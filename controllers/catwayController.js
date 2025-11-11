const catwayService = require("../services/catways");

/** Controller for managing catways.
 * @module catwayController
 */

/** Get all catways
 * @route {GET} /catways
 * @param {object} req - Express request object
 * @param {object} res - Express request object
 * @returns {Promise<void>}
 * @throws {Error} If server error occurs
 */

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await catwayService
      .getAllCatways()
      .sort({ catwayNumber: 1 })
      .lean();
    res.status(200).render("catways", {
      catways,
      selectedCatwayId: null,
      role: req.userRole,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

/** Get a specific catway by its number.
 * @route {GET} /catways/{id}
 * @routeparam {number} :id - Catway number
 * @param {object} req - Express request object
 * @param {object} res - Express reponse object
 * @returns {Promise<void>}
 * @throws {Error} If the catway doesn't exist
 */

exports.getByNumber = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const selectedCatway = await catwayService.getByNumber(catwayNumber);

    if (!selectedCatway) {
      return res.status(404).render("catway", {
        catway: null,
        errorMessage: `Le catway est introuvable ou n'existe pas.`,
        role: req.userRole,
      });
    }

    res
      .status(200)
      .render("catway", { catway: selectedCatway, role: req.userRole });
  } catch (err) {
    console.error(err);
    res.status(500).render("catway", {
      catway: null,
      errorMessage: "Erreur serveur",
      role: req.userRole,
    });
  }
};

/**  Create a new catway
 * @route {POST} /catways
 * @param {object} req - Express request object, req.body contains catway data
 * @param {object} res - Express reponse object
 * @returns {Promise<void>}
 * @throws {Error} If catway already exists or server error occurs
 */

exports.createCatway = async (req, res) => {
  try {
    const catway = await catwayService.createCatway(req.body);
    res.status(201).json(catway);
  } catch (err) {
    if (err.statusCode === 400) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
};

/** Update an existing catway
 * @route {PUT} /catways/{id}
 * @routeparam {number} :id - Catway number
 * @param {object} req - Express request object, req.params.id = catway number / req.body = updated data
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If catway doesn't exist or server error occurs
 */

exports.updateCatway = async (req, res) => {
  try {
    const catwayNumber = req.params.id;
    const updatedCatway = await catwayService.updateCatway(
      catwayNumber,
      req.body
    );
    if (!updatedCatway)
      return res.status(404).json({ message: "Catway introuvable " });
    res.status(200).json(updatedCatway);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** Delete a catway
 * @route {DELETE} /catways/{id}
 * @routeparam {number} :id - Catway number
 * @param {object} req - Express request object, req.params.id = catway number
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If catway doesn't exist or server error occurs
 */

exports.deleteCatway = async (req, res) => {
  const catwayNumber = req.params.id;
  try {
    const deletedCatway = await catwayService.deleteCatway(catwayNumber);
    if (!deletedCatway)
      return res.status(404).json({ message: "Catway introuvable " });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
