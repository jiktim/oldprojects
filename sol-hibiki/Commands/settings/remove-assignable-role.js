const { Command } = require('discord.js-commando');
const Guild = require('../../Models/Guild');

module.exports = class RemoveAssignableRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove-assignable-role',
            aliases: ['remove-assign-role'],
            group: 'settings',
            memberName: 'removes-assignable-role',
            description: 'Removes a role from the list of self-assignable roles.',
            guildOnly: true,
            examples: [
                'remove-assignable-role frens'
            ],
            args: [{
                key: 'role',
                prompt: 'What role would you like to remove from the the list of self-assignable roles?\n',
                type: 'role'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_ROLES');
    }

    async run(msg, { role }) {
        const settings = await Guild.findOne({ where: { guildID: msg.guild.id } }) || await Guild.create({ guildID: msg.guild.id });
        if (!settings.assignableRoles.roles) return msg.reply('there are no self-assignable roles on the list.');
        if (!settings.assignableRoles.roles.includes(role.id)) return msg.reply(`${role.name} is not in the list of self-assignable roles.`);
        let assignableRoles = settings.assignableRoles;
        settings.assignableRoles.roles.splice(settings.assignableRoles.roles.indexOf(role.id));
        settings.assignableRoles = assignableRoles;
        await settings.save().catch(console.error);
        return msg.reply(`The role \`${role.name}\` has been successfully removed from the list of self-assignable roles!`);
    }
};