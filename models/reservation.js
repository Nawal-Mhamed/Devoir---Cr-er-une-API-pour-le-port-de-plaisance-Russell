const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: { type: Number, required: true, trim: true },
    clientName: { type: String, required: true },
    boatName: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          if (this.startDate) {
            return value > this.startDate;
          }

          const update = this.getUpdate?.();
          if (update) {
            const newStartDate =
              update.startDate || update.$set?.startDate || this.startDate;
            return value > newStartDate;
          }
          return true;
        },
        message: "La date de fin doit être après la date de début.",
      },
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
