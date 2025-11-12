const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.SECRET_KEY || "GTGh6rdP54GT76";

/** Service for managing users
 * @module usersService
 */

/** Get all users
 * @returns {Promise<Array>} List of users
 */

exports.getAllUsers = () => {
  return User.find();
};

/** Get a user by email
 * @param {string} email
 * @returns {Promise<object|null>} User object or null if not found
 */

exports.getByEmail = (email) => {
  return User.findOne({ email });
};

/** Create a new user
 * @param {{username: string, email: string, password: string}} data
 * @returns {Promise<object>} Created user
 * @throws {Error} If email is already used
 */

exports.createUser = async (data) => {
  // Check if a user with the same email already exists

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

/** Update user information
 * @param {string} email - Email of the user to update
 * @param {{username: string, email: string, password: string}=} data
 * @returns {Promise<object>} Updated user
 * @throws {Error} If user not found or email already used
 */

exports.updateUser = async (email, data) => {
  if ("createdAt" in data) {
    delete data.createdAt;
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // Check if the user exists

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }

  // Check if the email isn't already used

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

  // Update data

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

/** Delete a user by email
 * @param {string} email
 * @returns {Promise<object|null>} Deleted user or null if not found
 */

exports.deleteUser = (email) => {
  return User.findOneAndDelete({ email });
};

/** Verify credentials and return a JWT token if valid
 * @param {{username: string, email: string, password: string}} data
 * @returns {Promise<string>} JWT token
 * @throws {Error} If credentials are invalid
 */
exports.loginUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });

  // Check if user exists
  if (!existingUser) {
    const error = new Error(
      "Utilisateur introuvable ou identifiants incorrects."
    );
    error.statusCode = 401;
    throw error;
  }

  // Check if password is valid
  const isValid = await bcrypt.compare(password, existingUser.password);
  if (!isValid) {
    const error = new Error("Mot de passe incorrect.");
    error.statusCode = 401;
    throw error;
  }

  // Create and send back the JWT token
  const token = jwt.sign(
    {
      id: existingUser._id,
      role: existingUser.role,
      email: existingUser.email,
    },
    SECRET_KEY,
    {
      expiresIn: "2h",
    }
  );
  console.log("Token généré :", token);
  return token;
};
