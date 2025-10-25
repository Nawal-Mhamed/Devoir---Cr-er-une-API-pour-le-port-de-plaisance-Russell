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
      minlength: 8,
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

// Hash le mot de passe

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);

  next();
});

module.exports = mongoose.model("User", userSchema);
