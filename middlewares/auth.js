const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "GTGh6rdP54GT76";

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Token manquant" });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json("Token invalide");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.userRole !== "administrateur") {
    return res
      .status(403)
      .json({ message: "Accès réservé aux administrateurs" });
  }
  next();
};
