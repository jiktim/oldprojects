let embed = require("../utils/Embed");

module.exports = async (msg) => {
  let ping = await msg.channel.createMessage(embed("🏓 Ping!", undefined, "general"));
  ping.edit(embed("🏓 Pong!", `This message took **${ping.timestamp - msg.timestamp}ms** to send.`, "general"));
};
