const Command = require('../../Structures/Command');

module.exports = class AntiInviteRole extends Command {
    constructor(client) {
        super(client, {
            name: 'mod-log',
            aliases: ['mod-log-channel', 'm-l'],
            group: 'settings',
            memberName: 'mod-log',
            description: 'Sets an moderation channel for ban/kick/unban logs and etc.',
            guildOnly: true,
            args: [{
                key: 'channel',
                prompt: 'What would be the moderation log channel?\n',
                type: 'channel'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }

    run(msg, { channel }) {
        msg.guild.settings.set('modLog', channel.id);
        return msg.say(`✅ | Succesfully set moderation log channel to \`${channel.name}\` in this server.`);
    }
};
