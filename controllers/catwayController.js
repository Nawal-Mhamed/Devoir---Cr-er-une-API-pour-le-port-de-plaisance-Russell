const catwayService = require("../services/catways");

/** Controller pour gérer les catways
 * @module catwayController
 */

/** Afficher l'ensemble des catways
 * @route {GET} /catways
 * @param {object} req - Ojet requête Express
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si erreur serveur
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

/** Obtenir les informations sur un catway en particulier avec le numéro du catway
 * @route {GET} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 * @param {object} req - Objet requête Express
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si le catway n'existe pas ou erreur serveur
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

/**  Créer un nouveau Catway
 * @route {POST} /catways
 * @param {object} req - Objet requête Express, req.body contient les données du catway
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si le catway existe déjà ou erreur serveur
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

/** Modifier les informations d'un catway existant
 * @route {PUT} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 * @param {object} req - Objet requête Express, req.params.id = numéro du catway, req.body = données à modifier
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si le catway n'existe pas ou erreur serveur
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

/** Supprimer un catway
 * @route {DELETE} /catways/{id}
 * @routeparam {number} :id - Numéro du catway
 * @param {object} req - Objet requête Express, req.params.id = numéro du catway à supprimer
 * @param {object} res - Objet réponse Express
 * @returns {Promise<void>}
 * @throws {Error} Si le catway n'existe pas ou erreur serveur
 */

exports.deleteCatway = async (req, res) => {
  const catwayNumber = req.params.id;
  console.log("Catway reçu :", catwayNumber);
  try {
    const deletedCatway = await catwayService.deleteCatway(catwayNumber);
    if (!deletedCatway)
      return res.status(404).json({ message: "Catway introuvable " });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
