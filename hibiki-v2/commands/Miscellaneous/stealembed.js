const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const { inspect } = require("util");

class stealembedCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives the embed object of a message.",
      aliases: ["embedobj", "embedobject"],
      usage: "<messageID>",
      cooldown: 2000,
    });
  }

  async run(msg, args) {
    // Looks for the message
    let m = await msg.channel.getMessage(args.join("")).catch(() => {});
    // Handler for if the message isn't found
    if (!m) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });
    // Gets the richembed
    let richembed = m.embeds.find(e => e.type == "rich");
    // Handler for if the message doesn't have an embed
    if (!richembed) return msg.channel.createMessage(this.bot.embed("❌ Error", "I couldn't find an embed in that message.", "error"));
    // Deletes the useless type object
    if (richembed.type) delete richembed.type;
    // Fetches the API
    const res = await fetch("https://hastebin.com/documents", { referrer: "https://hastebin.com/", body: inspect(richembed), method: "POST", mode: "cors" });
    const { key } = await res.json();
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("🔗 Embed Object", `The embed object can be viewed [here](https://www.hastebin.com/${key}.js).`, "success"));
  }
}

module.exports = stealembedCommand;
