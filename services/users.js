const User = require("../models/user");
const jwt = require("jsonwebtoken"); // ← ajoute cette ligne en haut
const SECRET_KEY = process.env.SECRET_KEY || "GTGh6rdP54GT76";
const bcrypt = require("bcrypt");

/** Service pour gérer les utilisateurs
 * @module usersService
 */

/** Affiche tous les utilisateurs enregistrés
 * @returns {Promise<Array>}
 */

exports.getAllUsers = () => {
  return User.find();
};

/** Affiche l'utilisateur spécifié
 * @param {string} email
 * @returns {Promise<object|null>}
 */

exports.getByEmail = (email) => {
  return User.findOne({ email });
};

/** Crée un nouvel utilisateur
 * @param {{username: string, email: string, password: string}} data
 * @returns {Promise<object>}
 * @throws {Error} Si email déjà utilisé
 */

exports.createUser = async (data) => {
  /** Vérifie si un utilisateur avec le même email existe déjà */

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    const error = new Error("Cet email est déjà utilisé.");
    error.statusCode = 400;
    throw error;
  }

  try {
    const user = new User(data);
    return await user.save();
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(" ");
      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }
    throw err;
  }
};

/** Modifie les informations de l'utilisateur spécifié
 * @param {string} email
 * @param {{username: string, email: string, password: string}=} data
 * @returns {Promise<object>}
 * @throws {Error} Si utilisateur introuvable ou email déjà utilisé
 */

exports.updateUser = async (email, data) => {
  if ("createdAt" in data) {
    delete data.createdAt;
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  /** Vérifie que l'utilisateur existe */

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }

  /** Vérifie si l'email n'a pas déjà été utilisé */

  if (data.email && data.email !== user.email) {
    const existingUser = await User.findOne({
      email: data.email,
    });
    if (existingUser) {
      const error = new Error("Cet email est déjà utilisé.");
      error.statusCode = 400;
      throw error;
    }
  }

  /** Met à jour les informations */

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }
  return updatedUser;
};

/** Supprime l'utilisateur spécifié
 * @param {string} email
 * @returns {Promise<object|null>}
 */

exports.deleteUser = (email) => {
  return User.findOneAndDelete({ email });
};

/** Vérifie les identifiants et renvoie un token si valides
 * @param {object} data - Contient username, email et password
 * @param {string} data.username - Nom de l'utilisateur
 * @param {string} data.email - Email de l'utilisateur
 * @param {string} data.password - Mot de passe de l'utilisateur
 * @returns {Promise<string>} token JWT
 */
exports.loginUser = async ({ username, email, password }) => {
  console.log("Données reçues :", { username, email, password });

  const existingUser = await User.findOne({ username, email });
  console.log("Utilisateur trouvé :", existingUser);

  /** Vérifie si l'utilisateur existe */
  if (!existingUser) {
    console.log("Aucun utilisateur ne correspond.");
    const error = new Error(
      "Utilisateur introuvable ou identifiants incorrects."
    );
    error.statusCode = 401;
    throw error;
  }

  /** Vérifie si le mot de passe est correct */
  const isValid = await bcrypt.compare(password, existingUser.password);
  if (!isValid) {
    const error = new Error("Mot de passe incorrect.");
    error.statusCode = 401;
    throw error;
  }

  /** Crée et renvoie le token JWT */
  const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
    expiresIn: "1h",
  });
  console.log("Token généré :", token);
  return token;
};
