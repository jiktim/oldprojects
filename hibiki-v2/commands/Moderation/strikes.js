const Command = require("../../lib/Command");
const format = require("../../utils/Format");
const fetch = require("node-fetch");

class strikesCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["punishinfo", "punishments", "search", "searchall", "strikes", "warnings"],
      description: "Displays what strikes you have.",
      usage: "<@user>",
    });
  }

  // Checks if the author mentioned a valid user.
  async run(msg, args) {
    let member = msg.member;
    if (args.length) member = msg.channel.guild.members.find(m => {
      if (m.id == args.join(" ")) return m;
      if (args.join(" ") == `<@${m.id}>`) return m;
      if (args.join(" ") == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) return m;
    }) || msg.member;

    // Filters the DB
    const strikes = await this.db.table("strikes").filter({
      receiverId: member.id,
      guildId: msg.guild.id,
    });

    // Handler for if the user has no strikes
    if (!strikes.length) {
      msg.channel.createMessage(this.bot.embed("🔨 Strikes", `**${member.id === msg.member.id ? "You" : member.username}** do${member.id === msg.member.id ? "n't" : "esn't"} have any strikes.`, "general"));
      // Handler for if the user has over 25 strikes. Uploads them to hastebin
    } else if (strikes.length > 25) {
      const strikeString = `Strikes for ${format.tag(member, false)}\r\n========\r\n${strikes.map(m => `${m.id} (issued by ${format.tag(msg.guild.members.get(m.giverId) || { username: `Unknown User (${m.giverId})`, discriminator: "0000" }, false)})\r\n${m.reason}\r\n========`).join("\r\n")}`;
      const res = await fetch("https://hastebin.com/documents", { referrer: "https://hastebin.com/", body: strikeString, method: "POST", mode: "cors" });
      const { key } = await res.json();
      // Handler for if hastebin upload fails
      if (!key) return msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
      // Sends the embed if the user has no strikes
      msg.channel.createMessage(this.bot.embed("🔨 Strikes", `**${member.id === msg.member.id ? "You" : member.username}** ha${member.id === msg.member.id ? "ve" : "s"} more than 25 strikes. [Hastebin URL](https://www.hastebin.com/${key})`, "success"));
    } else {
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: `🔨 ${member.username} has ${strikes.length} strike${strikes.length == 1 ? "" : "s"}.`,
          fields: strikes.map(m => ({
            name: `${m.id} - from **${msg.guild.members.get(m.giverId) ? msg.guild.members.get(m.giverId).username : m.giverId}**`,
            value: `${m.reason.slice(0, 150) || "No reason provided"}`,
          })),
          color: require("../../utils/Colour")("general"),
        },
      });
    }
  }
}

module.exports = strikesCommand;
