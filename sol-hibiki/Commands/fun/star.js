const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class Star extends Command {
    constructor(client) {
        super(client, {
            name: 'star',
            group: 'fun',
            memberName: 'star',
            description: 'Stars a Message ID.',
            examples: ['star <message id here>'],
            args: [{
                key: 'id',
                prompt: 'What is the Message ID you want to star?\n',
                type: 'string'
            }]
        });

        this.starred = [];
    }

    async run(msg, args, reaction) {
        const { id } = args;
        const channel = msg.guild.channels.get(msg.guild.settings.get('starboard'));
        if (!channel || this.starred.includes(id)) return null;
        if (!channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return null;
        const message = await msg.channel.messages.fetch(id);
        if (!reaction && msg.author.id === message.author.id) {
            reaction.users.remove(msg.author.id);
            return msg.reply(this.client.translate('commands.star.author'));
        }
        this.starred.push(id);
        if (!channel.permissionsFor(this.client.user).has('EMBED_LINKS')) {
            return msg.say(this.client.translate('commands.star.response', message.author.tag, message.content, moment(message.createdTimestamp).format('MMMM Do YYYY h:mm:ss A'), message.attachments.first() ? `**Image:** ${message.attachments.first().url}` : ''));
        } else {
            const embed = new MessageEmbed()
                .setColor(0xFFFF00)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(message.content)
                .setImage(message.attachments.first() ? message.attachments.first().url : null)
                .setFooter(`⭐ | ${moment(message.createdTimestamp).format('MMMM Do YYYY h:mm:ss A')}`);
            return channel.send({ embed });
        }
    }
};
