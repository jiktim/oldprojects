const Command = require("../../lib/Command");

class eightBallCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["ask", "askball", "ball"],
      description: "Asks a Magic 8-Ball a question.",
      usage: "<question>",
    });
  }

  run(msg) {
    // Sets the responses for the 8-Ball to return
    let responses = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("🎱 8ball", `${responses[Math.floor(Math.random() * responses.length)]}`, "general"));
  }
}

module.exports = eightBallCommand;
