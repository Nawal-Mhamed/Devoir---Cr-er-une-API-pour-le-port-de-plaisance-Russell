const express = require("express");
const router = express.Router({ mergeParams: true });
const reservationRouter = require("./reservations");
const catwayController = require("../controllers/catwayController");
const authMiddleware = require("../middlewares/auth");

/** Catway routes
 * @module RoutesCatways
 */

/** Get all catways
 * @name Get all catways
 * @route {GET} /catways
 */
router.get("/", authMiddleware.verifyToken, catwayController.getAllCatways);

/** Get a catway by number
 * @name Get a catway by number
 * @route {GET} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 */
router.get("/:id", authMiddleware.verifyToken, catwayController.getByNumber);

/** Create a catway
 * @name Create a catway
 * @route {POST} /catways
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  catwayController.createCatway
);

/** Update a catway
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

/** Delete a catway
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

/** Sub-route for reservations under a catway */
router.use("/:id/reservations", reservationRouter);

module.exports = router;
