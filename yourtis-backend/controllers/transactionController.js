const db = require("../config/database");

// 1. GET ALL (Untuk Dashboard & Laporan)
exports.getAllTransactions = (req, res) => {
  const query = "SELECT * FROM tb_transaksi ORDER BY tgl_transaksi DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error DB", error: err });
    res.status(200).json(results);
  });
};

// 2. CHECKOUT (Untuk Pembeli)
exports.checkout = (req, res) => {
  const { id_pembeli, total_bayar, metode_kirim, metode_bayar, items } =
    req.body;
  const id_transaksi = `TRX-${Date.now()}`;

  const queryTx =
    "INSERT INTO tb_transaksi (id_transaksi, id_pembeli, total_bayar, metode_kirim, metode_bayar, status) VALUES (?, ?, ?, ?, ?, 'Pending')";

  db.query(
    queryTx,
    [id_transaksi, id_pembeli, total_bayar, metode_kirim, metode_bayar],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Gagal Checkout", error: err });

      if (items && items.length > 0) {
        const detailValues = items.map((item) => [
          id_transaksi,
          item.id_sayur,
          item.qty,
          item.subtotal,
        ]);
        const queryDetail =
          "INSERT INTO tb_detail_transaksi (id_transaksi, id_sayur, qty, subtotal) VALUES ?";
        db.query(queryDetail, [detailValues], (errD, resD) => {
          // Opsional: Update stok di sini
        });
      }
      res.status(201).json({ message: "Berhasil", id_transaksi });
    }
  );
};

// 3. UPDATE STATUS (TAMBAHAN BARU)
exports.updateStatus = (req, res) => {
  const id_transaksi = req.params.id;
  const { status } = req.body; // Status baru: "Proses" atau "Selesai"

  const query = "UPDATE tb_transaksi SET status = ? WHERE id_transaksi = ?";

  db.query(query, [status, id_transaksi], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal update status", error: err });
    }
    res.status(200).json({ message: "Status berhasil diubah" });
  });
};
