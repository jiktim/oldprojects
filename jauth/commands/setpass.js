const aes256 = require("aes256");
const embed = require("../utils/Embed");
const waitFor = require("../utils/Wait");
const check = require("../utils/Check");

module.exports = async (msg, args, bot) => {
  // Gets the author from the DB
  let user = await bot.db.table("users").get(msg.author.id);
  // Gets the DM channel
  let DMChannel = await msg.author.getDMChannel();
  // Sends a message prompting to set their master password
  let dmsg = await DMChannel.createMessage(embed("🔒 Master Password", "You have **30 seconds** to respond with your desired password.", "general")).catch(err => {
    msg.channel.createMessage(embed("❌ Error", "Please enable DMs.", "general"));
  });
  if (!dmsg) return;
  if (msg.channel.type != "1") msg.channel.createMessage(embed("🔒 Set Password", "I've DMd you instructions on how to set a master password.", "general"));
  try {
    // Sets a timeout of 30 seconds
    let [resp] = await waitFor("messageCreate", 30000, m => {
      // Returns if it isn't a DM channel
      if (m.channel.id != DMChannel.id) return false;
      // Returns if it isn't sent by the original author
      if (m.author.id != msg.author.id) return false;
      // Detects weak passwords & prompts user's to set a stronger one
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.exec(m.content) === null) {
        m.channel.createMessage(embed("🔓 Weak Password", "Your password **must have at least** 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and must be more than 8 characters long.", "error"));
      } else {
        return true;
      }
    }, bot);
    // Encrypts the test string with AES256
    let teststr = aes256.encrypt(resp.content, "Test string");
    // Inserts the data into the DB
    await bot.db.table("users").insert({
      id: msg.author.id,
      teststr: teststr
    });
    // Sends a success embed
    msg.channel.createMessage(embed("🔐 Password Set", `Encrypted string`, "general"));
  } catch (err) {
    // If the response timed out, send an error message
    if (err === "timeout") DMChannel.createMessage(embed("Error", "You failed to respond in **30 seconds**.", "error"));
    else {
      DMChannel.createMessage("❌ Error", err, "error");
      console.log(err);
    }
    return;
  }
};
