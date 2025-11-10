const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

/** User routes
 * @module RoutesUsers
 */

/** Get all users
 * @name Get all users
 * @route {GET} /users
 */
router.get("/", authMiddleware.verifyToken, userController.getAllUsers);

/** Get a user by email
 * @name Get a user by email
 * @route {GET} /users/{email}
 * @routeparam {string} :email - Email de l'utilisateur
 */
router.get("/:email", authMiddleware.verifyToken, userController.getByEmail);

/** Create a user
 * @name Create a user
 * @route {POST} /users
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.createUser
);

/** Update a user
 * @name Update a user
 * @route {PUT} /users/{email}
 * @routeparam {string} :email - Email de l'utilisateur
 */
router.put(
  "/:email",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.updateUser
);

/** Delete a user
 * @name Delete a user
 * @route DELETE /users/{email}
 * @routeparam {string} :email - Email de l'utilisateur
 */
router.delete(
  "/:email",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userController.deleteUser
);

module.exports = router;
