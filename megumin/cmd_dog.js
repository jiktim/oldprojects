var request = require('request');
module.exports = function(param, clientArg, args) { // it sends cats
    request('https://random.dog/woof', function(error, response, body) {
        console.log(body)
      param.channel.createMessage("ERROR: Please try again!")
      var lol = "https://random.dog/"+body
      console.log(lol)
    const data = {
  "embed": {
    "content": "\u200b",
    "title": ":dog: Here is your dog!",
    "color": 9123701,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~dog"
    },
    "image": {
      "url": lol
    }
  }
};
        
    param.channel.createMessage(":dog: Looking for a dog! (wait)").then(m => {m.edit("\u200b");m.edit(data)}); 
      });
};  