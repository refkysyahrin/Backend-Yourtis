const db = require("../config/database");

const Product = {
  // 1. Ambil Semua Data Sayur (Untuk Katalog)
  getAll: (callback) => {
    const query = "SELECT * FROM tb_sayur";
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    });
  },

  // 2. Ambil Satu Sayur berdasarkan ID (Untuk Detail/Edit)
  getById: (id, callback) => {
    const query = "SELECT * FROM tb_sayur WHERE id_sayur = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results[0]);
    });
  },

  // 3. Tambah Sayur Baru (Create)
  create: (data, callback) => {
    const query =
      "INSERT INTO tb_sayur (id_petani, nama_sayur, harga, stok, deskripsi, gambar) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      data.id_petani,
      data.nama_sayur,
      data.harga,
      data.stok,
      data.deskripsi,
      data.gambar, // Nama file gambar yang tersimpan
    ];
    db.query(query, values, (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  },

  // 4. Update Sayur (Edit Stok & Harga)
  update: (id, data, callback) => {
    // Cek apakah ada gambar baru yang diupload atau tidak
    let query, values;

    if (data.gambar) {
      // Jika ada gambar baru, update semua termasuk gambar
      query =
        "UPDATE tb_sayur SET nama_sayur=?, harga=?, stok=?, deskripsi=?, gambar=? WHERE id_sayur=?";
      values = [
        data.nama_sayur,
        data.harga,
        data.stok,
        data.deskripsi,
        data.gambar,
        id,
      ];
    } else {
      // Jika tidak ada gambar baru, gambar lama tetap dipakai
      query =
        "UPDATE tb_sayur SET nama_sayur=?, harga=?, stok=?, deskripsi=? WHERE id_sayur=?";
      values = [data.nama_sayur, data.harga, data.stok, data.deskripsi, id];
    }

    db.query(query, values, (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  },

  // 5. Hapus Sayur (Delete)
  delete: (id, callback) => {
    const query = "DELETE FROM tb_sayur WHERE id_sayur = ?";
    db.query(query, [id], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  },
};

module.exports = Product;
