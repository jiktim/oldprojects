const Command = require("../../lib/Command");

class owoifyCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["owo"],
      description: "OwOifys some text given.",
    });
  }

  async run(msg, args) {
    // Sets the OwOIfy faces
    let faces = ["(・`ω´・)", ";;w;;", "owo", "OwO", "OvO", "UvU", "ouo", "OuO", "UwU", "uwu", ">w<", "^w^", "OvO", "OWO"];

    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Replaces text for the OwOIfy function
    function owoify(owo) {
      owo = owo.replace(/(?:r|l)/g, "w");
      owo = owo.replace(/(?:R|L)/g, "W");
      owo = owo.replace(/n([aeiou])/g, "ny");
      owo = owo.replace(/N([aeiou])/g, "Ny");
      owo = owo.replace(/N([AEIOU])/g, "Ny");
      owo = owo.replace(/ove/g, "uv");
      owo = owo.replace(/!+/g, ` ${faces[Math.floor(Math.random() * faces.length)]} `);
      return owo;
    }

    // Sends the embed
    msg.channel.createMessage(this.bot.embed(`💬 ${faces[Math.floor(Math.random() * faces.length)]}`, owoify(args.join(" ")), "general"));
  }
}

module.exports = owoifyCommand;
