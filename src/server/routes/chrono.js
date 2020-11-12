const express = require("express");
const router = express.Router();
const fs = require("fs");
const chronoJSON = require("../json/chrono.json");

router.get("/", function (req, res) {
  res.send(chronoJSON);
});

router.post("/", function (req, res) {
  try {
    const newChrono = parseInt(req.body.chrono.split(":").join(""));
    let jsonFile = fs.readFileSync("./json/chrono.json");
    let chronos = JSON.parse(jsonFile);
    let chrono;
    let newPlayer = false;
    // chronos.chrono.forEach((chrono) => console.log(chrono));
    for (chrono in chronos.chrono) {
      let ligne = chronos.chrono[chrono];
      let recordChrono = parseInt(ligne.chrono.split(":").join(""));
      if (ligne.playerName === req.body.playerName && ligne.level === req.body.level) {
        newPlayer = true;
        if (newChrono < recordChrono) {
          ligne.chrono = req.body.chrono;
          break;
        }
      }
    }
    if (!newPlayer) {
      chronos.chrono.push(req.body);
    }

    var newJSONFile = JSON.stringify(chronos);
    fs.writeFileSync("./json/chrono.json", newJSONFile, undefined, 4);
    res.status(200).json(!newPlayer ? { message: "Chrono enregistré !" } : { message: "Joueur existe deja !" });
  } catch (err) {
    res.status(500).json({ message: "erreur d'enregistement !" });
  } finally {
    res.end();
  }
});
module.exports = router;
