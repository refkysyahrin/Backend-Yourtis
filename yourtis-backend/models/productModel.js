const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- 1. KONFIGURASI UPLOAD GAMBAR ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    // Buat folder uploads jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Format: timestamp-namafileasli.jpg
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
exports.uploadMiddleware = upload.single("gambar");

// --- 2. GET ALL (AMBIL DATA) ---
exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM tb_sayur ORDER BY id_sayur DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("ERROR GET PRODUCTS:", err);
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(200).json(results);
  });
};

// --- 3. CREATE (TAMBAH DATA) ---
exports.createProduct = (req, res) => {
  console.log("--- REQUEST TAMBAH PRODUK ---");
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { id_petani, nama_sayur, harga, stok, deskripsi } = req.body;

  // Validasi Gambar
  if (!req.file) {
    console.error("ERROR: Gambar tidak ditemukan dalam request");
    return res.status(400).json({ message: "Gambar wajib diupload" });
  }

  const gambar = req.file.filename;
  // Buat URL gambar dinamis berdasarkan IP server
  const gambar_url = `${req.protocol}://${req.get("host")}/uploads/${gambar}`;

  const query = `INSERT INTO tb_sayur (id_petani, nama_sayur, harga, stok, deskripsi, gambar, gambar_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    id_petani,
    nama_sayur,
    harga,
    stok,
    deskripsi,
    gambar,
    gambar_url,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("DATABASE INSERT ERROR:", err.sqlMessage);
      return res
        .status(500)
        .json({
          message: "Gagal menyimpan ke database",
          error: err.sqlMessage,
        });
    }
    console.log("Berhasil Insert Sayur ID:", result.insertId);
    res.status(201).json({ message: "Produk berhasil ditambahkan" });
  });
};

// --- 4. UPDATE (EDIT DATA) ---
exports.updateProduct = (req, res) => {
  console.log("--- REQUEST UPDATE PRODUK ---");
  console.log("ID:", req.params.id);

  const id = req.params.id;
  const { nama_sayur, harga, stok, deskripsi } = req.body;

  let query = "";
  let values = [];

  // Cek apakah user mengupload gambar baru
  if (req.file) {
    console.log("User mengupload gambar baru:", req.file.filename);
    const gambar = req.file.filename;
    const gambar_url = `${req.protocol}://${req.get("host")}/uploads/${gambar}`;

    query =
      "UPDATE tb_sayur SET nama_sayur=?, harga=?, stok=?, deskripsi=?, gambar=?, gambar_url=? WHERE id_sayur=?";
    values = [nama_sayur, harga, stok, deskripsi, gambar, gambar_url, id];
  } else {
    console.log("User TIDAK mengganti gambar, hanya update teks.");
    query =
      "UPDATE tb_sayur SET nama_sayur=?, harga=?, stok=?, deskripsi=? WHERE id_sayur=?";
    values = [nama_sayur, harga, stok, deskripsi, id];
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("DATABASE UPDATE ERROR:", err.sqlMessage);
      return res
        .status(500)
        .json({ message: "Gagal update produk", error: err.sqlMessage });
    }
    console.log("Berhasil Update.");
    res.status(200).json({ message: "Produk berhasil diupdate" });
  });
};

// --- 5. DELETE (HAPUS DATA) ---
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM tb_sayur WHERE id_sayur = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("DATABASE DELETE ERROR:", err);
      return res
        .status(500)
        .json({ message: "Gagal hapus produk", error: err });
    }
    res.status(200).json({ message: "Produk berhasil dihapus" });
  });
};
