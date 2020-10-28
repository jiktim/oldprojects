const { Command } = require('discord-akairo');

class AgreeCommand extends Command {
    constructor() {
        super('agree', {
            aliases: ['agree'],
            category: 'general',
            channel: 'guild',
            quoted: false,
            description: { content: 'Allows a user to agree to the rules.' }
        });
    }

    async exec(message) {
        const agreeEnabled = this.client.settings.get(message.guild.id, 'agreeEnabled');
        const agreeChannel = this.client.settings.get(message.guild.id, 'agreeChannel');
        const agreeRole = this.client.settings.get(message.guild.id, 'agreeRole');

        if (!agreeEnabled || !agreeRole) {
            return message.util.send({
                embed: {
                    color: 0xFF0000,
                    title: 'Error!',
                    description: 'Agreement system has not been configured in this server.',
                    footer: {
                        text: 'Admins, to enable agreement, please run the agree-enable command.'
                    }
                },
            });
        }
        if (agreeChannel && agreeChannel !== message.channel.id) {
            return message.util.send({
                embed: {
                    color: 0xFF0000,
                    title: 'Error!',
                    description: 'Agreement system cannot be used in this channel.',
                },
            });
        }
        let role;
        try { 
            role = message.guild.roles.get(agreeRole.id);
            message.member.roles.add(role, [':: Member has agreed to the rules.']);
            message.delete();
        } catch (_) {
            message.util.send({
                embed: {
                    color: 0xFF0000,
                    title: 'Error!',
                    description: 'The role given to new members is invalid.',
                },
            });
        }
    }
}

module.exports = AgreeCommand;