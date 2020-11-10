const express = require("express");
const router = express.Router();
const fs = require("fs");

let header = fs.readFileSync("../client/html/header.html");
let menu = fs.readFileSync("../client/html/menu.html");
let footer = fs.readFileSync("../client/html/footer.html");
var page = "";
var pageHtml = header + menu + page + footer;
router.get("/", function (req, res) {
  page = fs.readFileSync("../client/html/index.html");
  pageHtml = header + menu + page + footer;
  res.send(pageHtml);
});
router.get("/index", function (req, res) {
  page = fs.readFileSync("../client/html/index.html");
  pageHtml = header + menu + page + footer;
  res.send(pageHtml);
});

router.get("/roberto", function (req, res) {
  page = fs.readFileSync("../client/html" + req.route.path + ".html");
  pageHtml = header + menu + page + footer;
  res.send(pageHtml);
});
router.get("/starkong", function (req, res) {
  page = fs.readFileSync("../client/html" + req.route.path + ".html");
  pageHtml = header + menu + page + footer;
  res.send(pageHtml);
});
router.get("/kuru", function (req, res) {
  page = fs.readFileSync("../client/html" + req.route.path + ".html");
  pageHtml = header + menu + page + footer;
  res.send(pageHtml);
});
router.get("/puissance4", function (req, res) {
  page = fs.readFileSync("../client/html" + req.route.path + ".html");
  pageHtml = header + menu + page + footer;
  res.send(pageHtml);
});
module.exports = router;
