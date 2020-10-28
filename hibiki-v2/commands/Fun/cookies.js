const Command = require("../../lib/Command");

class cookiesCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["balance", "money", "total", "totalcookies", "totalmoney"],
      description: "Tells you how many cookies you have.",
      usage: "<@user>",
      cooldown: 3000,
    });
  }

  async run(msg, args) {
    // Sets the cookies to 0
    let cookies = 0;
    // Checks if the author is a valid author & if the user is a valid user
    const member = msg.guild.members.find(m => m.id == args[0] || `<@${m.id}>` === args[0] || `<@!${m.id}>` === args[0]);
    // Posts the amount of cookies that the author has
    if (!member) {
      const cookiesDB = await this.db.table("cookies").get(msg.author.id);
      // Inserts 0 cookies if the user doesn't exist in the DB
      if (!cookiesDB) cookies = 0;
      else cookies = cookiesDB.amount;
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("🍪 Cookies", `You have **${Math.floor(cookies)}** cookies.`, "general"));
    } else {
      // Posts the amount of cookies the mentioned user has
      const cookiesDB = await this.db.table("cookies").get(member.id);
      // Inserts 0 cookies if the user doesn't exist in the DB
      if (!cookiesDB) cookies = 0;
      else cookies = cookiesDB.amount;
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("🍪 Cookies", `**${member.username}** has **${Math.floor(cookies)}** cookies.`, "general"));
    }
  }
}

module.exports = cookiesCommand;
