const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

/** GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Accueil" });
});

/** Dashboard utilisateur
 * @module RoutesDashboard
 */
router.get("/dashboard", authMiddleware.verifyToken, (req, res) => {
  res.render("dashboard", { title: "Tableau de bord", username: req.userId });
});

module.exports = router;
