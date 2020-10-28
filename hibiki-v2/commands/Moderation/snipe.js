const Command = require("../../lib/Command");

class snipeCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gets the latest deleted message.",
      aliases: ["deletedmsg", "snipemsg"],
      cooldown: 2000,
      requiredperms: "manageMessages",
      staff: true,
    });
  }

  run(msg) {
    // Sets the snipeMsg
    let snipeMsg = this.bot.snipeData[msg.channel.id];
    // Handler for if there's no message
    if (!snipeMsg) return msg.channel.createMessage(this.bot.embed("❌ Error", "No message to snipe.", "error"));

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        description: snipeMsg.content,
        author: {
          name: snipeMsg.author,
          icon_url: snipeMsg.authorpfp,
        },
        footer: {
          icon_url: this.bot.user.dynamicAvatarURL("png", 1024),
          text: `ID: ${snipeMsg.msgid}`,
        },
        image: {
          url: snipeMsg.attachment
        },
        color: require("../../utils/Colour")("error"),
        timestamp: new Date(snipeMsg.timestamp),
      }
    });
  }
}

module.exports = snipeCommand;
