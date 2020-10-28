const { Router } = require("express");
const router = Router();

module.exports = (db) => {
  router.post("/api/deleteProject", async (req, res) => {
    // Sends a 401 if the user isn't authed
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.body || !req.body.name) return res.sendStatus(400);
    const projects = await db.table("projects");
    const project = projects.find(p => p.owner.id === req.user.id && p.name === req.body.name);
    if (!project) return res.status(400).send("Project not found");
    // Deletes the project
    const dbres = await db.table("projects").get(project.id).delete();
    // OK status
    if (!dbres.errors) res.sendStatus(200);
    // 500 internal server error
    else res.sendStatus(500);
  });
  return router;
};
