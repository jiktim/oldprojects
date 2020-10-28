const { Router } = require("express");
const router = Router();
const uuid = require("uuid").v4;

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login/");
};

module.exports = (db) => {
  router.post("/api/createInvite", async (req, res) => {
    // Sends a 401 if the user isn't authed
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Sends 400 if body isn't correct
    if (!req.body || !req.body.id || !req.body.uses || !req.body.expiration) return res.sendStatus(400);
    const projects = await db.table("projects");
    // Finds the project & user
    const project = projects.find(p => p.owner.id === req.user.id && p.id === req.body.id);
    // Sends if the project doesn't exist
    if (!project) return res.status(400).send("Project not found");
    if (!project.invites) project.invites = [];
    // Pushes the invites
    project.invites.push({
      id: uuid(),
      uses: req.body.uses,
      expiration: req.body.expiration,
      role: req.body.role || "Member",
      label: req.body.label,
    });
    await db.table("projects").get(project.id).update(project);
    res.sendStatus(200);
  });

  router.get("/api/getInvites", async (req, res) => {
    // Sends a 401 if the user isn't authed
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Sends if the query isn't right
    if (!req.query || !req.query.id) return res.sendStatus(400);
    const projects = await db.table("projects");
    const project = projects.find(p => p.owner.id === req.user.id && p.id === req.query.id);
    if (!project) return res.status(400).send("Project not found");
    if (!project.invites) project.invites = [];
    // Sends the project invites
    res.send(JSON.stringify(project.invites));
  });

  router.get("/invite/:inviteid", checkAuth, async (req, res) => {
    if (!req.params || !req.params.inviteid) return res.status(404).send("Invite not found");
    const projects = await db.table("projects");
    // Finds the project invite
    const project = projects.find(p => p.invites && p.invites.find(inv => inv.id === req.params.inviteid));
    if (!project) return res.sendStatus(404);
    if (project.owner.id === req.user.id || project.members && project.members.find(m => m.id === req.user.id)) return res.send("User already has access");
    // Finds the project invite & compares it to the expiration
    const invite = project.invites.find(i => i.id === req.params.inviteid);
    console.log(invite.expiration - new Date().getTime());
    if (invite.expiration - new Date().getTime() <= 0) {
      project.invites.splice(project.invites.indexOf(invite), 1);
      await db.table("projects").get(project.id).update(project);
      return res.send("Invite has expired");
    }
    if (invite.uses === 0) return res.send("Invite has expired");
    res.render("acceptInvite", { project: project, invite: invite });
  });

  router.get("/invite/:inviteid/accept", checkAuth, async (req, res) => {
    if (!req.params || !req.params.inviteid) return res.status(404).send("Invite not found");
    const projects = await db.table("projects");
    // Finds the project invite
    const project = projects.find(p => p.invites && p.invites.find(inv => inv.id === req.params.inviteid));
    if (!project) return res.sendStatus(404);
    if (project.owner.id === req.user.id || project.members && project.members.find(m => m.id === req.user.id)) return res.send("User already has access");
    // Finds the project invite & compares it to the expiration
    const invite = project.invites.find(i => i.id === req.params.inviteid);
    if (invite.expiration - new Date().getTime() <= 0) {
      res.send("Invite has expired");
      project.invites.splice(project.invites.indexOf(invite), 1);
      return await db.table("projects").get(project.id).update(project);
    }
    if (invite.uses === 0) {
      project.invites.splice(project.invites.indexOf(invite), 1);
      await db.table("projects").get(project.id).update(project);
      return res.send("Invite has expired");
    }
    // Saves the members & invite info
    if (!project.members) project.members = [];
    project.members.push({ id: req.user.id, username: req.user.username, avatar: req.user.avatar, role: invite.role });
    const Iinv = project.invites.indexOf(invite);
    project.invites[Iinv].uses--;
    if (project.invites[Iinv].uses === 0) project.invites.splice(Iinv, 1);
    await db.table("projects").get(project.id).update(project);
    // Sends back to the project
    res.redirect(`/project/${project.owner.id}/${project.name}`);
  });
  return router;
};
