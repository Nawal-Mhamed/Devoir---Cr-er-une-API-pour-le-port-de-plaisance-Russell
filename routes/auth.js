const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/** Authentication routes
 * @module RoutesAuthentication
 */

/** Log in a user
 * @name Login
 * @route {POST} /login
 * @param {string} username - Username
 * @param {string} email - User email
 * @param {string} password - User password
 */
router.post("/login", userController.loginUser);

console.log("userController.loginUser", userController.loginUser);

/** Log out a user
 * @name Logout
 * @route {GET} /logout
 */
router.get("/logout", userController.logoutUser);

module.exports = router;
