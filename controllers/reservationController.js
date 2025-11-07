const reservation = require("../models/reservation");
const reservationService = require("../services/reservations");

/** Controller pour gérer les réservations
 * @module reservationController
 */

/** Afficher l'ensemble des réservations
 * @param {object} req - Objet requête Express, req.params.id = numéro du catway où l'on souhaite voir l'ensemble des réservations
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si erreur serveur
 */

exports.getAllReservations = async (req, res) => {
  try {
    const catwayIdParam = req.params.id;
    const catwayNumber =
      catwayIdParam !== undefined ? Number(catwayIdParam) : 0;

    const reservations =
      catwayNumber === 0
        ? await reservationService.getAllReservations()
        : await reservationService.getReservationsByCatway(catwayNumber);

    res.status(200).render("reservations", {
      title: "Gestionnaire des réservations",
      reservations: reservations.map((r) => r.toObject()),
      catwayNumber:
        catwayNumber === 0 ? "Tous les catways" : "Catway " + catwayNumber,
      filters: {
        clientName: "",
        boatName: "",
        idReservation: "",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** Obtenir des informations sur des réservations contenant les paramètres de recherche spécifiés
 * @param {object} req - Objet requête Express
 * @param {object} res - Objet réponse Express
 * @returns {Promise<Array>}
 * @throws {Error} Si erreur serveur
 */
exports.getBySearch = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id) || 0;

    const { idReservation, clientName, boatName } = req.query;

    // Si l'identifiant est connu, on redirige vers getById
    if (idReservation) {
      return res.redirect(
        `/catways/${catwayNumber}/reservations/${idReservation}`
      );
    }

    // Si seul le catway est spécifié
    if (!clientName && !boatName && !idReservation) {
      return res.redirect(`/catways/${catwayNumber}/reservations`);
    }

    // Recherche multi-critères
    const reservations = await reservationService.searchReservations({
      catwayNumber,
      clientName,
      boatName,
    });

    res.status(200).render("reservations", {
      title: "Gestionnaire des réservations",
      reservations: reservations.map((r) => r.toObject()),
      catwayNumber:
        catwayNumber === 0 ? "Tous les catways" : "Catway " + catwayNumber,
      filters: {
        clientName: clientName || "",
        boatName: boatName || "",
        idReservation: "",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** Obtenir des informations sur une réservation spécifique avec son identifiant
 * @param {object} req - Objet requête Express, req.params.id = numéro du catway où se trouve la réservation, req.params.idReservation = ID de la réservation
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si la réservation n'existe pas ou erreur serveur
 */
exports.getById = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const reservationId = req.params.idReservation;

    const reservation = await reservationService.getById(
      catwayNumber,
      reservationId
    );

    if (!reservation)
      return res.status(404).json({
        message: "Réservation introuvable sur le catway ${catwayNumber}.",
      });
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** Créer une réservation
 * @param {object} req - Objet requête Express, req.params.id = numéro du catway où la réservation doit être créée, req.body = données de la réservation
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si la réservation entre en conflit avec d'autres réservations ou erreur serveur.
 */

exports.createReservation = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const data = { ...req.body, catwayNumber };

    const reservation = await reservationService.createReservation(data);
    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    if (err.statusCode === 400) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
};

/** Modifier une réservation existante
 * @param {object} req - Objet requête Express, req.params.id = numéro du catway où se trouve la réservation, req.params.idReservation =  ID de la réservation, req.body = données à modifier
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si la réservation n'existe pas ou entre en conflit avec d'autres réservations ou erreur serveur.
 */

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

/** Supprimer une réservation
 * @param {object} req - Objet requête Express, req.params.id = numéro du catway où se trouve la réservation, req.params.idReservation = ID de la réservation
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si la réservation est introuvable ou erreur serveur
 */

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
