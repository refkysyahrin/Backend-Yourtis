const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Import Database & Controllers
const db = require("./config/database");
const authController = require("./controllers/authController");
const productController = require("./controllers/productController");
const transactionController = require("./controllers/transactionController");

const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Folder statis untuk akses gambar (PENTING AGAR GAMBAR MUNCUL DI HP)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================

// 1. AUTH ROUTES
app.post("/api/auth/login", authController.login);
app.post("/api/auth/register", authController.register);

// 2. PRODUCT ROUTES (CRUD SAYUR)
// Read (Ambil Semua)
app.get("/api/products", productController.getAllProducts);

// Create (Tambah Baru - Pakai Middleware Upload)
app.post(
  "/api/products",
  productController.uploadMiddleware,
  productController.createProduct
);

// Update (Edit Produk - Pakai Middleware Upload karena bisa ganti gambar) -> ROUTE BARU
app.put(
  "/api/products/:id",
  productController.uploadMiddleware,
  productController.updateProduct
);

// Delete (Hapus)
app.delete("/api/products/:id", productController.deleteProduct);

// 3. TRANSACTION ROUTES
// Ambil Semua Transaksi (Untuk Dashboard Petani)
app.get("/api/transactions", transactionController.getAllTransactions);

// Checkout (Untuk Pembeli)
app.post("/api/transactions/checkout", transactionController.checkout);

// Update Status Transaksi (Pending -> Selesai)
app.put("/api/transactions/:id", transactionController.updateStatus);

// ==========================================

// Cek Koneksi Server
app.get("/", (req, res) => {
  res.send("Server YourTis Berjalan...");
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
