const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const child = require("child_process");

class execCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["shell"],
      description: "Executes commands on the host.",
      usage: "<commands>",
      allowdisable: false,
      owner: true,
    });
  }

  run(msg, args) {
    // Sends if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    try {
      // Tries to execute
      child.exec(args.join(" "), async (_error, stdout, stderr) => {
        // Sends if an error happened
        if (stderr) return msg.channel.createMessage(this.bot.embed("❌ Error", stderr, "error"));
        // Handler for if the length is larger than 2048
        if (stdout.length > 2000) {
          const res = await fetch("https://hastebin.com/documents", { referrer: "https://hastebin.com/", body: stdout, method: "POST", mode: "cors" });
          const { key } = await res.json();
          // Sends the embed if it's over 2k characters
          msg.channel.createMessage(this.bot.embed("❌ Error", `Output longer than 2000. View the output [here](https://www.hastebin.com/${key})`, "error"));
        } else {
          // Sends the success embed
          msg.channel.createMessage(this.bot.embed("✅ Success", `\`\`\`\n${stdout}\n\`\`\``, "success"));
        }
      });
    } catch (e) {
      // Sends the error embed
      msg.channel.createMessage(this.bot.embed("❌ Error", e, "error"));
    }
  }
}

module.exports = execCommand;
