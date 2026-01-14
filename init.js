const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// database.db yolu
const dbPath = path.join(__dirname, "database.db");

// veritabanını aç / oluştur
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Veritabanı açılamadı:", err.message);
  } else {
    console.log("Veritabanı hazır");
  }
});

// TABLO OLUŞTUR
db.run(`
  CREATE TABLE IF NOT EXISTS codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    purpose TEXT NOT NULL,
    description TEXT NOT NULL,
    language TEXT NOT NULL,
    nickname TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("Tablo oluşturulamadı:", err.message);
  } else {
    console.log("codes tablosu hazır");
  }
});

// kapat
db.close();
