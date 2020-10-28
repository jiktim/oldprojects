const Command = require("../../lib/Command");
const { readFileSync } = require("fs");

class changelogCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Tells you what's new in the latest version.",
      aliases: ["cl", "clog", "updates", "whatsnew"],
      cooldown: 2000,
      allowdms: true,
    });
  }

  async run(msg) {
    // Function to get microseconds
    function getMicSecTime() {
      let hrTime = process.hrtime();
      return hrTime[0] * 1000000 + parseInt(hrTime[1] / 1000);
    }

    const time = getMicSecTime();
    let pLog = [];
    // Reads the changelog file
    const clog = readFileSync(`${process.cwd()}/CHANGELOG.md`, "UTF8").split("\n");
    let ver = 0;

    clog.forEach(c => {
      // Handles newlines
      if (c.indexOf("\r") == c.length - 1 && c.length != 1) c = c.substring(0, c.length - 1);
      // Only shows the latest version
      if (/# v[0-9].[0-9].[0-9] - [a-zA-Z, 0-9()]{1,100}/.test(c) && ver <= 1) ver++;
      if (ver > 1) return;
      // Heading handlers
      if (c.startsWith("# ")) pLog.push(`**${c.substring(2, c.length)}**`);
      else if (c.startsWith("## ") && !c.startsWith("# ")) pLog.push(`**${c.substring(3, c.length)}**`);
      else if (c.startsWith("### ") && !c.startsWith("## ") && !c.startsWith("# ")) pLog.push(c.substring(4, c.length));
      else if (c.startsWith("#### ") && !c.startsWith("### ") && !c.startsWith("## ") && !c.startsWith("# ")) pLog.push(c.substring(5, c.length));
      else if (c.startsWith("  - ")) pLog.push(`\`➡️\` ${c.substring(4)}`);
      // Ignores comments
      else if (c.startsWith("<!-")) return;
      else pLog.push(c);
    });

    msg.channel.createMessage({
      embed: {
        title: "📚 Changelog",
        description: pLog.join("\n"),
        footer: {
          icon_url: this.bot.user.dynamicAvatarURL("png", 1024),
          text: `This took ${getMicSecTime() - time} microseconds to parse.`
        },
        color: require("../../utils/Colour")("general"),
      }
    });
  }
}

module.exports = changelogCommand;
