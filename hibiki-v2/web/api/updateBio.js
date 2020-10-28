/*
  Hibiki Bio Updater

  Updates a user's bio.
*/

let express = require("express");

// Sets the express router
let router = express.Router();

module.exports = (bot) => {
  router.get("/api/updateBio", async (req, res) => {
    // Sends if the user isn't authenticated
    if (!req.isAuthenticated()) return res.status(401).send({ error: "Unauthorized" });
    // Reads the userconfig
    let cfg = await bot.db.table("userconfig").get(req.user.id);
    // Sends and error if there are no params
    if (!req.query || typeof req.query.bio == "undefined") return res.status(400).send({ error: "Missing required params" });
    // Sets the bio
    let bio = req.query.bio;
    // Sets bio to null if its length is 0
    if (req.query.bio.length == 0 && typeof req.query.bio == "string") bio = null;
    else bio = bio.substring(0, 100);
    // Inserts blank config
    if (!cfg) {
      cfg = { id: req.user.id, bio: bio };
      await bot.db.table("userconfig").insert(cfg)
      res.sendStatus(200);
      return;
    }
    // Sets bio
    cfg.bio = bio;
    await bot.db.table("userconfig").get(req.user.id).update(cfg);
    res.sendStatus(200);
  });
  return router;
};
