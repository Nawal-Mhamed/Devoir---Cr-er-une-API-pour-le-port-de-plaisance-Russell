const express = require("express");
const router = express.Router();

/** Home page.
 * @route {GET} /
 */
router.get("/", function (req, res) {
  const logoutStatus = req.query.logout;

  res.render("index", { title: "Accueil", logoutStatus });
});

module.exports = router;
