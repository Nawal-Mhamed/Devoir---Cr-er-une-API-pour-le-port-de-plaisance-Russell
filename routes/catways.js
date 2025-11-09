const express = require("express");
const router = express.Router({ mergeParams: true });
const reservationRouter = require("./reservations");
const catwayController = require("../controllers/catwayController");
const authMiddleware = require("../middlewares/auth");

/** Routes des catways
 * @module RoutesCatways
 */

/** Récupère tous les catways
 * @name Get all catways
 * @route {GET} /catways
 */
router.get("/", authMiddleware.verifyToken, catwayController.getAllCatways);

/** Récupère un catway
 * @name Get a catway by number
 * @route {GET} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 */
router.get("/:id", authMiddleware.verifyToken, catwayController.getByNumber);

/** Crée un catway
 * @name Create a catway
 * @route {POST} /catways
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  catwayController.createCatway
);

/** Met à jour un catway
 * @name Update a catway
 * @route {PUT} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 */
router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  catwayController.updateCatway
);

/** Supprime un catway
 * @name Delete a catway
 * @route {DELETE} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 */
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  catwayController.deleteCatway
);

/** Ajout de la sous-route des réservations */
router.use("/:id/reservations", reservationRouter);

module.exports = router;
