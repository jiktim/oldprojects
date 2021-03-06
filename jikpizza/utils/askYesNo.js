module.exports = async (bot, msg, retMsg = false) => {
  try {
    // Sets the response message.
    const [resp] = await bot.waitForEvent("messageCreate", 10000, m => {
      if (m.author.id != msg.author.id) return false;
      if (m.channel.id != msg.channel.id) return false;
      // Checks for a response of yes.
      if (m.content.toLowerCase() != "y" && m.content.toLowerCase() != "yes" && m.content.toLowerCase() != "n" && m.content.toLowerCase() != "no") return false;
      return true;
    });
    // Checks for a response of yes.
    if (resp.content.toLowerCase() === "y" || resp.content.toLowerCase() === "yes") {
      return retMsg ? {
        response: true,
        msg: resp,
      } : true;
      // Sets the response to no if it isn't yes.
    } else {
      return retMsg ? {
        response: false,
        msg: resp,
      } : false;
    }
  } catch (_) {
    return retMsg ? {
      response: false,
      msg: null,
    } : false;
  }
};
