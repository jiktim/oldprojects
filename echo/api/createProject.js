const { Router } = require("express");
const router = Router();

module.exports = (db) => {
  router.post("/api/createProject", async (req, res) => {
    // Sends a 401 if the user isn't authed
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.body || !req.body.name) return res.sendStatus(400);
    const projects = await db.table("projects");
    // Sends 403 if the project already exists
    if (projects.find(p => p.owner.id === req.user.id && p.name === req.body.name)) return res.status(400).send("Process already exists");
    // Prevents uploading images over 1mb
    if (req.body.logo && req.body.logo.length && (4 * Math.ceil((req.body.logo.length / 3)) * 0.5624896334383812) / 1000000 > 1) return res.status(400).send("Image too large, limit is 1mb");
    // Inserts the project
    const dbres = await db.table("projects").insert({
      id: parseInt(Date.now() / 15).toString(36),
      name: req.body.name,
      logo: req.body.logo || undefined,
      owner: { id: req.user.id, username: req.user.username, avatar: req.user.avatar },
    });
    // Sends OK if no errors
    if (!dbres.errors) res.sendStatus(200);
    else res.sendStatus(500);
  });
  return router;
};
