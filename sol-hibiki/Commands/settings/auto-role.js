const Command = require('../../Structures/Command');

module.exports = class AutoRole extends Command {
    constructor(client) {
        super(client, {
            name: 'auto-role',
            aliases: ['join-role'],
            group: 'settings',
            memberName: 'auto-role',
            description: 'Sets an role where new members instantly get the role.',
            guildOnly: true,
            args: [{
                key: 'role',
                prompt: 'What would be the role for new members?\n',
                type: 'role'
            }]
        });
    }
    
    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_ROLES');
    }

    run(msg, { role }) {
        msg.guild.settings.set('autoRole', role.id);
        return msg.say(`✅ | Succesfully set **auto role** to **${role.name}** (**${role.id}**).`);
    }
};
