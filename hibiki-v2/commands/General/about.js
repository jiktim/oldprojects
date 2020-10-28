const Command = require("../../lib/Command");
const format = require("../../utils/Format");
const os = require("os");

class aboutCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["aboutbot", "botinfo", "info", "information", "stats", "uptime", "version"],
      description: "Displays info and stats about the bot.",
    });
  }

  async run(msg) {
    // Gets the user amount
    let useramnt = 0;
    this.bot.guilds.forEach(g => {
      useramnt += g.memberCount;
    });

    // Hides owner commands from the command field
    let owneramt = 0;
    this.bot.commands.forEach(c => c.category == "Owner" ? owneramt++ : null);
    // Sets the main fields to send
    let fields = [{
      name: "Users",
      value: useramnt,
      inline: true,
    }, {
      name: "Servers",
      value: this.bot.guilds.size,
      inline: true,
    }, {
      name: "Uptime",
      value: `${format.uptimeFormat(process.uptime())}`,
      inline: true,
    }, {
      name: "Commands",
      value: `${this.bot.commands.size - owneramt || "0"}`,
      inline: true,
    }, {
      name: "Memory Used",
      value: `${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100}mb`,
      inline: true,
    }, {
      name: "Platform",
      value: format.formatOs(os.platform(), os.release()).replace("-gcp", "") || "Unknown",
      inline: true,
    }, {
      name: "Eris Version",
      value: `v${require("eris").VERSION}`,
      inline: true,
    }, {
      name: "Node Version",
      value: process.version,
      inline: true,
    }, {
      name: "Bot Version",
      value: `v${require("../../package").version}`,
      inline: true,
    }, {
      name: "\u200b",
      value: `[Invite](https://${this.bot.config.homepage}/invite/) • [Support](https://discord.gg/${this.bot.config.support}) • [Vote](https://top.gg/bot/${this.bot.user.id}/vote) • [Website](${this.bot.config.homepage})`,
      inline: false,
    }];

    // Looks to see if the command was ran by an owner
    if (this.bot.config.owners.includes(msg.author.id)) {
      fields.pop();
      let cmds = [];
      // Bot logs
      this.bot.logs.forEach(l => {
        let cmdID = /\*\*([a-z]{1,64})\*\*/.exec(l.msg);
        if (!cmdID) return;
        cmdID = cmdID[1];
        let cmd = cmds.filter(c => c.cmd == cmdID)[0];
        // If the cmd had already been added to the array
        if (cmd) {
          let index = cmds.indexOf(cmd);
          cmd.runs++;
          cmds[index] = cmd;
        } else {
          cmds.push({
            cmd: cmdID,
            runs: 1,
          });
        }
      });

      let mostRanCmd;
      // Looks for the most ran command
      cmds.forEach(c => { if (!mostRanCmd || c.runs > mostRanCmd.runs) mostRanCmd = c; });
      let neverRanCmds = 0;
      // Looks for commands that were never ran
      this.bot.commands.forEach(cmd => {
        if (!cmds.filter(c => c.cmd == cmd.id && cmd.category != "Owner").length) neverRanCmds++;
      });

      // Pushes the fields
      fields.push({
        name: "Daily Commands",
        value: this.bot.logs.filter(log => new Date() - log.date <= 3600000 * 24).length,
        inline: true,
      });
      fields.push({
        name: "Most Ran Command",
        value: `${mostRanCmd.cmd}, ran ${mostRanCmd.runs} times.`,
        inline: true,
      });
      fields.push({
        name: "Commands Never Ran",
        value: neverRanCmds,
        inline: true,
      });
      fields.push({
        name: "\u200b",
        value: `[Invite](${this.bot.config.homepage}/invite/) • [Support](https://discord.gg/${this.bot.config.support}) • [Vote](https://top.gg/bot/${this.bot.user.id}/vote) • [Website](${this.bot.config.homepage})`,
        inline: false,
      });
    }

    msg.channel.createMessage({
      embed: {
        title: "🤖 About",
        description: `**${this.bot.user.username}**, made with 💜 by **[smolespi](https://lesbian.codes)**, **[resolved](https://github.com/resolvedxd)**, and **[cth103](https://twitter.com/cth103)**.`,
        fields: fields,
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = aboutCommand;
