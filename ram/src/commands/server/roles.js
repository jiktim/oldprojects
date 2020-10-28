const { Command } = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('roles', {
            aliases: ['roles'],
            category: 'server',
            channel: 'guild',
            description: { content: 'Get all roles in current server/guild.' }
        });
    }

    async exec(message) {
        message.util.send({ embed: {
            title: `Roles in ${message.guild.name}`,
            description: `\`\`\`diff\n${message.guild.roles.map(role => `[${role.id}] ${role.name} [${role.members.size} users]`).join('\n')}\`\`\``
        }});
    }
}

module.exports = PingCommand;