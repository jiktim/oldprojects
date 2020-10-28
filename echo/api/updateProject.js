const { Router } = require("express");
const router = Router();
// Properties set & updated by the API
const allowed = ["Authorization", "webhookURL", "id"];
const memberAllowed = ["role"];
const roles = ["Member", "Administrator", "Manager"];

module.exports = (db) => {
  router.post("/api/updateProject", async (req, res) => {
    // Sends a 401 if the user isn't authed
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.body || !req.body.id) return res.sendStatus(400);
    const projects = await db.table("projects");
    // Finds the user & project ID
    const project = projects.find(p => p.owner.id === req.user.id && p.id === req.body.id);
    // Sends if a project doesn't exist
    if (!project) return res.status(400).send("Project not found");
    Object.getOwnPropertyNames(req.body).forEach(r => {
      if (!allowed.includes(r) && r !== "id") delete req.body[r];
    });
    await db.table("projects").get(req.body.id).update(req.body);
    res.sendStatus(200);
  });

  router.get("/api/getProject", async (req, res) => {
    // Sends a 401 if the user isn't authed
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.query || !req.query.id) return res.sendStatus(400);
    const projects = await db.table("projects");
    // Finds the user & project id
    const project = projects.find(p => p.owner.id === req.user.id && p.id === req.query.id);
    if (!project) return res.status(400).send("Project not found");
    const obj = {};
    allowed.forEach(a => project[a] ? obj[a] = project[a] : obj[a] = null);
    res.status(200).send(JSON.stringify(obj));
  });

  router.post("/api/updateMember", async (req, res) => {
    // Sends a 401 if the user isn't authed
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.body || !req.body.id || !req.body.member) return res.sendStatus(400);
    const projects = await db.table("projects");
    // Finds the user & project ID
    const project = projects.find(p => p.owner.id === req.user.id || (p.members && p.members.find(m => m.id === req.user.id && m.role === "Administrator" || m.role === "Manager")) && p.id === req.body.id);
    // Sends if a project doesn't exist
    if (!project) return res.status(400).send("Project not found");
    const member = project.members.find(m => m.id === req.body.member && req.user.id !== m.id);
    if (!member) return res.sendStatus(400);
    const memberindex = project.members.indexOf(member);
    Object.getOwnPropertyNames(req.body).forEach(r => {
      if (r === "role" && !roles.includes(req.body[r])) delete req.body[r];
      if (memberAllowed.includes(r)) member[r] = req.body[r];
    });
    project.members[memberindex] = member;

    await db.table("projects").get(req.body.id).update(project);
    res.sendStatus(200);
  });
  return router;
};
