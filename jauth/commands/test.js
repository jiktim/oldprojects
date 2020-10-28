let embed = require("../utils/Embed");
let testpass = require("../utils/Check");

module.exports = async (msg, args, bot) => {
  // Gets the DM channel of the user
  let DMChannel = await msg.author.getDMChannel();
  let user = await bot.db.table("users").get(msg.author.id);
  if(!user) {
    msg.channel.createMessage(embed("❌ Error", "You haven't set a password please run \`~setpass\`", "error"));
    return;
  }
  let dmsg = await DMChannel.createMessage(embed("🔑 Enter password", "You have **3** attempts"));
  if(!dmsg) {
    msg.channel.createMessage(embed("❌ Error", "Please enable DMs.", "general"));
    return;
  }
  let resp = await testpass(user.teststr, DMChannel, bot);
  console.log(resp);
  if(resp.fail) {
    msg.channel.createMessage("u failed");
    return;
  }
  msg.channel.createMessage("success?");
};
