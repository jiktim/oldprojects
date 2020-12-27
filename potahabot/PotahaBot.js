var Discordie = require("discordie");
var client = new Discordie();
var prefix = "p-"
var ownerid = "219826813554130944"
var adminRoleName = "Owners";
client.User.setGame("coding w/ Potaha | " + prefix + "help ")
client.User.setStatus("dnd")
client.connect({ token: "replace diz shit with ur token" });

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on("MESSAGE_CREATE", e => {

  if(e.message.content == prefix + "ping") {
    e.message.channel.sendMessage("ping")
  .then(sentMessage => {
      sentMessage.edit(`Pong! | ${Date.parse(sentMessage.timestamp) - Date.parse(e.message.timestamp)}ms`);
  });
  }
 
if (e.message.content.startsWith(prefix + "rate ")) {
     var ratething = e.message.content.substring(6,2000)
     var randomvalue1 = Math.floor(Math.random() * 11);
     var randomvalue2 = Math.round(randomvalue1)
     e.message.channel.sendMessage("I rate " + "`" + ratething + "`" + " " + randomvalue2 + "/10.")
     console.log(e.message.author.username + " rated " + ratething + ". The results were: " + randomvalue2 + ".")
}
if (e.message.content.startsWith(prefix + "cat")) {
     var cat = e.message.content.substring(6,2000)
     var randomvalue1 = Math.floor(Math.random() * 999);
     var randomvalue2 = Math.round(randomvalue1)
     e.message.channel.sendMessage("http://random.cat/view?i=" + randomvalue2)
}


if (e.message.content.startsWith(prefix+"8ball ")) {
    var responses = ["It is certain", "Without a doubt", "You may rely on it", "Most likely", "Yes", "Signs point to yes", "Better not tell you now", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
    e.message.channel.sendMessage(responses[Math.floor(Math.random() * (responses.length))]);
          }  
		  
		 
		   if (e.message.content == prefix + "about") {
	  e.message.channel.sendMessage(e.message.author.nickMention  +  " , `This bot was made by ` <@!219826813554130944> ` also , special thanks to ` <@!244509121838186497> ` for these bot commands `:heart:");
  }
           if (e.message.content == prefix + "myid") {
			   e.message.reply("Here's your user id :  " + " `" + e.message.author.id + "` " + ">" + ".")
		   }
		   
		   if (e.message.content == prefix + "hi") {
			   e.message.content.sendMessage("Hey , " + e.message.author.nickMention + " :) ");
		   }
		  
		  if (e.message.content.startsWith(prefix+"jpg")) {
        var imageNames = ["Loool.jpg", "kek.jpg", "Reeee.jpg", "wooooow.jpg", "Woaaaah.jpg"];
        e.message.channel.uploadFile(imageNames [Math.floor(Math.random() * (imageNames .length))]);
    }
       
 if (e.message.content == "ayy") {
	 e.message.channel.sendMessage("lmao");
 }
 if (e.message.content == prefix + "userinfo") {
    e.message.channel.sendMessage("Username about " + e.message.author.username + "\n" + "Username: e.message.author.username + "\n" + "Nickname: " +  e.message.author.nickMention" + "\n" + "Discriminator: " + e.message.author.discriminator + "\n" + "Registered at (Bot's local timezone applies): " + e.message.author.registeredAt + "\n" + "Avatar URL (link) : " + e.message.author.avatarURL + "\n" + "Bot user: " + e.message.author.bot + "\n" "ID: " + e.message.author.id);
 }
if (e.message.author.id == "219826813554130944") {
             if (e.message.content.startsWith(prefix + "say")) {
      client.Messages.deleteMessage(e.message); 
       e.message.channel.sendMessage(e.message.content.substring(6));
          }
}
if (!e.message.author.id == "219826813554130944") {
if(e.message.content.startsWith(prefix+"say")) {
e.message.reply("**You pleb,** that's for owner's only.");
}
}

  
   
 });
