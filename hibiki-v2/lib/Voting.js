/*
  Hibiki Voting Module

  This listens for proper requests from top.gg
  in order to know what users to add cookies
  to when they have voted for the bot.
*/

const express = require("express");
const format = require("../utils/Format");
const config = require("../config");

// Sets up express
const app = express();
app.use(express.json());

module.exports = async (bot, port) => {
  app.post("/voteReceive", async (req, res) => {
    // Sends a 403 error if the proper authorization isn't provided
    if (req.headers.authorization != config.votingRewards.authorization) {
      if (req.headers.authorization && req.headers.authorization.length) console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`${req.connection.remoteAddress} tried to make a request with the wrong auth key`.red}`);
      return res.sendStatus(403);
    }

    // Gets the user from the request
    let user = bot.users.get(req.body.user);
    // Gets the user from the cookies DB
    let cookies = await bot.db.table("cookies").get(req.body.user);

    // Inserts 0 cookies if the user doesn't exist in the DB
    if (!cookies) {
      cookies = {
        id: req.body.user,
        amount: 0,
        lastclaim: 9999,
      };
      await bot.db.table("cookies").insert(cookies);
    }

    // Sets the amount to add, if it's a weekend give 200
    let amounttoadd = cookies.amount + 150;
    if (req.body.isWeekend) amounttoadd += 50;
    cookies = {
      id: req.body.user,
      amount: amounttoadd,
      lastclaim: cookies.lastclaim,
    };

    // Updates the DB
    await bot.db.table("cookies").get(req.body.user).update(cookies);
    // Gets the DM channel
    if (user != undefined) {
      let DMChannel = await user.getDMChannel();
      if (DMChannel == undefined) return;
      DMChannel.createMessage({
        embed: {
          title: "✨ Thanks for voting!",
          description: `**${req.body.isWeekend ? "200" : "150"} cookies** have been added to your account.`,
          color: require("../utils/Colour")("general"),
        }
      });
    }

    // Sends a message of who voted to the logchannel
    bot.createMessage(bot.config.logchannel, {
      embed: {
        title: "🗳 Vote Received",
        description: `**${user != undefined ? user.username : req.body.user}** has voted. ${req.body.isWeekend == true ? "(recieved 2 votes)" : ""}`,
        color: require("../utils/Colour")("general"),
      }
    }).catch(() => {});
    // Logs to the console
    console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`${user != undefined ? user.username : req.body.user} has voted (requested from: ${req.connection.remoteAddress})`.green}`);
    res.sendStatus(200);
  });

  // Listens on the local network & logs
  const listener = app.listen(port, "0.0.0.0", () => console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Voting handler loaded on`.green} ${`${listener.address().address}:${listener.address().port}`.bold.green}`.yellow));
};
