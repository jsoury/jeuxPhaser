const express = require("express");
const bodyParser = require("body-parser");
var serveFavicon = require("serve-favicon");
const path = require("path");
const fs = require("fs");

const app = express();

const siteRoutes = require("./routes/site");
const chronoRoutes = require("./routes/chrono");

app.use(serveFavicon(__dirname + "/public/favicon.ico"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.get("/favicon.ico", function (req, res, next) {
  res.sendFile(path.join("client", "public", "favicon.ico"));
  next();
});

app.use(express.static(path.resolve("../client/asset")));
app.use(express.static(path.resolve("../client/js")));
app.use(express.static(path.resolve("../client/css")));
app.use(express.static(path.resolve("../client/json")));

app.use(bodyParser.json());

app.use("/", siteRoutes);
app.use("/chrono", chronoRoutes);

let jeux = require("./json/jeu");
app.get("/jeu", function (req, res) {
  res.send(jeux);
});

module.exports = app;
