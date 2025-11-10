const Reservation = require("../models/reservation");
const mongoose = require("mongoose");

/** Service for managing reservations.
 * @module reservationsService
 */

/** Get all reservations
 * @returns {Promise<Array>} List of all reservations
 */
exports.getAllReservations = () => {
  return Reservation.find({});
};

/** Get all reservations for a specific catway.
 * @param {number} catwayNumber - Catway Number
 * @returns {Promise<Array>} List of reservations for the specified catway
 */
exports.getReservationsByCatway = (catwayNumber) => {
  return Reservation.find({ catwayNumber });
};

/** Search reservations with flexible filters
 * - If catwayNumber === 0, catway filter is  ignored (all catways)
 * - Can filter by clientName (partial, case-insensitive), boatName (partial) and exact _id (idReservation)
 * @param {{catwayNumber: number, clientName?: string, boatName?: string, idReservation?: string}} filters
 * @returns {Promise<Array>} List of reservations matching filters

*/
exports.searchReservations = ({
  catwayNumber,
  clientName,
  boatName,
  idReservation,
}) => {
  const filter = {};

  if (catwayNumber && Number(catwayNumber) !== 0) {
    filter.catwayNumber = Number(catwayNumber);
  }

  if (idReservation) {
    try {
      filter._id = new mongoose.Types.ObjectId(idReservation);
    } catch (e) {
      return [];
    }
  }
  if (clientName) filter.clientName = { $regex: new RegExp(clientName, "i") };
  if (boatName) filter.boatName = { $regex: new RegExp(boatName, "i") };

  return Reservation.find(filter).sort({ startDate: 1 });
};

/** Get a reservation by catway number and reservation ID.
 * @param {number} catwayNumber
 * @param {string} idReservation
 * @returns {Promise<object|null>} The reservation or null if not found
 */

exports.getById = async (catwayNumber, idReservation) => {
  try {
    return await Reservation.findOne({
      _id: new mongoose.Types.ObjectId(idReservation),
      catwayNumber: catwayNumber,
    });
  } catch (err) {
    return null;
  }
};

/** Create a new reservation on a specified catway
 * @param {{catwayNumber: number, clientName: string, boatName: string, startDate: Date, endDate: Date}=} data
 * @returns {Promise<object>} Created reservation
 * @throws {Error} If reservation conflicts with existing reservations or required fields are missing
 */

exports.createReservation = async (data) => {
  const { catwayNumber, clientName, boatName, startDate, endDate } = data;

  if (!catwayNumber || !clientName || !boatName || !startDate || !endDate) {
    const error = new Error(
      "Les champs catwayNumber, clientName, boatName, startDate et endDate sont requis."
    );
    error.statusCode = 400;
    throw error;
  }

  // Checking dates

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    const error = new Error("Les dates fournies ne sont pas valides.");
    error.statusCode = 400;
    throw error;
  }

  if (start >= end) {
    const error = new Error(
      "La date de fin doit être postérieure à la date de début."
    );
    error.statusCode = 400;
    throw error;
  }

  // Check for overlapping reservations on the same catway

  const sameCatwayConflict = await Reservation.findOne({
    catwayNumber,
    $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
  });

  if (sameCatwayConflict) {
    const error = new Error(
      "Une réservation a déjà été faite sur ce catway dans cette période."
    );
    error.statusCode = 400;
    throw error;
  }

  // Check for overlapping reservations for the same client

  const sameClientConflict = await Reservation.findOne({
    clientName,
    $or: [
      { startDate: { $lt: Date(endDate) }, endDate: { $gt: Date(startDate) } },
    ],
  });

  if (sameClientConflict) {
    const error = new Error(
      `Une réservation a déjà été faite à ce nom sur cette période sur le catway ${sameClientConflict.catwayNumber}.`
    );
    error.statusCode = 400;
    throw error;
  }

  // Check for overlapping reservations for the same boat

  const sameBoatConflict = await Reservation.findOne({
    boatName,
    $or: [
      { startDate: { $lt: Date(endDate) }, endDate: { $gt: Date(startDate) } },
    ],
  });

  if (sameBoatConflict) {
    const error = new Error(
      `Ce bateau a déjà été réservé sur cette période sur le catway ${sameBoatConflict.catwayNumber}.`
    );
    error.statusCode = 400;
    throw error;
  }

  const reservation = new Reservation(data);
  return reservation.save();
};

