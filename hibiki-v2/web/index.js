/*
  Hibiki WebUI Backend

  This is the main backend of the
  Hibiki dashboard. This file mostly
  handles rendering & authentication.
*/

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const uglify = require("uglify-es");
const { readdirSync, readFileSync } = require("fs");
const format = require("../utils/Format");
const { Strategy } = require("passport-discord");

// Gets the required authorization info
const { dashboard: { cookiesecret, secret, port, redirect_uri, uglifycode } } = require("../config");

// Sets the authorization scope
const scope = ["identify", "guilds"];
const app = express();

// Uses helmet for setting HTTP headers
app.use(require("helmet")());

// Allows nginx proxy to run
app.enable("trust proxy", 1);

// Checks authentication data
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login/");
};

// Login fail functionality
app.get("/login/fail/", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Gets the authenticated user's data
const getAuthUser = user => ({
  username: user.username,
  discriminator: user.discriminator,
  guilds: user.guilds,
  id: user.id,
  avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png",
});

// Sets the viewengine
app.set("views", `${__dirname}/views`);
app.set("partials", `${__dirname}/partials`);
app.set("view engine", "ejs");

if (uglifycode) {
  // Uglifies code
  readdirSync(`${__dirname}/static`, { withFileTypes: true }).forEach((f) => {
    if (f.isDirectory()) return;
    if (!f.name.endsWith(".js")) return;
    let fSource = readFileSync(`${__dirname}/static/${f.name}`, { encoding: "utf8" });
    let fUglified = uglify.minify(fSource);
    // If the uglifier returns an error serve the normal files
    if (fUglified.error || !fUglified.code) {
      console.log(fUglified.error);
      console.log(`Error while uglifying ${f.name}, the non-uglified file will be served instead`);
      app.use(`/static/${f.name}`, (_req, res) => { res.send(fSource) });
      return;
    }
    app.use(`/static/${f.name}`, (_req, res) => { res.set("Content-Type", "application/javascript").send(fUglified.code) });
  });
}

// Static files for the web
app.use("/static", express.static(`${__dirname}/static`, { dotfiles: "allow" }));

module.exports = (bot) => {
  if (!port || !cookiesecret) return
  // Loads the auth system
  app.use(session({
    secret: `${cookiesecret}`,
    resave: false,
    saveUninitialized: false,
  }));

  // Sets headers for the webserver
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Parsers
  app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 10000,
    limit: "5mb",
  }));

  app.use(bodyParser.json({
    parameterLimit: 10000,
    limit: "5mb",
  }));

  // Serialises the user
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserisalises the user
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  // Creates a new passport
  passport.use(new Strategy({ clientID: bot.user.id, clientSecret: secret, callbackURL: redirect_uri, scope: scope },
    (_accessToken, _refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }));

  // Makes the app use the cookie parser
  app.use(cookieParser());

  // Initialises the passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication
  app.get("/login/", passport.authenticate("discord", { scope: scope }));
  app.get("/login/callback/", passport.authenticate("discord", { failureRedirect: "/login/fail/" }), (_req, res) => {
    res.redirect("/servers/");
  });

  // Logout functionality
  app.get("/logout/", checkAuth, (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Checks the authentication & renders the dashboard
  app.get("/servers/", checkAuth, (req, res) => {
    res.render("servers", {
      bot: bot,
      user: req.user
    });
  });

  // Redirects /invite/ to the bot's invite link
  app.get("/invite/", (_req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?&client_id=${bot.user.id}&scope=bot&permissions=${bot.config.permissions}`);
  });

  // Redirects /support/ to the bot's invite link
  app.get("/support/", (_req, res) => {
    res.redirect(`https://discord.gg/${bot.config.support}`);
  });

  // Gets the ID
  app.get("/manage/:id", checkAuth, async (req, res) => {
    // Sets the vaid items & props
    const validItems = require("../utils/modules/ValidItems");

    // Displays if the user isn't authenticated
    if (!req.isAuthenticated()) {
      res.status(401).render("401");
    }

    // Sets the user, managableguilds, & guild
    let user = getAuthUser(req.user);
    let managableguilds = user.guilds.filter(g => (g.permissions & 32) === 32 && bot.guilds.get(g.id));
    let guild = managableguilds.find(g => g.id == req.params.id);

    // Displays if the user can't manage that guild
    if (!guild) {
      res.status(403).render("403");
      return;
    }

    // Reads the guildconfig
    let cfg = await bot.db.table("guildconfig").get(guild.id);
    // Renders the dashboard
    res.render("manageguild.ejs", { guild: guild, bot: bot, cfg: cfg, validItems: validItems, user: user });
  });

  // Renders the landing page
  app.get("/", (req, res) => {
    // Renders the page
    res.render("index", {
      checkAuth: checkAuth,
      bot: bot,
      avatar: bot.user.avatar ? `https://cdn.discordapp.com/avatars/${bot.user.id}/${bot.user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png",
      authUser: req.isAuthenticated() ? getAuthUser(req.user) : null,
      format: format
    });
  });

  // Uses the API
  app.use(require("./api/getItems")(bot));
  app.use(require("./api/getConfig")(bot));
  app.use(require("./api/updateConfig")(bot));
  app.use(require("./api/getBio")(bot));
  app.use(require("./api/updateBio")(bot));

  // Sends a 404 status
  app.use((req, res) => {
    if (req.accepts("html")) {
      res.render("404", { url: req.url });
      return;
    }

    if (req.accepts("json")) {
      res.send({ error: "404" });
      return;
    }

    // Falls back to plaintext
    res.type("txt").send("404");
  });

  app.listen(port);
};
