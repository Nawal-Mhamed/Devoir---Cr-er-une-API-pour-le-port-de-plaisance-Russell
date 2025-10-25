const Reservation = require("../models/reservation");
const mongoose = require("mongoose");

exports.getAllReservations = (catwayNumber) => {
  return Reservation.find({ catwayNumber: catwayNumber });
};

exports.getById = (catwayNumber, idReservation) => {
  return Reservation.findOne({
    _id: new mongoose.Types.ObjectId(idReservation),
    catwayNumber: catwayNumber,
  });
};

exports.createReservation = async (data) => {
  const { catwayNumber, clientName, boatName, startDate, endDate } = data;

  if (!catwayNumber || !clientName || !boatName || !startDate || !endDate) {
    const error = new Error(
      "Les champs catwayNumber, clientName, boatName, startDate et endDate sont requis."
    );
    error.statusCode = 400;
    throw error;
  }

  // Vérification même catway + période qui se chevauche

  const sameCatwayConflict = await Reservation.findOne({
    catwayNumber,
    $or: [
      { startDate: { $lt: Date(endDate) }, endDate: { $gt: Date(startDate) } },
    ],
  });

  if (sameCatwayConflict) {
    const error = new Error(
      "Une réservation a déjà été faite sur ce catway dans cette période."
    );
    error.statusCode = 400;
    throw error;
  }

  // Vérification même client + période qui se chevauche sur un autre catway ou le même catway

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

  // Vérification même bateau + période qui se chevauche sur un autre catway ou le même catway

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

exports.updateReservation = async (catwayNumberParam, idReservation, data) => {
  if ("createdAt" in data) {
    delete data.createdAt;
  }

  // Vérification de l'existence de la réservation

  const existingReservation = await Reservation.findById(idReservation);
  if (!existingReservation) {
    const error = new Error("Réservation introuvable.");
    error.statusCode = 404;
    throw error;
  }

  // Vérification de la cohérence de la route avec la réservation actuelle

  if (existingReservation.catwayNumber !== Number(catwayNumberParam)) {
    const error = new Error(
      `Cette réservation n'appartient pas au catway ${catwayNumberParam} mais au catway ${existingReservation.catwayNumber}.`
    );
    error.statusCode = 403;
    throw error;
  }

  // Fusion des anciennes et nouvelles données
  const updatedData = { ...existingReservation.toObject(), ...data };
  const { catwayNumber, clientName, boatName, startDate, endDate } =
    updatedData;

  // Conversion des dates pour éviter les erreurs de comparaison
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);

  // Vérifiction conflit de réservation du catway sur la même période

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

  // Vérification conflit de réservation d'un même client sur la même période sur un autre catway.

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

  // Vérification conflit de réservation d'un même bateau sur la même période sur un autre catway.

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

  // Mise à jour de la réservation avec les nouvelles données

  const updatedReservation = await Reservation.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(idReservation) },
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  return updatedReservation;
};

exports.deleteReservation = (catwayNumber, idReservation) => {
  return Reservation.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(idReservation),
    catwayNumber,
  });
};
