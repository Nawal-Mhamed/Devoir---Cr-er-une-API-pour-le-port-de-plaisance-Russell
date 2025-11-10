const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "GTGh6rdP54GT76";

/**
 * Middleware to verify JWT token from cookies
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
exports.verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).redirect("/?logout=expired");
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;
    console.log("decoded token:", decoded);
    next();
  } catch (err) {
    res.clearCookie("token");
    res.status(401).redirect("/?logout=expired");
  }
};

/**
 * Middleware to check if user has admin privileges
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== "administrateur") {
    return res
      .status(403)
      .json({ message: "Accès réservé aux administrateurs" });
  }
  next();
};
