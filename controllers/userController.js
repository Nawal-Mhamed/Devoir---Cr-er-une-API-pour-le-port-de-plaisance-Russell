const userService = require("../services/users");

/** Controller for managing users
 * @module userController
 */

/** Create a new user
 * @param {object} req - Express request object, req.body contains user data
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If email is already used or server error occurs
 */
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.statusCode === 400) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
};

/** Get all users
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If server error occurs
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers().sort({ createdAt: 1 }).lean();
    res.status(200).render("users", { users, role: req.userRole });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

/** Get a user by email
 * @param {object} req - Express request object, req.params.email = target user's email
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If user does not exist or server error occurs
 */
exports.getByEmail = async (req, res) => {
  try {
    const user = await userService.getByEmail(req.params.email);
    if (!user) {
      return res.status(404).render("user", {
        user: null,
        errorMessage: `L'utilisateur est introuvable ou n'existe pas.`,
        role: req.userRole,
      });
    }

    const isOwnProfile = req.userEmail === user.email;

    res
      .status(200)
      .render("user", { user: user, role: req.userRole, isOwnProfile });
  } catch (err) {
    console.error(err);
    res.status(500).render("user", {
      user: "null",
      errorMessage: "Erreur serveur",
      role: req.userRole,
      isOwnProfile: false,
    });
  }
};

/** Update a user's information.
 * @param {object} req - Express request object, req.params.email = user's email / req.body = updated data
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If user does not exist, email is already user or server error occurs
 */
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.email,
      req.body
    );

    const { password, ...safeUser } = updatedUser.toObject();

    res
      .status(200)
      .json({ message: "Utilisateur mis à jour avec succès.", user: safeUser });
  } catch (err) {
    if (err.statusCode === 400 || err.statusCode === 404) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
};

/** Delete a user
 * @param {object} req - Express request object, req.params.email = email of user to delete
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If user doesn't exist or server error occurs
 */
exports.deleteUser = async (req, res) => {
  try {
    if (req.userEmail === req.params.email) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez pas supprimer votre propre compte." });
    }

    const deletedUser = await userService.deleteUser(req.params.email);
    if (!deletedUser)
      return res.status(404).json({ message: "Utilisateur introuvable." });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** Login a user
 * @param {object} req - Express request object, req.body contains login credentials
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If credentials are invalid or server error occurs
 */
exports.loginUser = async (req, res) => {
  try {
    const token = await userService.loginUser(req.body);

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (err) {
    res.status(401).send(err.message);
  }
};

/** Logout a user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.redirect("/?logout=success");
};
