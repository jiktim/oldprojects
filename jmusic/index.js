/**
 * @fileoverview Main jMusic webserver
 * @author smolespi <espi@lesbian.codes>
 * @author cth103 <cth103@free.fr>
 */

const express = require("express");
const { port } = require("./cfg.json");

const app = express();

// Configures ejs
app.set("views", `${__dirname}/views`);
app.set("partials", `${__dirname}/partials`);
app.use("/static", express.static(`${__dirname}/static`, { dotfiles: "allow" }));
app.set("view engine", "ejs");

// Renders index page
app.get("/", (_req, res) => {
  res.render("index");
});

app.get("/player/", (_req, res) => {
  res.render("player");
});

// Listens on port
console.log(`jMusic, listening on port ${port}.`);
app.listen(port);
