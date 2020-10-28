const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
 

module.exports = class Announce extends Command {
    constructor(client) {
        super(client, {
            name: 'announce',
            aliases: ['announcement'],
            group: 'moderation',
            memberName: 'announce',
            description: 'Sends an announcement on the announcement(s) channel.',
            examples: ['announce Hello!'],
            args: [{
                key: 'text',
                prompt: 'What would you like to announce?\n',
                type: 'string'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }

    run(msg, { text }) {
        const channel = this.client.channels.get(msg.guild.settings.get('announceChannel'));
        if (!channel) {
            return msg.say(`No announcement channel set. Type \`${msg.guild.commandPrefix} announce-channel #channel\` to set it.`);
        }
        try {
            const embed = new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                .setColor(this.client.color)
                .setDescription(text)
                .setTimestamp(`${new Date().toLocaleString()} | ${this.client.version}`);
            return channel.send({ embed });
            return msg.react('✅');
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
