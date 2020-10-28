/**
 * @fileoverview Webserver
 * @description Main express application; handles loading everything
 */

const bodyParser = require("body-parser");
const express = require("express");
const showdown = require("showdown");
const config = require("../config");
const articles = require("./articles");
const app = express();

const converter = new showdown.Converter();
converter.setOption("simplifiedAutoLink", "true");

app.use(require("helmet")());
app.enable("trust proxy", 1);

// Returns if unconfigured :'(
if (!config || !config.port) return console.error("Config not set");

// TODO: authentication
// Configures bodyParser
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 5000, limit: "10mb" }));
app.use(bodyParser.json({ extended: true, parameterLimit: 5000, limit: "10mb" }));

// Configures ejs
app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);
app.set("partials", `${__dirname}/partials`);
app.use("/public/", express.static(`${__dirname}/public/`, { dotfiles: "allow" }));

// Configures routes
app.use("/", require("./routes/index"));
app.post("/testconvert", function(req, res, next) {
  // Sends if no data sent
  if (!req.body || req.body && !req.body.content) {
    res.json(["error", "No data to convert"]);
  } else {
    // test api
    text = req.body.content;
    html = converter.makeHtml(text);
    res.json(["markdown", html]);
  }
});

app.get("/asdfasd", function(req, res, next) {
  res.send(articles.getLatestArticles());
});


// 404 handler
app.use((req, res) => {
  if (req.accepts("html")) return res.render("404", { url: req.url });
  else if (req.accepts("json")) return res.json({ error: "404" });
  else res.type("txt").send("404");
});

console.log(`Server listening on port ${config.port}.`);
if (config.hostname !== null && typeof config.hostname == "string") { 
  app.listen(config.port, config.hostname) 
} else { 
  app.listen(config.port) 
};
