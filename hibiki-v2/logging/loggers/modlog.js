/*
  Hibiki Modlog

  This handles things such as mutes & punishments
  and logs them to the modLogging channel of the server.
*/

const format = require("../../utils/Format");
const getColour = require("../../utils/Colour");
const Logging = require("../lib/logger");

// Gets the logging configuration of the guild
module.exports = (bot, db) => {
  const loggingFacility = new Logging(db);
  const canSendLog = async (guild) => {
    const channel = await loggingFacility.getLoggingChannel(guild, "modLogging");
    if (guild.channels.has(channel)) return channel;
  };

  // Sends the logging embeds
  const trySendLog = async (guild, event, embed) => {
    const channel = await canSendLog(guild, event);
    if (channel) {
      bot.createMessage(channel, {
        embed: embed
      }).catch(() => {});
    }
  };

  /*
    Bot Punishment logging
    memberMute, memberUnmute, strikeAdd, strikeRemove
  */

  // Logs when a member is muted
  bot.on("memberMute", (guild, user, member, reason) => trySendLog(guild, "memberMute", {
      description: `**${format.tag(user, false)}** muted them for: ${reason || "No reason provided"}.`,
      author: {
        name: `${format.tag(member, false)} was muted.`,
        icon_url: member.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "Mute",
      },
      color: getColour("error"),
      timestamp: new Date()
    }))

    // Logs when a member is unmuted
    .on("memberUnmute", (guild, user, member) => trySendLog(guild, "memberUnmute", {
      description: `**${format.tag(user, false)}** unmuted them.`,
      author: {
        name: `${format.tag(member, false)} was unmuted.`,
        icon_url: member.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "Unmute",
      },
      color: getColour("success"),
      timestamp: new Date()
    }))

    // Logs strike adds
    .on("strikeAdd", (guild, giver, receiver, id, reason) => trySendLog(guild, "strikeAdd", {
      description: `Reason: ${reason}`,
      author: {
        name: `${format.tag(giver, false)} gave ${format.tag(receiver, false)} a strike.`,
        icon_url: receiver.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: `ID: ${id}`,
      },
      color: getColour("error"),
      timestamp: new Date()
    }))

    // Logs strike removes
    .on("strikeRemove", (guild, user, ids) => trySendLog(guild, "strikeRemove", {
      description: ids.join(", "),
      author: {
        name: `${format.tag(user, false)} removed some strikes.`,
        icon_url: user.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "RemoveStrike",
      },
      color: getColour("success"),
      timestamp: new Date()
    }))

    /*
      Guild Punishment logging
      guildBanAdd, guildKick, guildbanRemove */

    // Logs when a user is kicked
    .on("guildKick", (guild, user, member, reason) => trySendLog(guild, "guildKick", {
      description: `**${format.tag(user, false)}** kicked them for: ${reason}`,
      author: {
        name: `${format.tag(member, false)} was kicked.`,
        icon_url: user.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "Kick",
      },
      color: getColour("error"),
      timestamp: new Date()
    }))

    // Logs when a user is banned
    .on("guildBanAdd", async (guild, user) => {
      const channel = await canSendLog(guild, "guildBanAdd");
      // Returns if there's no channel set
      if (!channel) return;
      setTimeout(async () => {
        // Reads the audit logs
        const logs = await guild.getAuditLogs(1, null, 22).catch(() => {});
        // Sets the log entries
        if (!logs || !logs.entries[0]) return;
        const log = logs.entries[0];
        // Finds the users
        const perp = logs.users.find(u => u.id !== user.id);
        // Sets the embed construct
        let embed = {
          description: `Banned by **${format.tag(perp, false)}** for the reason ${log.reason || "No reason provided"}`,
          author: {
            name: `${format.tag(user, false)} was banned.`,
            icon_url: user.avatarURL,
          },
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: `ID: ${user.id}`,
          },
          color: getColour("error"),
          timestamp: new Date()
        };
        // Sends the embed
        bot.createMessage(channel, { embed: embed });
      }, 1000);
    })

    // Logs when a member is unbanned
    .on("guildBanRemove", async (guild, user) => {
      const channel = await canSendLog(guild, "guildBanRemove");
      // Returns if there's no channel set
      if (!channel) return;
      setTimeout(async () => {
        // Reads the audit logs
        const logs = await guild.getAuditLogs(1, null, 23).catch(() => {});
        // Sets the log entries
        if (!logs || !logs.entries[0]) return;
        const log = logs.entries[0];
        // Finds the users
        const perp = logs.users.find(u => u.id !== user.id);
        // Sets the embed construct
        let embed = {
          description: `Unbanned by **${format.tag(perp, false)}**.`,
          author: {
            name: `${format.tag(user, false)} was unbanned.`,
            icon_url: user.avatarURL,
          },
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: `ID: ${user.id}`,
          },
          color: getColour("success"),
          timestamp: new Date()
        };

        // Gets the log reason
        if (log.reason) {
          // Sets the reason as embed fields if there's a reason
          embed.fields = [{}];
          embed.fields[0].name = "Reason";
          embed.fields[0].value = log.reason;
        }
        // Sends the embed
        bot.createMessage(channel, { embed: embed });
      }, 1000);
    })

    /*
      Message-related logging
      messageDeleteBulk, messageDelete, messageUpdate
    */

    // Logs when messages are purged
    .on("messageDeleteBulk", async messages => {
      // Returns if there's no messages
      if (!messages[0].channel.guild) return;
      // Gets the channel
      const channel = await canSendLog(messages[0].channel.guild, "messagePurge");
      // Returns if there's no channel
      if (!channel) return;
      const messageText = messages
        // Remove uncached messages
        .filter(m => m.content && m.attachments)
        // Sort by date
        .sort((m1, m2) => m1.id - m2.id)
        .map(m => `${format.tag(m.author || { username: "Unknown User", discriminator: "0000" }, false)} (message ID: ${m.id}): ${m.content ? `${m.content} ` : ""}${m.attachments.length ? m.attachments[0].proxy_url : ""}`);

      // Sets the authors of the deleted messages
      let authors = [];
      // Gets the users that aren't cached by Eris
      let unknownUsers = 0;
      messages.forEach(m => {
        if (m.author == undefined) {
          unknownUsers += 1;
          return;
        }
        // Gets the author id
        let author = authors.find(d => m.author !== undefined && d.id == m.author.id);
        // Pushes the author
        if (author) authors[authors.indexOf(author)].count += 1;
        else authors.push({
          tag: format.tag(m.author, false),
          id: m.author.id,
          count: 1
        });
      });

      // Pushes the author as unknown if needed
      if (unknownUsers > 0) authors.push({
        tag: "Unknown#0000",
        count: unknownUsers
      });

      // Sends the embed
      bot.createMessage(channel, {
        embed: {
          title: `💣 ${messages.length} messages purged.`,
          // Filters out the users who's messages were purged & their amount
          description: authors.map(author => `**${author.tag}**: ${author.count}`).join("\n") || "Error while trying to filter users.",
          footer: {
            text: `Deleted messages are in the text file.`,
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
          },
          color: getColour("error"),
          timestamp: new Date()
        },
      }, {
        // Attaches the file as a footer
        file: Buffer.from(messageText.join("\r\n")),
        name: "deleted-messages.txt",
      }).catch(() => {});
    })

    // Logs message deletions
    .on("messageDelete", async message => {
      // Returns if it's an invalid channel
      if (!message.channel.guild) return;
      // Returns if there's no author
      if (!message.author) return;
      // Returns if the message was sent by the bot itself
      if (message.author.id == bot.user.id) return;
      // Gets the channel
      const channel = await canSendLog(message.channel.guild, "messageDelete");
      // Returns if it's an invalid channel
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          author: {
            name: `${format.tag(message.author, false)}'s message has been deleted.`,
            icon_url: message.author.avatarURL,
          },
          fields: [{
            name: "Message",
            value: message.content || "No message",
            inline: true,
          }, {
            name: "Channel",
            value: message.channel.mention,
            inline: true,
          }, {
            name: "ID",
            value: message.id,
            inline: true,
          }],
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "MessageDelete",
          },
          image: {
            url: message.attachments && message.attachments[0] ? message.attachments[0].proxy_url : null
          },
          color: getColour("error"),
          timestamp: new Date()
        },
      }).catch(() => {});
    })

    // Logs message updates
    .on("messageUpdate", async (message, oldMessage) => {
      // Returns if there's no oldMessage
      if (!oldMessage) return;
      // Returns if it's an invalid channel
      if (!message.channel.guild) return;
      // Returns if there's no author
      if (!message.author) return;
      // Returns if it was the bot's message
      if (message.author.id == bot.user.id) return;
      // Returns if the content is the same
      if (message.content === oldMessage.content) return;
      // Gets the channel
      let channel = await canSendLog(message.channel.guild, "messageUpdate");
      // Returns if it's an invalid channel
      if (!channel) return;
      // Creates a text buffer
      const text = Buffer.from(message.content.replace(/\n/g, "\r\n"));
      // Errorembed
      function errembed(...objects) {
        return Object.assign({}, ...objects);
      }

      // Sends the embed
      bot.createMessage(channel, {
        embed: errembed({
          author: {
            name: `${format.tag(message.author, false)}'s message has been updated.`,
            icon_url: message.author.avatarURL,
          },
        }, message.content.length <= 1024 ? {
          fields: [{
            name: "Old content",
            value: oldMessage.content || "No content",
            inline: false,
          }, {
            name: "New content",
            value: message.content || "No content",
            inline: false,
          }, {
            name: "Channel",
            value: message.channel.mention,
            inline: true,
          }, {
            name: "Message",
            value: `[Jump](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
            inline: true,
          }],
          footer: {
            text: `ID: ${message.id}`,
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
          },
          color: getColour("error"),
          timestamp: new Date()
        } : {
          footer: {
            text: "The message content was too long to send in an embed.",
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
          },
          color: getColour("error"),
          timestamp: new Date()
        }),
      }, message.content.length > 1024 ? {
        file: text,
        name: "new-message-content.txt",
      } : null).catch(() => {});
    })


    /*
      AutoMod logging
      automodMute, automodAntiInvite
    */

    // Logs when a member is muted due to automod
    .on("automodMute", async (guild, member, msgs) => {
      let channel = await canSendLog(guild, "automodMute");
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          description: `Cause of mute:\n${msgs.map(m => `**${member.username}**: ${m.content.substring(0, 128)}`).join("\n")}`,
          author: {
            name: `${format.tag(member, false)} was automatically muted.`,
            icon_url: member.avatarURL,
          },
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "Automod",
          },
          color: getColour("error"),
          timestamp: new Date()
        }
      }).catch(() => {});
    })

    // Logs automod invites
    .on("automodantiInvite", async (guild, member, content, strike) => {
      let channel = await canSendLog(guild, "automodantiInvite");
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          author: {
            name: `${format.tag(member, false)} tried to send an invite.`,
            icon_url: member.avatarURL,
          },
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "Automod",
          },
          fields: [{
            name: "Message content",
            value: (content.length > 100 ? `${content.substring(0, 100)}..` : content) || "No content",
            inline: false,
          }, {
            name: "Strike ID",
            value: strike ? strike : "No strike",
            inline: false,
          }],
          color: getColour("error"),
          timestamp: new Date()
        }
      });
    })

    /*
      Other Modlogs
      nicknameUpdate
    */

    // Logs nickname changes
    .on("nicknameUpdate", async (guild, member, user, oldnick) => {
      let channel = await canSendLog(guild, "nicknameUpdate");
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          description: `Nickname changed by **${format.tag(member, false)}**.`,
          author: {
            name: `${format.tag(user, false)}'s nickname was changed.`,
            icon_url: user.avatarURL,
          },
          fields: [{
            name: "Old Nickname",
            value: oldnick,
            inline: false,
          }, {
            name: `New Nickname`,
            value: user.nick || "No nickname",
            inline: true,
          }],
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "Nickname",
          },
          color: getColour("general"),
          timestamp: new Date()
        }
      }).catch(() => {});
    });
};
