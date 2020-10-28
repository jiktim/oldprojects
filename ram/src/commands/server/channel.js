const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const types = {
    dm: 'DM',
    group: 'Group DM',
    text: 'Text Channel',
    voice: 'Voice Channel',
    category: 'Category',
    unknown: 'Unknown'
};

class ChannelCommand extends Command {
    constructor() {
        super('channel', {
            aliases: ['channel'],
            category: 'server',
            description: { content: 'Retrieves channel information.' },
            channel: 'guild',
            args: [{
                id: 'channel',
                type: 'channel',
                default: (msg) => msg.channel
            }]
        });
    }

    exec(msg, { channel }) {
        const embed = new MessageEmbed()
            .setColor(this.groupColor)
            .addField('❯ Name',
                `${msg.channel.name}`, true)
            .addField('❯ ID',
                `${msg.channel.id}`, true)
            .addField('❯ Category',
                `${channel.parent ? channel.parent.name : 'None'}`, true)
            .addField('❯ Topic',
                `${channel.topic ? channel.topic : 'None'}`, true)
            .addField('❯ Created at',
                `${channel.createdAt.toDateString()}`, true)
            .addField('❯ NSFW?',
                `${channel.nsfw ? 'Yes': 'No'}`, true)
            .addField('❯ Type',
                `${types[channel.type]}`, true);
        return msg.util.send([embed]);

    }
}

module.exports = ChannelCommand;