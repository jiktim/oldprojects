module.exports = function(param,clientArg, args) { // it sends help ok
    clientArg.getDMChannel(param.author.id).then(dm => {
                param.channel.createMessage(param.author.mention + ", Sliding into your dms! :wink:");
                return clientArg.createMessage(dm.id, {
  "embed": {
    "description": "we reccomend reading the commands in our website **https://jiktim.github.io/megumin/**\nIf there is <> next to commandit means that input is required\nCommands:",
    "color": 16711680,
    "timestamp": "2018-09-01T23:36:06.008Z",
    "footer": {
      "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
      "text": "~help"
    },
    "fields": [
      {
        "name": "kick <person> <reason>",
        "value": "Kicks whoever is mentioned!"
      },
      {
        "name": "ban <person> <reason>",
        "value": "Bans whoever is mentioner!"
      },
      {
        "name": "play <song>",
        "value": ":musical_note: Plays music!"
      },
      {
        "name": "skip",
        "value": "Skips the currently playing song!"
      },
      {
        "name": "cat",
        "value": ":cat: Sends a random image of a cat!"
      },
      {
        "name": "8ball",
        "value": ":8ball: Predicts your future!"
      },
      {
        "name": "cowsay <message>",
        "value": ":cow: Moo!"
      },
      {
        "name": "radio",
        "value": ":radio: Plays jpop from listen.moe!"
      },
      {
        "name": "ping",
        "value": ":ping_pong: pong!"
      },
      {
        "name": "uptime",
        "value": ":clock1130: Tells you how much time the bot has been running for!"
      },
      {
        "name": "urban <word>",
        "value": "Looks up the urban dictionary!"
      },
      {
        "name": "about",
        "value": "Gives you a bunch of info about the bot!"
      }, {
        "name": "avatar <input>",
        "value": "Gives you the user's avatar"
      }, {
        "name": "guildinfo",
        "value": "Gives you a bunch on info about the guild you are in"
      }, {
        "name": "dog",
        "value": ":dog: Gives you a random picture of a dog!"
      }, {
        "name": "megumin",
        "value": "Sends you a random picture of me! ^^"
      }
    ]
  }
                });
            });
}