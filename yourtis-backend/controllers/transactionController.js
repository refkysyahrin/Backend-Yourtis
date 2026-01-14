const Transaction = require("../models/transactionModel");

exports.checkout = (req, res) => {
  const { id_pembeli, total_bayar, metode_kirim, metode_bayar, items } =
    req.body;

  // 1. Validasi Input
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Keranjang belanja kosong!" });
  }

  // 2. Generate ID Transaksi Unik (TRX + Timestamp)
  const id_transaksi = `TRX-${Date.now()}`;

  // Data Header Nota
  const transactionData = {
    id_transaksi,
    id_pembeli,
    total_bayar,
    metode_kirim,
    metode_bayar,
  };

  // 3. Eksekusi Simpan Header
  Transaction.createHeader(transactionData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal membuat transaksi.", error: err });
    }

    // 4. Eksekusi Simpan Detail Barang
    Transaction.createDetail(items, id_transaksi, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Gagal menyimpan rincian barang." });
      }

      // 5. Eksekusi Kurangi Stok (Sesuai SRS REQ-TRX-04)
      Transaction.decreaseStock(items);

      // 6. Respon Sukses
      res.status(201).json({
        message: "Transaksi Berhasil!",
        id_transaksi: id_transaksi,
        total_bayar: total_bayar,
        metode_pembayaran: metode_bayar,
      });
    });
  });
};
