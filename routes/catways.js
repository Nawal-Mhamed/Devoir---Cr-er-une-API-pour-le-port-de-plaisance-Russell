const express = require("express");
const router = express.Router();
const reservationRouter = require("./reservations");
const catwayController = require("../controllers/catwayController");

/** Routes des catways
 * @module RoutesCatways
 */

/** Récupère tous les catways
 * @name Get all catways
 * @route {GET} /catways
 */
router.get("/", catwayController.getAllCatways);

/** Récupère un catway
 * @name Get a catway by number
 * @route {GET} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 */
router.get("/:id", catwayController.getByNumber);

/** Crée un catway
 * @name Create a catway
 * @route {POST} /catways
 */
router.post("/", catwayController.createCatway);

/** Met à jour un catway
 * @name Update a catway
 * @route {PUT} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 */
router.put("/:id", catwayController.updateCatway);

/** Supprimer une réservation
 * @name Delete a catway
 * @route {DELETE} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 */
router.delete("/:id", catwayController.deleteCatway);

/** Ajout de la sous-route des réservations */
router.use("/:id/reservations", reservationRouter);

module.exports = router;
