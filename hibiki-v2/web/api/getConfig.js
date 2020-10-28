/*
  Hibiki Config API

  Gets the guild config of a server.
*/

let express = require("express");

// Sets the express router
let router = express.Router();

module.exports = bot => {
  router.get("/api/getconfig/:id", async (req, res) => {
    // Sends if the user isn't authenticated
    if (!req.isAuthenticated()) return res.status(401).send({ error: "Unauthorized" });
    // Looks for managable guilds
    let managableguilds = req.user.guilds.filter(g => (g.permissions & 32) === 32);
    // Sends if can't access the guild
    if (!managableguilds.find(g => g.id === req.params.id)) return res.status(403).send({ error: "No access to guild" });
    // Reads the guildconfig
    let cfg = await bot.db.table("guildconfig").get(req.params.id);
    // Sends if no config
    if (!cfg) return res.status(404).send({ error: "No config" });
    // Sends the cfg
    res.send(cfg);
  });
  return router;
};
