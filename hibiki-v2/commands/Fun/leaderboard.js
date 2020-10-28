const Command = require("../../lib/Command");

class leaderboardCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["topcookies", "topmoney"],
      description: "Shows the users with the most cookies.",
      cooldown: 3000,
    });
  }

  async run(msg) {
    // Reads the DB
    const cookies = await this.db.table("cookies");
    // Sets the leaderboardcookies array
    let leaderboardcookies = [];
    // Sorts the cookie amount/userID
    Object.values(cookies).forEach(cookie => {
      leaderboardcookies.push([cookie.amount, cookie.id]);
    });

    // Sorts the top 10 users
    leaderboardcookies.sort((a, b) => b[0] - a[0]);
    // Sets the message content
    let msgContent = "";
    // Sets the place
    let place = 1;

    // Looks for each user
    leaderboardcookies.forEach(leaderboard => {
      // Returns if a user is less than 10th place
      if (place > 10) return;
      // Finds the top 10 users
      let user = this.bot.users.find(o => o.id == leaderboard[1]);
      // Returns if an invalid user/no user is given
      if (!user) return;
      // Sets the message contents
      msgContent = `${msgContent}\n**${place}.** ${user.username} **(${Math.floor(leaderboard[0])})**`;
      place += 1;
    });

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: "🍪 Leaderboard",
        description: msgContent,
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = leaderboardCommand;
