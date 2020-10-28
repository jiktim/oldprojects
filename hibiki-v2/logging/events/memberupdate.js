/*
  Hibiki MemberUpdate Logger

  This logs whenevr a member joins or leaves
  a server. It also handles the leavejoin message
  functionality, aswell as automatically remuting
  any users that left after being punished.
*/

const format = require("../../utils/Format.js");
const Logging = require("../lib/logger");
const getColour = require("../../utils/Colour");

module.exports = (bot, db) => {
  const loggingFacility = new Logging(db);
  // Checks to see if able to log
  const canSendLog = async (guild, event) => {
    // Looks for the server's loggingchannel
    const channel = await loggingFacility.getLoggingChannel(guild);
    // Returns the channel
    if (guild.channels.has(channel)) return channel;
  };

  // Handles when a user joins a server
  bot.on("guildMemberAdd", async function(guild, member) {
      // Returns if the member isn't cached etc
      if ((!member.username || !member.user) && !member.user.username) return;
      else if (!member.username && member.user && member.user.username) member = member.user;
      // Posts to the logging channel
      bot.emit("loggingMemberAdd", guild, member);
      // Sets & reads the DB for the guild ID
      const guildConfig = await this.db.table("guildconfig").get(guild.id);
      const mutedb = await this.db.table("muteCache");
      const mute = mutedb.find(m => m.member == member.id && m.guild == guild.id);
      // Remutes a user if they left after being muted
      if (mute && guildConfig.muted) {
        // Adds the muted role to the user & logs it to the audit logs
        await member.addRole(guildConfig.muted, `Rejoined after being muted`).catch(() => {});
      }

      // Returns if it isn't setup
      if (!guildConfig || !guildConfig.leavejoin) return;
      // Sets leavejoin.
      let leavejoin = guildConfig.leavejoin;
      // If leavejoin isn't setup, do nothing
      if (!leavejoin) return;
      // Sets logchannel as the leavejoin channel
      let logchannel = guild.channels.find(o => o.id == leavejoin);
      // If leavejoin isn't setup, do nothing
      if (!logchannel) return;
      // Handler for custom join messages
      let joinMessage = `**${format.tag(member, false)}** has joined **${guild.name}**.`;
      if (guildConfig.joinMessage && guildConfig.joinMessage.length < 2000) {
        joinMessage = guildConfig.joinMessage;
        joinMessage = joinMessage.replace("{member}", `**${format.tag(member, false)}**`);
        joinMessage = joinMessage.replace("{membercount}", `**${guild.memberCount}**`);
        joinMessage = joinMessage.replace("{guildname}", `**${guild.name}**`);
      }

      // Sends the join message to the channel set to leavejoin
      logchannel.createMessage({
        embed: {
          title: "👋 Member Joined",
          description: joinMessage,
          color: require("../../utils/Colour")("success"),
          footer: {
            text: `ID: ${member.id}`,
            icon_url: member.avatarURL,
          },
        },
      }).catch(() => {});
    })

    .on("guildMemberRemove", async function(guild, member) {
      if ((!member.username || !member.user) && !member.user.username) return;
      // maybe the member isnt cached but the user is
      else if (!member.username && member.user && member.user.username) member = member.user;
      // Posts to the logging channel
      bot.emit("loggingMemberDelete", guild, member);
      // Sets & reads the DB for the guild ID
      const guildConfig = await this.db.table("guildconfig").get(guild.id);
      if (!guildConfig || !guildConfig.leavejoin) return;
      // If the guild hasnt setup anything, do nothing
      if (!guildConfig) return;
      // Sets leavejoin.
      let leavejoin = guildConfig.leavejoin;
      // If leavejoin isn't setup, do nothing
      if (!leavejoin) return;
      // Sets logchannel as the leavejoin channel
      let logchannel = guild.channels.find(o => o.id == leavejoin);
      // If leavejoin isn't setup, do nothing.
      if (!logchannel) return;

      // Handler for custom leave messages
      let leaveMessage = `**${format.tag(member, false)}** has left **${guild.name}**.`;
      if (guildConfig.leaveMessage && guildConfig.leaveMessage.length < 2000) {
        leaveMessage = guildConfig.leaveMessage;
        leaveMessage = leaveMessage.replace("{member}", `**${format.tag(member, false)}**`);
        leaveMessage = leaveMessage.replace("{membercount}", `**${guild.memberCount}**`);
        leaveMessage = leaveMessage.replace("{guildname}", `**${guild.name}**`);
      }

      // Sends the leave message to the channel set to leavejoin
      logchannel.createMessage({
        embed: {
          title: "👋 Member Left",
          description: leaveMessage,
          footer: {
            text: `ID: ${member.id}`,
            icon_url: member.avatarURL,
          },
          color: require("../../utils/Colour")("error"),
        },
      }).catch(() => {});
    });

  // Logs when a member joins
  bot.on("loggingMemberAdd", async (guild, member) => {
      function compareInvites(current, saved) {
        let i = 0;
        for (i = 0; i < current.length; i++) {
          if (current[i] !== saved[i]) return current[i];
        }
        return null;
      }
      const channel = await canSendLog(guild, "loggingMemberAdd");
      if (!channel) return;
      let embed = {
        embed: {
          author: {
            name: `${format.tag(member, false)} joined`,
            icon_url: member.avatarURL,
          },
          thumbnail: {
            url: member.user ? member.user.dynamicAvatarURL(null, 1024) : member.dynamicAvatarURL(null, 1024),
          },
          fields: [{
            name: "User ID",
            value: member.id,
            inline: true,
          }, {
            name: "Joined On",
            value: format.prettyDate(member.joinedAt),
            inline: true,
          }, {
            name: "Creation Date",
            value: format.prettyDate(member.user.createdAt),
            inline: true,
          }, {
            name: "Account Age",
            value: `**${Math.floor((new Date() - member.user.createdAt) / 86400000)}** days old`,
            inline: true,
          }],
          footer: {
            icon_url: guild.iconURL || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
            text: `${guild.name} now has ${guild.memberCount} members`,
          },
          color: getColour("success"),
          timestamp: new Date()
        }
      };

      setTimeout(async () => {
        // Gets the guild invites
        let guildInvites = await guild.getInvites().catch(() => {});
        // Gets the cached invites
        let cachedInvites = bot.invitecache[guild.id];
        if (cachedInvites && guildInvites) {
          // Maps the invites' uses
          guildInvites = guildInvites.map(invite => `${invite.code}|${invite.hasOwnProperty("uses") ? invite.uses : "Infinite"}`);
          const usedInviteStr = compareInvites(guildInvites, cachedInvites);
          // Pushes if a vanity URL was used
          if (!usedInviteStr) {
            if (guild.features.includes("VANITY_URL")) {
              embed.embed.fields.push({
                name: "Invite Used",
                value: "Vanity URL",
                inline: true
              });
            }
          }

          // Pushes a field if it's a bot
          if (member.bot) {
            embed.embed.fields.push({
              name: "Invite Used",
              value: "OAuth (Bot)",
              inline: true
            });
          }

          // Pushes if invite & not bot
          if (usedInviteStr && !member.bot) {
            const split = usedInviteStr.split("|");
            const usedInvite = {
              code: split[0],
              uses: split[1]
            };

            // Pushes what invite was used
            embed.embed.fields.push({
              name: "Invite Used",
              value: `${usedInvite.code}`,
              inline: true
            });

            // Pushes # of invite uses
            embed.embed.fields.push({
              name: "Invite Uses",
              value: `${usedInvite.uses} uses`,
              inline: true
            });
          }
          // Caches the new invites
          bot.invitecache[guild.id] = guildInvites;
        }
        bot.createMessage(channel, embed).catch(() => {});
      }, 1000);
    })

    // Logs when a member leaves
    .on("loggingMemberDelete", async (guild, member) => {
      const channel = await canSendLog(guild, "loggingMemberDelete");
      if (!channel) return;
      bot.createMessage(channel, {
        embed: {
          author: {
            name: `${format.tag(member, false)} left`,
            icon_url: member.avatarURL,
          },
          thumbnail: {
            url: member.user ? member.user.dynamicAvatarURL(null, 1024) : member.dynamicAvatarURL(null, 1024),
          },
          fields: [{
            name: "User ID",
            value: member.id,
            inline: true,
          }, {
            name: "Joined On",
            value: format.prettyDate(member.joinedAt),
            inline: true,
          }, {
            name: "Creation Date",
            value: format.prettyDate(member.user.createdAt),
            inline: true,
          }, {
            name: "Account Age",
            value: `**${Math.floor((new Date() - member.user.createdAt) / 86400000)}** days old`,
            inline: true,
          }],
          footer: {
            icon_url: guild.iconURL || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
            text: `${guild.name} now has ${guild.memberCount} members`,
          },
          color: getColour("error"),
          timestamp: new Date()
        }
      }).catch(() => {});
    });
};
