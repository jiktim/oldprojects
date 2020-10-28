module.exports = function(param, clientArg, args) { // it sends ping
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
  const data = {
  "embed": {
    "title": "​",
    "color": 16711680,
    "timestamp": "2018-08-28T13:52:19.234Z",
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~urbandict" // ur mom gay
    },
    "author": {
      "name": "Megumin!",
      "url": "https://discordapp.com",
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png"
    },
    "fields": [
      {
        "name": "Uptime",
        "value": toHHMMSS(process.uptime())
      }
    ]
  }
};
    param.channel.createMessage(data);
}