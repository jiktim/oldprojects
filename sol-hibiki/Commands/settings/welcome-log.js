const Command = require('../../Structures/Command');

module.exports = class WelcomeLog extends Command {
    constructor(client) {
        super(client, {
            name: 'welcome-log',
            aliases: ['welcome-channel', 'member-log'],
            group: 'settings',
            memberName: 'welcome-log',
            description: 'Sets a logging channel for new users.',
            guildOnly: true,
            args: [{
                key: 'channel',
                prompt: 'What log channel do you want to set for new users?\n',
                type: 'channel'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }

    run(msg, { channel }) {
        msg.guild.settings.set('welcomeLog', channel.id);
        return msg.say(`✅ | Succesfully set log channel for new users to <#${channel.id}> (\`${channel.name}\`) in this server.`);
    }
};
