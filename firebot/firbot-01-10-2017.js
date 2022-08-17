var Discordie = require("discordie");
var Cleverbot = require("cleverbot-node");
var client = new Discordie();
var prefix = "*";
var Events = Discordie.Events;
var client = new Discordie();
const request = require("request");
var Events = Discordie.Events;
var mybot = new Discordie();
var ownerid = "194892236650053633";
var token = "ashooshi";

function setGame(name) {
  var gamee = {type: 1, name: name, url: "http://www.twitch.tv/firec123123"};
  client.User.setGame(gamee);
} 
function safeEval (code, context, opts) {
  var sandbox = {}
  var resultKey = 'SAFE_EVAL_' + Math.floor(Math.random() * 1000000)
  sandbox[resultKey] = {}
  code = resultKey + '=' + code
  if (context) {
    Object.keys(context).forEach(function (key) {
      sandbox[key] = context[key]
    })
  }
  require('vm').runInNewContext(code, sandbox, opts)
  return sandbox[resultKey]
}

//var game = {name: name};
client.connect({
  token: "MjI3MDIzNDUxNjQ1NDExMzI5.CtDk-Q.p40Zihy6dZ9zbpHj5JvWJUQ9ADQ"
});

client.Dispatcher.on("GATEWAY_READY", a => { 
  console.log("Connected as: " + client.User.username);
  setGame("Type *help | " + " there are " + client.Users.length + " users in this server.")
});



client.Dispatcher.on(Events.GUILD_EMOJIS_UPDATE, geu => {
  geu.guild.generalChannel.sendMessage("**UH OH!** ok someone added/removed an emote ._.");
});
client.Dispatcher.on(Events.GUILD_ROLE_CREATE, grc => {
  grc.guild.generalChannel.sendMessage("**UH OH!** ok someone created a role (ABOOOSEEEE?????) ._.");
});
client.Dispatcher.on(Events.GUILD_ROLE_DELETE, grd => {
  grd.guild.generalChannel.sendMessage("**UH OH!** ok someone deleted a role (ABOOOSEEEE?????) ._.");
});

