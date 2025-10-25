const mongoose = require("mongoose");

const clientOptions = {
  useNewUrlParser: true,
  dbName: "apinode",
};

exports.initClientConnection = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, clientOptions);
    console.log("Connection to MongoDB successful!");
  } catch (error) {
    console.error("Connection to MongoDB failed: ", error);
    throw error;
  }
};
