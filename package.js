{
  "name": "arcion-backend",
  "version": "1.0.0",
  "description": "ARCION - ücretsiz, login'siz kod paylaşım platformu backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "init-db": "node db/init.js"
  },
  "author": "ARCION",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "sqlite3": "^5.1.7"
  }
}
