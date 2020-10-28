const Command = require("../../lib/Command");

class coinflipCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["coin", "flip", "flipacoin", "flipcoin"],
      description: "Flips a coin.",
      allowdms: true,
    });
  }

  run(msg) {
    // Sets the coin constant, randomly deciding between heads or tails
    let coin = ["heads", "tails"][Math.floor(Math.random() * 2)];
    // Tails percentage is if it returns > 50%, Heads percentage is if it returns < 50%
    const random = Math.floor(Math.random() * 99) + 1;
    // Sends the embed if it landed on heads
    if (random < 50 && coin == "heads") {
      msg.channel.createMessage(this.bot.embed("💰 Coinflip", `The coin landed on **heads**.`, "general"));
    } else if (random > 50 && coin == "tails") {
      // Sends the embed if it landed on tails
      msg.channel.createMessage(this.bot.embed("💰 Coinflip", `The coin landed on **tails**.`, "general"));
    } else {
      // Sends the embed deciding between heads and tails at random
      msg.channel.createMessage(this.bot.embed("💰 Coinflip", `The coin landed on **${random > 50 ? "tails" : "heads"}**.`, "general"));
    }
  }
}

module.exports = coinflipCommand;
