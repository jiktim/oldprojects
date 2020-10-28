var Discordie = require("discordie");
const request = require("request");
var client = new Discordie();
var Events = Discordie.Events;
var ownerid = "194892236650053633";

client.connect({
  token: "MjU5NTMwMTEzMjc0NzQwNzM2.C0xFCQ.jhqyINwrunX5dG7BzaYOLcMW_ds"
});
client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
  console.log("The bot is currently in " + client.Guilds.length + " servers, with " + client.Users.length + " users.");
  setGame("Say ew1;help :).")
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
			  if(e.message.content.startsWith("ew1;help")) { 
    e.message.channel.sendMessage("**```\nCommands\new1;8ball - get a random answer\new1;say - make the bot say something\new1;cat - get a random picture of a kitty\new1;userinfo - prints out information about your profile\new1;help - print out this message\new1;youtube - get a link to my channel\new1;website - get link to my website```**\n*Coded by:FireC for Electronicwiz1 :)*");
			  }
			  else if (e.message.content == "ew1;userinfo")
    e.message.channel.sendMessage(":bust_in_silhouette: Info About " + e.message.author.nickMention + "\n" +"➣ Username: "+ e.message.author.username + "\n" + "➣ Nickname: " + e.message.author.nickMention + "\n" + "➣ Discriminator: " + e.message.author.discriminator + "\n" + "➣ Registered at (Bot's local timezone applies): " + e.message.author.registeredAt + "\n" + "➣ Avatar URL: " + e.message.author.avatarURL + "\n" + "➣ Bot user: " + e.message.author.bot + "\n➣ ID: " + e.message.author.id);
			    if (e.message.content.startsWith("ew1;8ball")) {
    var responses = ["It is certain", "Without a doubt", "You may rely on it", "Most likely", "Yes", "Signs point to yes", "Better not tell you now", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
    e.message.channel.sendMessage(responses[Math.floor(Math.random() * (responses.length))]);
  }
	  if(e.message.content.startsWith("ew1;youtube")) {
    e.message.channel.sendMessage("https://www.youtube.com/channel/UC6D_Ee3rLteOhGe-qD0Ku3A");
	  }
	  	  if(e.message.content.startsWith("ew1;website")) {
    e.message.channel.sendMessage("http://electronicwiz1.comxa.com/");
	  }
		  if(e.message.content.startsWith("@everyone")) {
    console.log(e.message.author.nickMention + " Just used @everyone ")
}

	  if(e.message.content.startsWith("@here")) {
    console.log(e.message.author.nickMention + " Just used @here ")
} 

	  if(e.message.content.startsWith("<@227023451645411329>")) {
    console.log(e.message.author.nickMention + " Just mentioned me with the message: \n" + e.message.content.substring(5,2000))
}
	  if(e.message.content.startsWith("nnnnnnnnnnnnnnuhuiiuhuihuhhihjbbyghyiig")) {
    console.log(e.message.author.nickMention + "just used a command =" + e.message.content.substring(5,2000))
	}
		      if (e.message.author.id == ownerid) {
		  if(e.message.content.startsWith("ew1;say")) {
	  client.Messages.deleteMessage(e.message); 
    e.message.channel.sendMessage(e.message.content.substring(5,2000));
		  }
	}
	    if (e.message.content =="ew1;mspaint.exe") {
    e.message.channel.sendMessage("get tf out plz kthx");
  }
      if (e.message.content =="ew1;mspaint") {
    e.message.channel.sendMessage("get tf out plz kthx");
  }
        if (e.message.content =="ew1;am i gey?") {
    e.message.channel.sendMessage("**for sure**");
  }
          if (e.message.content =="ew1;help") {
		  e.message.channel.sendMessage("```diff\n + ew1;say - make the bot say something\n+ ew1;cat - get a picture of a kitty cat \n+ ew1;am i gey? - are you gay?\n+ ew1;website - ok\n+ ew1;youtube - ok");
  }
    if(e.message.content.startsWith("ew1;cat")) {
    request("http://random.cat/meow", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        var cat = result.file;
        e.message.channel.sendMessage(cat);
      }
    });
  }
	      if (e.message.author.id == ownerid) {
        if (e.message.content.startsWith("**eval")) {
          var splittext = e.message.content.split(" ");
          console.log(splittext);
          if (splittext[0] == "**eval") {
            var sliced = e.message.content.slice(6);
            console.log(sliced);
            try {
              var evaluated = eval(sliced);
              console.log(evaluated);
              e.message.channel.sendMessage("Input:\n```js\n" + sliced + "```\nOutput:\n```js\n" + evaluated + "\n```");
            }catch(err){
              console.log("An error occurred while using eval:" + err.message);
              e.message.channel.sendMessage("Error:\n```xl\n" + err.message + "\n```");
		}}}};
});

client.Dispatcher.on(Events.GUILD_MEMBER_ADD, gma => {
  gmr.guild.generalChannel.sendMessage(gmr.user.username + " just left **" + gmr.guild.name + "**. :(");
  console.log(gma.member.username + " joined " + gma.guild.name);
});
client.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, gmr => {
  console.log(gmr.user.username + " left " + gmr.guild.name);
  gma.guild.generalChannel.sendMessage(gma.member.nickMention + " just joined **" + gma.guild.name + "** ^.^");
});
function setGame(name) {
  var game = {name: name};
  client.User.setGame(game);
}
