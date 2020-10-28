const Command = require("../../lib/Command");

class gayCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["calculategay", "gaylevel", "gayness"],
      description: "Calculates how you or a user is.",
      usage: "<@user>",
    });
  }

  run(msg, args) {
    // Checks to see if the author mentioned another user and if that user is valid
    let member = msg.member;
    if (args.length) member = msg.channel.guild.members.find(m => {
      if (m.id == args.join(" ")) return m;
      if (args.join(" ") == `<@${m.id}>`) return m;
      if (args.join(" ") == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) return m;
    }) || msg.member;

    // Random math for calculating the gayness
    const random = Math.floor(Math.random() * 99) + 1;
    // Defines the string for the embed
    let string = `**${member.username}** is **${random}%** gay!`;
    // I'm the gayest girl ever! - Espi
    if (member.id == "647269760782041133") {
      msg.channel.createMessage(this.bot.embed("🏳️‍🌈 Lesbiab", `**${member.username}** is the gayest girl, ever. 💜💙`, "general"));
    } else {
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("🏳️‍🌈 Gay", string, "general"));
    }
  }
}

module.exports = gayCommand;
