const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/** Routes d'authentification
 * @module RoutesAuthentification
 */

/** Connecte un utilisateur
 * @name Login
 * @route {POST} /login
 * @param {string} username - Nom d'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 */
router.post("/login", userController.loginUser);

/** Déconnecte un utilisateur
 * @name Logout
 * @route {GET} /logout
 */
router.get("/logout", userController.logoutUser);

module.exports = router;
