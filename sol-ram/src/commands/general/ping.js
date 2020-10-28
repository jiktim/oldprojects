const { Command } = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'general',
            description: { content: 'Pings the bot.' }
        });
    }

    async exec(message) {
        const sent = await message.util.send({
            embed: {
                color: 0xb4b0b0,
                title: 'Pinging..'
            }
        });
        
        const sentTime = sent.editedTimestamp || sent.createdTimestamp;
        const startTime = message.editedTimestamp || message.createdTimestamp;
        return sent.edit({
            embed: {
                color: 0xE91E63,
                title: 'Pong!',
                description: `Message took **${sentTime - startTime} ms**, gateway took **${this.client.ws.ping} ms**`,
                footer: { text: `Total ping: ${sentTime - startTime - this.client.ws.ping} ms`}
            }
        });
    }
}

module.exports = PingCommand;