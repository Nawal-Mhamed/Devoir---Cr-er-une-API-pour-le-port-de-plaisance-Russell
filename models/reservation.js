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

      /** Vérifie que la date de fin est bien après la date de début
       * @function validateDates
       * @memberof Reservation
       * @param {Date} startDate - Date de début de la réservation
       * @param {Date} endDate - Date de fin de la réservation
       * @returns {boolean}
       */
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

/** Modèle représentant une réservation
 * @namespace Reservation
 * @property {number} catwayNumber - Numéro du catway réservé
 * @property {string} clientName - Nom du client qui a fait la réservation
 * @property {string} boatName - Nom du bateau réservé
 * @property {Date} startDate - Date de début de la réservation
 * @property {Date} endDate - Date de fin de la réservation
 */
module.exports = mongoose.model("Reservation", reservationSchema);
