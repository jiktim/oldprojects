/*
  Hibiki Botlog

  This logging module logs things that have to deal with Hibiki herself.
  Some of these are things such as interactions & configuration changes.
*/

const format = require("../../utils/Format");
const getColour = require("../../utils/Colour");
const Logging = require("../lib/logger");

// Gets the logging configuration of the guild
module.exports = (bot, db) => {
  const loggingFacility = new Logging(db);
  const canSendLog = async (guild, event) => {
    // Gets the modLogging oiptions
    const channel = await loggingFacility.getLoggingChannel(guild, "modLogging");
    if (guild.channels.has(channel)) return channel;
  };

  // Sends the logging embeds
  const trySendLog = async (guild, event, embed) => {
    const channel = await canSendLog(guild, event);
    if (channel) {
      bot.createMessage(channel, { embed: embed }).catch(() => {});
    }
  };

  /*
    Bot interaction logging
    Logs pointAdd & pointRemove
  */

  // Logs point adds
  bot.on("pointAdd", (guild, giver, receiver, id, reason) => trySendLog(guild, "pointAdd", {
      description: `Reason: ${reason}`,
      author: {
        name: `${format.tag(receiver, false)} was given a point by ${format.tag(giver, false)}.`,
        icon_url: receiver.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: `ID: ${id}`,
      },
      color: getColour("success"),
      timestamp: new Date()
    }))

    // Logs point removes
    .on("pointRemove", (guild, user, ids) => trySendLog(guild, "pointRemove", {
      author: {
        name: `${format.tag(user, false)} removed some points.`,
        icon_url: user.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: `IDs: ${ids}`,
      },
      color: getColour("error"),
      timestamp: new Date()
    }))

    /*
      Bot role logging
      Logs memberUnverify, memberUnverify, assignableRoleAdd, assignableRoleRemove, memberAssign, memberUnassign
    */

    // Logs when a member is verified
    .on("memberVerify", (guild, user, member) => trySendLog(guild, "memberVerify", {
      description: `**${format.tag(user, false)}** gave them the role.`,
      author: {
        name: `${format.tag(member, false)} was given the verified role.`,
        icon_url: member.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "Verify",
      },
      color: getColour("success"),
      timestamp: new Date()
    }))

    // Logs when a member is unverified
    .on("memberUnverify", (guild, user, member) => trySendLog(guild, "memberUnverify", {
      description: `**${format.tag(user, false)}** removed the role.`,
      author: {
        name: `${format.tag(member, false)} was unverified.`,
        icon_url: member.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "Unverify",
      },
      color: getColour("error"),
      timestamp: new Date()
    }))

    // Logs when a role is set to be assignable
    .on("assignableRoleAdd", (guild, user, role) => trySendLog(guild, "assignableRoleAdd", {
      description: `**${role.name}** was set to be assignable.`,
      author: {
        name: `${format.tag(user, false)} made a role assignable.`,
        icon_url: user.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "SetAssignable",
      },
      color: getColour("success"),
      timestamp: new Date()
    }))

    // Logs when a role is unset to be assignable
    .on("assignableRoleRemove", (guild, user, role) => trySendLog(guild, "assignableRoleRemove", {
      description: `**${role.name}** was removed from the assignable roles.`,
      author: {
        name: `${format.tag(user, false)} removed an assignable role.`,
        icon_url: user.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "UnsetAssignable",
      },
      color: getColour("error"),
      timestamp: new Date()
    }))

    // Logs when a member assigns a role to themselves
    .on("memberAssign", async (guild, member, role) => {
      let channel = await canSendLog(guild, "memberAssign");
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          description: `The **${role}** role was added to them.`,
          author: {
            name: `${format.tag(member, false)} assigned a role.`,
            icon_url: member.avatarURL,
          },
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "Assign",
          },
          color: getColour("general"),
          timestamp: new Date()
        }
      }).catch(() => {});
    })

    // Logs when a member removes a role from themselves
    .on("memberUnassign", async (guild, member, role) => {
      let channel = await canSendLog(guild, "memberUnassign");
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          description: `The **${role}** role was removed from them.`,
          author: {
            name: `${format.tag(member, false)} unassigned a role.`,
            icon_url: member.avatarURL,
          },
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "Unassign",
          },
          color: getColour("general"),
          timestamp: new Date()
        }
      }).catch(() => {});
    })

    /*
      Bot functionality logging
      Logs commandDisable, commandEnable, commandCreate, commandRemove, guildPrefixChange
    */

    // Logs when a command is disabled
    .on("commandDisable", (guild, command, user) => trySendLog(guild, "commandDisable", {
      description: `**${command}** was disabled.`,
      author: {
        name: `${format.tag(user, false)} disabled a command.`,
        icon_url: user.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "Disable",
      },
      color: getColour("error"),
      timestamp: new Date()
    }))

    // Logs when a command is enabled
    .on("commandEnable", (guild, command, user) => trySendLog(guild, "commandEnable", {
      description: `**${command}** was enabled.`,
      author: {
        name: `${format.tag(user, false)} enabled a command.`,
        icon_url: user.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "Enable",
      },
      color: getColour("success"),
      timestamp: new Date()
    }))

    // Logs when a custom command gets created
    .on("commandCreate", async (guild, member, command) => {
      let channel = await canSendLog(guild, "commandCreate");
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          description: `Custom command **${command}** created.`,
          author: {
            name: `Custom command created by ${format.tag(member, false)}.`,
            icon_url: member.avatarURL,
          },
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "CreateCommand",
          },
          color: getColour("success"),
          timestamp: new Date()
        }
      }).catch(() => {});
    })

    // Logs when a custom command gets removed
    .on("commandRemove", async (guild, member, command) => {
      let channel = await canSendLog(guild, "commandRemove");
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          description: `Custom command **${command}** removed.`,
          author: {
            name: `Custom command removed by ${format.tag(member, false)}.`,
            icon_url: member.avatarURL,
          },
          footer: {
            icon_url: bot.user.dynamicAvatarURL("png", 1024),
            text: "RemoveCommand",
          },
          color: getColour("error"),
          timestamp: new Date()
        }
      }).catch(() => {});
    })

    // Logs when the prefix is changed
    .on("guildPrefixChange", (guild, prefix, changerguy) => trySendLog(guild, "guildPrefixChange", {
      description: `My prefix was changed to **${prefix}**.`,
      author: {
        name: `${format.tag(changerguy, false)} changed the prefix.`,
        icon_url: changerguy.avatarURL,
      },
      footer: {
        icon_url: bot.user.dynamicAvatarURL("png", 1024),
        text: "PrefixChange",
      },
      color: getColour("general"),
      timestamp: new Date()
    }));
};
