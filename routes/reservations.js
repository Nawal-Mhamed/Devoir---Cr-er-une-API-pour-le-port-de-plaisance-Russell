const express = require("express");
const router = express.Router({ mergeParams: true });
const reservationController = require("../controllers/reservationController");
const authMiddleware = require("../middlewares/auth");

/** Reservation routes
 * @module RoutesReservations
 */

/** Get all reservations
 * @name Get all reservations
 * @route {GET} /reservations
 */
router.get(
  "/",
  authMiddleware.verifyToken,
  reservationController.getAllReservations
);

/** Get reservations by search criteria
 * @name Get a reservation by searching
 * @route {GET} /reservations/search
 */
router.get(
  "/search",
  authMiddleware.verifyToken,
  reservationController.getBySearch
);

/** Get a reservation by ID
 * @name Get a reservation by ID
 * @route {GET} /reservations/{idReservation}
 * @routeparam {string} :idReservation - ID de la réservation
 */
router.get(
  "/:idReservation",
  authMiddleware.verifyToken,
  reservationController.getById
);

/** Create a reservation
 * @name Create a reservation
 * @route {POST} /reservations
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  reservationController.createReservation
);

/** Update a reservation
 * @name Update a reservation
 * @route {PUT} /reservations/{idReservation}
 * @routeparam {string} :idReservation - ID de la réservation
 */
router.put(
  "/:idReservation",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  reservationController.updateReservation
);

/** Delete a reservation
 * @name Delete a reservation
 * @route {DELETE} /reservations/{idReservation}
 * @routeparam {string} :idReservation - ID de la réservation
 */
router.delete(
  "/:idReservation",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  reservationController.deleteReservation
);

router.use("/:id/reservations", (req, res, next) => {
  console.log("Reservations subroute hite", req.method, req.originalUrl);
  next();
});

module.exports = router;
