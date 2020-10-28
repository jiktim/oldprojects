const Command = require("../../lib/Command");

class coolnessCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["calculatecool", "cool", "howcool"],
      description: "Calculates how cool you are.",
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

    // Random math for calculating the user's coolness
    const random = Math.floor(Math.random() * 99) + 1;
    // Defines the string for the embed
    let string = `**${member.username}** is **${random}%** cool!`;
    msg.channel.createMessage(this.bot.embed("😎 Coolness", string, "general"));
  }
}

module.exports = coolnessCommand;
