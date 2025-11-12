const reservation = require("../models/reservation");
const reservationService = require("../services/reservations");

/** Controller for managing reservations.
 * @module reservationController
 */

/** Get all reservations.
 * @param {object} req - Express request object, req.params.id =  catway number to filter by (0 = all catways)
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If server error occurs
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
      role: req.userRole,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** Get reservations based on search parameters
 * @param {object} req - Express request object, req.query may contain idReservation, clientName or boatName
 * @param {object} res - Express response object
 * @returns {Promise<Array>}
 * @throws {Error} If server error occurs
 */
exports.getBySearch = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id) || 0;

    const { idReservation, clientName, boatName } = req.query;

    // If reservation ID is provided, return that reservation directly
    if (idReservation) {
      const reservation = await reservationService.getById(
        catwayNumber,
        idReservation
      );

      if (!reservation) {
        return res.status(404).render("reservation", {
          reservation: null,
          errorMessage: `Réservation introuvable sur le catway ${catwayNumber}.`,
        });
      }

      return res
        .status(200)
        .render("reservation", { reservation, role: req.userRole });
    }

    // If onyl catway is specified with no other search parameters
    if (!clientName && !boatName && !idReservation) {
      return res.redirect(`/catways/${catwayNumber}/reservations`);
    }

    // Multi-criteria search
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
      role: req.userRole,
    });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};

/** Get a specific reservation by its ID.
 * @param {object} req - Express request object, req.params.id = catway number / req.params.idReservation = reservation ID
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If reservation doesn't exist or server error occurs
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
      return res.status(404).render("reservation", {
        reservation: null,
        catwayNumber,
        errorMessage: `La réservation est introuvable sur le catway ${catwayNumber} ou n'existe pas.`,
        role: req.userRole,
      });
    res.status(200).render("reservation", {
      reservation: reservation.toObject(),
      catwayNumber,
      filters: {},
      role: req.userRole,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("reservation", {
      reservation: null,
      catwayNumber,
      errorMessage: "Erreur serveur",
      role: req.userRole,
    });
  }
};

/** Create a new reservation.
 * @param {object} req - Express request object, req.params.id = catway number / req.body = reservation data
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If reservation conflicts with existing ones or server error occurs
 */

exports.createReservation = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const data = { ...req.body, catwayNumber };

    const reservation = await reservationService.createReservation(data);
    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    if (err.statusCode === 400 || err.statusCode === 404) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
};

/** Update an existing reservation
 * @param {object} req - Express request object, req.params.id = catway number / req.params.idReservation =  reservation ID / req.body = updated data
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If reservation doesn't exist, conflicts or server error occurs
 */

exports.updateReservation = async (req, res) => {
  try {
    console.log("[UPDATE DEBUG] Requête reçue :", {
      params: req.params,
      body: req.body,
    });

    const catwayNumber = Number(req.params.id);
    const idReservation = req.params.idReservation;
    const data = req.body;

    const updatedReservation = await reservationService.updateReservation(
      catwayNumber,
      idReservation,
      data
    );

    if (!updatedReservation) {
      console.log("[UPDATE DEBUG] Aucune réservation trouvée avec cet ID");
      return res.status(404).json({ message: "Réservation introuvable." });
    }
    console.log("[UPDATE DEBUG] Aucune réservation trouvée avec cet ID");
    res.status(200).json(updatedReservation);
  } catch (err) {
    if (err.statusCode === 404) {
      console.log("[UPDATE DEBUG] Aucune réservation trouvée avec cet ID");
      res.status(404).json({ message: err.message });
    } else if (err.statusCode === 403) {
      console.log("[UPDATE DEBUG] Aucune réservation trouvée avec cet ID");
      res.status(403).json({ message: err.message });
    } else if (err.statusCode === 400) {
      console.log("[UPDATE DEBUG] Aucune réservation trouvée avec cet ID");
      res.status(400).json({ message: err.message });
    } else {
      console.log("[UPDATE DEBUG] Aucune réservation trouvée avec cet ID");
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
};

/** Delete a reservation
 * @param {object} req - Express request object, req.params.id = catway number, req.params.idReservation = reservation ID
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If reservation not found or server error occurs
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
