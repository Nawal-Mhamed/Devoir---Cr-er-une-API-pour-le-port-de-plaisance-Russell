const express = require("express");
const router = express.Router({ mergeParams: true });
const reservationController = require("../controllers/reservationController");
const authMiddleware = require("../middlewares/auth");

/** Routes des réservations
 * @module RoutesReservations
 */

/** Récupère toutes les réservations
 * @name Get all reservations
 * @route {GET} /reservations
 */
router.get(
  "/",
  authMiddleware.verifyToken,
  reservationController.getAllReservations
);

/** Récupère les réservations correspondant aux critères de recherche
 * @name Get a reservation by searching
 * @route {GET} /reservations/search
 */
router.get(
  "/search",
  authMiddleware.verifyToken,
  reservationController.getBySearch
);

/** Récupère une réservation grâce à son identifiant
 * @name Get a reservation by ID
 * @route {GET} /reservations/{idReservation}
 * @routeparam {string} :idReservation - ID de la réservation
 */
router.get(
  "/:idReservation",
  authMiddleware.verifyToken,
  reservationController.getById
);

/** Crée une réservation
 * @name Create a reservation
 * @route {POST} /reservations
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  reservationController.createReservation
);

/** Met à jour une réservation
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

/** Supprime une réservation
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

module.exports = router;
