const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Embed extends Command {
    constructor(client) {
        super(client, {
            name: 'embed',
            group: 'text-edit',
            memberName: 'embed',
            description: 'Embeds your text.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to embed?\n',
                type: 'string',
            }]
        });
    }

    run(msg, { text }) {
        const embed = new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png' }))
            .setColor(this.client.color)
            .setFooter(this.client.version)
            .setDescription(text);
        return msg.embed(embed);
    }
};
