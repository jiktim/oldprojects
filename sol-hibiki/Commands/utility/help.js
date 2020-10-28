const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
 

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['commands', 'command-list'],
            group: 'utility',
            memberName: 'help',
            description: 'Displays a list of available commands, or detailed information for a specific command.',
            guarded: true,
            args: [
                {
                    key: 'command',
                    prompt: 'Which command would you like to view the help for?',
                    type: 'command',
                    default: ''
                }
            ]
        });
    }

    async run(msg, { command }) {
        if (!command) {
            const embed = new MessageEmbed()
                .setTitle('Command List')
                .setColor(this.client.color)
                .setFooter(`${this.client.registry.commands.size} Commands`);
            for (const group of this.client.registry.groups.values()) {
                embed.addField(group.name, `\`${group.commands.map(cmd => cmd.name).join('`, `')}\`` || 'None');
            }
            try {
                const msgs = [];
                msgs.push(await msg.direct(stripIndents`
                    Use ${msg.usage('<command>')} to view detailed information about a command. The support server is ${this.client.options.invite}.
                `, { embed }));
                if (msg.channel.type !== 'dm') msgs.push(await msg.say('📬 Sent you a DM with information.'));
                return msgs;
            } catch (err) {
                this.captureError(err);
                return msg.reply('Failed to send DM. You probably have DMs disabled.');
            }
        }
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setTitle(`__Command **${command.name}**__${command.guildOnly ? ' (Usable only in servers)' : ''}`)
            .setDescription(`${command.description}${command.details ? `\n_${command.details}_` : ''}`)
            .addField('Format', `${msg.anyUsage(`${command.name} ${command.format || ''}`)}`, true)
            .addField('Aliases', `${command.aliases.join(', ') || 'None'}`, true)
            .addField('Group', `${command.group.name} (\`${command.groupID}:${command.memberName}\`)`);
        return msg.embed(embed);
    }
};