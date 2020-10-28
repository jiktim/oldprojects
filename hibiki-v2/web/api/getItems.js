/*
  Hibiki Config API

  This gets the getItems API & sends a status code.
*/

let express = require("express");

// Sets the express router
let router = express.Router();

module.exports = (bot) => {
  router.get("/api/getitems", async (req, res) => {
    // Sends if the user isn't authenticated
    if (!req.isAuthenticated()) return res.status(401).send({ error: "Unauthorized" });

    // Sends the loaded commands if commands is set to true
    if (req.query.commands) {
      let cmds = [];
      bot.commands.forEach(cmd => {
        if (!cmds.find(c => c.label == cmd.category) && cmd.category != "Owner")
          cmds.push({ label: cmd.category, type: "optgroup", children: [] });
      });
      bot.commands.forEach(cmd => {
        if (cmd.category == "Owner") return;
        cmds.find(c => c.label == cmd.category).children.push({ text: cmd.id, value: cmd.id });
      });
      return res.status(200).send(cmds);
    }

    // Sends the db items
    res.status(200).send(require("../../utils/modules/ValidItems"));
  });
  return router;
};
