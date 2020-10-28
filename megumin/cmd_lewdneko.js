var request = require('request');
module.exports = function(param, args) {
  if(param.channel.nsfw) {
    request('https://nekos.life/api/lewd/neko', function(error, response, body) {
        let json = JSON.parse(body); // parsing
        let result = json.neko; // omg lewd neko omg :o
        const data = { // define embed thing
            "embed": {
                "title": "Here is a lewd neko picture **OH MY HOW LEWD**:",
                "color": 13631743,
                "image": {
                    "url": result
                }
            }
        }
        param.channel.createMessage(data); // send embed
    
    });
  } else {
param.channel.createMessage('This is not an NSFW channel :smiley: (you can use the neko command to get a non lewd neko)');
  }
  }