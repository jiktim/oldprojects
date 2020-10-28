const aes256 = require("aes256");
const twofactor = require("node-2fa");
const embed = require("../utils/Embed");
const waitFor = require("../utils/Wait");
const check = require("../utils/Check");

module.exports = async (msg, args, bot) => {
  // Gets the user from the DB
  let user = await bot.db.table("users").get(msg.author.id);

  // Handler for if the user hasn't set a password
  if (!user.teststr) {
    msg.channel.createMessage(embed("❌ Error", "You haven't set a master password, yet. Run `~setpass` to set one.", "error"));
    return;
  }

  // Gets the DM channel
  let DMChannel = await msg.author.getDMChannel();

  // Sends a message telling the user to check their DMs
  let dmsg = await DMChannel.createMessage(embed("🔒 Confirm password", "You have **30 seconds** to respond with your jAuth master password.", "general")).catch(err => {
    msg.channel.createMessage(embed("❌ Error", "Please enable DMs.", "general"));
  });
  if (!dmsg) return;
  if (msg.channel.type != "1") msg.channel.createMessage(embed("🔒 Add key", "I've DMd you instructions on how to add keys.", "general"));
  let resp = await check(teststr, DMChannel, bot);
  if(!resp.fail) {
    let [key] = await waitFor("messageCreate", 30000, m => {
      // Returns if it isn't a DM channel
      if (m.channel.id != DMChannel.id) return false;
      // Returns if it isn't sent by the original author
      if (m.author.id != msg.author.id) return false;
    });
  }
};
