/*
  Hibiki Config API

  This updates a server's guildConfig when
  a user uses the front-end Dashboard.
*/

let express = require("express");

// Sets the express router
let router = express.Router();

// Sets the valid setup items
const items = require("../../utils/modules/ValidItems");

module.exports = bot => {
  router.post("/api/updateconfig/:id", async (req, res) => {
    // If user isn't authenticated, return a 403
    if (!req.isAuthenticated()) return res.status(401).send({ error: "Unauthorized" });
    // Looks for managable guilds
    let managableguilds = req.user.guilds.filter(g => (g.permissions & 32) === 32);
    // Sends if not able to manage a guild
    if (!managableguilds.find(g => g.id === req.params.id)) return res.status(403).send({ error: "No access to guild" });
    // Reads the guildconfig
    let cfg = await bot.db.table("guildconfig").get(req.params.id);

    // Inserts a blank config if needed
    if (!cfg) {
      cfg = { id: req.params.id };
      await bot.db.table("guildconfig").insert(cfg);
    }

    // Sends if no body/config exists
    if (!req.body) return res.status(400).send({ error: "No config" });
    cfg = req.body;

    // Each type of thing
    Object.keys(cfg).forEach(c => {
      if (c == "id") return;
      let opt = cfg[c];
      if (!opt) return;
      let item = items.find(i => i.id == c);
      // Deletes the item if it's invalid
      if (!item) return delete cfg[c];
      // Handles the number types
      if (item.type == "number" && typeof opt != "number") delete cfg[c];
      else if (item.type == "number" && item.maximum && opt > item.maximum) cfg[c] = item.maximum;
      if (item.type == "number" && item.minimum && opt < item.minimum) cfg[c] = item.minimum;
      // Handles the punishment types
      if (item.type == "punishment") cfg[c] = opt.filter(p => ["Purge", "Strike", "Mute"].includes(p));
      // if the channel doesnt exist set to null
      if (item.type == "channelID" && !bot.guilds.get(req.params.id).channels.find(channel => channel.id == opt)) cfg[c] = null;
      // Handles the role configs
      if (item.type == "roleArray") cfg[c] = opt.filter(r => bot.guilds.get(req.params.id).roles.find(rol => rol.id == r));
      if (item.type == "roleArray" && item.maximum && cfg[c].length > item.maximum) cfg[c].length = item.maximum;
      if (item.type == "roleID" && !bot.guilds.get(req.params.id).roles.find(r => r.id == opt)) cfg[c] = null;
      // Boolean handler
      if (item.type == "bool" && typeof opt != "boolean") cfg[c] = null;
      // String handler
      if (item.type == "string" && item.maximum) cfg[c] = opt.substring(0, 15);
      if (item.type == "string" && item.minimum && opt.length < item.minimum) cfg[c] = null;
      // Disabled commands/categories handler
      if (item.type == "array" && !Array.isArray(cfg[c])) return cfg[c] = null;
      if (c == "disabledCategories") {
        let categories = [];
        bot.commands.forEach(c => {
          if (!categories.includes(c.category) && c.category != "Owner") categories.push(c.category);
        });
        cfg[c] = cfg[c].filter(cat => categories.includes(cat))
      }
      if (c == "disabledCmds") cfg[c] = cfg[c].filter(cmd => {
        let command = bot.commands.get(cmd);
        if (command && command.allowdisable != false) return true;
        return false;
      });
    });

    // Sets the ID
    cfg.id = req.params.id;
    // Updates the config
    await bot.db.table("guildconfig").get(req.params.id).update(cfg);
    // Sends the OK status
    res.sendStatus(200);
  });
  return router;
};
