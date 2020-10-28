// WORK IN PROGRESS
const fs = require("fs");
const connections = {};

var jpop = "https://listen.moe/opus";
//oh yeah get the latest ffmpeg binary before you run this
module.exports = function (msg, bot, args) {
  if (bot.voiceConnections.get(msg.channel.guild.id)) { //ITS IN THE FUCKING TIMEOUT
    	  	bot.voiceConnections.get(msg.channel.guild.id).stopPlaying();
      } 
  setTimeout(
              function() {
bot.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
            bot.createMessage(msg.channel.id, "Error joining voice channel: " + err.message); // Notify the user if there is an error
            console.log(err); // Log the error
        }).then((connection) => {
            
            connection.once("end", () => {
            bot.createMessage(msg.channel.id, `📻❌ Stopped playing radio!`); // Say when the file has finished playing
            });
  // program flow omg so intelectual
            
                        connection.play(jpop); // Play the file and notify the user
                        bot.createMessage(msg.channel.id, `📻✅ Playing radio!`);

            
})
                }, 3000); // wait 3 secs 
            
}