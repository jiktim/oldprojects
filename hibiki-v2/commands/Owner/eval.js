const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const { inspect } = require("util");

class evalCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["evaluate"],
      description: "Evaluates some JavaScript.",
      usage: "<code>",
      allowdisable: false,
      owner: true,
    });
  }

  async run(msg, args) {
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    try {
      // Tries to eval
      const evaluated = await eval(`(async () => {\n${args.join(" ")}\n})()`);
      const evalstring = typeof evaluated === "string" ? evaluated : inspect(evaluated);
      // Logs the result
      console.log(evalstring);
      if (evalstring.length > 2000) {
        // Fetches the API
        const res = await fetch("https://hastebin.com/documents", { referrer: "https://hastebin.com/", body: evalstring, method: "POST", mode: "cors" });
        const { key } = await res.json();
        // Sends the embed if it's over 2k characters
        msg.channel.createMessage(this.bot.embed("❌ Error", `Output longer than 2000. View the output [here](https://www.hastebin.com/${key}).`, "error"));
      } else {
        // Sends the success embed
        msg.channel.createMessage(this.bot.embed("✅ Success", `\`\`\`js\n${evalstring.replace(this.bot.token, "WARN: This would have displayed the bot token. I have hidden it due to security reasons.")}\n\`\`\``, "success"));
      }
    } catch (err) {
      // Sends the error embed
      msg.channel.createMessage(this.bot.embed("❌ Error", `\`\`\`js\n${err.stack}\n\`\`\``, "error"));
    }
  }
}
module.exports = evalCommand;
