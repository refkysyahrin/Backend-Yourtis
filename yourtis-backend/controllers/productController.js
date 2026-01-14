const Product = require("../models/productModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- KONFIGURASI UPLOAD GAMBAR (MULTER) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'uploads' sudah ada
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "uploads/"); // Simpan di folder uploads
  },
  filename: (req, file, cb) => {
    // Rename file agar unik: timestamp + nama asli
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter agar hanya menerima gambar
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus JPG/PNG"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Export middleware upload agar bisa dipakai di Route
exports.uploadMiddleware = upload.single("gambar");

// --- LOGIKA BISNIS CRUD ---

// 1. GET ALL (Lihat Katalog)
exports.getAllProducts = (req, res) => {
  Product.getAll((err, products) => {
    if (err) return res.status(500).json({ message: "Error mengambil data." });

    // Format ulang response agar URL gambar lengkap
    // Contoh: "wortel.jpg" menjadi "http://localhost:3000/uploads/wortel.jpg"
    const productsWithImageURL = products.map((item) => ({
      ...item,
      gambar_url: item.gambar
        ? `${req.protocol}://${req.get("host")}/uploads/${item.gambar}`
        : null,
    }));

    res.json(productsWithImageURL);
  });
};

// 2. CREATE (Tambah Sayur)
exports.createProduct = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Harap upload gambar produk!" });
  }

  const newProduct = {
    id_petani: req.body.id_petani, // Didapat dari input form (seharusnya otomatis dari sesi login)
    nama_sayur: req.body.nama_sayur,
    harga: req.body.harga,
    stok: req.body.stok,
    deskripsi: req.body.deskripsi,
    gambar: req.file.filename, // Nama file yang tersimpan di server
  };

  Product.create(newProduct, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal menyimpan produk.", error: err });
    res
      .status(201)
      .json({ message: "Sayur berhasil ditambahkan!", data: result });
  });
};

// 3. UPDATE (Edit Sayur)
exports.updateProduct = (req, res) => {
  const id = req.params.id;

  const updateData = {
    nama_sayur: req.body.nama_sayur,
    harga: req.body.harga,
    stok: req.body.stok,
    deskripsi: req.body.deskripsi,
    gambar: req.file ? req.file.filename : null, // Cek apakah user upload gambar baru
  };

  Product.update(id, updateData, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal update produk.", error: err });
    res.json({ message: "Sayur berhasil diperbarui!" });
  });
};

// 4. DELETE (Hapus Sayur)
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  Product.delete(id, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal menghapus produk." });
    res.json({ message: "Sayur berhasil dihapus!" });
  });
};
