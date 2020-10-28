var os = require('os');
module.exports = function(param, bot, args) {
  const toHHMMSS = seconds => { //convert to HH:MM:SS
    var secNum = parseInt(seconds, 10); // don't forget the second param
    var hours = Math.floor(secNum / 3600);
    var minutes = Math.floor((secNum - (hours * 3600)) / 60);
    seconds = secNum - (hours * 3600) - (minutes * 60);

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return hours + ":" + minutes + ":" + seconds;
  };
  var time = toHHMMSS(process.uptime());
  const data = {
    "embed": {
      "title": "About the bot",
      "color": 16711680,
      "timestamp": new Date(),
      "footer": {
        "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
        "text": "~about"
      },
      "author": {
        "name": "Megumin!",
        "url": "https://discordapp.com",
        "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png"
      },
      "fields": [
        {
          "name": "Guilds",
          "value": "**```prolog\n"+bot.guilds.size+"\n```**"
        },{
          "name": "Bot version",
          "value": "**```prolog\n"+global.version+"\n```**"
        },
        {
          "name": "Users",
          "value": "**```prolog\n"+bot.users.size+"\n```**"
        },
        {
          "name": "Uptime",
          "value": "**```prolog\n"+time+"\n```**"
        },
        {
          "name": "Memory",
          "value": "**```prolog\n"+os.freemem()/1000000+" MB / "+os.totalmem()/1000000+" MB\n```**"
        },
        {
          "name": "Streams",
          "value": "**```prolog\n"+bot.voiceConnections.size+"\n```**"
        }
      ]
    }
  };
    param.channel.createMessage(data); // send embed
}