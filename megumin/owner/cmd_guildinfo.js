module.exports = function(param, clientArg, args) {
global.voice = 0; // a very stupid way to find how much of channels are voice channels but if it works, it works
global.text = 0;
global.bot = 0;
function info(owo) {
guild.channels.forEach(lul => {if (lul.type == 2) {global.voice++}})
guild.channels.forEach(lul => {if (lul.type == 0) {global.text++}})
guild.members.forEach(ow => {if(ow.bot == true) {global.bot++}})
var verifitext = "ERROR :O"
var guildfa = "ERROR :O"
if (guild.verificationLevel == 0) {verifitext = "None"}
if (guild.verificationLevel == 1) {verifitext = "Low"}
if (guild.verificationLevel == 2) {verifitext = "Medium"}
if (guild.verificationLevel == 3) {verifitext = "(╯°□°）╯︵ ┻━┻"}
if (guild.verificationLevel == 4) {verifitext = "┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻"}
  var ownername = guild.members.find(ow => ow.id == guild.ownerID)
  if(guild.mfaLevel == 1) {
  guildfa = "True"
  } else {
    guildfa = "False"
  }
const data = {
  "embed": {
    "title": guild.name,
    "description": "​",
    "color": 12911432,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~guildinfo"
    },
    "thumbnail": {
      "url": guild.iconURL
    },
    "fields": [
      {
        "name": "Members:",
        "value": guild.members.size-global.bot+" humans, "+global.bot+" bots",
        "inline": true
      },
      {
        "name": "Channels:",
        "value": global.voice+" voice, "+global.text+" text",
        "inline": true
      },
      {
        "name": "Created at:",
        "value": new Date(guild.createdAt),
        "inline": true
      },
      {
        "name": "Large:",
        "value": guild.large,
        "inline": true
      },
      {
        "name": "Roles:",
        "value": guild.roles.size ,
        "inline": true
      },
      {
        "name": "Verification Level:",
        "value": verifitext,
        "inline": true
      },
      {
        "name": "ID:",
        "value": guild.id,
        "inline": true
      },
      {
        "name": "Region:",
        "value": guild.region,
        "inline": true
      },
      {
        "name": "Owner:",
        "value": ownername.username+"#"+ownername.discriminator,
        "inline": true
      },
      {
        "name": "2FA:",
        "value": guildfa,
        "inline": true
      }
    ]
  }
};
  param.channel.createMessage(data);
}
  if (args) {
var guild = clientArg.guilds.find(gd => gd.id == args) // find guild
if (guild != undefined) { //check if guild is found
  info()
} else {
var guild = clientArg.guilds.find(gd => gd.name.toLowerCase() == args)
info()
}

  } else {
    var guild = param.channel.guild;
  guild.channels.forEach(lul => {if (lul.type == 2) {global.voice++}})
guild.channels.forEach(lul => {if (lul.type == 0) {global.text++}})
var verifitext = "ERROR :O"
var guildfa = "ERROR :O"
var ownername = guild.members.find(ow => ow.id == guild.ownerID)
if (guild.verificationLevel == 0) {verifitext = "None"}
if (guild.verificationLevel == 1) {verifitext = "Low"}
if (guild.verificationLevel == 2) {verifitext = "Medium"}
if (guild.verificationLevel == 3) {verifitext = "(╯°□°）╯︵ ┻━┻"}
if (guild.verificationLevel == 4) {verifitext = "┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻"}
guild.members.forEach(ow => {if(ow.bot == true) {global.bot++}})
  if(guild.mfaLevel == 1) {
  guildfa = "True"
  } else {
    guildfa = "False"
  }
const data = {
  "embed": {
    "title": guild.name,
    "description": "​",
    "color": 12911432,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~guildinfo"
    },
    "thumbnail": {
      "url": guild.iconURL
    },
    "fields": [
      {
        "name": "Members:",
        "value": guild.members.size-global.bot+" humans, "+global.bot+" bots",
        "inline": true
      },
      {
        "name": "Channels:",
        "value": global.voice+" voice, "+global.text+" text",
        "inline": true
      },
      {
        "name": "Created at:",
        "value": new Date(guild.createdAt),
        "inline": true
      },
      {
        "name": "Large:",
        "value": guild.large,
        "inline": true
      },
      {
        "name": "Roles:",
        "value": guild.roles.size ,
        "inline": true
      },
      {
        "name": "Verification Level:",
        "value": verifitext,
        "inline": true
      },
      {
        "name": "ID:",
        "value": guild.id,
        "inline": true
      },
      {
        "name": "Region:",
        "value": guild.region,
        "inline": true
      },
      {
        "name": "Owner:",
        "value": ownername.username+"#"+ownername.discriminator,
        "inline": true
      },
      {
        "name": "2FA:",
        "value": guildfa,
        "inline": true
      }
    ]
  }
  
};
    param.channel.createMessage(data);
  }
};