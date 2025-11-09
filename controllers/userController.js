const userService = require("../services/users");

/** Controller pour gérer les utilisateurs
 * @module userController
 */

/** Créer un nouvel utilisateur
 * @param {object} req - Objet requête Express, req.body = données de l'utilisateur
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si l'utilisateur créé a le même email qu'un utilisateur déjà enregistré ou erreur serveur
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

/** Afficher l'ensemble des utilisateurs
 * @param {object} req - Objet requête Express
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si erreur serveur
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers().sort({ createdAt: 1 }).lean();
    res.status(200).render("users", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

/** Obtenir des informations sur un utilisateur grâce à son email
 * @param {object} req - Objet requête Express, req.params.email = email de l'utilisateur recherché
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si l'utilisateur n'existe pas ou erreur serveur
 */
exports.getByEmail = async (req, res) => {
  try {
    const user = await userService.getByEmail(req.params.email);
    if (!user) {
      return res.status(404).render("user", {
        user: null,
        errorMessage: `L'utilisateur est introuvable.`,
      });
    }

    res.status(200).render("user", { user: user });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .render("user", { user: "null", errorMessage: "Erreur serveur" });
  }
};

/** Modifier les informations d'un utilisateur
 * @param {object} req - Objet requête Express, req.params.email = email de l'utilisateur, req.body = données à modifier
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si l'utilisateur n'existe pas ou si l'email est déjà utilisé ou erreur serveur
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

/** Supprimer un utilisateur
 * @param {object} req - Objet requête Express, req.params.email = email de l'utilisateur à supprimer
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si l'utilisateur n'existe pas ou erreur serveur
 */
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.email);
    if (!deletedUser)
      return res.status(404).json({ message: "Utilisateur introuvable." });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** Se connecter en tant qu'utilisateur
 * @param {object} req - Objet requête Express
 * @param {string} req.body - Données entrées par l'utilisateur pour se connecter
 * @param {object} res - Objet réponse Express
 * @throws {Error} Si les données entrées sont incorrectes ou erreur serveur
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

/** Se déconnecter du tableau de bord
 * @param {object} req - Objet requête Express
 * @param {object} res - Objet réponse Express
 */
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.redirect("/?logout=success");
};
