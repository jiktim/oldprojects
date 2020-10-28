const Command = require("../../lib/Command");

class loadCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["ld"],
      description: "Loads a command.",
      usage: "<command>",
      allowdisable: false,
      owner: true,
    });
  }

  run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length || !args) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    let command;
    let category;
    try {
      let categories = [];
      this.bot.commands.forEach(cmd => {
        // Returns if categories doesn't include the category
        if (!categories.includes(cmd.category)) categories.push(cmd.category);
      });

      // Looks for the correct category
      categories.forEach(c => {
        if (require("fs").existsSync(`${process.cwd()}/commands/${c}/${args.join(" ")}.js`)) category = c;
      });
      // Command
      command = require(`../${category}/${args.join(" ")}`);
    } catch (err) {
      // Sends if an error happened
      msg.channel.createMessage(this.bot.embed("❌ Error", `\n\`\`\`js\n${err}\n\`\`\``), "error");
    }

    // Returns if no command was found
    if (!command) return;

    // Loads the command
    this.bot.commands.add(new command(this.bot, this.db, args.join(" "), category));
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("✅ Success", `Loaded \`${args.join(" ")}\` successfully.`, "success"));
  }
}

module.exports = loadCommand;
