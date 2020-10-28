const express = require("express");
const articles = require("../articles");
const app = require("../app");
const showdown = require("showdown");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {articles: articles, app: app});
});

router.get("/legal", (req, res) => {
  res.render("policies");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/read/:parentFolder/:article", (req, res) => {
  res.render("reading", {showdown: showdown, articles: articles, app: app, parentFolder: req.params.parentFolder, article: req.params.article});
});

module.exports = router;
