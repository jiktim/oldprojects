var Discord = require("discord.js");

var bot = new Discord.Client();

// PREFIX //
var prefix = "::";
// -- -- //

// Message (hi) reply (Hello!) //
bot.on("message", function(message)
{
    if(message.content === "Hi")
    {
        message.channel.sendMessage("Hello!");
    }
});

// Message (hi) reply (Hello!) //
bot.on("message", function(message)
{
    if(message.content === "hi")
    {
        message.channel.sendMessage("Hello!");
    }
});














bot.on("message", function(message)
{
    if(message.content === prefix + "lemons")
    {
        message.channel.sendMessage("I don't want your damn lemons! What am I supposed to do with these? Demand to see life's manager! Make life rue the day it thought it could give Cave Johnson lemons! Do you know who I am? I'm the man whose gonna burn your house down - with the lemons!  I'm gonna get my engineers to invent a combustible lemon that'll burn your house down!");
    }
});








bot.on("message", function(message)
{
    if(message.content === prefix + "infinity")
    {
        message.channel.sendMessage("https://support.discordapp.com/hc/en-us/article_attachments/212300167/portal.gif");
    }
});








bot.on("message", function(message)
{
    if(message.content === prefix + "Command Name")
    {
        message.channel.sendMessage("Bot Reply");
    }
});














// -- -- -- -- -- -- -- -- //


// https://discordapp.com/oauth2/authorize?client_id=240463308132450305&scope=bot //





// LOGIN INFO //
bot.login("MjQwNDYzMzA4MTMyNDUwMzA1.CvIWrw.jXNkU_mmh5RgeHFLmvHhza3Cpeg");
// END OF SCRIPT //
