const Command = require('../../Structures/Command');

module.exports = class AntiInvite extends Command {
    constructor(client) {
        super(client, {
            name: 'anti-invite',
            aliases: ['invite-guard', 'no-invite'],
            group: 'settings',
            memberName: 'anti-invite',
            description: 'Configures anti-invite for this server.',
            guildOnly: true,
        });
    }
    
    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }

    run(msg) {
        msg.guild.settings.set('antiInvite', true);
        return msg.say('✅ | Succesfully enabled **anti invite** for this server.');
    }
};