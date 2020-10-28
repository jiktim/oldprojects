const { Router } = require("express");
const router = Router();

module.exports = (db) => {
  router.post("/api/leaveProject", async (req, res) => {
    // Sends a 401 if the user isn't authed
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.body || !req.body.id) return res.sendStatus(400);
    const projects = await db.table("projects");
    const project = projects.find(p => p.members && p.id === req.body.id && p.members.find(m => m.id === req.user.id));
    if (!project) return res.status(400).send("Project not found");
    project.members.splice(project.members.indexOf(project.members.find(m => m.id === req.user.id)), 1);
    const dbres = await db.table("projects").get(project.id).update(project);
    // OK status
    if (!dbres.errors) res.sendStatus(200);
    // 500 internal server error
    else res.sendStatus(500);
  });
  return router;
};
