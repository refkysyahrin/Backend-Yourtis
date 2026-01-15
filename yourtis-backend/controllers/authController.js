const db = require("../config/database");

// --- 1. LOGIN ---
exports.login = (req, res) => {
  console.log("--- REQUEST LOGIN ---");
  console.log("Body:", req.body);

  const { email, password } = req.body;

  // Query cek email & password
  const query = "SELECT * FROM tb_user WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("ERROR LOGIN DB:", err);
      return res.status(500).json({ message: "Database Error", error: err });
    }

    if (results.length > 0) {
      // Login Sukses
      const user = results[0];
      console.log("Login Sukses:", user.username);
      res.status(200).json({
        message: "Login Berhasil",
        data: user,
      });
    } else {
      // Login Gagal
      console.log("Login Gagal: Email/Password salah");
      res.status(401).json({ message: "Email atau kata sandi salah" });
    }
  });
};

// --- 2. REGISTER ---
exports.register = (req, res) => {
  console.log("--- REQUEST REGISTER ---");
  console.log("Body:", req.body);

  const { username, email, password, role, no_hp, alamat } = req.body;

  // 1. Cek apakah email sudah ada?
  const checkQuery = "SELECT * FROM tb_user WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error("ERROR CEK EMAIL:", err);
      return res.status(500).json({ message: "Database Error", error: err });
    }

    if (results.length > 0) {
      console.log("Register Gagal: Email sudah ada");
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    // 2. Jika email belum ada, Lakukan Insert
    const insertQuery =
      "INSERT INTO tb_user (username, email, password, role, no_hp, alamat) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [username, email, password, role, no_hp, alamat];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("ERROR INSERT USER:", err.sqlMessage);
        return res
          .status(500)
          .json({ message: "Gagal Mendaftar", error: err.sqlMessage });
      }
      console.log("Register Berhasil, ID:", result.insertId);
      res
        .status(201)
        .json({ message: "Registrasi Berhasil", id: result.insertId });
    });
  });
};
