const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); // Library untuk enkripsi password

// LOGIKA REGISTRASI
exports.register = (req, res) => {
  const { username, email, password, role, no_hp, alamat } = req.body;

  // 1. Validasi Input Sederhana
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  // 2. Enkripsi Password (Sesuai SRS 5.3 Safety Req)
  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = {
    username,
    email,
    password: hashedPassword,
    role,
    no_hp,
    alamat,
  };

  // 3. Simpan ke Database
  User.create(newUser, (err, result) => {
    if (err) {
      // Cek jika email sudah ada (Error duplicate entry)
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email sudah terdaftar!" });
      }
      return res
        .status(500)
        .json({ message: "Gagal mendaftar user.", error: err });
    }
    res.status(201).json({
      message: "Registrasi Berhasil!",
      userId: result.insertId,
    });
  });
};

// LOGIKA LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  // 1. Cari User berdasarkan Email
  User.findByEmail(email, (err, user) => {
    if (err)
      return res.status(500).json({ message: "Terjadi kesalahan server." });

    // 2. Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    // 3. Cek Password (Bandingkan password input vs password database)
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Password salah!" });
    }

    // 4. Login Sukses - Kirim data user (tanpa password)
    // Sesuai SRS REQ-AUTH-02, respon ini nanti dipakai Android untuk navigasi (Admin vs Pembeli)
    res.json({
      message: "Login Berhasil",
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        role: user.role, // Penting untuk filter dashboard di Android
        no_hp: user.no_hp,
        alamat: user.alamat,
      },
    });
  });
};
