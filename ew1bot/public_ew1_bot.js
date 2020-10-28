var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie();
  var prefix = "!";
  var token = "";
  var ownerid = "";
var adminRoleName = "Electronicwiz1 bot Commander";
client.connect({ token: token });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.username);
  console.log("The bot is currently in " + client.Guilds.length + " servers, with " + client.Users.length + " users.");
  setGame("Being a bot - !help");
  client.autoReconnect.enable();
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
if (!e.message.isPrivate){
const role = e.message.guild.roles.find(r => r.name === adminRoleName)
if (role && e.message.member.hasRole(role)) {
 if (e.message.content.match(prefix + "setnick")) {
var word = e.message.content.split(" ");
if (word[0] == prefix + "setnick") {
  var nick = e.message.content.slice(9);
client.User.memberOf(e.message.guild).setNickname(nick);
} 
} else if (e.message.content.match(prefix + "ban")) {
  var word = e.message.content.split(" ");
  console.log(word);
  console.log(word[0]);
  console.log(word[1]);
   if (word[0] == prefix + "ban") { 
    const banUser = e.message.guild.members.find(bu => bu.name === e.message.content.slice(5,37))
      if (e.message.content.slice(5,37) == client.User.username || e.message.content.slice(5,37) == client.User.memberOf(e.message.guild).name) {
        e.message.channel.sendMessage(e.message.author.nickMention + ", **nope.**")
      } else {
    e.message.guild.ban(banUser);
    e.message.channel.sendMessage(e.message.author.nickMention + ", tried to ban " + e.message.content.slice(5,37));
      }
  }
  } else if  (e.message.content == prefix + "help") {
    e.message.channel.sendMessage("```xl\n" + adminRoleName + ":\n"+prefix+"setnick <nick> - Sets the nickname for Electronicwiz1 Bot.\n"+prefix+"kick - Kicks the user by username.\n"+prefix+"assignrole - Adds the role to the user.\n"+prefix+"unassignrole - Removes the role from the user.\n"+prefix+"clear - Clears 100 messages.\n"+prefix+"ban - Ban a user by username.```")
} else if (e.message.content.match(prefix + "assignrole")) {
  var initialSlice = e.message.content.split(" ");
  if (initialSlice[0] == prefix + "assignrole") {
    var slice2 = e.message.content.slice(12);
    var split = slice2.split(" to ");
    console.log(split);
    console.log(slice2)
    var member = e.message.guild.members.find(m => m.name === split[1]);
    var roleAssigned = e.message.guild.roles.find(r => r.name === split[0]);
    if (member && roleAssigned && !member.hasRole(roleAssigned)){
      member.assignRole(roleAssigned);
      e.message.channel.sendMessage(e.message.author.nickMention + ", Attempted to give " + split[0] + " role to " + split[1]);
    }

  }
}  else if (e.message.content.match(prefix + "unassignrole")) {
  var initialSlice = e.message.content.split(" ");
  if (initialSlice[0] == prefix + "unassignrole") {
    var slice2 = e.message.content.slice(14);
    var split = slice2.split(" from ");
    console.log(split);
    console.log(slice2)
    var member = e.message.guild.members.find(m => m.name === split[1]);
    var roleAssigned = e.message.guild.roles.find(r => r.name === split[0]);
    if (member && roleAssigned && member.hasRole(roleAssigned)){
      member.unassignRole(roleAssigned);
      e.message.channel.sendMessage(e.message.author.nickMention + ", Attempted to take " + split[0] + " role from " + split[1]);
    }

  }
}else if (e.message.content.match(prefix + "kick")) {
  var initialSlice = e.message.content.split(" ");
  if (initialSlice[0] == prefix + "kick") {
    var slice2 = e.message.content.slice(6);
    console.log(split);
    console.log(slice2)
    var member = e.message.guild.members.find(m => m.name === slice2);
    if (member){
      member.kick();
      e.message.channel.sendMessage(e.message.author.nickMention + ", Attempted to kick " + slice2);
    }

  }
} else if (e.message.content.match(prefix + "clear")) {
    var initialSlice = e.message.content.split(" ");
  if (initialSlice[0] == prefix + "clear") {
var slice2 = e.message.content.slice(7);
        e.message.channel.fetchMessages(slice2).then(fetched => {
            client.Messages.deleteMessages(fetched.messages);
        }).catch(console.log);
  }
}
  }
}
if (e.message.content == prefix + "hello") {
	e.message.channel.sendMessage("Hey!");
	}else if (e.message.content == prefix + "youtube") {
	e.message.channel.sendMessage("My youtube: https://www.youtube.com/channel/UC6D_Ee3rLteOhGe-qD0Ku3A");
	} else if (e.message.content == prefix + "help"){
    e.message.channel.sendMessage("``'"+prefix+"hi - Says hi to you \n"+prefix+"youtube - Electronicwiz1's channel!\n"+prefix+"crazyredhead - Katie's channel (Julia's Best friend)\n"+prefix+"discord - Julia's Discord Server\n"+prefix+"windowsupdate - Tells you about updates lol!\n"+prefix+"twitter - Electronicwiz1's Twitter!\n"+prefix+"invite - Use to invite this bot to another server!\n"+prefix+"instagram - Electronicwiz1's Instagram!\n"+prefix+"website - electronicwiz1's computer website! ")
    setGame("Being a bot - !help");
    }else if (e.message.content == prefix + "crazyredhead") {
	e.message.channel.sendMessage("https://www.youtube.com/channel/UCJ3Z84sQTV7cIlJxxJ1rfYg");
	}else if (e.message.content == prefix + "website") {
	e.message.channel.sendMessage("http://juliascomputersite.webs.com/");
	}else if (e.message.content == prefix + "invite") {
	e.message.channel.sendMessage("https://discordapp.com/oauth2/authorize?&client_id=251142151474249730&scope=bot");
	}else if (e.message.content == prefix + "instagram") {
	e.message.channel.sendMessage("http://instagram.com/watewut44/");
	}else if (e.message.content == prefix + "discord") {
	e.message.channel.sendMessage("https://discord.me/electronicwiz1official");
	}else if (e.message.content == prefix + "hi") {
	e.message.channel.sendMessage("```Hi.```");
	}else if (e.message.content =="rd your host") {
	e.message.channel.sendMessage("NO RD");
    }else if (e.message.content =="bcdedit /delete {current}") {
	e.message.channel.sendMessage("Hmm let me think.. NO!");
	}else if (e.message.content =="delete your bcd") {
	e.message.channel.sendMessage("NO I want my computer to boot! It needs its boot files!");
	}else if (e.message.content =="syskey your host") {
	e.message.channel.sendMessage("NO I'm not a scammer!");
	}else if (e.message.content == "RD") {
	e.message.channel.sendMessage("Why even rd, when you can do something much better that isn't overused? There are a lot more cool things to do!")
	}else if (e.message.content == "rd") {
	e.message.channel.sendMessage("Why even rd, when you can do something much better that isn't overused? There are a lot more cool things to do!")
	}else if (e.message.content == "rstrui") {
	e.message.channel.sendMessage("You REALLY want to run System Restore?!?")
	}else if (e.message.content == "Rstrui") {
	e.message.channel.sendMessage("You REALLY want to run System Restore?!?")
	}else if (e.message.content == "rstrui.exe") {
	e.message.channel.sendMessage("You REALLY want to run System Restore?!?")
	}else if (e.message.content == "RSTRUI") {
	e.message.channel.sendMessage("You REALLY want to run System Restore?!? http://www.windowsxphome.windowsreinstall.com/howto/howto/systemrestore3.jpg")
	}else if (e.message.content == "bcdedit") {
	e.message.channel.sendMessage("Are you trying to delete your BCD?!? Please DON'T!")
	}else if (e.message.content == "RDSTRUI") {
	e.message.channel.sendMessage("RD + System Restore?!? Hmmmmm?!?")
	}else if (e.message.content == "rdstrui") {
	e.message.channel.sendMessage("RD + System Restore?!? Hmmmmm?!?")
	}else if (e.message.content == "RIP") {
    e.message.channel.sendMessage("Oh no, did something bad happen?!?")
	}else if (e.message.content == "rip") {
    e.message.channel.sendMessage("Oh no, did something bad happen?!?")
	}else if (e.message.content == "Ping") {
    e.message.channel.sendMessage("Pong!")
	}else if (e.message.content == "ping") {
    e.message.channel.sendMessage("Pong!")
	}else if (e.message.content == prefix + "windowsupdate") {
    e.message.channel.sendMessage("Do your Windows Updates on Patch Tuesday for security! It is on the second Tuesday of every month for sure, but sometimes it can be other days too!");
	}else if (e.message.content == "syskey") {
    e.message.channel.sendMessage("Are you a scammer?!?")
	}else if (e.message.content == "MEMZ") {
    e.message.channel.sendMessage("MEMZ IS OLD AND OVERUSED.")
	}else if (e.message.content == "memz") {
    e.message.channel.sendMessage("MEMZ IS OLD AND OVERUSED.")
	}else if (e.message.content == "Memz") {
    e.message.channel.sendMessage("MEMZ IS OLD AND OVERUSED.")
	}else if (e.message.content == "vm") {
    e.message.channel.sendMessage("You mean Virtual Machine?")
	}else if (e.message.content == "VM") {
    e.message.channel.sendMessage("You mean Virtual Machine?")
	}else if (e.message.content == "silent rd") {
    e.message.channel.sendMessage("WHAT NO!")
	}else if (e.message.content == "wirus") {
    e.message.channel.sendMessage("OH NO I HAVE A WIRUS ON MY DEXTOP!")
	}else if (e.message.content == "Wirus") {
    e.message.channel.sendMessage("OH NO I HAVE A WIRUS ON MY DEXTOP!")
	}else if (e.message.content == "WIRUS") {
    e.message.channel.sendMessage("OH NO I HAVE A WIRUS ON MY DEXTOP!")
	}else if (e.message.content == "Dextop") {
    e.message.channel.sendMessage("Hope I don't have a wirus on it..")
	}else if (e.message.content == "DEXTOP") {
    e.message.channel.sendMessage("Hope I don't have a wirus on it..")
	}else if (e.message.content == "dextop") {
    e.message.channel.sendMessage("Hope I don't have a wirus on it..")
	}else if (e.message.content == "taxbar") {
    e.message.channel.sendMessage("CAN IT EVEN GET A WIRUS ON A DEXTOP?!?")
	}else if (e.message.content == "System Restore") {
    e.message.channel.sendMessage("You want to restore?! Ok, I'll go back to the earliest date possible HAHAHA!")
	}else if (e.message.content == "system restore") {
    e.message.channel.sendMessage("You want to restore?! Ok, I'll go back to the earliest date possible HAHAHA!")
	}else if (e.message.content == "lame") {
    e.message.channel.sendMessage("LOL!")
	}else if (e.message.content == "I will rd") {
    e.message.channel.sendMessage("NOOOOOOOOOOOOOO")
	}else if (e.message.content == ".NET") {
    e.message.channel.sendMessage("Framework!")
	}else if (e.message.content == "I'll rd") {
    e.message.channel.sendMessage("NOOOOOOOOOOOOOO")
	}else if (e.message.content == "I will rd my host") {
    e.message.channel.sendMessage("NOOOOOOOOOOOOOO!")
	}else if (e.message.content == "I WILL RD") {
    e.message.channel.sendMessage("NOOOOOOOOOOOOOO")
	}else if (e.message.content == "I WILL RD MY HOST") {
    e.message.channel.sendMessage("NOOOOOOOOOOOOOO!")
	}else if (e.message.content == ".net") {
    e.message.channel.sendMessage("Framework!")
	}else if (e.message.content == ".NET Framework") {
    e.message.channel.sendMessage("Oh no not again!")
	}else if (e.message.content == ".net framework") {
    e.message.channel.sendMessage("Oh no not again! ")
	}else if (e.message.content == "Windows 10") {
    e.message.channel.sendMessage("An awesome OS!")
	}else if (e.message.content == "Windows 7") {
    e.message.channel.sendMessage("If you are using Windows 7, why?!? It is from 2009 and is unsecure. Microsoft broke the updates so it doesn't even update properly anymore. If you still use it, I recommend upgrading, and if you can't, fix the broken update system.")
	}else if (e.message.content == "Windows XP") {
    e.message.channel.sendMessage("Was a GREAT OS, but sadly lost support on April 8, 2014. :(")
	}else if (e.message.content == "Where is Julia?") {
    e.message.channel.sendMessage("If you are asking this, then she is probably offline.")
	}else if (e.message.content == "Virus") {
    e.message.channel.sendMessage("Did you mean Wirus?")
	}else if (e.message.content == "VIRUS") {
    e.message.channel.sendMessage("Did you mean WIRUS?")
	}else if (e.message.content == "virus") {
    e.message.channel.sendMessage("Did you mean wirus?")
	}else if (e.message.content == "Windows 9") {
    e.message.channel.sendMessage("Why is there no Windows 9?!? Because 7 8 9 LOL!")
	}else if (e.message.content == "joolya") {
    e.message.channel.sendMessage("It is Julia.. LOL!")
	}else if (e.message.content == "rd C:") {
    e.message.channel.sendMessage("Just DON'T. BAD IDEA!!!")
	}else if (e.message.content == "rd I:") {
    e.message.channel.sendMessage("Hmm let me think.. NOOO!")
	}else if (e.message.content == "rd V:") {
    e.message.channel.sendMessage("I am NOT rding my ISO's! NOOO!")
	}else if (e.message.content == "gruel") {
    e.message.channel.sendMessage("Hmmmm... WHAT ABOUT NO!")
	}else if (e.message.content == "format") {
    e.message.channel.sendMessage("DO NOT EVEN..")
	}else if (e.message.content == "404") {
    e.message.channel.sendMessage("https://http.cat/404")
	}else if (e.message.content == "VineMEMZ") {
    e.message.channel.sendMessage("NO ONE HAS A REAL COPY!")
	}else if (e.message.content == "hurr-durr") {
    e.message.channel.sendMessage("http://hurr-durr.com/")
	}else if (e.message.content == "lsass.exe") {
    e.message.channel.sendMessage("The system is shutting down. The shutdown process was started by NT AUTHORITY\SYSTEM")
	}else if (e.message.content == "bleach") {
    e.message.channel.sendMessage("DO NOT EVEN...")
	}else if (e.message.content == "Format I:") {
    e.message.channel.sendMessage("Sure, I'll format.. WUT NOOOOOO! MY BACKUPS.. NOOOOO!!!")
	}else if (e.message.content == "format I:") {
    e.message.channel.sendMessage("Sure, I'll format.. WUT NOOOOOO! MY BACKUPS.. NOOOOO!!!")
	}else if (e.message.content == "delete your backups") {
    e.message.channel.sendMessage("WUUUUUT NOOOOOOOOOO!!!!")
	}else if (e.message.content == "Delete your backups") {
    e.message.channel.sendMessage("WUUUUUT NOOOOOOOOOO!!!!")
	}else if (e.message.content == "RIP VM") {
    e.message.channel.sendMessage("Good thing it was only a VM...")
	}else if (e.message.content == "rip vm") {
    e.message.channel.sendMessage("Good thing it was only a VM...")
	}else if (e.message.content == "Rip VM") {
    e.message.channel.sendMessage("Good thing it was only a VM...")
	}else if (e.message.content == "Rip vm") {
    e.message.channel.sendMessage("Good thing it was only a VM...")
	}else if (e.message.content == "not rip") {
    e.message.channel.sendMessage("YAY!")
	}else if (e.message.content == "Not RIP") {
    e.message.channel.sendMessage("YAY!")
	}else if (e.message.content == "NOT RIP") {
    e.message.channel.sendMessage("YAY!")
	}else if (e.message.content == "not rip") {
    e.message.channel.sendMessage("YAY!")
	}else if (e.message.content == "Format V:") {
    e.message.channel.sendMessage("Ok... NOOOOOOOO MY ISO'S NOOOOOOO!!")
	}else if (e.message.content == "format V:") {
    e.message.channel.sendMessage("Ok... NOOOOOOOO MY ISO'S NOOOOOOO!!")
	}else if (e.message.content == "Run MEMZ") {
    e.message.channel.sendMessage("NO WAY!")
	}else if (e.message.content == "run memz") {
    e.message.channel.sendMessage("NO WAY!")
	}else if (e.message.content == "RUN MEMZ") {
    e.message.channel.sendMessage("NO WAY!")
	}else if (e.message.content == "run MEMZ") {
    e.message.channel.sendMessage("NO WAY!")
	}else if (e.message.content == "Run memz") {
    e.message.channel.sendMessage("NO WAY!")
	}else if (e.message.content == "oops") {
    e.message.channel.sendMessage("Don't worry, we all make mistakes!")
	}else if (e.message.content == "Pizza") {
    e.message.channel.sendMessage("Mmmmm.. PIZZA! Now I am hungry.")
	}else if (e.message.content == "Goodnight") {
    e.message.channel.sendMessage("Have a great night and sleep well!")
	}else if (e.message.content == "goodnight") {
    e.message.channel.sendMessage("Have a great night and sleep well!")
	}else if (e.message.content == "I'm sad") {
    e.message.channel.sendMessage("Why sad?! Is everything ok?!?")
	}else if (e.message.content == "Nyan cat") {
    e.message.channel.sendMessage("Nyan nyan nyan!")
	}else if (e.message.content == "Nyan cat!") {
    e.message.channel.sendMessage("Nyan nyan nyan!")
	}else if (e.message.content == "Cake") {
    e.message.channel.sendMessage("I WANT CAKE NOW!")
	}else if (e.message.content == "cake") {
    e.message.channel.sendMessage("I WANT CAKE NOW!")
	}else if (e.message.content == "I won't rd") {
    e.message.channel.sendMessage("Ok, GOOD!")
	}else if (e.message.content == prefix + "twitter") {
	e.message.channel.sendMessage("https://twitter.com/Julo431");
	}else if (e.message.content == "format C:") {
    e.message.channel.sendMessage("You cannot format this volume.")
	
	
	
	
/* 
if (e.message.guild.id == <guild id>) {
     // some commands here
}
This is used to have custom commands for other servers
*/
if (e.message.author.id == ownerid) {
  if(e.message.content == prefix + "disconnect") {
    client.disconnect();
  } else if (e.message.content == prefix + "reconnect") {
    client.disconnect();
    client.connect({ token: token }); 
  } else if (e.message.content == prefix + "removebot") {
    e.message.guild.leave();
  } else if (e.message.content.match(prefix + "setnick")) {
var word = e.message.content.split(" ");
if (word[0] == prefix + "setnick") {
  var nick = e.message.content.slice(9);
client.User.memberOf(e.message.guild).setNickname(nick);
} 
} else if (e.message.content == prefix + "help") {
    e.message.channel.sendMessage("```xl\nOwner:\n"+prefix+"disconnect - Shuts down Electronicwiz1 Bot.\n"+prefix+"reconnect - Shuts down and restarts Electronicwiz1 Bot.\n"+prefix+"removebot - Removes Electronicwiz1 Bot from the server.\n"+prefix+"setnick <nick> - Sets the nickname for Electronicwiz1 Bot.\n"+prefix+"eval <javascript> - Advanced mode of Electronicwiz1 Bot.```");
    console.log("Owner:\n,disconnect/Ctrl+PauseBreak - Shuts down Electronicwiz1 bot.\n,reconnect - Shuts down and restarts Electronicwiz1 Bot.\n,removebot - Removes Electronicwiz1 Bot from the server.\n,setnick <nick> - Sets the nickname for Electronicwiz1.");
  } else if (e.message.content.match(prefix + "eval")) {1
    var splittext = e.message.content.split(" ");
    console.log(splittext);
    if (splittext[0] == prefix + "eval") {
      var sliced = e.message.content.slice(6);
      console.log(sliced);
try {
var evaluated = eval(sliced);
console.log(evaluated);
e.message.channel.sendMessage("Input:\n```js\n" + sliced + "```\nOutput:\n```js\n" + evaluated + "\n```")
}catch(err){
console.log("An error occurred while using eval:" + err.message)
e.message.channel.sendMessage("Error:\n```xl\n" + err.message + "\n```")
}
  
  }
}
}}}
);

