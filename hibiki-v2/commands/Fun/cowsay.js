// Doesn't meet quality standards.
const Command = require("../../lib/Command");
const cows = {
  default: "        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n",
  tux: "   \\\n    \\\n        .--.\n       |o_o |\n       |:_/ |\n      //   \\ \\\n     (|     | )\n    /'\\_   _/`\\\n    \\___)=(___/",
}

class cowsayCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["cow"],
      description: "Makes a cow say something.",
      usage: "<text> [cow=tux]",
    });
  }

  run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });
    let cow = Object.keys(cows).find(c => args.indexOf(`cow=${c}`) != -1);
    if (!cow) cow = cows.default;
    else {
      args.splice(args.indexOf(`cow=${cow}`), 1);
      if (cows[cow]) cow = cows[cow];
      else cow = cows.default;
    }
    // Sets the dashes
    let dashes = "";
    // Sets the callback
    let callback;
    // Fixes line breaks
    let fixLineBreak = (c, l) => {
      if (typeof c[1] === "undefined") {
        callback = e => {
          let su = `< ${e} >`;
          return su;
        };
      } else {
        callback = (e, index, array) => {
          let chars2use = ["| ", " |"];
          // Corners
          if (!index) chars2use = ["/ ", " \\"];
          if (index === array.length - 1) chars2use = ["\\ ", " /"];
          let su = `${chars2use[0]}${e}${chars2use[1]}`;
          // Auto spacing
          if (l < 41) {
            su = `${chars2use[0]}${e}${" ".repeat(l - e.length)}${chars2use[1]}`;
          }
          return su;
        };
      }
      return c.map(callback);
    };

    let cowsay = t => {
      dashes = "";
      let length = Math.max(...t.match(/.{1,41}/g).map(a => {
        return a.length;
      }));

      // Limits it to 41
      if (length > 41) length = 41;
      // Dashes
      dashes = "-".repeat(length + 2);
      dashes = ` ${dashes}`;
      // Sets the cow
      return `\n${dashes.replace(/-/g, "_")}\n${fixLineBreak(t.match(/.{1,41}/g), length).join("\n")}\n${dashes}\n${cow}`;
    };

    // Sends the embed
    msg.channel.createMessage(this.bot.embed("🐮 Cowsay", `\`\`\`\n ${cowsay(args.join(" "))}\n\`\`\``, "general"));
  }
}

module.exports = cowsayCommand;
