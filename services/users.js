const user = require("../models/user");
const User = require("../models/user");
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

  const user = new User(data);
  return user.save();
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

  /** Vérifie si l'email n'a pas déjà été utilisé */

  if (data.email) {
    const existingUser = await User.findOne({
      email: data.email,
      email: { $ne: email },
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

  if (data.password) {
    data.password = bcrypt.hashSync(data.password, 10);
  }

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
  const existingUser = await User.findOne({ username, email });

  /** Vérifie si l'utilisateur existe */
  if (!existingUser) {
    const error = new Error(
      "Utilisateur introuvable ou identifiants incorrects."
    );
    error.statusCode = 401;
    throw error;
  }

  /** Vérifie si le mot de passe est correct */
  console.log("password formulaire :", password);
  console.log("password stocké :", user.password);
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const error = new Error("Mot de passe incorrect.");
    error.statusCode = 401;
    throw error;
  }

  /** Crée et renvoie le token JWT */
  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
  return token;
};
