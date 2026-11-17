const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const db = require("../config/database");

// POST /api/orders
// Tạo đơn hàng mới

router.post("/", async (req, res) => {
    const {
        customer_name,
        phone,
        email,
        address,
        payment_method,
        items
    } = req.body;

    // 1. Kiểm tra thông tin khách hàng

    if (
        typeof customer_name !== "string" ||
        !customer_name.trim() ||
        typeof phone !== "string" ||
        !/^[0-9]{10,11}$/.test(phone) ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof address !== "string" ||
        !address.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Thông tin khách hàng không hợp lệ."
        });
    }

    if (!["Thanh toán khi nhận hàng", "Chuyển khoản ngân hàng"]
        .includes(payment_method)) {
        return res.status(400).json({
            success: false,
            message: "Phương thức thanh toán không hợp lệ."
        });
    }

    // 2. Kiểm tra giỏ hàng

    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Giỏ hàng không hợp lệ hoặc đang trống."
        });
    }

    const quantities = new Map();

    for (const item of items) {
        const id = Number(item.product_id);
        const quantity = Number(item.quantity);

        if (
            !Number.isSafeInteger(id) ||
            id <= 0 ||
            !Number.isSafeInteger(quantity) ||
            quantity <= 0 ||
            quantity > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Sản phẩm hoặc số lượng không hợp lệ."
            });
        }

        quantities.set(id, (quantities.get(id) || 0) + quantity);
    }

    const connection = await db.getConnection();

    try {
        // 3. Bắt đầu transaction
        await connection.beginTransaction();

        const productIds = [...quantities.keys()];
        const placeholders = productIds.map(() => "?").join(",");

        // Khóa các dòng sản phẩm trong lúc kiểm tra tồn kho
        const [products] = await connection.query(
            `SELECT id, name, price, stock
             FROM products
             WHERE id IN (${placeholders})
             FOR UPDATE`,
            productIds
        );

        if (products.length !== productIds.length) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Một hoặc nhiều sản phẩm không tồn tại."
            });
        }

        // 4. Kiểm tra tồn kho và tính tiền từ database
        let totalAmount = 0;

        for (const product of products) {
            const requestedQuantity = quantities.get(product.id);

            if (product.stock < requestedQuantity) {
                await connection.rollback();

                return res.status(409).json({
                    success: false,
                    message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm. Vui lòng điều chỉnh giỏ hàng.`,
                    product_id: product.id,
                    available_stock: product.stock
                });
            }

            totalAmount += Number(product.price) * requestedQuantity;
        }

        // 5. Tạo mã đơn hàng
        const orderCode = "SE" + crypto.randomBytes(4).toString("hex").toUpperCase();

        const orderStatus = "Pending";

        // 6. Lưu đơn hàng
        const [orderResult] = await connection.execute(
            `INSERT INTO orders
            (order_code, customer_name, phone, email, address,
             total_amount, payment_method, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                orderCode,
                customer_name.trim(),
                phone,
                email.trim(),
                address.trim(),
                totalAmount,
                payment_method,
                orderStatus
            ]
        );

        const orderId = orderResult.insertId;

        // 7. Lưu chi tiết đơn hàng và cập nhật kho
        for (const product of products) {
            const quantity = quantities.get(product.id);
            const price = Number(product.price);

            await connection.execute(
                `INSERT INTO order_items
                (order_id, product_id, product_name, price, quantity)
                VALUES (?, ?, ?, ?, ?)`,
                [orderId, product.id, product.name, price, quantity]
            );

            await connection.execute(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?`,
                [quantity, product.id]
            );
        }

        // 8. Tạo bản ghi thanh toán
        const paymentStatus = "Pending";

        await connection.execute(
            `INSERT INTO payments
            (order_id, amount, payment_method, payment_status)
            VALUES (?, ?, ?, ?)`,
            [orderId, totalAmount, payment_method, paymentStatus]
        );

        // 9. Hoàn tất transaction
        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công!",
            order: {
                id: orderId,
                order_code: orderCode,
                total_amount: totalAmount,
                payment_method: payment_method,
                status: orderStatus
            }
        });

    } catch (error) {
        await connection.rollback();

        console.error("Lỗi tạo đơn hàng:", error);

        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi tạo đơn hàng."
        });

    } finally {
        connection.release();
    }
});

module.exports = router;