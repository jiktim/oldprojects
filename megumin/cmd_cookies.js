module.exports = function(msg, bot, args) {
  var fs = require('fs')
  global.coins = JSON.parse(fs.readFileSync("./coins.json", "utf8"))
  const data = {
  "embed": {
    "title": "**"+msg.author.username+"#"+msg.author.discriminator+"** has **"+global.coins[msg.author.id].cookies+"** cookies! :cookie:",
    "color": 7951687,
    "timestamp": new Date(),
    "footer": {
      "text": "~cookies"
    }
  }
};
msg.channel.createMessage(data);
}
