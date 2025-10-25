const catwayService = require("../services/catways");

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.status(200).json(catways);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getByNumber = async (req, res) => {
  try {
    const catwayNumber = req.params.id;
    const catway = await catwayService.getByNumber(catwayNumber);
    if (!catway) return res.status(404).json({ message: "Catway introuvable" });
    res.status(200).json(catway);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

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
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.deleteCatway = async (req, res) => {
  const catwayNumber = req.params.id;
  console.log("Catway reçu :", catwayNumber);
  try {
    const deletedCatway = await catwayService.deleteCatway(catwayNumber);
    if (!deletedCatway)
      return res.status(404).json({ message: "Catway introuvable " });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
