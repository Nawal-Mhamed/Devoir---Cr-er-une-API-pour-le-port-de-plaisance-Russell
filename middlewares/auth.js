const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "GTGh6rdP54GT76";

exports.verifyToken = (req, res, next) => {
  const authHeader = req.cookies?.token;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userID = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};
