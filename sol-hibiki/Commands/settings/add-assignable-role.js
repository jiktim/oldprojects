const { Command } = require('discord.js-commando');
const Guild = require('../../Models/Guild');

module.exports = class AddAssignableRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add-assignable-role',
            aliases: ['add-assign-role'],
            group: 'settings',
            memberName: 'add-assignable-role',
            description: 'Adds a role to the list of self-assignable roles.',
            guildOnly: true,
            examples: [
                'add-assignable-role frens'
            ],
            args: [{
                key: 'role',
                prompt: 'What role would you like to add to the list of self-assignable roles?\n',
                type: 'role'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_ROLES');
    }

    async run(msg, { role }) {
        const settings = await Guild.findOne({ where: { guildID: msg.guild.id } }) || await Guild.create({ guildID: msg.guild.id });
        let assignableRoles = settings.assignableRoles;
        if (!assignableRoles.roles) assignableRoles.roles = [];
        if (assignableRoles.roles.includes(role.id)) return msg.reply(`${role.name} is already in the list of self-assignable roles.`);
        assignableRoles.roles.push(role.id);
        settings.assignableRoles = assignableRoles;
        await settings.save().catch(console.error);
        return msg.reply(`The role \`${role.name}\` has been successfully added to the list of self-assignable roles!`);
    }
};