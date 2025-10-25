const reservationService = require("../services/reservations");

exports.getAllReservations = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const reservations = await reservationService.getAllReservations(
      catwayNumber
    );
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const reservationId = req.params.idReservation;

    const reservation = await reservationService.getById(
      catwayNumber,
      reservationId
    );

    if (!reservation)
      return res.status(404).json({ message: "Réservation introuvable" });
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const data = { ...req.body, catwayNumber };

    const reservation = await reservationService.createReservation(data);
    res.status(201).json(reservation);
  } catch (err) {
    if (err.statusCode === 400) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const idReservation = req.params.idReservation;
    const data = req.body;

    const updatedReservation = await reservationService.updateReservation(
      catwayNumber,
      idReservation,
      data
    );

    if (!updatedReservation)
      return res.status(404).json({ message: "Réservation introuvable." });
    res.status(200).json(updatedReservation);
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).json({ message: err.message });
    } else if (err.statusCode === 403) {
      res.status(403).json({ message: err.message });
    } else if (err.statusCode === 400) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
};

exports.deleteReservation = async (req, res) => {
  const { id: catwayNumber, idReservation } = req.params;

  try {
    const deletedReservation = await reservationService.deleteReservation(
      catwayNumber,
      idReservation
    );
    if (!deletedReservation)
      return res.status(404).json({ message: "Réservation introuvable." });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
