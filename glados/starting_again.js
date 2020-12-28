var Discord = require("discord.js");
var bot = new Discord.Client();
var questions = require('questions');
// COLORS //
var colors = require("colors/safe");
colors.setTheme({
  cyan: "cyan",
  green: "green",
  yellow: "yellow",
  blue: "blue",
  red: "red",
  grey: "grey",
  multi: "rainbow",
});
// // // //
// PREFIX //
var prefix = ">";
// // // // //

bot.on('ready', () => {
  console.log('And im feeeeeling onlineeeee!!!!!!');
});

// KICK COMMAND //
var owner = {
    id : "211172230099501056"
};

bot.on("message", function(message)
{
    if(message.content.startsWith(">kick "))
    {
        try {
            if(message.author.id == owner.id) {
                message.guild.member(message.mentions.users.first()).kick()
                message.channel.sendMessage("BANG! CRASH! " + message.mentions.users.first() + " just went flying out of that glass window back there with my shoe! **Thank me laster.**")
                
                console.log(message.author.username + " <" + message.author.id + "> " + "kicked " + message.mentions.users.first().username + "!");
            } else {
                console.log(message.author.username + " <" + message.author.id + "> " + "tried to kick " + message.mentions.users.first().username + "!");
            }
        } catch(err) {
            console.log("Kick error occured: " + err.message + "");
            message.reply("I caught a fly/error! Here it is: `" + err.message + ".`");
        }
    }
});
// // // // //
bot.on("message", function(message)
{
if (message.content.startsWith(">slap"))
  {
      message.channel.sendMessage(message.author + " just slapped " + message.content.substring(6));
  }

  if (message.content.startsWith(">shoot"))
  {
      message.channel.sendMessage(message.author + " just shot " + message.content.substring(7));
  }

  if (message.content.startsWith(">stab"))
  {
      message.channel.sendMessage(message.author + " just stabbed " + message.content.substring(6));
  }
  
bot.login("Token here");
