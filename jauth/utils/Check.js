let aes256 = require("aes256");
let embed = require("./Embed");
let waitFor = require("./Wait");

module.exports = async (teststr, DMChannel, bot, maxTries = 2) => {
  // Sets the tries to 0
  let tries = 0;
  try {
    let fail = false;
    // Waits for a response, timeouts after 30 seconds
    let [resp] = await waitFor("messageCreate", 30000, m => {
      // If the channel ID isn't a DM channel, return
      if (m.channel.id != DMChannel.id) return false;
      // If nothing was sent, return
      if (!m.content.length) return;
      // If the user has hit their max tries
      if (tries == maxTries) {
        fail = true;
        // DMChannel.createMessage(embed("❌ Error", `You failed to enter your password in **${maxTries + 1}** tries.`));
        return true;
      }
      // Sets the decrypted string
      let decrypted = aes256.decrypt(m.content, teststr);
      if (decrypted === "Test string") {
        fail = false;
        return true;
      }
      // Tells the user how many tries they have left if they entered the wrong password
      DMChannel.createMessage(embed("❌ Error", `Wrong password. You have **${maxTries - tries}** attempts left.`));
      tries++;
      return false;
    }, bot);
    return {
      fail: fail,
      content: resp.content
    };
  } catch (err) {
    // if (err === "timeout") DMChannel.createMessage(embed("❗️ Error", "You failed to respond in **30** seconds.", "error"));
    // DMChannel.createMessage("❗️ Internal error", err, "error");
    // console.log(err);
    return;
  }
};
