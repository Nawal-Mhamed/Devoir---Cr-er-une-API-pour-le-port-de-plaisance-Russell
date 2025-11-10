const Catway = require("../models/catway");

/** Service for managing catways
 * @module catwayService
 */

/** Get all catways
 * @returns {Promise<Array>} List of all catways
 */

exports.getAllCatways = () => {
  return Catway.find();
};

/** Get a catway by its number
 * @param {number} catwayNumber - Number of the catway
 * @returns {Promise<object|null>} The catway or null if not found
 */

exports.getByNumber = (catwayNumber) => {
  return Catway.findOne({ catwayNumber: catwayNumber });
};

/** Create a new catway
 * @param {{catwayNumber: number, catwayType: string, catwayState: string}} data
 * @returns {Promise<object>} The created catway
 * @throws {Error} If the catway already exists or if the number is invalid
 */

exports.createCatway = async (data) => {
  const existingCatway = await Catway.findOne({
    catwayNumber: data.catwayNumber,
  });

  // Ensure the catway number is unique

  if (existingCatway) {
    const error = new Error("Ce catway existe déjà.");
    error.statusCode = 400;
    throw error;
  }

  // Ensure the catway number is not 0

  if (data.catwayNumber === 0) {
    const error = new Error("Le numéro de catway ne peut pas être 0.");
    error.statusCode = 400;
    throw error;
  }

  // Save the new catway

  const catway = new Catway(data);
  return catway.save();
};

/** Update an existing catway.
 * @param {number} catwayNumber - Number of the catway to update
 * @param {{catwayNumber: number, catwayType: string, catwayState: string}=} data - Data to update
 * @returns {Promise<object|null>} Updated catway or null if not found
 */

exports.updateCatway = async (catwayNumber, data) => {
  // Prevent modification of the creation timestamp
  if ("createdAt" in data) {
    delete data.createdAt;
  }

  return Catway.findOneAndUpdate(
    { catwayNumber: catwayNumber },
    { $set: data },
    { new: true, runValidators: true }
  );
};

/** Delete a catway by its number
 * @param {number} catwayNumber - Number of the catway to delete
 * @returns {Promise<object|null>} Delete catway or null if not found
 */

exports.deleteCatway = (catwayNumber) => {
  return Catway.findOneAndDelete({ catwayNumber });
};