//client.Dispatcher.on(Events.WEBHOOKS_UPDATE, wu => {
//  wu.guild.generalChannel.sendMessage("**UH OH!** ok someone is playing with the webhooks (ABOOOSEEEE?????) ._.");
//});
client.Dispatcher.on(Events.GUILD_MEMBER_ADD, gma => {
  gma.guild.generalChannel.sendMessage(gma.member.nickMention + " just joined **" + gma.guild.name + "** make sure to read the <#226576534926917632> ^.^");
  console.log(gma.member.username + " joined " + gma.guild.name);
});
client.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, gmr => {
  gmr.guild.generalChannel.sendMessage(gmr.user.username + " just left **" + gmr.guild.name + "**. :(");
  console.log(gmr.user.username + " left " + gmr.guild.name);
});
client.Dispatcher.on(Events.GUILD_CREATE, gcr => {
  gcr.guild.generalChannel.sendMessage("hi ._.");
});
client.Dispatcher.on(Events.GUILD_DELETE, gdl => {
  console.log("RIP BOT ;-;");
});
client.Dispatcher.on(Events.GUILD_BAN_ADD, gba => {
  gba.guild.generalChannel.sendMessage(gba.user.username + " just got banned. o.o");
  console.log(gba.user.username + " got banned from " + gba.guild.name);
});
client.Dispatcher.on(Events.GUILD_BAN_REMOVE, gba => {
  gba.guild.generalChannel.sendMessage(gba.user.username + " just got unbanned. ._.");
  console.log(gba.user.username + " got unbanned from " + gba.guild.name);
});
client.Dispatcher.on("MESSAGE_CREATE", e => {
		if (e.message.author.id == ownerid) {
			var game = {name: "Type *help | " + " there are " + client.Users.length + " users in this server."};
            var streamingGame = {type: 1, name: "Type *help | " + " there are " + client.Users.length + " users in this server.", url: "http://www.twitch.tv/firec123123"};
			  if (e.message.content == "*status online") {
				  client.User.setStatus("online", game);
    e.message.channel.sendMessage("Status set as: Online");
  }
  			  if (e.message.content == "*status idle") {
				  client.User.setStatus("idle", game);
    e.message.channel.sendMessage("Status set as: Idle");
  }
  			  if (e.message.content == "*status dnd") {
				  client.User.setStatus("dnd", game);
    e.message.channel.sendMessage("Status set as: Do not disturb");
  }
    			  if (e.message.content == "*status do not disturb") {
					  client.User.setStatus("dnd", game);
    e.message.channel.sendMessage("Status set as: Do not disturb");
  }
      			  if (e.message.content == "*status invisible") {
					  client.User.setStatus("invisible", game);
    e.message.channel.sendMessage("Status set as: invisible");
  }
        			  if (e.message.content == "*status live") {
					  client.User.setStatus(null, streamingGame);
    e.message.channel.sendMessage("Status set as: Streaming");
  }
	if (e.message.content.startsWith("*restart")) {
		client.disconnect(); client.connect({ token: token });	
			  }
	if (e.message.content.startsWith("*ban")) {
			  var banUser = e.message.content.substring(7,26);
			  e.message.guild.ban(banUser);
			  e.message.channel.sendMessage("Banned " + "<@"+banUser+">");
			  }
			  
		  if(e.message.content.startsWith("*say")) {
	  client.Messages.deleteMessage(e.message); 
    e.message.channel.sendMessage(e.message.content.substring(5,2000));
		  }
			  
			  if (e.message.content.startsWith("*softban")) {
			  var softbanUser = e.message.content.substring(11,29);
			  e.message.guild.ban(softbanUser);
			  e.message.guild.unban(softbanUser);
			  e.message.channel.sendMessage("SoftBanned " + "<@"+softbanUser+">");
			  console.log("SoftBanned " + softbanUser)
			  }

			  if (e.message.content.startsWith("*unban")) {
			  var unbanUser = e.message.content.substring(7,25);
			  e.message.guild.unban(unbanUser);
			  e.message.channel.sendMessage("Unbanned " + "<@"+unbanUser+">");
			  console.log("Unbanned" + unbanUser)
			  }	

			  if (e.message.content.startsWith("*kick")) {
					  var kickUser = e.message.guild.members.find(m => m.id === e.message.content.substring(8,26));
					  console.log(e.message.content.substring(8,26))
					  console.log(kickUser)
					  kickUser.kick()
              e.message.channel.sendMessage("Kicked " + "<@"+kickUser+">");
    }
  if (e.message.content.startsWith("*setgame")) {
						  var customgame = e.message.content.substring(9,2000);
						  setGame(customgame);
						  e.message.channel.sendMessage("Custom Game Set: "+ customgame);
						  console.log("Custom Game Set: "+ customgame)
					  }
					  					  if (e.message.content.startsWith("*logban")) {
			  var banlogUser = e.message.content.substring(10,28);
			  var banlogReason = e.message.content.substring(30,500);
			  e.message.guild.ban(banlogUser);
			  e.message.channel.sendMessage("Banned " + "<@"+banlogUser+">");
					  client.Channels.find(gn => gn.id == "236477798124879872").sendMessage("Ban: "+"<@"+banlogUser+">"+" \n ID: "+banlogUser+"  \n Ban reason: "+ banlogReason)
										  }
					          if (e.message.content.startsWith("*eval")) {
          var splittext = e.message.content.split(" ");
          console.log(splittext);
          if (splittext[0] == "*eval") {
            var sliced = e.message.content.slice(6);
            console.log(sliced);
            try {
              var evaluated = eval(sliced);
              console.log(evaluated);
              e.message.channel.sendMessage("Input:\n```js\n" + sliced + "```\nOutput:\n```js\n" + evaluated + "\n```");
            }catch(err){
              console.log("An error occurred while using eval:" + err.message);
              e.message.channel.sendMessage("Error:\n```xl\n" + err.message + "\n```");
			  }}}}
  if (e.message.content == "*kms") {
    e.message.channel.sendMessage(":joy: :gun:");
  }
    if (e.message.content == "*ok") {
    e.message.channel.sendMessage("OK" + e.message.content.substring(3,999));
  }
  if (e.message.content.startsWith("*kys")) {
    e.message.channel.sendMessage("kys " + e.message.content.substring(5,27) + " :joy: :gun:    -" + e.message.author.nickMention);
  }

  if (e.message.content.startsWith("<@227023451645411329>")) {
  if (e.message.content != "<@227023451645411329>") {
    cleverbot = new Cleverbot();
    var cleverMessage = e.message.content.slice(9);
        Cleverbot.prepare(function(){
      cleverbot.write(cleverMessage, function (response) {
           e.message.channel.sendMessage(e.message.author.nickMention+", " + response.message)
      })
    })
  }else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `@FireBot how are you?`")
}
}
  if (e.message.content == "*help") {
    e.message.channel.sendMessage(":radio_button: **FireBot Commands** :radio_button:\n\n \n **`~ Fun/Usefull commands ~`**:speech_balloon:\n```*help *kms *kys *bleach *ping *rate *8ball *userinfo\n*cat *dog *penguin *unsplash *how2bot *fuck *rape *spank *slap *shoot *stab *kiss *hug *succ *changelog *electronicwiz1 *quote```");
    e.message.channel.sendMessage("**`~ Music commands ~`** :musical_note:\n```*play - play a video of youtube  \n*skip - skip a song/vote for skip\n*volume - set the volume of the song example: *volume 40\n*search - search a video in youtube and play it \n*queue - sends a message with the song queue\n*pause - pauses the current song\n*resume - unpauses a song if its paused\n*summon - summon's the bot in the channel that you are currently in```");
    e.message.channel.sendMessage(":radioactive: ***`~ STAFF ONLY COMMANDS ~`*** :radioactive:\n ```*shutdown *restart *blacklist```");
    e.message.channel.sendMessage(":love_letter: ``Made By:``**`FireC,cth103,MDMCK10`** :love_letter:");
	setGame("*help | " + " there are " + client.Users.length + " users in this server.")
  }
  if (e.message.content == "hi") {
    e.message.channel.sendMessage("hello there :)");
  }

  if(e.message.content.startsWith("*electronicwiz1")) {
    e.message.channel.sendMessage("https://www.youtube.com/channel/UC6D_Ee3rLteOhGe-qD0Ku3A");
  }
  if (e.message.content == "*this is fine") {
    e.message.channel.sendMessage("https://giphy.com/gifs/form-z9AUvhAEiXOqA");
  }
  if (e.message.content == "*bleach") {
    e.message.channel.sendMessage("http://gaia.adage.com/images/bin/image/x-large/Clorox_bleach.jpg here you go");
  }

  if (e.message.content == "*gimmearole") {
	  console.log(e.message.author.nickMention + " just tried to get a role")
    e.message.channel.sendMessage("nah");			
  }
  
  if (e.message.content == "*givemearole") {
	  console.log(e.message.author.nickMention + " just tried to get a role")
    e.message.channel.sendMessage("nah");
  }
  
  if (e.message.content == "*gimmestaff") {
	  console.log(e.message.author.nickMention + " just tried to get a role")
    e.message.channel.sendMessage("nah");
  }
	
	  if (e.message.content == "*givemestaff") {
	  console.log(e.message.author.nickMention + " just tried to get a role")
    e.message.channel.sendMessage("nah");	

  }
  if (e.message.content =="*how2bot") {
    e.message.channel.sendMessage("here is an example of MDMCK10 fixing FireC's code https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif");
  }
  if (e.message.content =="*test") {
	  e.message.channel.sendMessage("`1. anim1\n2.anim2\n3.anim3\n4.fircs moni\n5.idk\n6.gameanim`")
  }
      if(e.message.content == "*test ok") {
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("Fir").then(sentMessage => {
      sentMessage.edit("Fir");
sentMessage.edit("Fire");
sentMessage.edit("FireBot");
sentMessage.edit("FireBot is");
sentMessage.edit("FireBot is online"); }) 
}
if(e.message.content == "*test anim1") {
e.message.channel.sendMessage("Applying options").then(sentMessage => {
      sentMessage.edit("Applying options.");
      sentMessage.edit("Applying options..");
      sentMessage.edit("Applying options...");
      sentMessage.edit("Applying options.");
      sentMessage.edit("Applying options..");
      sentMessage.edit("Applying options...");
	  sentMessage.edit("Done");  })
}
if(e.message.content == "*test anim2") {
e.message.channel.sendMessage("k").then(sentMessage => {
      sentMessage.edit("ky");
      sentMessage.edit("kys");
      sentMessage.edit("kys f");
      sentMessage.edit("kys fi");
      sentMessage.edit("kys fir");
      sentMessage.edit("kys firc"); })
}
if(e.message.content == "*test anim3") {
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("ha").then(sentMessage => {
      sentMessage.edit("hax");
      sentMessage.edit("haxed");
      sentMessage.edit("haxed by");
      sentMessage.edit("haxed by jik");
      sentMessage.edit("haxed by jik tim"); })
}
if(e.message.content == "*test fircs moni") {
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("+1 doge coin").then(sentMessage => {
      sentMessage.edit("+2 doge coin");
      sentMessage.edit("+5 doge coin");
      sentMessage.edit("+10 doge coin");
      sentMessage.edit("+100 doge coin");
      sentMessage.edit("+999 doge coin"); })
}
if(e.message.content == "*test game") {
		  setGame("k")
	  setGame("ky")
	  setGame("kys")
	  setGame("kys f")
	  setGame("kys fi")
	  setGame("kys fir")
	  setGame("kys firc")
}
    if(e.message.content == "*test idk") {
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("```hentai plez```").then(sentMessage => {
      sentMessage.edit("s");
sentMessage.edit("se");
sentMessage.edit("sex");
sentMessage.edit("sex m");
sentMessage.edit("sex me");	  }) 
}
    if(e.message.content == "*test rd") {
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("N").then(sentMessage => {
      sentMessage.edit("NO");
sentMessage.edit("NO R");
sentMessage.edit("NO RD");
sentMessage.edit("NO RD!");
sentMessage.edit("NO RD!!"); }) 
}
if (e.message.content.startsWith("solelyko")) {
	client.Messages.deleteMessage(e.message);
	e.message.sendMessage("bad")
}
  if (e.message.content =="*russia")
    e.message.channel.sendMessage("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_Soviet_Union.svg/2000px-Flag_of_the_Soviet_Union.svg.png");
  if (e.message.startsWith =="*fuck")
    e.message.channel.sendMessage(e.message.author.nickMention + "Just F*CKED" + e.message.content.substring(5,2000));

//if (e.message.content.startsWith("*bf")) {
//try {
//	var code = [];
//	var bfded = bf.compile(e.message.content.substring(4, 9999999999999));
//	bfded.run(bfded, function (num, chor) {
//  code.push(chor);
//});
//     var finishdcode = code.join('');
//	if (!finishdcode == "") {
//	e.message.channel.sendMessage("```brainfuck\n" +finishdcode + "```");
//	}
//	if (finishdcode == "") {
//	e.message.channel.sendMessage("```brainfuck\nERROR AAAAAAAAAAAAA```");
//}	
//}
//catch (err) {
//e.message.channel.sendMessage("```brainfuck\nError " + err.toString() + "```");	
//}

//}
  if (e.message.content =="*changelog")
    e.message.channel.sendMessage("`10\23\2016`\nAdded a lot of commands that could help staff(not open yet)\n`10/12/2016`\nadded a *quote command\n`10/5/2016`\nnow anyone that says (@)everyone or (@)here will be logged\nadded a *givemearole command'");

  else if (e.message.content == "*userinfo")
    e.message.channel.sendMessage(":bust_in_silhouette: Info About " + e.message.author.nickMention + "\n" +"➣ Username: "+ e.message.author.username + "\n" + "➣ Nickname: " + e.message.author.nickMention + "\n" + "➣ Discriminator: " + e.message.author.discriminator + "\n" + "➣ Registered at (Bot's local timezone applies): " + e.message.author.registeredAt + "\n" + "➣ Avatar URL: " + e.message.author.avatarURL + "\n" + "➣ Bot user: " + e.message.author.bot + "\n➣ ID: " + e.message.author.id);

if(e.message.content == prefix + "ping") {
e.message.channel.sendMessage(`ping`)
  .then(sentMessage => {
	  sentMessage.edit(`pong | ${Date.parse(sentMessage.timestamp) - Date.parse(e.message.timestamp)}ms`);
  })
}
  if(e.message.content.startsWith("*dog")) {
    request("http://random.dog/woof", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        e.message.channel.sendMessage("http://random.dog/" + body + " here you go :heart:");
      }
    })
  }
  //if command equal to cat
  if(e.message.content.startsWith("*cat")) {
    request("http://random.cat/meow", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        var cat = result.file;
		console.log(cat)
        e.message.channel.sendMessage(cat + " MEOW");
      }
    })
  }
  
  if(e.message.content.startsWith("*quote")) 
  request({
    headers: {
      'X-Mashape-Authorization': '2W1js31pYJmshjhSeK7bv8Sb4SIgp1HPxkDjsnxBZqr7ZhGKZ2'
    },
    uri: 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=movies',
    method: 'POST'
  }, function (err, res, body) {
    if (!err && res.statusCode == 200) {
        const quote = JSON.parse(body);
        e.message.channel.sendMessage(' " ' + quote.quote + ' " -' + quote.author);
    } else {
        throw "Error.";
    }
  })
  	  if (e.message.content.startsWith("*unsplash")) {
    var httpsPoster = require("https");
    var options = {
      hostname: "source.unsplash.com",
      port : 443,
      path: "/random",
      method: "GET",
      headers: {

      }
    }
    var req = httpsPoster.get(options, function(res) {
      console.log(JSON.parse(JSON.stringify(res.headers)).location);
      var url = JSON.parse(JSON.stringify(res.headers)).location;
      res.setEncoding("utf8");
      res.on("data", function (body) {
        e.message.channel.sendMessage(url);

      })
    })
    req.on("error", function(e) {
      console.log(e.message);
    })
}
  else if (e.message.content.startsWith("*penguin")) {
    request("http://penguin.wtf", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        e.message.channel.sendMessage("here you go :heart:" + body);
	}})
 
    var req = httpsPoster.get(options, function(res) {
      console.log(JSON.parse(JSON.stringify(res.headers)).location);
      var url = JSON.parse(JSON.stringify(res.headers)).location;
      res.setEncoding("utf8");
      res.on("data", function (body) {
        e.message.channel.sendMessage(url);

      })
  })
    req.on("error", function(e) {
      console.log(e.message);
    })
}
	  if(e.message.content.startsWith("*fuck")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just F*CKED" + e.message.content.substring(5,2000));
	  if(e.message.content.startsWith("*slap")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just slaped" + e.message.content.substring(5,2000));
	  if(e.message.content.startsWith("*rape")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just RAPED" + e.message.content.substring(5,2000));
	  if(e.message.content.startsWith("*stab")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just stabbed" + e.message.content.substring(5,2000));
	  if(e.message.content.startsWith("*shoot")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just shot" + e.message.content.substring(5,2000));
if(e.message.content.startsWith("*succ")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just sucked " + e.message.content.substring(5,2000) + "");
if(e.message.content.startsWith("*hug")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just hugged " + e.message.content.substring(5,2000) + "");
if(e.message.content.startsWith("*kiss")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just gave a kiss to " + e.message.content.substring(5,2000) + " *ok*");
if(e.message.content.startsWith("*sit-on")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just sat on " + e.message.content.substring(7,2000) + "");
if(e.message.content.startsWith("*sit-on")) 
    e.message.channel.sendMessage(e.message.author.nickMention + " Just sat on " + e.message.content.substring(7,2000) + "");

// plez work
		  if (e.message.content.startsWith("*8ball ")) {
    var responses = ["It is certain", "Without a doubt", "You may rely on it", "Most likely", "Yes", "Signs point to yes", "Better not tell you now", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
    e.message.channel.sendMessage(responses[Math.floor(Math.random() * (responses.length))]);
		  }	  
		  		  if (e.message.content.startsWith("*rate ")) {
    var responsess = ["1/10", "2/10", "3/10", "4/10", "5/10", "6/10", "7/10", "8/10", "9/10", "10/10", "11/10", "0/10"];
    e.message.channel.sendMessage("I give that a "+responsess[Math.floor(Math.random() * (responsess.length))]);
				  }
		  		  		  if (e.message.content.startsWith("*rate-gud")) {
    var responsesss = ["7/10", "8/10", "9/10", "10/10", "11/10"];
    e.message.channel.sendMessage("I give that a "+responsesss[Math.floor(Math.random() * (responsesss.length))]);
				  }
		  });
