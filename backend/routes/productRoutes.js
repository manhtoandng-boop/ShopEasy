
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET /api/products
// Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
    try {
        const [products] = await db.execute(
            "SELECT * FROM products ORDER BY id ASC"
        );

        res.json({
            success: true,
            count: products.length,
            products: products
        });

    } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách sản phẩm.",
            error: error.message
        });
    }
});

// GET /api/products/:id
// Lấy thông tin chi tiết một sản phẩm
router.get("/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);

        if (!Number.isInteger(productId) || productId <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID sản phẩm không hợp lệ."
            });
        }

        const [products] = await db.execute(
            "SELECT * FROM products WHERE id = ?",
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm."
            });
        }

        res.json({
            success: true,
            product: products[0]
        });

    } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy thông tin sản phẩm.",
            error: error.message
        });
    }
});

module.exports = router;
