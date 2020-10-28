const Command = require('../../Structures/Command');

module.exports = class AntiInviteRole extends Command {
    constructor(client) {
        super(client, {
            name: 'anti-invite-role',
            aliases: ['air', 'no-invite-role', 'nir'],
            group: 'settings',
            memberName: 'anti-invite-role',
            description: 'Sets an role where you/members can bypass the anti-invite (if enabled).',
            guildOnly: true,
            args: [{
                key: 'role',
                prompt: 'What would be the role?\n',
                type: 'role'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_ROLES');
    }

    run(msg, { role }) {
        msg.guild.settings.set('antiInviteRole', role.id);
        return msg.say(`✅ | Succesfully set **anti invite role** to **${role.name}** (**${role.id}**).`);
    }
};