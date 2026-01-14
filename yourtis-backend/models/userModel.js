const db = require("../config/database");

const User = {
  // Fungsi untuk mencari user berdasarkan email (Untuk Login)
  findByEmail: (email, callback) => {
    const query = "SELECT * FROM tb_users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results[0]); // Mengembalikan 1 user jika ditemukan
    });
  },

  // Fungsi untuk menyimpan user baru (Untuk Register)
  create: (userData, callback) => {
    // Sesuai atribut di SRS Halaman 22 (Tabel 6.2.7.1)
    const query =
      "INSERT INTO tb_users (username, email, password, role, no_hp, alamat) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      userData.username,
      userData.email,
      userData.password, // Password yang sudah di-hash
      userData.role, // 'Petani' atau 'Pembeli'
      userData.no_hp,
      userData.alamat,
    ];

    db.query(query, values, (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    });
  },
};

module.exports = User;
