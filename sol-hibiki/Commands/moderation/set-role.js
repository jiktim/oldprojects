const Command = require('../../Structures/Command');

module.exports = class SetRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'set-role',
            aliases: ['sr', 'srole', 'ar', 'add-role'],
            group: 'moderation',
            memberName: 'set-role',
            description: 'Gives a user a role.',
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'What user would you like to give a role to?\n',
                type: 'member'
            }, {
                key: 'role',
                prompt: 'What role would you like to give the user?\n',
                type: 'role'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_ROLES');
    }

    async run(msg, { member, role }) {
        const botMember = await msg.guild.members.fetch(msg.client.user);
        if (!botMember.permissions.has('MANAGE_ROLES')) 
            return msg.say('Sorry, I don\'t have permissions to manage roles.');

        await member.roles.add([role]);
        await msg.react('✅');
    }
};