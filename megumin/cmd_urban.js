module.exports = function(param, clientArg, args) { // it sends urban dictionary
if (param.channel.guild != 264445053596991498) {
  var request = require('request');
  request('http://api.urbandictionary.com/v0/define?term=' + encodeURI(args), function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let pack = JSON.parse(body); // parsing stuff
      try {
        const data = {
          "embed": {
            "title": args + " By " + pack.list[1].author,
            "description": pack.list[1].definition,
            "color": 16580352,
            "timestamp": new Date(),
            "footer": {
              "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
              "text": "~urbandict"
            },
            "author": {
              "name": "Megumin!",
              "url": "https://discordapp.com",
              "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png"
            },
            "fields": [{
                "name": ":thumbsdown:",
                "value": pack.list[1].thumbs_down
              },
              {
                "name": ":thumbsup:",
                "value": pack.list[1].thumbs_up
              }
            ]
          }
        };
        param.channel.createMessage(data); // send the stuff
      } catch (no) {
        param.channel.createMessage('\n :x: ' + 'Your word is so fucked up it\'s not even in the urban dictionary lmao, :smiley:'); // error message
      }
    } else if (response.statusCode == 404 || 400) {
      console.log('hmmm ok');
    } else console.log(error);
  });
} else {
  if(param.channel.nsfw) {
  var request = require('request');
  request('http://api.urbandictionary.com/v0/define?term=' + encodeURI(args), function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let pack = JSON.parse(body); // parsing stuff
      try {
        const data = {
          "embed": {
            "title": args + " By " + pack.list[1].author,
            "description": pack.list[1].definition,
            "color": 16580352,
            "timestamp": new Date(),
            "footer": {
              "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
              "text": "~urbandict"
            },
            "author": {
              "name": "Megumin!",
              "url": "https://discordapp.com",
              "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png"
            },
            "fields": [{
                "name": ":thumbsdown:",
                "value": pack.list[1].thumbs_down
              },
              {
                "name": ":thumbsup:",
                "value": pack.list[1].thumbs_up
              }
            ]
          }
        };
        param.channel.createMessage(data); // send the stuff
      } catch (no) {
        param.channel.createMessage('\n :x: ' + 'Your word is so fucked up it\'s not even in the urban dictionary lmao, :smiley:'); // error message
      }
    } else if (response.statusCode == 200 || 400) {
      console.log('hmmm ok');
    } else console.log(error);
  });
  }
}
};
