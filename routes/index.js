const express = require("express");
const router = express.Router();

/** GET home page. */
router.get("/", function (req, res, next) {
  const showLogout = req.query.logout === "success";
  res.render("index", { title: "Accueil", showLogout });
});

module.exports = router;
