const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/database");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Frontend: phục vụ HTML, CSS và JavaScript
const frontendPath = path.join(__dirname, "..");

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.use("/css", express.static(path.join(frontendPath, "css")));
app.use("/js", express.static(path.join(frontendPath, "js")));

// API
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Kiểm tra server
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "ShopEasy Backend is running!"
    });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// Kết nối database trước khi chạy server
async function startServer() {
    try {
        const connection = await db.getConnection();

        console.log("MySQL connected successfully!");

        connection.release();

        app.listen(PORT, () => {
            console.log(`ShopEasy server: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Cannot connect to MySQL:", error.message);
        process.exit(1);
    }
}

startServer();