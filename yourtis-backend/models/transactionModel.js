const db = require("../config/database");

const Transaction = {
  // 1. Simpan Header Transaksi (Nota)
  createHeader: (data, callback) => {
    const query =
      "INSERT INTO tb_transaksi (id_transaksi, id_pembeli, total_bayar, metode_kirim, metode_bayar, status) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      data.id_transaksi,
      data.id_pembeli,
      data.total_bayar,
      data.metode_kirim,
      data.metode_kirim === "Pickup" ? "Transfer" : data.metode_bayar, // Logika sederhana
      "Pending",
    ];
    db.query(query, values, (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  },

  // 2. Simpan Detail Transaksi (Looping item keranjang)
  createDetail: (items, id_transaksi, callback) => {
    // Kita siapkan array untuk Bulk Insert agar lebih efisien
    const values = items.map((item) => [
      id_transaksi,
      item.id_sayur,
      item.qty,
      item.subtotal,
    ]);
    const query =
      "INSERT INTO tb_detail_transaksi (id_transaksi, id_sayur, qty, subtotal) VALUES ?";

    db.query(query, [values], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  },

  // 3. Kurangi Stok Sayur (Otomatis saat checkout)
  decreaseStock: (items) => {
    items.forEach((item) => {
      const query = "UPDATE tb_sayur SET stok = stok - ? WHERE id_sayur = ?";
      db.query(query, [item.qty, item.id_sayur], (err, result) => {
        if (err) console.error("Gagal update stok id " + item.id_sayur);
      });
    });
  },
};

module.exports = Transaction;
