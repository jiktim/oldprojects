/*
  Echo © 2020 smolespi & resolved.
  Code licensed under the GNU AGPL v3.
*/

const cfg = require("./cfg");
const db = require("rethinkdbdash")(cfg.rethink);
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const { Strategy } = require("passport-discord");

// App settings
const app = express();

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
  id: user.id,
  avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png",
});

// Sets the viewengine
app.set("view engine", "ejs");
app.set("partials", `${__dirname}/partials`);
app.set("views", `${__dirname}/views`);
app.use("/static", express.static(`${__dirname}/static`, { dotfiles: "allow" }));
// Renders the index page
// app.get("/", (req, res) => {});

// Loads the auth system
app.use(session({
  secret: cfg.echo.cookieSecret,
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

// Body parser & serialization
app.use(express.json({
  limit: "1.5mb",
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Creates a new passport
passport.use(new Strategy({ clientID: cfg.discord.userid, clientSecret: cfg.discord.secret, callbackURL: cfg.discord.redirect_uri, scope: cfg.discord.scope },
  (_accessToken, _refreshToken, profile, done) => {
    process.nextTick(() => {
      return done(null, profile);
    });
  }));

// Passport
app.use(passport.initialize());
app.use(passport.session());
// Authentication
app.get("/login/", passport.authenticate("discord", { scope: cfg.discord.scope }));
app.get("/login/callback/", passport.authenticate("discord", { failureRedirect: "/login/fail/" }), async (req, res) => {
  res.redirect("/projects/");
  const projects = await db.table("projects");
  projects.forEach(async p => {
    if (p.owner.id === req.user.id && (p.owner.username !== req.user.username || p.owner.avatar !== req.user.avatar)) {
      p.owner.username = req.user.username;
      p.owner.avatar = req.user.avatar;
      await db.table("projects").get(p.id).update(p);
    } else {
      if (!p.members) return;
      const member = p.members.find(m => m.id === req.user.id);
      const Imember = p.members.indexOf(member);
      if (member && (member.avatar !== req.user.avatar || member.username !== req.user.username)) {
        p.members[Imember].username = req.user.username;
        p.members[Imember].avatar = req.user.avatar;
        await db.table("projects").get(p.id).update(p);
      }
    }
  });
});

// Logout functionality
app.get("/logout/", checkAuth, (req, res) => {
  req.logout();
  res.redirect("/");
});

// Renders list of projects
app.get("/projects", checkAuth, async (req, res) => {
  // Gets the userid from the projects table
  let projects = await db.table("projects");
  // Sorts projects by alphabetical order
  projects = projects.filter(p => p.owner.id === req.user.id || (p.members && p.members.find(m => m.id === req.user.id)));
  projects = projects.sort((a, b) => a.name > b.name ? -1 : 1);
  projects.forEach(p => {
    if (p.owner.id !== req.user.id) p.suffix = ` (owned by ${p.owner.username})`;
  });
  res.render("projects", { projects: projects, user: getAuthUser(req.user) });
});

app.get("/main/events", checkAuth, async (req, res) => {
  if (!req.query.event && req.query.project) {
    const project = await db.table("projects").get(req.query.project);
    if (!project.events) project.events = [];
    res.render("main/events", { events: project.events });
  } else if (req.query.event) {
    // TODO: Viewing errors
  }
});

// Renders each page on the main UI
app.get("/main/members", checkAuth, async (req, res) => {
  let project = await db.table("projects");
  // Finds the project
  project = project.find(p => p.owner.id === req.user.id || (p.members && p.members.find(m => m.id === req.user.id)) && p.id === req.query.project);
  if (!project) return res.sendStatus(404);
  res.render("main/members", { project: project, user: getAuthUser(req.user) });
});

app.get("/main/invites", checkAuth, async (req, res) => {
  let project = await db.table("projects");
  project = project.find(p => p.owner.id === req.user.id || (p.members && p.members.find(m => m.id === req.user.id && m.role === "Administrator")) && p.id === req.query.project);
  if (!project) return res.sendStatus(404);
  if (!project.invites) project.invites = [];
  res.render("main/invites", { invites: project.invites });
});

app.get("/main/settings", checkAuth, async (req, res) => {
  let project = await db.table("projects");
  project = project.find(p => p.owner.id === req.user.id || (p.members && p.members.find(m => m.id === req.user.id && m.role === "Administrator")) && p.id === req.query.project);
  if (!project) return res.sendStatus(404);
  res.render("main/settings", {});
});

app.get("/main/stats", checkAuth, async (req, res) => {
  res.render("main/stats", {});
});

// Renders the project manager
app.get("/project/:user/:project", checkAuth, async (req, res) => {
  // Gets the userid from the projects table
  let project = await db.table("projects");
  project = project.find(p => p.owner.id === req.user.id || (p.members && p.members.find(m => m.id === req.user.id)) && p.name === req.params.project && p.owner.id === req.params.user);
  // Sends a 404 if the project doesn't exist
  if (!project) return res.sendStatus(404);
  res.render("manage", { project: project, user: getAuthUser(req.user) });
});

// Loads the APIs
app.use(require("./api/invites.js")(db));
app.use(require("./api/captureEvent.js")(db));
app.use(require("./api/leaveProject.js")(db));
app.use(require("./api/createProject.js")(db));
app.use(require("./api/deleteProject.js")(db));
app.use(require("./api/updateProject.js")(db));

// Listens on the port
app.listen(cfg.echo.port);
