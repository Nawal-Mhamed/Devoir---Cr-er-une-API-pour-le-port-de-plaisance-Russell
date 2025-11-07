const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis."],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "L'email est requis."],
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères."],
      required: [true, "Veuillez entrer votre mot de passe."],
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
  { timestamps: true }
);

/** Hash le mot de passe
 * @function hashPassword
 * @memberof User
 * @param {function} next - Callback pour passer au middleware suivant
 */
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);

  next();
});

/** Modèle représentant un utilisateur
 * @namespace User
 * @property {string} username - Nom d'utilisateur
 * @property {string} email - Email de l'utilisateur
 * @property {string} password - Mot de passe de l'utilisateur
 */
module.exports = mongoose.model("User", userSchema);
