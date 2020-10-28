/*
  Hibiki Bio Loader

  Gets the logged in user's bio.
*/

let express = require("express");

// Sets the express router
let router = express.Router();

module.exports = (bot) => {
  router.get("/api/getBio", async (req, res) => {
    // Sends if the user isn't authenticated
    if (!req.isAuthenticated()) return res.status(401).send({ error: "Unauthorized" });
    // Reads the userconfig
    let cfg = await bot.db.table("userconfig").get(req.user.id);
    // Sends if no config
    if (!cfg || !cfg.bio) return res.status(404).send({ error: "No bio" });
    // Sends the cfg
    res.send(cfg.bio);
  });
  return router;
};
