/*
  Hibiki Eventlog

  This logging module logs server events such as
  channel/role edits and message updates & deletions,
*/

const format = require("../../utils/Format");
const getColour = require("../../utils/Colour");
const Logging = require("../lib/logger");

// Gets the logging configuration of the guild
module.exports = (bot, db) => {
  const loggingFacility = new Logging(db);
  const canSendLog = async (guild, event) => {
    // Gets guildLogging
    const channel = await loggingFacility.getLoggingChannel(guild, "guildLogging");
    if (guild.channels.has(channel)) return channel;
  };

  /*
    Channel logging
    Logs channelCreate, channelDelete, channelUpdate
  */

  // Logs channel creations
  bot.on("channelCreate", async channel => {
      // if channel is in dms return
      if (channel.type == 1 || channel.type == 3) return;
      // Tries to send the log
      let logchannel = await canSendLog(channel.guild, "channelCreate");
      // Returns if logchannel isn't set
      if (!logchannel) return;
      // Sets the embed constructor
      let embed = {
        description: `The <#${channel.id}> channel was created.`,
        author: {
          name: "Channel Created"
        },
        footer: {
          text: `ID: ${channel.id}`,
          icon_url: bot.user.dynamicAvatarURL("png", 1024),
        },
        color: getColour("error"),
        timestamp: new Date()
      };
      // Reads the audit logs for the channel creator
      const logs = await channel.guild.getAuditLogs(1, null, 10).catch(() => {});
      // Gets the user/entries
      if (logs) {
        const log = logs.entries[0];
        const user = logs.users[0];
        // Adds to the embed if needed
        if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
          embed.author.name = `${format.tag(user)} created a channel.`;
          embed.author.icon_url = user.avatarURL;
        }
      }
      bot.createMessage(logchannel, { embed: embed }).catch(() => {});
    })

    // Logs channel deletions
    .on("channelDelete", async channel => {
      // if channel is in dms return
      if (channel.type == 1 || channel.type == 3) return;
      setTimeout(async () => {
        let logchannel = await canSendLog(channel.guild, "channelDelete");
        // Returns if logchannel isn't setup
        if (!logchannel) return;
        // Sets the embed construct
        let embed = {
          author: {
            name: "Channel Deleted"
          },
          description: `The **#${channel.name}** channel was deleted.`,
          footer: {
            text: `ID: ${channel.id}`,
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
          },
          color: getColour("error"),
          timestamp: new Date()
        };
        // Gets the logs & updates the embed if needed
        const logs = await channel.guild.getAuditLogs(1, null, 12).catch(() => {});
        if (logs) {
          const log = logs.entries[0];
          const user = logs.users[0];
          if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
            embed.author.name = `${format.tag(user)} deleted a channel.`;
            embed.author.icon_url = user.avatarURL;
          }
        }
        bot.createMessage(logchannel, { embed: embed }).catch(() => {});
      }, 1000);
    })

    // Logs channel updates
    .on("channelUpdate", async (channel, oldChannel) => {
      function getDifference(array1, array2) {
        return array1.filter(i => {
          return array2.indexOf(i) < 0;
        });
      }

      // Returns if it's a DM channel
      if (channel.type == 1 || channel.type == 3) return;
      // Gets the logchannel
      let logchannel = await canSendLog(channel.guild, "channelCreate");
      // Returns if the logchannel isn't setup
      if (!logchannel) return;
      // Sets the embed construct
      let embed = {
        description: `<#${channel.id}> was edited.`,
        author: {
          name: "Channel Edited"
        },
        fields: [],
        footer: {
          text: `ID: ${channel.id}`,
          icon_url: bot.user.dynamicAvatarURL("png", 1024),
        },
        color: getColour("general"),
        timestamp: new Date()
      };

      // Fields for if the channel name changed
      if (channel.name !== oldChannel.name) embed.fields.push({ name: "Name Changed", value: `**${oldChannel.name}** -> **${channel.name}**` });
      // Fields for if the topic changed
      if (channel.topic !== oldChannel.topic) embed.fields.push({ name: "Topic Changed", value: `**${oldChannel.topic ? oldChannel.topic.substr(0, 400) : "No topic"}** -> **${channel.topic ? channel.topic.substr(0, 400) : "No topic"}**` });
      // Fields for if the NSFW setting changed
      if (channel.nsfw !== oldChannel.nsfw) embed.fields.push({ name: "NSFW Toggled", value: `${channel.nsfw ? "**Enabled**" : "**Disabled**"} -> **${oldChannel.nsfw ? "**Enabled**" : "**Disabled**"}**` });
      // Fields for if the bitrate changed
      if (channel.bitrate && channel.bitrate !== oldChannel.bitrate) embed.fields.push({ name: "Bitrate", value: `**${oldChannel.bitrate}** -> **${channel.bitrate}**` });
      // Fields for if slowmode changed
      if (channel.rateLimitPerUser !== oldChannel.rateLimitPerUser) embed.fields.push({ name: "Slowmode", value: `**${oldChannel.rateLimitPerUser == 0 ? "No cooldown" : `${oldChannel.rateLimitPerUser} seconds`}** -> **${channel.rateLimitPerUser == 0 ? "No cooldown" : `${channel.rateLimitPerUser} seconds`}**` });
      // Return if there are no changes
      if (!embed.fields.length) return;
      // Reads the audit logs & gets the differences
      let channelOverwrites = channel.permissionOverwrites.map(o => o);
      let oldOverwrites = oldChannel.permissionOverwrites.map(o => o);
      let auditLogId;
      let uniques = getDifference(channelOverwrites, oldOverwrites);
      if (oldOverwrites.length > channelOverwrites.length) uniques = getDifference(oldOverwrites, channelOverwrites);
      // Audit log IDs
      if (channelOverwrites.length > oldOverwrites.length) {
        auditLogId = 13;
        channelOverwrites = channelOverwrites.filter(val => !uniques.includes(val));
      } else if (oldOverwrites.length > channelOverwrites.length) {
        auditLogId = 15;
        oldOverwrites = oldOverwrites.filter(val => !uniques.includes(val));
      } else if (channel.topic !== oldChannel.topic || channel.nsfw !== oldChannel.nsfw || channel.name !== oldChannel.name) {
        auditLogId = 11;
      } else auditLogId = 14;
      // Sets a timeout to check audit
      setTimeout(async () => {
        const logs = await channel.guild.getAuditLogs(1, null, auditLogId).catch(() => {});
        if (logs) {
          // Updates embed if needed
          const log = logs.entries[0];
          const user = logs.users[0];
          if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
            embed.author.name = `${format.tag(user)} edited a channel.`;
            embed.author.icon_url = user.avatarURL;
          }
        }
        // Sends the embed
        bot.createMessage(logchannel, { embed: embed }).catch(() => {});
      }, 1000);
    })

    /*
      Role logging
      logs guildRoleCreate, guildRoleDelete, guildRoleUpdate
    */

    // Logs role creations
    .on("guildRoleCreate", async (guild, role) => {
      // Gets the channel
      let logchannel = await canSendLog(guild, "channelCreate");
      // Returns if it's invalid
      if (!logchannel) return;
      // Sets the main embed up
      let embed = {
        description: `The **${role.name}** role was created.`,
        author: {
          name: "Role Created",
        },
        footer: {
          text: `ID: ${role.id}`,
          icon_url: bot.user.dynamicAvatarURL("png", 1024),
        },
        color: getColour("error"),
        timestamp: new Date()
      };
      // Reads the audit logs
      setTimeout(async () => {
        const logs = await guild.getAuditLogs(1, null, 30).catch(() => {});
        if (logs) {
          const log = logs.entries[0];
          const user = logs.users[0];
          // Updates the embed if needed
          if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
            embed.author.name = `${format.tag(user)} created a role.`;
            embed.author.icon_url = user.avatarURL;
          }
        }
        bot.createMessage(logchannel, { embed: embed }).catch(() => {});
      }, 1000);
    })

    // Logs role deletions
    .on("guildRoleDelete", async (guild, role) => {
      // Gets the channel
      let logchannel = await canSendLog(guild, "channelCreate");
      // Returns if it's invalid
      if (!logchannel) return;
      // Sets the main embed up
      let embed = {
        description: `The **${role.name}** role was deleted.`,
        author: {
          name: "Role Deleted"
        },
        footer: {
          text: `ID: ${role.id}`,
          icon_url: bot.user.dynamicAvatarURL("png", 1024),
        },
        color: getColour("error"),
        timestamp: new Date()
      };
      // Reads audit logs
      setTimeout(async () => {
        const logs = await guild.getAuditLogs(1, null, 32).catch(() => {});
        if (logs) {
          const log = logs.entries[0];
          const user = logs.users[0];
          // Updates embed if needed
          if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
            embed.author.name = `${format.tag(user)} deleted a role.`;
            embed.author.icon_url = user.avatarURL;
          }
        }
        bot.createMessage(logchannel, { embed: embed }).catch(() => {});
      }, 1000);
    })

    // Logs role updates
    .on("guildRoleUpdate", async (guild, role, oldRole) => {
      // Gets the logchannel
      let logchannel = await canSendLog(guild, "channelCreate");
      // Returns if no logchannel is set
      if (!logchannel) return;
      // Sets the base embed
      let embed = {
        description: `The **${role.name}** role was edited.`,
        author: {
          name: "Role Edited"
        },
        fields: [],
        footer: {
          text: `ID: ${role.id}`,
          icon_url: bot.user.dynamicAvatarURL("png", 1024),
        },
        color: getColour("general"),
        timestamp: new Date(),
      };

      // Field for if the name was changed
      if (role.name !== oldRole.name) embed.fields.push({ name: "Name Changed", value: `**${oldRole.name}** -> **${role.name}**` });
      // Field for if the role colour was changed
      if (role.color !== oldRole.color) {
        embed.fields.push({ name: "Colour Changed", value: `**${oldRole.color ? `#${parseInt(oldRole.color).toString(16)}` : "#00000"}** -> **#${role.color ? `#${parseInt(role.color).toString(16)}` : "#00000"}**` });
        embed.color = role.color;
      }
      // Field for if the hoistablity was changed
      if (role.hoist != undefined && oldRole.hoist != undefined && role.hoist !== oldRole.hoist) embed.fields.push({ name: "Visibility Changed", value: role.hoist ? "**Not Showing Seperately** -> **Showing Separately**" : "**Showing Separately** -> **Not Showing Seperately**" });
      // Field for if Mentionability was changed
      if (role.mentionable !== oldRole.mentionable) embed.fields.push({ name: "Mentionability Changed", value: role.mentionable ? "**Unmentionable** -> **Mentionable**" : "**Mentionable** -> **Unmentionable**" });
      // Returns if there's no fields
      if (embed.fields.length == 0) return;
      // Gets the audit logs
      setTimeout(async () => {
        const logs = await guild.getAuditLogs(1, null, 31).catch(() => {});
        if (logs) {
          const log = logs.entries[0];
          const user = logs.users[0];
          if (log && new Date().getTime() - new Date(log.id / 4194304 + 1420070400000).getTime() < 3000) {
            embed.author.name = `${format.tag(user)} edited a role.`;
            embed.author.icon_url = user.avatarURL;
          }
        }
        // Sends the message
        bot.createMessage(logchannel, { embed: embed }).catch(() => {});
      }, 1000);
    });
};
