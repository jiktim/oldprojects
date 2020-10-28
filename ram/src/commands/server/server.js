const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

class PingCommand extends Command {
    constructor() {
        super('server', {
            aliases: ['server', 'guild'],
            category: 'server',
            channel: 'guild',
            description: { content: 'Provides information about the current server/guild.' }
        });
    }

    async exec(message) {
        message.util.send({ embed: {
            title: message.guild.name,
            description: stripIndents`
            👥 ${message.guild.members.size} members
            👑 ${message.guild.owner.user.tag}
            
            `,
            thumbnail: { url: message.guild.iconURL() },
            footer: { text: 'Server created at' },
            timestamp: message.guild.createdAt
        }});
    }
}

module.exports = PingCommand;