const fs = require("fs");

/* eslint-disable no-sync */
module.exports = (path) => {
  let cmds = [];
  // Reads the commands folder
  let fa = fs.readdirSync(path);
  for (let i = 0; i < fa.length; i++) {
    let cmF = fa[i];
    // Loads any files ending with .js
    if (cmF.endsWith(".js")) {
      let name = cmF.split(".js")[0];
      cmds[name.replace("cmd_", "")] = require(`${process.cwd()}/${path}/${name}`);
      // Logs to the console
      console.log(`Loaded ${name.bold}.`.green);
    }
  }
  return cmds;
};
