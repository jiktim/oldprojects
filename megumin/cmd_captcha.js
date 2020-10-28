var request = require('request')
module.exports = function(msg, clientArg, args) {
    if (args) {
        if (msg.mentions[0]) {
            var u = msg.mentions[0]
            request('https://nekobot.xyz/api/imagegen?type=captcha&username='+u.username+'&url='+u.avatarURL, function(error, response, body) {
                let json = JSON.parse(body);
                var u = msg.mentions[0]
                msg.channel.createMessage({  "embed": {
    "color": 11317149,
    "footer": {
      "text": "~captcha"
    },
    "image": {
      "url": json.message
    }
  }});

            });

        } else {
            try {
                var u = msg.channel.guild.members.find(xd => xd.username.toLowerCase() == args.toLowerCase())
                request('https://nekobot.xyz/api/imagegen?type=captcha&username='+u.username+'&url='+u.avatarURL, function(error, response, body) {
                    let json = JSON.parse(body);
                    var u = msg.channel.guild.members.find(xd => xd.username.toLowerCase() == args.toLowerCase())
                    msg.channel.createMessage({  "embed": {
    "color": 11317149,
    "footer": {
      "text": "~captcha"
    },
    "image": {
      "url": json.message
    }
  }});
                });

            } catch (err) {
                msg.channel.createMessage("Couldnt find the user!")
            }
        }
    } else {
        var u = msg.author;
        request('https://nekobot.xyz/api/imagegen?type=captcha&username='+u.username+'&url='+u.avatarURL, function(error, response, body) {
            let json = JSON.parse(body);
            msg.channel.createMessage({  "embed": {
    "color": 11317149,
    "footer": {
      "text": "~captcha"
    },
    "image": {
      "url": json.message
    }
  }});
        });
    }
};