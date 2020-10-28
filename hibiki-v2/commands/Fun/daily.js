const Command = require("../../lib/Command");

class dailyCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["claimcookies", "claimdaily", "dailycookies"],
      description: "Gives your daily cookies.",
    });
  }

  async run(msg) {
    // Formats time
    function timeFormat(ms) {
      let d, h, m, s;
      s = Math.floor(ms / 1000);
      m = Math.floor(s / 60);
      s %= 60;
      h = Math.floor(m / 60);
      m %= 60;
      d = Math.floor(h / 24);
      h %= 24;
      h += d * 24;
      return `${h} hours and ${m} minutes`;
    }
    // Checks the user's lastclaim in the DB
    let cookies = await this.db.table("cookies").get(msg.author.id);
    // Inserts 0 cookies if the user doesn't exist in the DB
    if (!cookies) {
      cookies = {
        id: msg.author.id,
        amount: 0,
        lastclaim: 9999,
      };
      await this.db.table("cookies").insert(cookies);
    }

    // If the lastclaim has expired, allow the user to claim their cookies
    if (new Date() - new Date(cookies.lastclaim) > 86400000) {
      let amounttoadd = cookies.amount + 100;
      cookies = {
        id: msg.author.id,
        amount: amounttoadd,
        lastclaim: new Date()
      };

      // Updates the DB
      await this.db.table("cookies").get(msg.author.id).update(cookies);
      msg.channel.createMessage(this.bot.embed("🍪 Daily Cookies", "You have claimed your daily cookies.", "general"));
    } else {
      // If the lastclaim hasn't expired, post the amount of time needed until they can claim their daily cookies
      const lastclaim = new Date(cookies.lastclaim);
      // Formats the time
      const time = timeFormat(86400000 - (new Date().getTime() - lastclaim.getTime()));
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("🍪 Daily Cookies", `You can claim your daily cookies again in **${time}**.`, "general"));
    }
  }
}

module.exports = dailyCommand;
