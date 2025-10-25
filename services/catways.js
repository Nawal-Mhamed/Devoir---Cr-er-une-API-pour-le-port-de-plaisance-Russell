const Catway = require("../models/catway");

exports.getAllCatways = () => {
  return Catway.find();
};

exports.getByNumber = (catwayNumber) => {
  return Catway.findOne({ catwayNumber: catwayNumber });
};

exports.createCatway = async (data) => {
  const existingCatway = await Catway.findOne({
    catwayNumber: data.catwayNumber,
  });
  if (existingCatway) {
    const error = new Error("Ce catway existe déjà.");
    error.statusCode = 400;
    throw error;
  }

  const catway = new Catway(data);
  return catway.save();
};

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

exports.deleteCatway = (catwayNumber) => {
  return Catway.findOneAndDelete({ catwayNumber });
};
