const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const config = require("../../config");

class fortniteCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns Fortnite account stats.",
      aliases: ["fortnitestats"],
      usage: "<username> <platform>",
      cooldown: 2000,
      allowdms: true,
    });
  }

  async run(msg, [username, platform]) {
    // Handler for if the user provided no username
    if (!username) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Check if the platform is valid
    if (!["psn", "xbox", "pc"].includes(platform) && platform != undefined) return msg.channel.createMessage(this.bot.embed("🤙 Fortnite", "Valid platforms are `pc`, `psn`, and `xbox`.", "general"));
    // Sends the first embed
    let statmsg = await msg.channel.createMessage(this.bot.embed("🤙 Fortnite", "Please wait...", "general"));

    // Fetches the API
    let res = await fetch(`https://api.fortnitetracker.com/v1/profile/${platform != undefined ? encodeURIComponent(platform) : "pc"}/${encodeURIComponent(username)}`, {
      headers: {
        "TRN-Api-Key": config.gametracker,
      }
    });

    // API body
    let body = await res.json().catch(() => {});

    // Handler for if no player is found
    if (!body) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sends if the body lacks info the body errors
    if (body.error || !body.lifeTimeStats) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sends the embed
    statmsg.edit({
      embed: {
        title: `🤙 Fortnite stats for **${body.epicUserHandle}** on **${body.platformNameLong}**`,
        fields: [{
          name: "Wins",
          value: body.lifeTimeStats[8].value || "Unknown",
          inline: true
        }, {
          name: "Matches Played",
          value: body.lifeTimeStats[7].value || "Unknown",
          inline: true
        }, {
          name: "Kills",
          value: body.lifeTimeStats[10].value || "Unknown",
          inline: true
        }, {
          name: "Score",
          value: body.lifeTimeStats[6].value || "Unknown",
          inline: true
        }, {
          name: "K/D Ratio",
          value: body.lifeTimeStats[11].value || "Unknown",
          inline: true,
        }, {
          name: "Win Percent",
          value: body.lifeTimeStats[9].value || "Unknown",
          inline: true,
        }],
        // Fortnite's logo hex
        color: 0x6fc8f0,
      },
    });
  }
}

module.exports = fortniteCommand;
