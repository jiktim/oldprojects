const Command = require("../../lib/Command");

class payCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["give", "givecookie", "givecookies", "givemoney", "givepoint", "givepoints"],
      description: "Gives someone else some of your cookies.",
      usage: "<@user> <amount>",
      cooldown: 3000,
    });
  }

  async run(msg, [user, amt]) {
    // Checks to see if the author mentioned another user and if that user is valid
    const amount = parseInt(amt);
    let member;
    if (user && user.length) member = msg.guild.members.find(m => {
      if (m.id == user) return m;
      if (user == `<@${m.id}>`) return m;
      if (user == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(user.toLowerCase())) return m;
    });

    // Handler for if no member or an invalid member is mentioned
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Handler for if a bot is mentioned
    if (member.bot) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can't give cookies to a bot.", "error"));
    // Handler for if the author mentions themselves
    if (member.id === msg.author.id) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can't give cookies to yourself.", "error"));
    // Checks for a valid amount of cookies
    if (!amount) return msg.channel.createMessage(this.bot.embed("❌ Error", "You provided an invalid amount of cookies.", "error"));
    // Checks for a valid number of cookies
    if (isNaN(amount)) return msg.channel.createMessage(this.bot.embed("❌ Error", `You provided an invalid number of cookies.`, "error"));

    // Gets the member & author IDs from the cookies DB
    let mcookies = await this.db.table("cookies").get(member.id);
    let ucookies = await this.db.table("cookies").get(msg.author.id);

    // Inserts 0 cookies if the member has no cookies
    if (!mcookies) {
      await this.db.table("cookies").insert({
        id: member.id,
        amount: 0,
        lastclaim: 9999,
      });
      mcookies = await this.db.table("cookies").get(member.id);
      return;
    }

    // Inserts 0 cookies if the author has no cookies
    if (!ucookies) {
      await this.db.table("cookies").insert({
        id: msg.author.id,
        amount: 0,
        lastclaim: 9999,
      });
      mcookies = await this.db.table("cookies").get(msg.author.id);
      return;
    }

    // Checks if the author has enough cookies
    if (amount > ucookies.amount || amount < 0) return msg.channel.createMessage(this.bot.embed("❌ Error", "You don't have enough cookies.", "error"));

    // Sets cookies amount
    ucookies.amount -= amount;
    mcookies.amount += amount;
    // Inserts cookies into DB
    await this.db.table("cookies").get(member.id).update(mcookies);
    await this.db.table("cookies").get(msg.author.id).update(ucookies);
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("🍪 Pay", `You gave **${amount}** cookie${amount == 1 ? "" : "s"} to **${member.username}**.`, "general"));
  }
}

module.exports = payCommand;
