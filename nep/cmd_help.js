module.exports = function(param,clientArg, args) { // it sends help
    clientArg.getDMChannel(param.author.id).then(dm => {
                param.channel.createMessage(param.author.mention + ", Sliding into your dms! :wink:\n**<input>** - Required input\n");
                return clientArg.createMessage(dm.id, {
                    embed: {
                        author: {
                            name: "Nep. \nCoded by FireC, TTtie, Cth103."
                        },
			description: "Commands:",
                        fields: [{
                            name: "nep!help",
                            value: "Sends this message."
                        },{
                            name: "nep!ping",
                            value: "Pong."
                        },{
                            name: "nep!cat",
                            value: "Nep sends a random cat image! *MEOW ^^*"
                        },
			{
                            name: "nep!urbandict <input>",
                            value: "Pull info from the urban dictionary!"
                        },{
                            name: "nep!garfield",
                            value: "Random garfield comic"
                        },{
                            name: "nep!r34 <input>",
                            value: "Pull images from rule34, how lewd! ^^"
                        },{
                            name: "nep!cowsay <input>",
                            value: ":cow: <( Moo!)"
                        },{
                            name: "nep!uptime",
                            value: ":clock1030: Tell you how long the bot has been running for!"
                        },{
                            name: "nep!8ball",
                            value: ":8ball: Nep will read your future! ^^"
                        }],
                        color: 0xa71bba,
                        footer: {
                            text: `nep!help`
                        }
                    }
                });
            });
}
