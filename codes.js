const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// DB bağlantısı
const dbPath = path.join(__dirname, "..", "db", "database.db");
const db = new sqlite3.Database(dbPath);

// 🔹 TÜM KODLARI GETİR
// /api/codes?search=xxx&language=Python
router.get("/", (req, res) => {
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
// /api/codes/:id
router.get("/:id", (req, res) => {
  db.get(
    "SELECT * FROM codes WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "Kod bulunamadı" });
      }
      res.json(row);
    }
  );
});

// 🔹 KOD EKLE (HERKES)
// POST /api/codes
router.post("/", (req, res) => {
  const { title, code, purpose, description, language, nickname } = req.body;

  if (!title || !code || !purpose || !description || !language || !nickname) {
    return res.status(400).json({ error: "Tüm alanlar zorunlu" });
  }

  db.run(
    `
    INSERT INTO codes (title, code, purpose, description, language, nickname)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [title, code, purpose, description, language, nickname],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        success: true,
        id: this.lastID
      });
    }
  );
});

module.exports = router;
