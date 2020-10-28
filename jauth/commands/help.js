const embed = require("../utils/Embed");

module.exports = async (msg, args, bot) => {
  // Sends a message containing all of the commands
  await msg.channel.createMessage(embed("📚 Commands", `${Object.keys(bot.cmds).map(cmd => `\`${cmd}\``).join(", ")}`, "general"));
};
