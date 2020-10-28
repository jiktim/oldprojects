const Command = require("../../lib/Command");

class slotsCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Bets cookies to play the slot machine.",
      aliases: ["bet", "gamble", "slot", "slotmachine", "sm"],
      usage: "<amount>",
      cooldown: 6000,
    });
  }

  async run(msg, args) {
    // Sets the base profit
    let baseprofit = args[0];
    // Sets the emotes
    let emote = ["🍒", "🍌", "💎"];
    // Sets the emote modifiers
    let modifiers = [1, 2, 5];
    let finalemotes = [];
    // Sets the profit to 0
    let profit = 0;
    // Tells the author how to bet if they provided no arguments
    if (!args[0] || isNaN(args[0])) {
      msg.channel.createMessage({
        embed: {
          title: "🎰 Slots",
          description: `To play, run the command again with the amount you'd like to gamble. \n ${emote.map(e => `${e} ${modifiers[emote.indexOf(e)]} cookies`).join("\n")}`,
          color: require("../../utils/Colour")("general"),
        },
      });
      return;
    }

    // Prevents mass gambling - only you can stop gambling addiction
    if (args[0] > 100) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can't bet more than 100 cookies.", "error"));

    // Gets the emotes
    for (let i = 0; i < 3; i++) {
      finalemotes.push(emote[Math.floor(Math.random() * emote.length)]);
    }

    if (finalemotes[0] == finalemotes[1] && finalemotes[1] == finalemotes[2]) {
      // Applies the modifier to profit
      profit = baseprofit * modifiers[emote.indexOf(finalemotes[0])];
    } else if (finalemotes[0] == finalemotes[1] || finalemotes[1] == finalemotes[2]) {
      // If two emotes match, give half of the profit
      profit = baseprofit * modifiers[emote.indexOf(finalemotes[0])] / 2;
    }

    // Sets the emojistring
    let emojiString = finalemotes.join(" ");
    // Reads the cookies DB
    let cookies = await this.db.table("cookies").get(msg.author.id);
    // Inserts 0 cookies if the author has no entry in the DB
    if (!cookies) {
      cookies = {
        id: msg.author.id,
        amount: 0,
        lastclaim: 9999,
      };
      await this.db.table("cookies").insert(cookies);
    }

    // Checks to see if the author has enough cookies
    const amount = parseInt(args[0]);
    let ucookies = await this.db.table("cookies").get(msg.author.id);
    if (amount > ucookies.amount || amount < 0) return msg.channel.createMessage(this.bot.embed("❌ Error", "You don't have enough cookies.", "error"));

    // Profit
    if (profit > 0) {
      cookies.amount += profit;
    } else {
      cookies.amount -= args[0];
    }

    // Rounds the cookies
    cookies.amount = Math.floor(cookies.amount);

    // Inserts the cookies into the DB
    await this.db.table("cookies").get(msg.author.id).update(cookies);
    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: "🎰 Slots",
        description: `${profit ? "You won!" : "Sorry, you lost."} \n ${emojiString}`,
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = slotsCommand;
