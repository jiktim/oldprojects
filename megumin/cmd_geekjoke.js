var request = require('request');
module.exports = function(param, clientArg, args) { // it sends cats
    request('https://geek-jokes.sameerkumar.website/api', function(error, response, body) {
      /*let owo = body.replace("<br>", "\n")
      let uwu = owo.replace('&quot;', '"') guess not*/
    console.log(body)
      const data = {
  "embed": {
    "description": "**"+body+"**",
    "color": 9123701,

  }
};
    param.channel.createMessage(data);
    });
};