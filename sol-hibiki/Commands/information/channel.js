const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

const types = {
    dm: 'DM',
    group: 'Group DM',
    text: 'Text Channel',
    voice: 'Voice Channel',
    category: 'Category',
    unknown: 'Unknown'
};

module.exports = class Channel extends Command {
    constructor(client) {
        super(client, {
            name: 'channel',
            aliases: ['channel-info'],
            group: 'information',
            memberName: 'channel',
            description: 'Retrieves channel information.\n',
            args: [{
                key: 'channel',
                prompt: 'Which channel would you like to get the information on?',
                type: 'channel'
            }]
        });
    }
    run(msg, { channel }) {
        const embed = new MessageEmbed()
            .setColor(this.client.color)
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
        return msg.embed(embed);

    }
};