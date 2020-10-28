/*
  Hibiki EasyTranslate Event

  This looks for messages reacted to with a valid flag, and
  attempts to translate them using the Google Translate API.
*/

const Event = require("../lib/Event");
const fetch = require("node-fetch");

// Sets the EasyTranslate event
class easyTranslate extends Event {
  constructor(...args) {
    super(...args, {
      name: "messageReactionAdd",
    });
  }

  async run(msg, emoji) {
    // Returns if the channel isn't a normal text channel
    if (!msg.channel || msg.channel.type != 0) return;
    // Converts emojis into unicode
    const toUni = function(str) {
      if (str.length < 4)
        return str.codePointAt(0).toString(16);
      return `${str.codePointAt(0).toString(16)}-${str.codePointAt(2).toString(16)}`;
    };

    // If no content is found or it's not cached
    if (!msg.content) return;
    // Emoji to unicode
    let [letter1, letter2] = toUni(emoji.name).split("-");
    // Parses the emoji
    letter1 = parseInt(letter1, 16) - 127397;
    letter2 = parseInt(letter2, 16) - 127397;
    let lang = String.fromCharCode(letter1) + String.fromCharCode(letter2);
    if (!/[A-Z]{2}/.test(lang)) return;
    // Fixes some other languages
    if (lang == "JP") lang = "JA";
    else if (lang == "SE") lang = "SV";
    else if (lang == "BR") lang = "PT";
    // Gets the guildConfig
    let cfg = await this.bot.db.table("guildconfig").get(msg.guild.id);
    // Returns if easyTranslate isn't setup or doesn't exist
    if (!cfg || !cfg.easyTranslate) return;
    // Sets a timeout for EasyTranslate to avoid spam
    const cooldown = this.bot.cooldowns.get(`easytranslate${msg.channel.id}`);
    // Returns if there's a cooldown
    if (cooldown) return;
    // Sets the cooldown to 7 seconds
    this.bot.cooldowns.set(`easytranslate${msg.channel.id}`, new Date());
    setTimeout(() => { this.bot.cooldowns.delete(`easytranslate${msg.channel.id}`); }, 7000);
    // Fetches the API
    let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(msg.content)}`);
    let result = await res.json().catch(() => {});
    // Return if theres no result
    if (!result || !result[0] || !result[0][0]) return;
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("🌐 EasyTranslate", `${result[0][0][1]} **(${result[2].toUpperCase()})** => ${result[0][0][0]} **(${lang})**`, "general")).catch(() => {});
  }
}

module.exports = easyTranslate;
