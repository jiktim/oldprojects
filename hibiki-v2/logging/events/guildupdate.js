/*
  Hibiki GuildUpdate Event

  This logs to the loggingchannel when
  Hibiki is added or removed from a server.
  It also handles blacklisted guilds.
*/

const format = require("../../utils/Format");

module.exports = bot => {
  bot.on("guildCreate", async guild => {
      // Handler for if the guild isn't cached
      if (typeof guild != "object" || !guild || !guild.name) return;
      // Looks for blacklisted guilds
      const b = await bot.db("hibiki").table("blacklist").filter({
        guild: guild.id,
      });

      // Looks for the server owner
      const owner = guild.members.get(guild.ownerID);
      // Checks to see if the server is blacklisted
      if (b.find(g => g.guild === guild.id)) {
        // Logs when added to a blacklisted guild
        console.log(`[${format.prettyDate(new Date(), false)}] I was added to the blacklisted guild ${guild.name} (${guild.id}).`.red);
        try {
          // Tries to DM the owner notifying them of the blacklist
          const dm = await owner.user.getDMChannel();
          await dm.createMessage(this.bot.embed("❌ Blacklisted", `The server you own **(${guild.name})**, has been blacklisted from using ${bot.user.username}.`, "error"))
            .catch(() => console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Failed to DM the owner of the blacklisted guild ${guild.name}.`.red}`));
        } catch (e) {
          // Sends if the DM failed
          console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Failed to DM the owner of a blacklisted guild.`.red}`);
        }
        // Makes the bot leave the blacklisted server
        await guild.leave();
        return;
      }

      // Logs to the console when the bot is added to a guild
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Added to guild: ${guild.name} (${guild.id})`.green}`);
      // Gets number of bots
      const bots = guild.members.filter(m => m.bot).length;

      // Logs when the bot is added to a guild
      bot.createMessage(bot.config.logchannel, {
        embed: {
          title: "Added to Server",
          thumbnail: {
            url: guild.iconURL || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
          },
          fields: [{
            name: "Server Name",
            value: guild.name,
            inline: true,
          }, {
            name: "Server ID",
            value: guild.id,
            inline: true,
          }, {
            name: "Owner",
            value: `${format.tag(owner, false)}`,
            inline: true,
          }, {
            name: "Owner ID",
            value: owner.id,
            inline: true,
          }, {
            name: "Members",
            value: `${guild.memberCount - bots}`,
            inline: true,
          }, {
            name: "Bots",
            value: bots,
            inline: true,
          }, {
            name: "Region",
            value: format.region(guild.region),
            inline: true,
          }, {
            name: "Shard",
            value: guild.shard.id,
            inline: true,
          }],
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "guildAdd",
          },
          color: require("../../utils/Colour")("success"),
          timestamp: new Date()
        },
      });
    })

    .on("guildDelete", async guild => {
      // Handles uncached guilds
      if (typeof guild != "object" || !guild || !guild.name) return;
      // Logs to the console when the bot is removed from a guild
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Removed from guild: ${guild.name} (${guild.id}.`.red}`);
      // Gets bot length & owner ID
      const bots = guild.members.filter(m => m.bot).length;
      const owner = guild.members.get(guild.ownerID);

      // Logs when the bot is removed from a guild
      bot.createMessage(bot.config.logchannel, {
        embed: {
          title: "Removed from Server",
          thumbnail: {
            url: guild.iconURL || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
          },
          fields: [{
            name: "Server Name",
            value: guild.name,
            inline: true,
          }, {
            name: "Server ID",
            value: guild.id,
            inline: true,
          }, {
            name: "Owner",
            value: `${format.tag(owner, false)}`,
            inline: true,
          }, {
            name: "Owner ID",
            value: owner.id,
            inline: true,
          }, {
            name: "Members",
            value: `${guild.memberCount - bots}`,
            inline: true,
          }, {
            name: "Bots",
            value: bots,
            inline: true,
          }, {
            name: "Region",
            value: format.region(guild.region),
            inline: true,
          }, {
            name: "Shard",
            value: guild.shard.id,
            inline: true,
          }],
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "guildAdd",
          },
          color: require("../../utils/Colour")("error"),
          timestamp: new Date()
        },
      });
    });
};
