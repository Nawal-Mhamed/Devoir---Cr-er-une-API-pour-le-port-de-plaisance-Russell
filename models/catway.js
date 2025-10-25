const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
      min: [1, "Le numéro du catway doit être supérieur ou égal à 1."],
    },
    catwayType: { type: String, enum: ["long", "short"], required: true },
    catwayState: { type: String, required: true },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catway", catwaySchema);
