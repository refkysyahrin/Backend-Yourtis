const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_yourtiss",
});

db.connect((err) => {
  if (err) {
    console.error("X Gagal Konek ke Database:", err.message);
  } else {
    console.log("√ Berhasil Konek ke Database MySQL");
  }
});

module.exports = db;
