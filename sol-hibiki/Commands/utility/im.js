const { Command } = require('discord.js-commando');
const Guild = require('../../Models/Guild');

module.exports = class ImRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'im',
            aliases: ['assign'],
            group: 'utility',
            memberName: 'im',
            description: 'Gives yourself an assignable role.',
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],
            args: [{
                key: 'role',
                prompt: 'What role would you like to assign yourself?\n',
                type: 'role'
            }]
        });
    }
    
    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_ROLES');
    }

    async run(msg, { role }) {
        let settings = await Guild.findOne({ where: { guildID: msg.guild.id } });
        if (!settings || !settings.assignableRoles || !settings.assignableRoles.roles) return msg.reply('There are no self-assignable roles set up.');
        let assignableRoles = settings.assignableRoles.roles;
        if (!assignableRoles.includes(role.id)) return msg.say(`The role ${role.name} is not available as a self-assignable role.`);
        if (!msg.member.roles.has(role.id)) {
            await msg.member.roles.add([role]);
            return msg.say(`I have given you the assignable role \`${role.name}\`.`);
        }	else {
            await msg.member.roles.remove([role]);
            return msg.say(`I have removed the assignable role \`${role.name}\` from you.`);
        }
    }
};