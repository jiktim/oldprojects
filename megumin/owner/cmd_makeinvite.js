module.exports = function(msg, bot, args) {
var guild = bot.guilds.find(gd => gd.id == args)// find guild
if (guild != undefined) { //check if guild is found
  var channel = guild.channels[0]
  console.log(guild+" ; "+channel)
channel.createInvite({}, "Megumin support!").then(ow => {msg.channel.createMessage("Invite for "+guild.name+" created: https://discord.gg/"+ow.code)})  
} else {
  
var guild = bot.guilds.find(gd => gd.name.toLowerCase() == args)
var channel = guild.channels[0]
channel.createInvite({}, "Megumin support!").then(ow => {msg.channel.createMessage("Invite for "+guild.name+" created: https://discord.gg/"+ow.code)})
}
};