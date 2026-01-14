const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== DATABASE ======
const dbPath = path.join(__dirname, "db", "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB HATASI:", err.message);
  } else {
    console.log("SQLite bağlandı");
  }
});

// ====== TABLO OLUŞTUR ======
db.run(`
  CREATE TABLE IF NOT EXISTS codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    purpose TEXT NOT NULL,
    language TEXT NOT NULL,
    nickname TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ====== API ======

// 🔹 TÜM KODLARI GETİR (arama + dil filtresi)
app.get("/api/codes", (req, res) => {
  const { search, language } = req.query;

  let query = "SELECT * FROM codes WHERE 1=1";
  let params = [];

  if (search) {
    query += " AND title LIKE ?";
    params.push(`%${search}%`);
  }

  if (language) {
    query += " AND language = ?";
    params.push(language);
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 🔹 TEK KOD DETAY
app.get("/api/codes/:id", (req, res) => {
  db.get(
    "SELECT * FROM codes WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    }
  );
});

// 🔹 KOD EKLE (HERKES)
app.post("/api/codes", (req, res) => {
  const { title, code, description, purpose, language, nickname } = req.body;

  if (!title || !code || !description || !purpose || !language || !nickname) {
    return res.status(400).json({ error: "Tüm alanlar zorunlu" });
  }

  db.run(
    `
    INSERT INTO codes (title, code, description, purpose, language, nickname)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [title, code, description, purpose, language, nickname],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 🔐 ADMIN – KOD SİL
const ADMIN_PASSWORD = "ARCION_ADMIN_123"; // sonra .env yaparız

app.delete("/api/admin/codes/:id", (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Yetkisiz" });
  }

  db.run(
    "DELETE FROM codes WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// ====== SERVER ======
app.listen(PORT, () => {
  console.log(`ARCION backend çalışıyor 👉 http://localhost:${PORT}`);
});
