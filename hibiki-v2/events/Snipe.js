/*
  Hibiki Snipe Event

  This looks for deleted messages and saves
  them to the snipe cache if applicable.
*/

const Event = require("../lib/Event");

// Sets the Snipe event
class sniper extends Event {
  constructor(...args) {
    super(...args, {
      name: "messageDelete",
    });
  }

  async run(msg) {
    // Handler for if the message isn't cached
    if ((!msg.attachments || msg.attachments[0] == undefined) && (!msg.content || !msg)) return;
    // Doesn't set snipe data if the message has an invite
    if (/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|list)|discordapp\.com\/invite)\/.+[a-z]/.test(msg.content)) return;
    // Sets the latest deleted message & the embed's content
    this.bot.snipeData[msg.channel.id] = {
      id: msg.channel.id,
      content: msg.content,
      author: `${msg.author.username}#${msg.author.discriminator}`,
      authorpfp: msg.author.dynamicAvatarURL(null, 1024),
      timestamp: msg.timestamp,
      msgid: msg.id,
      attachment: msg.attachments[0] != undefined && msg.attachments[0].proxy_url != undefined ? msg.attachments[0].proxy_url : undefined,
    };
  }
}

module.exports = sniper;
