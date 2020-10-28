const { Command } = require('discord-akairo');

class AgreeRoleCommand extends Command {
    constructor() {
        super('agreerole', {
            aliases: ['agree-role'],
            category: 'moderation',
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            quoted: false,
            args: [{
                id: 'role',
                type: 'role',
                prompt: {
                    start: 'What would you like to set the agreement role to?',
                    retry: 'Please provide a valid role.'
                }
            }],
            description: {
                content: 'Changes the agrement role on this guild.',
                usage: '<role>',
                examples: ['agreerole <role>']
            }
        });
    }

    async exec(message, { role }) {

        try {
            await this.client.settings.set(message.guild.id, 'agreeRole', role);
            return message.util.send({
                embed: {
                    color: 0x00FF00,
                    title: 'Success!',
                    description: `Agreement role set to \`${role.name}\`.`,
                },
            });
        } catch (_) {
            message.util.send({
                embed: {
                    color: 0xFF0000,
                    title: ':x: Error!',
                    description: '**::** The role given to new members is invalid.',
                },
            });
        }
    }
}

module.exports = AgreeRoleCommand;