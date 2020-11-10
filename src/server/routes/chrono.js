const express = require("express");
const router = express.Router();
const fs = require("fs");
const chronoJSON = require("../json/chrono.json");

router.get("/", function (req, res) {
  res.send(chronoJSON);
});

router.post("/", function (req, res) {
  let body = req.body;
  let newChrono = parseInt(req.body.chrono.split(":").join(""));
  let jsonFile = fs.readFileSync("./json/chrono.json");
  let chronos = JSON.parse(jsonFile);
  let chrono;
  for (chrono in chronos.chrono) {
    let ligne = chronos.chrono[chrono];
    let recordChrono = parseInt(ligne.chrono.split(":").join(""));
    if (ligne.playerName === req.body.playerName && ligne.level === req.body.level) {
      if (newChrono < recordChrono) {
        ligne.chrono = req.body.chrono;
        body = null;
      } else body = null;
    }
  }
  if (body) {
    chronos.chrono.push(body);
  }
  var newJSONFile = JSON.stringify(chronos);
  fs.writeFileSync("./json/chrono.json", newJSONFile, undefined, 4);
  res.status(200).json({ message: "Chrono enregistré !" });
  res.end();
});
module.exports = router;
