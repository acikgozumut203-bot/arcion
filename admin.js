const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ===== DB =====
const dbPath = path.join(__dirname, "..", "db", "database.db");
const db = new sqlite3.Database(dbPath);

// ===== ADMIN ŞİFRESİ =====
// NOT: Sonra .env yaparız
const ADMIN_PASSWORD = "ARCION_ADMIN_123";

// ===== ADMIN AUTH =====
function adminAuth(req, res, next) {
  const { password } = req.body;

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Yetkisiz erişim" });
  }
  next();
}

// ===== TÜM KODLARI ADMIN GÖRÜR =====
// POST /api/admin/codes
router.post("/codes", adminAuth, (req, res) => {
  db.all(
    "SELECT * FROM codes ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// ===== KOD SİL =====
// DELETE /api/admin/codes/:id
router.delete("/codes/:id", adminAuth, (req, res) => {
  db.run(
    "DELETE FROM codes WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, deletedId: req.params.id });
    }
  );
});

// ===== KOD DÜZENLE =====
// PUT /api/admin/codes/:id
router.put("/codes/:id", adminAuth, (req, res) => {
  const { title, code, purpose, description, language, nickname } = req.body;

  if (!title || !code || !purpose || !description || !language || !nickname) {
    return res.status(400).json({ error: "Tüm alanlar zorunlu" });
  }

  db.run(
    `
    UPDATE codes
    SET title = ?, code = ?, purpose = ?, description = ?, language = ?, nickname = ?
    WHERE id = ?
    `,
    [title, code, purpose, description, language, nickname, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, updatedId: req.params.id });
    }
  );
});

module.exports = router;
