const { Router } = require("express");
const router = Router();
const fetch = require("node-fetch");

module.exports = (db) => {
  router.post("/api/captureEvent", async (req, res) => {
    // Sends 400 if no id/error
    if (!req.body.id || !req.body.error) return res.sendStatus(400);
    const cfg = await db.table("projects").get(req.body.id);
    if (!cfg) return res.sendStatus(400);
    // Sends 401 if unauthorised
    if (cfg.Authorization && cfg.Authorization !== "" && cfg.Authorization !== req.headers.authorization) return res.sendStatus(401);
    if (!cfg.events) cfg.events = [];
    // Pushes the event
    cfg.events.push({ error: req.body.error, stack: req.body.stack, origin: req.body.origin, time: new Date().getTime() });
    await db.table("projects").get(req.body.id).update(cfg);
    // Sends to a Discord webhook if set
    if (cfg.webhookURL) {
      let culprit;
      // Advanced stack analyzation featuring unreliable regex
      culprit = req.body.error.stack.replace(`${req.body.error.origin}: ${req.body.error.message}`, "");
      culprit = /\s{0,}at \w{0,}.<?\w{0,}>? \(([/\\a-zA-Z0-9.\-:]{0,})\)/.exec(culprit);
      if (culprit) culprit = culprit[1].split("/");
      else culprit = undefined;
      fetch(cfg.webhookURL, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: req.body.error.origin ? `${req.body.error.origin}: ${req.body.error.message}` : req.body.error.message,
            color: 0xFF0048,
            fields: [{
              name: "Project",
              value: cfg.name,
              inline: true,
            }, {
              name: "Culprit",
              value: culprit ? culprit[culprit.length - 1] : "Unknown",
              inline: true,
            }],
          }],
        }),
      });
    }
    res.sendStatus(200);
  });
  return router;
};
