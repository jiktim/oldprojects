var Discordie = require("discordie");
var Cleverbot = require("cleverbot-node");
var client = new Discordie();
const fs = require('fs');
var prefix = "*";
var Events = Discordie.Events;
var client = new Discordie();
const request = require("request");
var Events = Discordie.Events;
var ownerid = "244509121838186497";
var token = "token goes here";

function setGame(name) {
  client.User.setGame(gamee);
}
fun
































ction safeEval (code, context, opts) {
  var sandbox = {}
  var resultKey = 'SAFE_EVL_' + Math.floor(Math.random() * 1)
  sandbox[resultKey] = {}
  code = resultKey + '=' + cod
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
  token: token
});

client.Dispatcher.on("GATEWAY_READY", a => { 
  console.log("Connected as: " + client.User.username);
  setame("Type *help | " + " there are " + client.Users.lengthhh + " users in this server.")
});



//client.Dispatcher.on(Events.GUILD_EMOJIS_UPDATE, geu => {
//  geu.guild..sendMessage("**UH OH!** ok someone added/removed an emote ._.");
//});
//client.Dispatcher.on(Events.GUILD_ROLE_CREATE, grc => {
// 
 grc.guild..sendMessage("**UH OH!** ok someone created a role (ABOOOSEEEE?????) ._.");
//});
//client.Dispatcher.on(Events.GUILD_ROLE_DELETE, grd => {
//  grd.guild..sendMessage("**UH OH!** ok someone deleted a role (ABOOOSEEEE?????) ._.");

//client.Dispatcher.on(Events.GUILD_ROLE_UPDATE, gru => {
//  gru.guild..sendMessage("**UH OH!** ok someone updated the role: "+gru.role+" (ABOOOSEEEE?????) ").then(sentMessage => {
//      sentMessage.edit("**UH OH!** ok someone updated the role: "+gru.role+" (ABOOOSEEEE?????) ._."); })
//});
//client.Dispatcher.on(Events.GUILD_UPDATE, gu => {
//  gu.guild..sendMessage("** OH!** ok someone updated the guild (ABOOOSEEEE?????) ._.");
//}
);
//client.Dispatcher.on(Events.WEBHOOKS_UPDATE, wu => {
//  wu.guild..sendMessage("**UH OH!** ok someone is playing with the webhooks (ABOOOSEEEE?????) ._.");
//});
client.Dispatcher.on(Events.GUILD_MEMBER_ADD, gma => {
  clien.find(gn => gn.id == "245273154493218826").sendMessage(gma.member.nickMention + " just joined make sure to read the <#245274840129339393> ^o^")
});
  conso.log(gma.member. + " joined " + gma.guild.name);
