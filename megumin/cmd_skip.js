module.exports = function(msg, bot, args) {
  //bad code
	if (!msg.member.voiceState.channelID) {
			msg.channel.createMessage('You have to be in a voice channel!');
	} else {
      if (bot.voiceConnections.get(msg.channel.guild.id)) {
    	  	bot.voiceConnections.get(msg.channel.guild.id).stopPlaying();
      } 
      bot.leaveVoiceChannel(msg.member.voiceState.channelID);
      bot.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
            bot.createMessage(msg.channel.id, "Error joining voice channel: " + err.message); // Notify the user if there is an error
            console.log(err); // Log the error
        }).then((connection) => {
        connection.play("http://opus-codec.org/static/examples/samples/speech_orig.wav"); 
        })
      if (bot.voiceConnections.get(msg.channel.guild.id)) {
    	  	bot.voiceConnections.get(msg.channel.guild.id).stopPlaying(); //end stream
      } // very smart solution FIREC APROOVES
      bot.leaveVoiceChannel(msg.member.voiceState.channelID);
	}
}