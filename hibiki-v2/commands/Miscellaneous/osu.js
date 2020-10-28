const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const config = require("../../config");

class osuCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["osuinfo", "osuinfo", "osuuser"],
      description: "Displays info about an osu! account.",
      usage: "<account>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Number formatting
    const formatNumber = num => Number.parseFloat(num).toLocaleString(undefined, {
      maximumFractionDigits: 2
    });

    // Joins the args
    let osucmd = args.join(" ");

    // Fetches the API
    let res = await fetch(`https://osu.ppy.sh/api/get_user?k=${config.osu}&u=${osucmd}&type=string`);
    let body = await res.json();

    // Handler for if player not found
    if (!body.length) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    const data = body[0];
    // Handler for if the API lacks most data
    if (!data.pp_raw && !data.playcount && !data.level && !data.accuracy && !data.playcount) return msg.channel.createMessage(this.bot.embed("❌ Error", "The user you searched for has no data.", "error"));

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        author: {
          name: `osu! profile for ${data.username}`,
          url: `https://osu.ppy.sh/users/${data.user_id}`,
          icon_url: `https://osu.ppy.sh/images/flags/${data.country}.png` || "https://i.imgur.com/tRXeTcU.png",
        },
        description: `
        ▸ **Rank**: ${data.pp_rank} (${data.country}#${data.pp_country_rank})
        ▸ **Level**: ${data.level} (${data.level.substring(3, 5)}%)
        ▸ **PP**: ${data.pp_raw}
        ▸ **Score Accuracy**: ${data.accuracy.substring(0, 5)}%
        ▸ **Play count**: ${data.playcount}
        `,
        // osu!'s logo hex colour
        color: 0xe6649e,
      },
    });
  }
}

module.exports = osuCommand;
