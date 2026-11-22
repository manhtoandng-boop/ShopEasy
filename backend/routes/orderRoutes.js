
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

    if (
        ![
            "Thanh toán khi nhận hàng",
            "Chuyển khoản ngân hàng"
        ].includes(payment_method)
    ) {
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

        const newQuantity = (quantities.get(id) || 0) + quantity;

        if (newQuantity > 100) {
            return res.status(400).json({
                success: false,
                message: "Tổng số lượng một sản phẩm không được vượt quá 100."
            });
        }

        quantities.set(id, newQuantity);
    }

    const connection = await db.getConnection();

    try {
        // 3. Bắt đầu transaction
        await connection.beginTransaction();

        const productIds = [...quantities.keys()];
        const placeholders = productIds.map(() => "?").join(",");

        // 4. Lấy giá gốc và mức giảm giá trực tiếp từ MySQL
        // ROUND đảm bảo giá bán được làm tròn đến 2 chữ số thập phân.
        const [products] = await connection.query(
            `SELECT
                id,
                name,
                price,
                discount_percent,
                ROUND(
                    price * (1 - discount_percent / 100),
                    2
                ) AS sale_price,
                stock
             FROM products
             WHERE id IN (${placeholders})
             AND id BETWEEN 343 AND 392
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

        // 5. Kiểm tra tồn kho và tính tổng tiền sau giảm giá
        let totalCents = 0;

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

            const discountPercent = Number(product.discount_percent);
            const salePrice = Number(product.sale_price);

            if (
                !Number.isFinite(discountPercent) ||
                discountPercent < 0 ||
                discountPercent > 100 ||
                !Number.isFinite(salePrice) ||
                salePrice < 0
            ) {
                throw new Error(
                    `Dữ liệu giá hoặc giảm giá không hợp lệ: ${product.id}`
                );
            }

            const priceInCents = Math.round(salePrice * 100);

            totalCents += priceInCents * requestedQuantity;
        }

        const totalAmount = totalCents / 100;

        // 6. Tạo mã đơn hàng
        const orderCode =
            "SE" + crypto.randomBytes(4).toString("hex").toUpperCase();

        const orderStatus = "Pending";

        // 7. Lưu đơn hàng
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

        // 8. Lưu chi tiết đơn hàng và cập nhật tồn kho
        for (const product of products) {
            const quantity = quantities.get(product.id);
            const salePrice = Number(product.sale_price);

            await connection.execute(
                `INSERT INTO order_items
                (order_id, product_id, product_name, price, quantity)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    orderId,
                    product.id,
                    product.name,
                    salePrice,
                    quantity
                ]
            );

            await connection.execute(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?`,
                [quantity, product.id]
            );
        }

        // 9. Tạo bản ghi thanh toán
        const paymentStatus = "Pending";

        await connection.execute(
            `INSERT INTO payments
            (order_id, amount, payment_method, payment_status)
            VALUES (?, ?, ?, ?)`,
            [
                orderId,
                totalAmount,
                payment_method,
                paymentStatus
            ]
        );

        // 10. Hoàn tất transaction
        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Đặt hàng thành công!",
            order: {
                id: orderId,
                order_code: orderCode,
                total_amount: totalAmount,
                payment_method,
                status: orderStatus
            }
        });

    } catch (error) {
        await connection.rollback();

        console.error("Lỗi tạo đơn hàng:", error);

        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi tạo đơn hàng."
        });

    } finally {
        connection.release();
    }
});

module.exports = router;
