const { Command } = require('discord-akairo');

class AgreeChannelCommand extends Command {
    constructor() {
        super('agreechannel', {
            aliases: ['agree-channel'],
            category: 'moderation',
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            quoted: false,
            args: [{
                id: 'channel',
                type: 'channel',
                prompt: {
                    start: 'What would you like to set the agreement channel to?',
                    retry: 'Please provide a valid channel.'
                }
            }],
            description: {
                content: 'Changes the agrement channel on this guild.',
                usage: '<channel>',
                examples: ['agreechannel <channel>']
            }
        });
    }

    async exec(message, { channel }) {
        try {
            await this.client.settings.set(message.guild.id, 'agreeChannel', channel.id);
            return message.util.send({ 
                embed: {
                    color: 0x00FF00,
                    title: 'Success!',
                    description: `Agreement channel set to \`${channel.name}\`.`
                }
            });
        } catch (_) {
            message.util.send({
                embed: {
                    color: 0xFF0000,
                    title: 'Error!',
                    description: 'The channel used for new members is invalid.',
                },
            });
        }
    }
}

module.exports = AgreeChannelCommand;