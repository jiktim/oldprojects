var request = require('request');
module.exports = function(param, clientArg, args) { // it sends cats
    request('http://aws.random.cat//meow', function(error, response, body) {
    let json = JSON.parse(body); // parsing
    let result = json.file; // defining the cat
    const data = {
  "embed": {
    "content": "\u200b",
    "title": "Here is your cat!",
    "color": 9123701,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~cat"
    },
    "image": {
      "url": json.file
    }
  }
};
    param.channel.createMessage(":cat: Looking for a cat! (wait)").then(m => {m.edit("\u200b");m.edit(data)});
    });
};
