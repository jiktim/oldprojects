const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
 

module.exports = class Kick extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            aliases: ['kicke'],
            group: 'moderation',
            memberName: 'kick',
            description: 'Kicks a user when executed.',
            examples: ['kick @User#1234'],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'Which user do you want to kick?\n',
                type: 'member'
            }, {
                key: 'reason',
                prompt: 'What is the reason?\n',
                type: 'string',
                default: ''
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('KICK_MEMBERS');
    }

    async run(msg, { member, reason } ) {
        const modlog = await msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!msg.guild.me.permissions.has('KICK_MEMBERS')) 
            return msg.say('Sorry, I don\'t have permissions to kick people.');
        if (!modlog) 
            return msg.say(`No moderation log channel set. Type \`${msg.guild.commandPrefix} mod-log #channel\` to set it.`);
        try {
            const resp = await this.client.modules.AwaitReply(msg, `Do you really want to ick **${member}**?\nRespond with "yes" or "no".`, 30000);
            if (['y', 'yes'].includes(resp.toLowerCase())) {
                await msg.guild.member(member).kick(reason);
                const embed = new MessageEmbed()
                    .setColor(0xFFFF00)
                    .setDescription(`👢 | **User kicked**: ${member}\n**Issuer**: ${msg.author.tag}\n**Reason**: ${reason}`);
                await modlog.send({ embed });
                await msg.react('✅');
            } else if (['n', 'no', 'cancel'].includes(resp.toLowerCase())) {
                return msg.say('Cancelled the kick.');
            }
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};