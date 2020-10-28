var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie();
var token = "MjU5NTMwMTEzMjc0NzQwNzM2.C0xFCQ.jhqyINwrunX5dG7BzaYOLcMW_ds";
client.connect({ token: "MjU5NTMwMTEzMjc0NzQwNzM2.C0xFCQ.jhqyINwrunX5dG7BzaYOLcMW_ds" });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("HuskyBot is now online!");
  client.User.setGame("&help for CMD'S!");
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  if (e.message.content == "&help")
    e.message.channel.sendMessage(e.message.author.nickMention + "```\nCaptialization does matter! Nothing should have caps in it\n&about = Info about bot\n&ping = See if the bot can see your message and send messages\n&aroo = D:\n&userinfo = information about a user\n***&&help = displays list of commands for musicbot***\n&fun = :o\n*** = command is unavailable```");

  if (e.message.content == "&fun")
    e.message.channel.sendMessage(e.message.author.nickMention + "```\nCaptialization does matter! Nothing should have caps in it\n&ddos = :o\n&triggered\n```");

  if (e.message.content == "&&help")
    e.message.channel.sendMessage(e.message.author.nickMention + "`You must summon the bot if it is not in the channel. Join a music channel and type &&summon`");

  if (e.message.content == "&about")
    e.message.channel.sendMessage("```HuskyBot is a simple discordie bot written by Jj The Husky, and runs Rhino Music Bot.\nThis bot is ran on dedicated servers, so this bot will not have any issues.```\n`Bot version; 0.6`");


var ownerid = "99292263909195776";
if (e.message.author.id == ownerid) {
if (e.message.content.startsWith("&restart")) {
	e.message.channel.sendMessage("Restarting...");
        client.disconnect(); client.connect({ token: token });
}
if (e.message.content.startsWith("&shutdown")) {
	e.message.channel.sendMessage("Shuting down...");
        client.disconnect();
              }
}
  if (e.message.content == "&ping")
    e.message.channel.sendMessage("Eeeee~!");

  if (e.message.content == "&aroo")
    e.message.channel.sendMessage("Arrrooooooooooooooooo!");

  if (e.message.content == "!isJJGay")
    e.message.channel.sendMessage("No who tf is Jj");

  if (e.message.content == "&userinfo")
    e.message.channel.sendMessage(":bust_in_silhouette: Info About " + e.message.author.nickMention + "\n" +"➣ Username: "+ e.message.author.username + "\n" + "➣ Nickname: " + e.message.author.nickMention + "\n" + "➣ Discriminator: " + e.message.author.discriminator + "\n" + "➣ Registered at (Bot's local timezone applies): " + e.message.author.registeredAt + "\n" + "➣ Avatar URL: " + e.message.author.avatarURL + "\n" + "➣ Bot user: " + e.message.author.bot + "\n➣ ID: " + e.message.author.id);

  if (e.message.content == "&triggered")
    e.message.channel.sendMessage("I'M TRIGGERED!\nDON'T YOU TRIGGER ME AGAIN");


  if (e.message.content.startsWith("&ddos")) {
    var responses = ["DDosing The IP of 8.8.8.8", "DDosing The IP of 127.0.0.1", "DDosing The Server of Cloudflare.com", "DDosing The IP of your mom", "DDosing The Server of YouTube.com", "DDosing The Server of The NSA", "DDosing The Server of HillaryClinton.com", "DDosing The Server of DonaldJTrump.com", "DDoSing athe server Of Your School"];
    e.message.channel.sendMessage(responses[Math.floor(Math.random() * (responses.length))]);
         }
  if (e.message.content == "rd")
    e.message.channel.sendMessage(e.message.author.nickMention + " DO NOT RD YOUR COMPUTER!!");

//next time just put code here instead of making a new event <3

});
client.Dispatcher.on(Events.GUILD_MEMBER_ADD, gma => {
  //gma.guild.generalChannel.sendMessage(gma.member.nickMention + " just joined **" + gma.guild.name + "** make sure to read the rules! ^.^");
  client.Channels.find(gn => gn.id == "242406788417323009").sendMessage(gma.member.nickMention + " just joined **" + gma.guild.name + "** make sure to read the rules! ^.^")
  console.log(gma.member.username + " joined " + gma.guild.name);
});

client.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, gmr => {
  //gmr.guild.generalChannel.sendMessage(gmr.user.username + " just left **" + gmr.guild.name + "**. :(");
  client.Channels.find(gn => gn.id == "242406788417323009").sendMessage(gmr.user.username + " just left **" + gmr.guild.name + "**. :(")
  console.log(gmr.user.username + " left " + gmr.guild.name);
});


client.Dispatcher.on(Events.GUILD_BAN_ADD, gba => {
  //gba.guild.generalChannel.sendMessage(gba.user.username + " just got banned. o.o");
  client.Channels.find(gn => gn.id == "242406788417323009").sendMessage(gba.user.username + " just got banned. o.o")
  console.log(gba.user.username + " got banned from " + gba.guild.name);
});

client.Dispatcher.on(Events.GUILD_BAN_REMOVE, gba => {
  //gba.guild.generalChannel.sendMessage(gba.user.username + " just got unbanned. ._.");
  client.Channels.find(gn => gn.id == "242406788417323009").sendMessage(gba.user.username + " just got unbanned. ._.")
  console.log(gba.user.username + " got unbanned from " + gba.guild.name);
});
