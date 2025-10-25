const userService = require("../services/users");

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.statusCode === 400) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getByEmail = async (req, res) => {
  try {
    const user = await userService.getByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.email,
      req.body
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.statusCode === 400 || err.statusCode === 404) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
};

exports.deleteUser = async (req, res) => {
  console.log("Email reçu : ", req.params.id);
  try {
    const deletedUser = await userService.deleteUser(req.params.email);
    if (!deletedUser)
      return res.status(404).json({ message: "Utilisateur introuvable." });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
