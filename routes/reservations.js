const express = require("express");
const router = express.Router({ mergeParams: true });
const reservationController = require("../controllers/reservationController");

/** Routes des réservations
 * @module RoutesReservations
 */

/** Récupère toutes les réservations
 * @name Get all reservations
 * @route {GET} /reservations
 */
router.get("/", reservationController.getAllReservations);

/** Récupère une réservation
 * @name Get a reservation by ID
 * @route {GET} /reservations/{idReservation}
 * @routeparam {string} :idReservation - ID de la réservation
 */
router.get("/:idReservation", reservationController.getById);

/** Crée une réservation
 * @name Create a reservation
 * @route {POST} /reservations
 */
router.post("/", reservationController.createReservation);

/** Met à jour une réservation
 * @name Update a reservation
 * @route {PUT} /reservations/{idReservation}
 * @routeparam {string} :idReservation - ID de la réservation
 */
router.put("/:idReservation", reservationController.updateReservation);

/** Supprime une réservation
 * @name Delete a reservation
 * @route {DELETE} /reservations/{idReservation}
 * @routeparam {string} :idReservation - ID de la réservation
 */
router.delete("/:idReservation", reservationController.deleteReservation);

module.exports = router;
