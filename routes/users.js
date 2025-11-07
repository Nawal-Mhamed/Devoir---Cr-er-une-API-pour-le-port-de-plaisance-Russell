const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

/** Routes des utilisateurs
 * @module RoutesUsers
 */

/** Récupère tous les utilisateurs
 * @name Get all users
 * @route {GET} /users
 */
router.get("/", authMiddleware.verifyToken, userController.getAllUsers);

/** Récupère un utilisateur
 * @name Get a user by email
 * @route {GET} /users/{email}
 * @routeparam {string} :email - Email de l'utilisateur
 */
router.get("/:email", authMiddleware.verifyToken, userController.getByEmail);

/** Crée un utilisateur
 * @name Create a user
 * @route {POST} /users
 */
router.post("/", authMiddleware.verifyToken, userController.createUser);

/** Met à jour un utilisateur
 * @name Update a user
 * @route {PUT} /users/{email}
 * @routeparam {string} :email - Email de l'utilisateur
 */
router.put("/:email", authMiddleware.verifyToken, userController.updateUser);

/** Supprimer un utilisateur
 * @name Delete a user
 * @route DELETE /users/{email}
 * @routeparam {string} :email - Email de l'utilisateur
 */
router.delete("/:email", authMiddleware.verifyToken, userController.deleteUser);

module.exports = router;
