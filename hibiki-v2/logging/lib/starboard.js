/*
  Hibiki Starboard

  This gets messages reacted to with stars and
  adds them to the starboard channel. It also updates
  any previous starred messages to an extent.
*/

module.exports = bot => {
  bot.on("messageReactionRemove", async (msg, emoji, uid) => {
      // Gets the message ID
      if (!msg.content) {
        msg = await msg.channel.getMessage(msg.id).catch(() => {});
      }

      // Returns if no message is found
      if (!msg) return;
      // Returns if the message was sent by a bot
      if (msg.author.bot === true) return;

      let guildcfg = await bot.db.table("guildconfig").get(msg.guild.id);
      const star = guildcfg.starEmoji ? guildcfg.starEmoji : "⭐";
      // Checks for the star reaction.
      if (msg.reactions[star] && msg.reactions[star].count) {
        if (guildcfg.starSelfStarring && msg.author.id == uid) return;
        // Reads the guildconfig star channel & star amount
        if (!guildcfg) {
          await bot.db.table("guildconfig").insert({
            id: msg.guild.id,
            starChannel: null,
          });
          return;
        }

        if (guildcfg && guildcfg.starChannel && guildcfg.starAmount) {
          const starChannel = await msg.channel.guild.channels.get(guildcfg.starChannel);
          // Returns and doesn't run if the starchannel isn't set
          if (!starChannel) return;
          // Gets up to 50 messages
          const getmsgs = await starChannel.getMessages(50).catch(() => {});
          // Returns if no msgs are gotten
          if (!getmsgs) return;
          // Sets the star constant
          const starmsg = getmsgs.find(m => m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.startsWith(star) && m.embeds[0].footer.text.endsWith(msg.id));
          // Sends the star embed
          if (msg.reactions[star].count === 0) {
            star.delete().catch(() => {});
          }
          // Edits the embed
          if (parseInt(guildcfg.starAmount) <= msg.reactions[star].count) {
            if (starmsg) {
              let embed = starmsg.embeds[0];
              embed.footer.text = `${star}${msg.reactions[star].count} stars | ${msg.id}`;
              star.edit({
                embed: embed,
              }).catch(() => {});
            }
          }
        }
      } else {
        // Inserts blank data into the db
        let guildcfg = await bot.db.table("guildconfig").get(msg.guild.id);
        if (!guildcfg) {
          await bot.db.table("guildconfig").insert({
            id: msg.guild.id,
            starChannel: null,
          });
          return;
        }

        // Gets the starChannel
        const starChannel = await msg.channel.guild.channels.get(guildcfg.starChannel);
        // Returns and doesn't run if the starchannel isn't set
        if (!starChannel) return;
        // Gets up to 50 messages
        const getmsgs = await starChannel.getMessages(50);
        // Sets the star constant
        const starmsg = getmsgs.find(m => m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.startsWith(star) && m.embeds[0].footer.text.endsWith(msg.id));
        // Returns if invalid
        if (!starmsg) return;
        // Deletes the star embed
        starmsg.delete().catch(() => {});
      }
    })

    .on("messageReactionAdd", async (msg, emoji, uid) => {
      let embedconstruct = {};
      // Gets the message ID
      if (!msg.content) {
        msg = await msg.channel.getMessage(msg.id).catch(() => {});
      }
      // Returns if it's an invalid message
      if (!msg) return;
      // Returns if the message was sent by a bot
      if (msg.author.bot === true) return;

      let guildcfg = await bot.db.table("guildconfig").get(msg.guild.id);
      const star = guildcfg.starEmoji ? guildcfg.starEmoji : "⭐";
      // Checks for the star reaction
      if (msg.reactions[star] && msg.reactions[star].count) {
        if (guildcfg.starSelfStarring && msg.author.id == uid) return;
        // Reads the guildconfig star channel & star amount
        if (guildcfg && guildcfg.starChannel && guildcfg.starAmount && parseInt(guildcfg.starAmount) <= msg.reactions[star].count) {
          const starChannel = await msg.channel.guild.channels.get(guildcfg.starChannel);
          // Returns if the starChannel is invalid
          if (!starChannel) return;
          // Gets the last 50 messages
          const getmsgs = await starChannel.getMessages(50);
          // Looks for starboard messages
          const starmsg = getmsgs.find(m => m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.startsWith(star) && m.embeds[0].footer.text.endsWith(msg.id));
          // Edits the message if needed
          if (starmsg) {
            let embed = starmsg.embeds[0];
            embed.footer.text = `${star}${msg.reactions[star].count} stars | ${msg.id}`;
            return star.edit({
              embed: embed,
            }).catch(() => {});
          }
          console.log(msg.reactions);
          console.log(star.length);
          // Sets the embed construct
          embedconstruct = {
            embed: {
              title: "Content",
              author: {
                name: require("../../utils/Format").tag(msg.author, false),
                icon_url: msg.author.avatarURL
              },
              fields: [{
                name: "Channel",
                value: msg.channel.mention,
                inline: true,
              }, {
                name: "Message",
                value: `[Jump](https://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`,
                inline: true,
              }],
              footer: {
                text: `${star}${msg.reactions[star].count} stars | ${msg.id}`,
                icon_url: bot.user.dynamicAvatarURL("png", 1024),
              },
              color: require("../../utils/Colour")("starboard"),
            },
          };

          // If message is an embed
          if (msg.content) embedconstruct.embed.description = msg.content || "No content";
          // Attempts to remove image URLs from the embed
          const urlcheck = msg.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/);
          if (urlcheck || msg.attachments[0]) {
            // Sets the image if needed
            let img;
            if (urlcheck && (urlcheck[0].endsWith(".jpg") || urlcheck[0].endsWith(".png") || urlcheck[0].endsWith(".gif"))) img = urlcheck[0];
            if (msg.attachments && msg.attachments[0]) img = msg.attachments[0].proxy_url;
            embedconstruct.embed.image = {
              url: img,
            };
          }
          // Sends the star embed
          bot.createMessage(guildcfg.starChannel, embedconstruct).catch(() => {});
        }
      }
    });
};
