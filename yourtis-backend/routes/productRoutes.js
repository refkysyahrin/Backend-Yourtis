const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// URL: http://localhost:3000/api/products

// GET: Ambil semua data (Katalog)
router.get("/", productController.getAllProducts);

// POST: Tambah produk baru (Perlu upload gambar)
router.post(
  "/",
  productController.uploadMiddleware,
  productController.createProduct
);

// PUT: Edit produk berdasarkan ID (Bisa upload gambar baru)
router.put(
  "/:id",
  productController.uploadMiddleware,
  productController.updateProduct
);

// DELETE: Hapus produk berdasarkan ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