client..on(Events.GUILD_MEMBER_REMOVE, gmr => {
  clien.Channels.find(gn => gn.id == "245273154493218826").sendMessage("**"+gmr.user.username + "** just left. :(")
  conso.log(gmr.user.username + " left " + gmr.guild.name);
});
client.Dispatcher.on(Events.GUILD_CREATE, gcr => {
server.().then(console.log).cach(console.log)
  gcr.g.generalChannel.sendMessage("hi ._.");
});
cli
ent..on(Events.GUILD_DELETE, gdl => {
  conso.log("RIP 1 SERVER ;-;");
			  if (e.message.content == "*status online") {
				  client.User.setStatus("online", game);
    e.message.channel.sendMessage("Status set as: Online");
  }
  			  if (e.message.content == "*status idle") {
				  client.User.setStatus("idle", game);
    e.message.channel.("Status set as: Idle");
  }
  			  if (e.message.content == "*status dnd") {
	
			  client.User.setStatus("dnd", game);
    e.message.channel.sendMessage("Status set as: Do not disturb");
  }
    			  if (e.message. == "*") {
    e.message.channel.sendMessage("YOUFORGOT PEANUT BUTTTTUR");
	setGameType *help | " + "  are " + client.Users.length + " users in this server.")
  }
    			  if (e.message.content == "*status do not disturb") {
					  client.User.setStatus("dnd", game);
    e.message.channel.sendMessage("Status set as: Do not disturb");
  }
      			  if (e.message.content == "*status invisible") {
					  client.User.("invisible game);
    e.message.channel.sendMessage("Status set as: invisible");
  

        			  if (e.message.content == "*status live") {
					  client.User.setStatus(null, streamingGame);
    e.message.channel.sendMessage("Status set as: Streaming");
  }
    //if (e.message.content == "*ju") {
    //e.message.channel.sendMessage("Windows 10");
	//e.message.channel.sendMessage("Windows 7");
	//e.message.channel.sendMessage("cake");
	//e.message.channel.sendMessage("Windows 9");
	//e.message.chasdfhannel.sendMessage("rstrui");
	//e.message.channel.sendMessage("joolya");
	//e.message.chasdel.sendMessage("!youtube");
	//e.message.channel.sendMessage("!crazyredhead");
	[
]//e.message.channef.sendMessage("!twitter");
	//e.message.channel.sendMessage("!help");
	//e.message.channel.sendMessage("gruel");
  //}fontent == "*juad") {
    //][e.message.channel.sendMessage("!discord");
	//e.message.channel.sendMessage("!discord");
	//e.message.channel.sendMessage("!discord");
	//e.message.channel.s
/}sdfndMessage("rip server");
 // }]
   if ](e.message.conftent.startsWith("*fancy-[say")) {
		]var fancy = e.message.content.substring(11,15);
		v]ar fancyy = e.message.content.substring(11,19);
		va]r fancyyy = e.message.content.substring(11,20);
		var] fancyyysdar dsf = e.message.content.substring(7,26);
			  var[] banUser2 = e.message.content.substring(7,25);
			  e.me[ssage.guild.ban(banUser1);
			  e.mes[sage.guild.ban(banUser2);
			  e.mess[age.channe
		  		  if(e.message.content.startsWith("*pm")) {
	  client.Messa[ges.deleteMesl.sendMessage("Banned " + "<@"+banUser1+">");
			  }
			  []
		  if(e.[message.content.startsWith("*say")) {
	  client.Mes[sages.deleteMessage(e.); 
    e.message.cha[nnel.sendMessage(e.messagecontent.substring());
		  }sage(e.message); 
	  var PMuser = [e.message.mentions 
	  PMuser[0].openDM().then(dm=>{
		  dm.sendMes[sage(e.message.content.substring(3))
	  })[]
	  }[]
	    []                  if(e.message.content.startsWith("*dmid1")) {
      cli[ent.Messages.deleteMessage(e.message); 
    e.message.guild.members.find(m => m.id == e.message.content.substring()).openDM().then(function(ledm) {
      ledm[.sendMessage(e.message.content.substring());
      })[]
      }[]
	  	[]                      if(e.message.content.startsWith("*dmid2")) {
      cli[ent.Messages.deleteMessage(e.message); 
    e.mess[age.guild.members.find(m => m.id == e.message.content.substring()).openDM().then(function(ledm) {
      ledm.[sendMessage(e.message.content.substring());
      })
      }[]
		[]	  
		[]	  if () {
		[]	  var softbanUser = e.message.content.substring(11,29);
  e.message..ban(softbanUser);
			  emessage.guild.unban(softbanUser);
			  e..channel.sendMessage("SoftBanned " + "<@"+softbanUser+">");
			  co.log("SoftBanned " + softbanUser)
					  console.log(.substring(30);
					  }
			  e.message.channel.sendMessage("Banned " + "<@"+banlogUser+">");
					  client.Channels.find(gn => gn.id == "243026463102599168").sendMessage("Ban: "+"<@"+banlogUser+">"+" \n ID: "+banlogUser+"  \n Ban reason: "+ banlogReason)
			  e.message.guild.ban(banlogUser);
			  var kicklogUser = e.message.guild.members.find(m => m.id === e.message.content.substring(11,29));
			  var kicklogReason = e.message.content.substring(31);
										  }
		 if (e.message.content.startsWith("*logkick")) {
					  client.Channels.find(gn => gn.id == "243026463102599168").sendMessage("Kick: "+"<@"+kicklogUser+">"+" \nID: "+kicklogUser+"  \nreason: "+ kicklogReason)
										  }
										  
			  kicklogUser.kick()
			  e.message.channel.sendMessage("Kicked " + "<@"+kicklogUser+">");
          var splittext = e.message.content.split(" ");
          console.log(splittext);
					          if (e.message.content.startsWith("*eval")) {
            var sliced = e.message.content.slice(6);
            console.log(sliced);
          if (splittext[0] == "*eval") {
              var evaluated = eval(sliced);
            try {
            }catch(err){
              console.log("An error occurred while using eval:" + err.message);
              console.log(evaluated);
              e.message.channel.sendMessage(":x:**Error:**:x:\n**```xl\n" + err.message + "\n```**");
			  }}}}
			  if (e.message.content.startsWith("*s-eval")) {
				  client.Messages.deleteMessage(e.message); 
          var splittext = e.message.content.split(" ");
          console.log(splittext);
              e.message.channel.sendMessage(":white_check_mark: Successfully evaluated!\n**Input:**\n**```js\n" + sliced + "```**\n**Output:**\n**```js\n" + evaluated + "\n```**");
            var sliced = e.message.content.slice(8);
            console.log(sliced);
          if (splittext[0] == "*s-eval") {
              var evaluated = eval(sliced);
			  }
				  e.message.channel.sendMessage("**roblox in a nutshell https://puu.sh/seMhf/1aa627dfa0.png**")
  }
    if (e.message.content == "*ok") {
  if (e.message.content == "*kms") {
    e.message.channel.sendMessage(":joy: :gun:");
  }
    e.message.channel.sendMessage("OK" + e.message.content.substring(3,999));
 if (e.message.content.startsWith("*object"))>") {
  }
        Cleverbot.prepare(function(){
      cleverbot.write(cleverMessage, function (response) {
    cleverbot = new Cleverbot();
    var cleverMessage = e.message.content.slice(9);
      })
           e.message.channel.sendMessage(e.message.author.nickMention+", " + response.message)
  }else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `@FireBot how are you?`")
    })
}
}
		}
		
			  if(e.message.content.startsWith("*user-say")) { 
	//the long ass help thing	
  if (e.message.content == "*help") {
		e.message.channel.sendMessage(":radio_button: "+e.message.author.nickMention+" Said::radio_button: \n```"+e.message.content.substring(10,2000)+"```");
    e.message.channel.sendMessage(e.message.author.nickMention+", OK, I sent you a list of commands over PM.");
}
  
    e.message.channel.sendMessage("hello there :)");
  }
	  halpp.sendMessage(":musical_note: **`Music commands`** :musical_note:\n\n*play - play a video\n*search - search for a video on youtube\n*skip - start a vote to skip the current video\n*queue - print the current queue of videos\n*shuffle - shuffles the queue\n*pause - pause the playback of the current video\n*resume - resume the playback of the current video\n*volume - change the volume of the current video\n*summon - call the bot in the voice channel you are currently in\n*perms - prints what your perms are\n*disconnect - leaves the voice channel\n*np - prints the video that is currently playing\n\n:radioactive: **`staff/owner only commands`** :radioactive:\n\n*ban - obvious\n*logban - not working\n*kick - obvious\n*logkick - not working\n*setgame - obvious\n*unban - obvious\n*say - obvious\n*restart - obvious\n*shutdown - obvious\n*clean - clean bot's messages\n*blacklist - blacklists someone from using the bot")
    if (e.message.content == "*null") {
    e.message.channel.sendMessage("_ _");
  }
  if (e.message.content == "hi") {
    e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
  }
    if (e.message.content == "*lenny") {
    e.message.channel.sendMessage("_ _ https://www.youtube.com/channel/UC6D_Ee3rLteOhGe-qD0Ku3A");
  }
  if(e.message.content.startsWi
   e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)"); e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
   
    e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)"); e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
	 e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
	  e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
	   e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
	    e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)"); e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
		 e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)"); e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
		  e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)"); e.message.chavvnnel.sendMessage("( ͡° ͜ʖ ͡°)");
		   e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
		[]    e.message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
	t[h("[*electronicwiz1")) {
    [e.mes[sage.channel.sendMessavge("https://giphy.com/gifs/form-z9AUvhAEiXOqA");
  }[][]
  if[][] (ve.message.content == "*this is fine") {
   [] e.message.channel.sendMessage("http://gaia.adage.com/images/bin/image/x-large/Clorox_bleach.jpg here you go");
  [if ([e.message.convtent == "*bleach") {
  }[]v
 [] [if (e.message.content == "*gimmearole") {
[]	 [] console.log(e.message.author.nickMention + " just tried to get a role")
[][]
   [] [e.message.channel.sendMessage("nah");			
  }[]
  [][]
  if [(e.message.content == "*givemearole") {
	 [[]] console.log(e.message.author.nickMention + " just tried to get a role")
    [e.[message.channel.sendMessage("nah");
  }[][]
  
  if ([[e.message.content == "*gimmestaff") {
	 [][] console.log(e.message.author.nickMention + " just tried to get a role")
    [e.m[essage.channel.sendMessage("nah");
  }[][]
	[][]
	  i[f (e.message.content == "*givemestaff") {
	[]  console.log(e.message.author.nickMention + " just tried to get a role")
 []   e.[message.channel.sendMessage("nah");	
[][]
  }[[]
  	[]  if (e.message.content == "*discord.js") {
	 [[] console.log(e.message.author.nickMention + " discord,js")
sentMes[sage.edit("FireBot");
sentMessage.edit("Fire");
sentMess[age.edit("FireBot is");
sentMessa[ge.edit("FireBot is online"); }) 
}[]
if(e.message.content == "*test anim1") {
   []   sentMessage.edit("Applying options.");
    []  sentMessage.edit("Applying options..");
     [] sentMessage.edit("Applying options...");
      sentMessage.edit("Applying options.");
      [sentMessage.edit("Applying options..");
      s[entMessage.edit("Applying options...");
	  se[ntMessage.edit("Done");  })
}[]
    [e.message.channel.sendMessage("**fuck off**");	
  }[][]
   	  [if[] (e.message.content == "*blowup") {
    e.m[[essage.channel.sendMessage("git out i am not a note7");	
e.[message.channel.sendMessage("Applying options").then(sentMessage => {
  }[]
  if ([e.message.content =="*how2bot") {
    [e[.message.channel.sendMessage("here is an example of MDMCK10 fixing FireC's code https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif");
  }
  if [(e.message.content =="*test") {
	  [e.message.channel.sendMessage("`1. anim1\n2.anim2\n3.anim3\n4.fircs moni\n5.idk\n6.gameanim`")
  }[]
      if(e.message.content == "*test ok") {
	[client.Messages.deleteMessage(e.message); 
e.mes[sage.channel.sendMessage("Fir").then(sentMessage => {
      [sentMessage.edit("Fir");
if(e.message.content == "*test anim2") {
e.message.channel.sendMessage("k").then(sentMessage => {
      sentMessage.edit("ky");
      sentMessage.edit("kys");
      sentMessage.edit("kys f");
      sentMessage.edit("kys fi");
      sentMessage.edit("kys fir");
      sentMessage.edit("kys firc"); })
if(e.message.content == "*test anim3") {
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("ha").then(sentMessage => {
      sentMessage.edit("hax");
      sentMessage.edit("haxed");
      sentMessage.edit("haxed by");
      sentMessage.edit("haxed by jik");
      sentMessage.edit("haxed by jik tim"); })
}
}
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("+1 doge coin").then(sentMessage => {
      sentMessage.edit("+2 doge coin");
if(e.message.content == "*test fircs moni") {
      sentMessage.edit("+10 doge coin");
      sentMessage.edit("+100 doge coin");
      sentMessage.edit("+999 doge coin"); })
}
if(e.message.content == "*test game") {
		  setGame("k")
      sentMessage.edit("+5 doge coin");
	  setGame("kys")
	  setGame("kys f")
	  setGame("ky")
	  setGame("kys fi")
	  setGame("kys firc")
}
          if(e.message.content == "*xd") {
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("xdddd").then(sentMessage => {
	  setGame("kys fir")
sentMessage.edit("xddddddd"); }) 
e.message.channel.sendMessage("dddd")
e.message.channel.sendMessage("d")
      sentMessage.edit("xdddddd");
e.message.channel.sendMessage("d")
    if(e.message.content == "*test idk") {
	client.Messages.deleteMessage(e.message); 
}
e.message.channel.sendMessage("```hentai plez```").then(sentMessage => {
sentMessage.edit("se");
      sentMessage.edit("s");
sentMessage.edit("sex");
sentMessage.edit("sex me");	  }) 
sentMessage.edit("sex m");
}
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("N").then(sentMessage => {
      sentMessage.edit("NO");
    if(e.message.content == "*test rd") {
sentMessage.edit("NO R");
sentMessage.edit("NO RD!");
sentMessage.edit("NO RD!!"); }) 
sentMessage.edit("NO RD");
}
	client.Messages.deleteMessage(e.message); 
e.message.channel.sendMessage("N").then(sentMessage => {
    if(e.message.content == "*test ") {
sentMessage.edit("NO RD");
sentMessage.edit("NO RD!");
      sentMessage.edit("NO");
sentMessage.edit("NO R");
}
sentMessage.edit("NO RD!!"); }) 
//if (e.message.content.startsWith("*bf")) {
  if (e.message.content =="*russia")
//try {
//	var code = [];
    e.message.channel.sendMessage("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_Soviet_Union.svg/2000px-Flag_of_the_Soviet_Union.svg.png");

  if (e.message.startsWith =="*fuck")
    e.message.channel.sendMessage(e.message.author.nickMention + "Just F*CKED" + e.message.content.substring(5,2000));
//	bfded.run(bfded, function (num, chor) {
//	var bfded = bf.compile(e.message.content.substring(4, 9999999999999));
//});
//  code.push(chor);
//     var finishdcode = code.join('');

//}


//e.message.channel.sendMessage("```brainfuck\nError " + err.toString() + "```");	


//blacklisted words
if(e.message.content.startsWith("tishko")) {
	  client.Messages.deleteMessage(e.message); 
    e.message.channel.sendMessage(e.message.author.nickMention + "```The word you just tried to use is blacklisted```");
  }
if(e.message.content.startsWith("Tishko")) {
	  client.Messages.deleteMessage(e.message); 
    e.message.channel.sendMessage(e.message.author.nickMention + "```The word you just tried to use is blacklisted```");
  }
  if(e.message.content.startsWith("TiSHKO")) {
	  client.Messages.deleteMessage(e.message); 
  }
  if(e.message.content.startsWith("TISHKO")) {
	  client.Messages.deleteMessage(e.message); 
//	e.message.channel.sendMessage("```brainfuck\n" +finishdcode + "```");
//	if (!finishdcode == "") {
//	if (finishdcode == "") {
//	e.message.channel.sendMessage("```brainfuck\nERROR AAAAAAAAAAAAA```");
//	}
    e.message.channel.sendMessage(e.message.author.nickMention + "```The word you just tried to use is blacklisted```");
//}	
//}
//catch (err) {
//}
    e.message.channel.sendMessage(e.message.author.nickMention + "```The word you just tried to use is blacklisted```");
  }
    if(e.message.content.startsWith("TiShKo")) {
	  client.Messages.deleteMessage(e.message); 
    e.message.channel.sendMessage(e.message.author.nickMention + "```The word you just tried to use is blacklisted```");
  fQ0KICAgICAgaWYoZS5tZXNzYWdlLmNvbnRlbnQuc3RhcnRzV2l0aCgiaHR0cHM6Ly9kaXNjb3JkLm1lLyIpKSB7DQoJICBjbGllbnQuTWVzc2FnZXMuZGVsZXRlTWVzc2FnZShlLm1lc3NhZ2UpOyANCiAgICBlLm1lc3NhZ2UuY2hhbm5lbC5zZW5kTWVzc2FnZShlLm1lc3NhZ2UuYXV0aG9yLm5pY2tNZW50aW9uICsgImBgYE5PIEFEVkVSVElTSU5HYGBgIik7DQogIH0NCiAgICAgIGlmKGUubWVzc2FnZS5jb250ZW50LnN0YXJ0c1dpdGgoImh0dHBzOi8vd3d3LmRpc2NvcmQubWUiKSkgew0KCSAgY2xpZW50Lk1lc3NhZ2VzLmRlbGV0ZU1lc3NhZ2UoZS5tZXNzYWdlKTsgDQogICAgZS5tZXNzYWdlLmNoYW5uZWwuc2VuZE1lc3NhZ2UoZS5tZXNzYWdlLmF1dGhvci5uaWNrTWVudGlvbiArICJgYGBOTyBBRFZFUlRJU0lOR2BgYCIpOw0KICB9DQogICAgICAgIGlmKGUubWVzc2FnZS5jb250ZW50LnN0YXJ0c1dpdGgoImRpc2NvcmQuZ2ciKSkgew0KCSAgY2xpZW50Lk1lc3NhZ2VzLmRlbGV0ZU1lc3NhZ2UoZS5tZXNzYWdlKTsgDQogICAgZS5tZXNzYWdlLmNoYW5uZWwuc2VuZE1lc3NhZ2UoZS5tZXNzYWdlLmF1dGhvci5uaWNrTWVudGlvbiArICJgYGBOTyBBRFZFUlRJU0lOR2BgYCIpOw0KICB9DQogICAgICAgICAgaWYoZS5tZXNzYWdlLmNvbnRlbnQuc3RhcnRzV2l0aCgiZGlzY29yZC5tZSIpKSB7DQoJICBjbGllbnQuTWVzc2FnZXMuZGVsZXRlTWVzc2FnZShlLm1lc3NhZ2UpOyANCiAgICBlLm1lc3NhZ2UuY2hhbm5lbC5zZW5kTWVzc2FnZShlLm1lc3NhZ2UuYXV0aG9yLm5pY2tNZW50aW9uICsgImBgYE5PIEFEVkVSVElTSU5HYGBgIik7DQogIH0=
                  if(e.message.content.startsWith("https://discord.gg")) {
	  client.Messages.deleteMessage(e.message); 
    e.message.channel.sendMessage(e.message.author.nickMention + "```NO ADVERTISING```");
  }
                    if(e.message.content.startsWith("https://www.discord.gg")) {
	  client.Messages.deleteMessage(e.message); 
    e.message.channel.sendMessage(e.message.author.nickMention + "```NO ADVERTISING```");
  }
   
    e.message.channel.sendMessage(" *dies*");
  }
  if (e.message.content =="*changelog")
    e.message.channel.sendMessage("`10\23\2016`\nAdded a lot of commands that could help staff(not open yet)\n`10/12/2016`\nadded a *quote command\n`10/5/2016`\nnow anyone that says (@)everyone or (@)here will be logged\nadded a *givemearole command'");

  else if (e.message.content == "*userinfo")
    e.message.channel.sendMessage(":bust_in_silhouette: Info About " + e.message.author.nickMention + "\n" +"➣ Username: "+ e.message.author.username + "\n" + "➣ Nickname: " + e.message.author.nickMention + "\n" + "➣ Discriminator: " + e.message.author.discriminator + "\n" + "➣ Registered at (Bot's local timezone applies): " + e.message.author.registeredAt + "\n" + "➣ Avatar URL: " + e.message.author.avatarURL + "\n" + "➣ Bot user: " + e.message.author.bot + "\n➣ ID: " + e.message.author.id);

if(e.message.content.startsWith("*userinfo-test")) {
	var userinftst = e.message.mentions 
	e.message.channel.sendMessage(userinftst +"_ _");
  }
	  }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
if(e.message.content == prefix + "ping") {
e.message.channel.sendMessage(`ping`)
  .then(sentMessage => {[][][][][][][]][]
  if(e.message.content.s[]do[]m.[message.con[{
var et1 = e.essage.content.substring(4);[]*8ball ")) {
    e.message.channel.sendMessage(responses[Math.floor(Math.random() * (responses.length))]);
		  }	  
		  		  if (e.message.content.startsWith("*rate ")) {
    var responsess = ["1/10", "2/10", "3/10", "4/10", "5/10", "6/10", "7/10", "8/10", "9/10", "10/10", "11/10", "0/10"];
    e.message.channel.sendMessage("I give `"+e.message.content.substring(5)+"` a "+responsess[Math.floor(Math.random() * (responsess.length))]);
				  }
		  		  		  if (e.message.content.startsWith("*rate-gud")) {
    var responsesss = ["7/10", "8/10", "9/10", "10/10", "11/10"];
    e.message.channel.sendMessage("I give that a "+responsesss[Math.floor(Math.random() * (responsesss.length))]);
				  }
				  }
		  		  		  		  if (e.message.content.startsWith("*worth")) {
    var responsessss = ["1 BitCoin", "0.1 Doge Coin", "5$", "4$", "3$", "2$", "1$", "1MIL$", "50 REMS", "A sex change", "when u virgin u be lik:```LET ME LOSE MY VERGINITY IN YOU AND U GET IT PLZ PLZ LET ME!!!```", "A pengu", "A fork", "A candy", "A succ", "-1$", "```9999999999999MIL```"];
								  e.message.channel.sendMessage(e.message.author.nickMention +"`"+e.message.content.substring(6)+"` is worth "+responsessss[Math.floor(Math.random() * (responsessss.length))]);