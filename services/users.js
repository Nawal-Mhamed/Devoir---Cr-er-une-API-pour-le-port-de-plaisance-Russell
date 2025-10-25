const User = require("../models/user");

exports.getAllUsers = () => {
  return User.find();
};

exports.getByEmail = (email) => {
  return User.findOne({ email });
};

exports.createUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    const error = new Error("Cet email est déjà utilisé.");
    error.statusCode = 400;
    throw error;
  }

  const user = new User(data);
  return user.save();
};

exports.updateUser = async (email, data) => {
  if ("createdAt" in data) {
    delete data.createdAt;
  }

  if (data.email) {
    const existingUser = await User.findOne({
      email: data.email,
      email: { $ne: email },
    });
    if (existingUser) {
      const error = new Error("Cet email est déjà utilisé.");
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!updatedUser) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }
  return updatedUser;
};

exports.deleteUser = (email) => {
  return User.findOneAndDelete({ email });
};
