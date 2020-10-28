const Command = require("../../lib/Command");
const format = require("../../utils/Format");

class userCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["profile", "uinfo", "userinfo"],
      description: "Displays info about a user.",
      usage: "<@user>",
      cooldown: 3000,
    });
  }

  async run(msg, args) {
    // Checks to see if the author mentioned another user and if that user is valid
    let member = msg.member;
    if (args.length) member = msg.channel.guild.members.find(m => {
      if (m.id == args.join(" ")) return m;
      if (args.join(" ") == `<@${m.id}>`) return m;
      if (args.join(" ") == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) return m;
    }) || msg.member;

    // Finds/trims the user's status
    let playing = member.game && member.game.name.trim() ? member.game.name.trim() : "Nothing";
    // Custom status support
    if (member.game && member.game.type === 4) {
      if (member.game.emoji && member.game.emoji.name && !member.game.emoji.id) playing = `${member.game.emoji.name} ${member.game.state || ""}`;
      else playing = member.game.state;
    }

    let playingname = "";
    // Makes user statuses prettier
    if (member.game) {
      switch (member.game.type) {
        case 0:
          playingname = "Playing";
          break;
        case 1:
          playingname = "Streaming";
          break;
        case 2:
          playingname = "Listening to";
          break;
        case 3:
          playingname = "Watching";
          break;
        case 4:
          playingname = "Custom Status";
          break;
        default:
          playingname = "Unknown";
          break;
      }
    } else playingname = "Playing";

    // Gets the user's nickname
    let usrname = "";
    if (msg.member.nick != undefined) {
      usrname = "Nickname";
    } else {
      usrname = "Username";
    }

    // Reads the marriage index
    const [marriageState] = await this.db.table("marry").getAll(member.id, { index: "marriageIndex" });
    // Reads the monitor DB
    const steamdb = await this.db.table("steammonitor");
    let marryid;
    let monitors = [];
    steamdb.forEach(d => d.uid == member.id ? monitors.push(d) : "");
    // Marriage status
    if (marriageState) marryid = marriageState.id === member.id ? marriageState.marriedTo : marriageState.id;
    // Custom bio
    let usercfg = await this.db.table("userconfig").get(member.id);
    // Strikedb & pointdb
    let strikedb = await this.bot.db.table("strikes"),
      pointdb = await this.bot.db.table("points"),
      cookiedb = await this.bot.db.table("cookies").get(member.id);
    let strikecount = 0,
      pointcount = 0,
      cookiecount;
    // Cookies
    if (cookiedb) cookiecount = cookiedb.amount;
    // Strike count
    strikedb.forEach(s => { if (s.guildId == msg.guild.id && s.receiverId == member.id) strikecount++; });
    // Points
    pointdb.forEach(s => { if (s.guildId == msg.guild.id && s.receiverId == member.id) pointcount++; });

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        description: usercfg && usercfg.bio ? usercfg.bio : null,
        author: {
          icon_url: member.user.dynamicAvatarURL(null, 1024),
          name: format.tag(member, false),
        },
        thumbnail: {
          url: member.user.dynamicAvatarURL(null, 1024),
        },
        fields: [{
          name: usrname,
          value: `${member.nick || member.username}`,
          inline: true,
        }, {
          name: "User ID",
          value: member.id,
          inline: true,
        }, {
          name: "Creation Date",
          value: format.prettyDate(member.createdAt),
          inline: true,
        }, {
          name: "Join Date",
          value: format.prettyDate(member.joinedAt),
          inline: true,
        }, {
          name: "Status",
          value: format.status(member.status) || "Nothing",
          inline: true,
        }, {
          name: playingname,
          value: playing || "Nothing",
          inline: true,
        }, {
          name: "Highest Role",
          value: member.roles.length > 0 ? member.roles.map(r => msg.guild.roles.get(r)).sort((a, b) => b.position - a.position)[0].name : "@everyone",
          inline: true,
        }, {
          name: "Spouse",
          value: marryid ? this.bot.users.find(m => m.id == marryid) ? this.bot.users.find(m => m.id == marryid).username : `<@!${marryid}>` : "Nobody",
          inline: true,
        }, {
          name: "Points",
          value: pointcount,
          inline: true,
        }, {
          name: "Strikes",
          value: strikecount,
          inline: true,
        }, {
          name: "Cookies",
          value: `${Math.floor(cookiecount) || "None"}`,
          inline: true,
        }, {
          name: "Monitoring",
          value: monitors.length > 0 ? monitors.map(m => m.uname).join(", ") : "Nobody",
          inline: true,
        }],
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = userCommand;
