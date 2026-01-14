// Admin doğrulama middleware'i

const ADMIN_PASSWORD = "ARCION_ADMIN_123"; 
// sonra .env yapacağız, şimdilik sabit

function adminAuth(req, res, next) {
  const { password } = req.body;

  if (!password) {
    return res.status(401).json({
      error: "Admin şifresi gerekli"
    });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({
      error: "Yanlış admin şifresi"
    });
  }

  // şifre doğruysa devam
  next();
}

module.exports = adminAuth;
