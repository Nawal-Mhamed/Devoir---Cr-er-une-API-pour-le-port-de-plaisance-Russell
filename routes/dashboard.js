const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

const User = require("../models/user");
const Reservation = require("../models/reservation");

/** User dashboard routes
 * @module RoutesDashboard
 */

/** Render dashboard if authenticated
 * @route {GET} /dashboard
 */
router.get("/dashboard", authMiddleware.verifyToken, async (req, res) => {
  const user = await User.findById(req.userId).lean();

  const todayDate = new Date();
  const activeReservations = await Reservation.find({
    startDate: { $lte: todayDate },
    endDate: { $gte: todayDate },
  }).lean();

  res.render("dashboard", {
    title: "Tableau de bord",
    username: req.userId,
    user,
    today: new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    activeReservations,
  });
});

module.exports = router;
