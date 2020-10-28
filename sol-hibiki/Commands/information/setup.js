const Command = require('../../Structures/Command');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');

module.exports = class Setup extends Command {
    constructor(client) {
        super(client, {
            name: 'setup',
            aliases: ['setupguide'],
            group: 'information',
            memberName: 'setup',
            description: 'Gives you useful information how to setup the bot.',
            args: [{
                key: 'option',
                prompt: 'Which option do you want to look up?',
                type: 'string',
                default: ''
            }]
        });
    }

    async run (msg, { option }) {
        if (option == 'starboard') {
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`Have issues? Run ${this.client.commandPrefix}invite to join the support server.`)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .addField('⭐ Starboard', stripIndents`
                In order to setup starboard, the bot must have permission to send embed messages to the providen channel.
                Run \`${this.client.commandPrefix}starboard <channel>\` to enable starboard to the providen channel.
                Run \`${this.client.commandPrefix}clear-config starboard\` to disable starboard.
            `);
            return msg.embed(embed);
        } else 
        if (option == 'mod log') {
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`Have issues? Run ${this.client.commandPrefix}invite to join the support server.`)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .addField('🔨 Moderation log', stripIndents`
                In order to setup moderation log, the bot must have permission to send embed messages to the providen channel.
                Run \`${this.client.commandPrefix}mod-log <channel>\` to enable moderation logging.
                Run \`${this.client.commandPrefix}clear-config modLog\` to disable moderation logging.
            `);
            return msg.embed(embed);
        } else 
        if (option == 'prefix') {
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`Have issues? Run ${this.client.commandPrefix}invite to join the support server.`)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .addField('🤖 Prefix', stripIndents`
                Run \`${this.client.commandPrefix}prefix <prefix>\` to change it to a custom prefix.
                Run \`${this.client.commandPrefix}prefix default\` to change the prefix to the default.
                Run \`${this.client.commandPrefix}prefix none\` to have no prefix at all. (use the bot mention to change the prefix back.)
            `);
            return msg.embed(embed);
        } else 
        if (option == 'anti invite') {
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`Have issues? Run ${this.client.commandPrefix}invite to join the support server.`)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .addField('🚫 Anti Invite', stripIndents`
                In order to setup anti invite, the bot must have permission to manage messages.
                Run \`${this.client.commandPrefix}anti-invite\` to enable anti invite.
                Run \`${this.client.commandPrefix}anti-invite-role <role>\` to set a anti invite role for users that won't be affected by the anti-invite.
                Run \`${this.client.commandPrefix}clear-config antiInvite\` to disable anti invite.
                Run \`${this.client.commandPrefix}clear-config antiInviteRole\` to disable anti invite role.
            `);
            return msg.embed(embed);
        } else
        if (option == 'auto role') {
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`Have issues? Run ${this.client.commandPrefix}invite to join the support server.`)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .addField('👥 Auto Role', stripIndents`
                    In other to setup auto role, the bot must have permission to manage roles.
                    Run \`${this.client.commandPrefix}auto-role <role>\` to enable auto role to the providen role.
                    Run \`${this.client.commandPrefix}clear-config autoRole\` to disable auto role.
            `);
            return msg.embed(embed);
        } else
        if (option == 'welcome') {
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`Have issues? Run ${this.client.commandPrefix}invite to join the support server.`)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .addField('👋 Welcome Message/Logging', stripIndents`
                In order to setup welcome logging, the bot must have permission to the providen welcome channel.
                Run \`${this.client.commandPrefix}welcome-msg welcomeMsg <message>\` to setup the join message.
                Run \`${this.client.commandPrefix}welcome-msg byeMsg <message>\` to setup the leave message.
                Run \`${this.client.commandPrefix}welcome-log <channel>\` to enable join/leave logging to the providen channel.
                Run \`${this.client.commandPrefix}clear-config welcomeMsg\` to clear the join message.
                Run \`${this.client.commandPrefix}clear-config byeMsg\` to clear the leave message.
                Run \`${this.client.commandPrefix}clear-config welcomeLog\` to disable join/leave logging.
            `);
            return msg.embed(embed);
        } else
        if (option == 'announce') {
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`Have issues? Run ${this.client.commandPrefix}invite to join the support server.`)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .addField('📢 Announcement Channel', stripIndents`
                In order to setup announcement channel, the bot must have permission to manage messages to the providen channel.
                Run \`${this.client.commandPrefix}announce-channel <channel>\` to enable announce(ment) channel.
                Run \`${this.client.commandPrefix}announce <message>\` to announce.
                Run \`${this.client.commandPrefix}clear-config announceChannel\` to disable announce(ment) channel.
            `);
            return msg.embed(embed);
        } else
        if (option == 'assignable roles') {
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`Have issues? Run ${this.client.commandPrefix}invite to join the support server.`)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .addField('👤 Assignable Roles', stripIndents`
                In order to setup assignable roles, the bot must have permission to manage roles.
                Run \`${this.client.commandPrefix}add-assignable-role <role>\` to add an assignable role.
                Run \`${this.client.commandPrefix}assign <role>\` to announce.
                Run \`${this.client.commandPrefix}remove-assignable-role <role>\` to remove an assignable role.
            `);
            return msg.embed(embed);
        } else {
        
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setAuthor(`${this.client.user.username} setup guide`, this.client.user.displayAvatarURL())
                .setDescription('Select the option you need help with.')
                .addField('⭐ Starboard', `Run \`${this.client.commandPrefix}setup starboard\`.`, true)
                .addField('🔨 Moderation Logging', `Run \`${this.client.commandPrefix}setup mod log\`.`, true)
                .addField('🤖 Prefix', `Run \`${this.client.commandPrefix}setup prefix\`.`, true)
                .addField('🚫 Anti Invite', `Run \`${this.client.commandPrefix}setup anti invite\`.`, true)
                .addField('👥 Auto Role', `Run \`${this.client.commandPrefix}setup auto role\`.`, true)
                .addField('👋 Welcome Message/Logging', `Run \`${this.client.commandPrefix}setup welcome\`.`, true)
                .addField('📢 Announcement Channel', `Run \`${this.client.commandPrefix}setup announce\`.`, true)
                .addField('👤 Assignable Roles', `Run \`${this.client.commandPrefix}setup assignable roles\`.`);
            return msg.embed(embed);
        }
    }
};