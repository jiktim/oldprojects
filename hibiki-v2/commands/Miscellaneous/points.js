const Command = require("../../lib/Command");
const format = require("../../utils/Format");
const fetch = require("node-fetch");

class pointsCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["showrep", "listmerits", "merits", "rep", "reputation"],
      description: "Displays what reputation points you have.",
      usage: "<@user>",
    });
  }

  async run(msg, args) {
    // Checks to see if the author mentioned another user and if that user is valid
    let member = msg.member;
    if (args.length) member = msg.channel.guild.members.find(m => {
      if (m.id == args.join(" ")) return m;
      if (args.join(" ") == `<@${m.id}>`) return m;
      if (args.join(" ") == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) return m;
    }) || msg.member;

    // Looks for points
    const points = await this.db.table("points").filter({
      receiverId: member.id,
      guildId: msg.guild.id,
    });

    // Handler for if the user has no points
    if (!points.length) {
      msg.channel.createMessage(this.bot.embed("✨ Points", `**${member.id === msg.member.id ? "You" : member.username}** do${member.id === msg.member.id ? "n't" : "esn't"} have any points.`, "general"));
      // Handler for if the user has over 25 points. Uploads them to hastebin
    } else if (points.length > 25) {
      const pointString = `Points for ${format.tag(member, false)}\r\n========\r\n${points.map(m => `${m.id} (issued by ${format.tag(msg.guild.members.get(m.giverId) || { username: `Unknown User (${m.giverId})`, discriminator: "0000" }, false)})\r\n${m.reason}\r\n========`).join("\r\n")}`;
      // Fetches the API
      const res = await fetch("https://hastebin.com/documents", { referrer: "https://hastebin.com/", body: pointString, method: "POST", mode: "cors" });
      const { key } = await res.json();
      // Handler for if hastebin upload fails
      if (!key) return msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
      msg.channel.createMessage(this.bot.embed("✨ Points", `**${member.id === msg.member.id ? "You" : member.username}** ha${member.id === msg.member.id ? "ve" : "s"} more than 25 points. [Hastebin URL](https://www.hastebin.com/${key})`, "success"));
    } else {
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: `✅ ${member.username} has ${points.length} point${points.length == 1 ? "" : "s"}.`,
          fields: points.map(m => ({
            name: `${m.id} - from **${msg.guild.members.get(m.giverId) ? msg.guild.members.get(m.giverId).username : m.giverId}**`,
            value: `${m.reason.slice(0, 150) || "No reason provided"}`,
          })),
          color: require("../../utils/Colour")("general"),
        },
      });
    }
  }
}

module.exports = pointsCommand;
