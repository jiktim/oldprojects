
module.exports = function(msg, clientArg, args) {
  if (args) {
  if (msg.mentions[0]) {
      const mentiondata = {
  "embed": {
    "description": msg.mentions[0].username+"#"+msg.mentions[0].discriminator,
    "color": 16773120,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~avatar"
    },
    "image": {
      "url": msg.mentions[0].avatarURL
    }
  }
};
msg.channel.createMessage(mentiondata);
  } else {
    try {
      var u = msg.channel.guild.members.find(xd => xd.username.toLowerCase() == args.toLowerCase())
          const namedata = {
  "embed": {
    "description": u.username+"#"+u.discriminator,
    "color": 16773120,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~avatar"
    },
    "image": {
      "url": u.user.avatarURL
    }
  }
};
msg.channel.createMessage(namedata);
    } catch (err) {
      msg.channel.createMessage("Couldnt find the user!")
    }
  }
  } else {
          var u = msg.member;
          const namedata = {
  "embed": {
    "description": u.username+"#"+u.discriminator,
    "color": 16773120,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~avatar"
    },
    "image": {
      "url": u.user.dynamicAvatarURL("png", 2048)
    }
  }
};
msg.channel.createMessage(namedata);
  }
};