/** Update a reservation by catway number and reservation ID
 * @param {number} catwayNumberParam
 * @param {string} idReservation
 * @param {{catwayNumber: number, clientName: string, boatName: string, startDate: Date, endDate: Date}=} data
 * @returns {Promise<object>} Updated reservation
 * @throws {Error} If reservation not found or conflicts with existing reservations
 */
exports.updateReservation = async (catwayNumberParam, idReservation, data) => {
  if ("createdAt" in data) {
    delete data.createdAt;
  }

  // Check if reservation exists

  const existingReservation = await Reservation.findById(idReservation);
  if (!existingReservation) {
    const error = new Error("Réservation introuvable.");
    error.statusCode = 404;
    throw error;
  }

  // Check if the route corresponds to the actual reservation

  if (existingReservation.catwayNumber !== Number(catwayNumberParam)) {
    const error = new Error(
      `Cette réservation n'appartient pas au catway ${catwayNumberParam} mais au catway ${existingReservation.catwayNumber}.`
    );
    error.statusCode = 403;
    throw error;
  }

  // Fusion of new and old data
  const updatedData = { ...existingReservation.toObject(), ...data };
  const { catwayNumber, clientName, boatName, startDate, endDate } =
    updatedData;

  // Date conversion to avoid comparison errors
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);

  if (isNaN(newStart) || isNaN(newEnd)) {
    const error = new Error("Les dates fournies ne sont pas valides.");
    error.statusCode = 400;
    throw error;
  }

  if (newStart >= newEnd) {
    const error = new Error(
      "La date de fin doit être postérieure à la date de début."
    );
    error.statusCode = 400;
    throw error;
  }

  // Check for overlapping reservations on the same catway

  const sameCatwayConflict = await Reservation.findOne({
    _id: { $ne: idReservation },
    catwayNumber,
    startDate: { $lt: newEnd },
    endDate: { $gt: newStart },
  });

  if (sameCatwayConflict) {
    const error = new Error(
      Number(catwayNumber) !== existingReservation.catwayNumber
        ? `Impossible de déplacer la réservation vers le catway ${catwayNumber} car une réservation a déjà été faite sur cette période.`
        : `Une réservation existe déjà sur le catway ${catwayNumber} sur cette période.`
    );
    error.statusCode = 400;
    throw error;
  }

  // Check for overlapping reservations for the same client */

  const sameClientConflict = await Reservation.findOne({
    _id: { $ne: idReservation },
    clientName,
    startDate: { $lt: newEnd },
    endDate: { $gt: newStart },
  });

  if (sameClientConflict) {
    const error = new Error(
      `Une réservation a déjà été faite à ce nom sur cette période sur le catway ${sameClientConflict.catwayNumber}.`
    );
    error.statusCode = 400;
    throw error;
  }

  // Check for overlapping reservations for the same boat

  const sameBoatConflict = await Reservation.findOne({
    _id: { $ne: idReservation },
    boatName,
    startDate: { $lt: newEnd },
    endDate: { $gt: newStart },
  });

  if (sameBoatConflict) {
    const error = new Error(
      `Le bateau '${boatName}' est déjà réservé sur cette période sur le catway ${sameBoatConflict.catwayNumber}.`
    );
    error.statusCode = 400;
    throw error;
  }

  // Updating the reservation with new data

  const updatedReservation = await Reservation.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(idReservation) },
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  return updatedReservation;
};

/** Delete a reservation by catway number and reservation ID
 * @param {number} catwayNumber
 * @param {string} idReservation
 * @returns {Promise<object|null>} Delete reservation or null if not found
 */

exports.deleteReservation = (catwayNumber, idReservation) => {
  return Reservation.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(idReservation),
    catwayNumber,
  });
};
