const Command = require("../../lib/Command");

class dicksizeCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["dick", "penissize"],
      description: "Tells you a user's dick size.",
    });
  }

  run(msg, args) {
    let member;
    // Checks to see if the author mentioned another user and if that user is valid
    if (args.length) member = msg.channel.guild.members.find(m => {
      if (msg.mentions.includes(m.user)) return m;
      if (m.id == args.join(" ")) return m;
      if (args.join(" ") == `<@${m.id}>`) return m;
      if (args.join(" ") == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) return m;
    });

    // Falls back to the author if no member was found
    if (!member) member = msg.author;
    let inches = member.id % 7.1;
    if (member.id == "647269760782041133") inches = 0;
    if (member.id == "569490086547292160") inches = 1;
    if (member.id == "511966736744972309") inches = -1;
    // Falls back to the author if no member was found
    if (!member) member = msg.author;

    // Function to add a suffix to inches if it's more than 1
    let suffix = a => {
      return a > 1 || a < 0 || a === 0 ? "es" : "";
    };

    // Sets the dicksize
    let thedick = `8${"=".repeat(Math.round(inches.toFixed(2) / 2))}D`;

    // Sends the embed
    if (!member.bot) {
      msg.channel.createMessage(this.bot.embed("🍆 Dicksize", `**${member.username}**'s dicksize is **${inches.toFixed(2)} inch${suffix(inches)}**.\n ${thedick}`, "general"));
    } else {
      // Handler for if a bot was mentioned
      msg.channel.createMessage(this.bot.embed("🍆 Dicksize", `I don't think **${member.username}** has a dick.`, "general"));
    }
  }
}

module.exports = dicksizeCommand;
