const express = require("express");
const router = express.Router({ mergeParams: true });
const reservationController = require("../controllers/reservationController");

router.get("/", reservationController.getAllReservations);
router.get("/:idReservation", reservationController.getById);
router.post("/", reservationController.createReservation);
router.put("/:idReservation", reservationController.updateReservation);
router.delete("/:idReservation", reservationController.deleteReservation);

module.exports = router;
