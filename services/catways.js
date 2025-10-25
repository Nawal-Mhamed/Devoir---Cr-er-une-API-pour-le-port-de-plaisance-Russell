const Catway = require("../models/catway");

/** Service pour gérer les catways
 * @module catwayService
 */

/** Affiche l'ensemble des catways enregistrés
 * @returns {Promise<Array>}
 */

exports.getAllCatways = () => {
  return Catway.find();
};

/** Affiche le catway demandé grâce au numéro de catway spécifié
 * @param {number} catwayNumber
 * @returns {Promise<object|null>}
 */

exports.getByNumber = (catwayNumber) => {
  return Catway.findOne({ catwayNumber: catwayNumber });
};

/** Crée un nouveau catway
 * @param {{catwayNumber: number, catwayType: string, catwayState: string}} data
 * @returns {Promise<object>}
 * @throws {Error} Si le catway existe déjà
 */

exports.createCatway = async (data) => {
  const existingCatway = await Catway.findOne({
    catwayNumber: data.catwayNumber,
  });

  /** Vérifie si le numéro de catway est unique avant de le créer */

  if (existingCatway) {
    const error = new Error("Ce catway existe déjà.");
    error.statusCode = 400;
    throw error;
  }

  const catway = new Catway(data);
  return catway.save();
};

/** Modifie les informations du catway spécifié
 * @param {number} catwayNumber
 * @param {{catwayNumber: number, catwayType: string, catwayState: string}=} data
 * @returns {Promise<object|null>}
 */

exports.updateCatway = async (catwayNumber, data) => {
  if ("createdAt" in data) {
    delete data.createdAt;
  }

  return Catway.findOneAndUpdate(
    { catwayNumber: catwayNumber },
    { $set: data },
    { new: true, runValidators: true }
  );
};

/** Supprime le catway spécifié
 * @param {number} catwayNumber
 * @returns {Promise<object|null>}
 */

exports.deleteCatway = (catwayNumber) => {
  return Catway.findOneAndDelete({ catwayNumber });
};
