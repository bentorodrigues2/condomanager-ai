
const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Token em falta" });
  }

  try {
    const decoded = jwt.decode(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