client.Dispatcher.on(Events.GUILD_MEMBER_ADD, gma => {
//this runs if someone joins a server.
gma.guild.generalChannel.sendMessage(gma.member.nickMention + " has joined **" + gma.guild.name + "**.");
console.log(gma.member.username + " joined " + gma.guild.name);
});
client.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, gmr => {
//this runs if someone leaves the server.
gmr.guild.generalChannel.sendMessage(gmr.user.username + " left **" + gmr.guild.name + "**.");
  
console.log(gmr.user.username + " left " + gmr.guild.name);
});
client.Dispatcher.on(Events.GUILD_CREATE, gcr => {
  gcr.guild.generalChannel.sendMessage("```xl\nThank you for adding Electronicwiz1 Bot to your server!\nTo experience moderation commands, add Electronicwiz1 Bot Commander role. (Optional)\ One again, Thanks for adding! :wink:```");
  console.log("New server: " + gcr.guild.name);
});
client.Dispatcher.on(Events.GUILD_DELETE, gdl => {
  console.log("Bot got removed from guild with ID " + gdl.guildId);
});
client.Dispatcher.on(Events.GUILD_BAN_ADD, gba => {
  gba.guild.generalChannel.sendMessage(gba.user.username + " got banned from **" + gba.guild.name + "**.");
  console.log(gba.user.username + " got banned from " + gba.guild.name);
});
client.Dispatcher.on(Events.GUILD_BAN_REMOVE, gbr => {
  gbr.guild.generalChannel.sendMessage(gbr.user.username + " got unbanned from **" + gbr.guild.name + "**.");
  console.log(gbr.user.username + " got unbanned from " + gbr.guild.name);
});
// the setGame function is meant to set game.
function setGame(name) {
  /* 
  //To set the bot's streaming game, uncomment this code and comment the playing game.
    var game = {type: 1, name: name, url: ""};
    url MUST be a valid twitch url
  */
  // playing game
  var game = {name: name};
  //playing game end
  client.User.setGame(game);
} 