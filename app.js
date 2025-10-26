const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const { initClientConnection } = require("./db/mongo");

const indexRouter = require("./routes/index");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/users");
const catwayRoutes = require("./routes/catways");

const app = express();

/** Déclaration du moteur de template et du dossier des views */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** Connexion à la base de données MongoDB */

initClientConnection()
  .then(() => {
    console.log("Connection to MongoDB successful!");
  })
  .catch((err) => {
    console.error("Connection to MongoDB failed: ", err);
    process.exit(1); /** Arrêt de l'app en cas d'erreur */
  });

/** Middlewares */

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/users", userRoutes);
app.use("/catways", catwayRoutes);

/** Middleware d'erreur simple */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur serveur" });
});

/** Exploitation du dossier public pour les fichiers statiques */

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("node_modules/bootstrap/dist"));
app.use("/docs", express.static(path.join(__dirname, "docs")));

module.exports = app;
