const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Clean extends Command {
    constructor(client) {
        super(client, {
            name: 'clean',
            aliases: ['purge', 'prune', 'clear'],
            group: 'moderation',
            memberName: 'clean',
            description: 'Deletes messages.',
            details: `Deletes messages. Here is a list of filters:
				__invites:__ Messages containing an invite,
				__user @user:__ Messages sent by @user,
				__bots:__ Messages sent by bots,
				__you:__ Messages sent by this bot,
				__uploads:__ Messages containing an attachment,
				__links:__ Messages containing a link.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [{
                key: 'limit',
                prompt: 'How many messages would you like to delete?\n',
                type: 'integer',
                max: 100
            }, {
                key: 'filter',
                prompt: 'What filter would you like to apply?\n',
                type: 'string',
                default: '',
                parse: str => str.toLowerCase()
            }, {
                key: 'member',
                prompt: 'Whose messages would you like to delete?\n',
                type: 'member',
                default: ''
            }]
        });
    }

    hasPermission(msg) {        
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES'); 
    }

    async run(msg, { filter, limit, member }) {
        const modlog = await msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlog) return msg.say(`No moderation log channel set. Type \`${msg.guild.commandPrefix} mod-log #channel\` to set it.`);
        let messageFilter;

        if (filter) {
            if (filter === 'invites') {
                messageFilter = message => message.content.search(/(discord\.gg\/.+|discordapp\.com\/invite\/.+)/i)
				!== -1;
            } else if (filter === 'user') {
                if (member) {
                    const { user } = member;
                    messageFilter = message => message.author.id === user.id;
                } else {
                    return msg.say('You have to mention someone.');
                }
            } else if (filter === 'bots') {
                messageFilter = message => message.author.bot;
            } else if (filter === 'you') {
                messageFilter = message => message.author.id === this.client.user.id;
            } else if (filter === 'uploads') {
                messageFilter = message => message.attachments.size !== 0;
            } else if (filter === 'links') {
                messageFilter = message => message.content.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1; // eslint-disable-line no-useless-escape, max-len
            } else {
                return msg.say('Invalid filter, try again.');
            }

            /* eslint-disable no-unused-vars, handle-callback-err */
            const messages = await msg.channel.messages.fetch({ limit }).catch(err => null);
            const messagesToDelete = messages.filter(messageFilter);
            await msg.channel.bulkDelete(messagesToDelete.array().reverse()).catch(err => null);
            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setDescription(`♻ | **Messages cleaned**: ${limit}\n**Filter**: ${this.client.modules.Filter ? this.client.modules.Filter(filter) : 'None'}\n**Issuer**: ${msg.author.tag}`);
            await modlog.send({ embed });

            return null;
        }

        const messagesToDelete = await msg.channel.messages.fetch({ limit }).catch(err => null);
        await msg.channel.bulkDelete(messagesToDelete.array().reverse()).catch(err => null);
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription(`♻ | **Messages cleaned**: ${limit}\n**Channel**: ${msg.channel.name}\n**Filter**: ${this.client.modules.Filter ? this.client.modules.Filter(filter) : 'None'}\n**Issuer**: ${msg.author.tag}`);
        await modlog.send({ embed });
        return null;
    }
};
