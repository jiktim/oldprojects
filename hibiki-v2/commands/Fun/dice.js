const Command = require("../../lib/Command");

class diceCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["die", "roll", "rolldie", "rolldice"],
      description: "Rolls a six-sided die.",
    });
  }

  run(msg) {
    // Randomly picks between 1 & 6
    let roll = Math.floor(Math.random() * 6) + 1;
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("🎲 Dice", `You rolled a **${roll}**.`, "general"));
  }
}

module.exports = diceCommand;
