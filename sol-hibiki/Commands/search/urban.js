const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { get } = require('snekfetch');

module.exports = class UrbanDictionaryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            aliases: ['urban-dictionary', 'define-urban'],
            group: 'search',
            memberName: 'urban',
            description: 'Defines a word, but with Urban Dictionary.',
            args: [{
                key: 'word',
                prompt: 'What word would you like to look up?',
                type: 'string'
            }]
        });
    }

    async run(msg, { word }) {
        const type = 'top';
        const { shorten } = this.client.modules.Util;
        try {
            const { body } = await get('http://api.urbandictionary.com/v0/define')
                .query({ term: word });
            if (!body.list.length) return msg.say('Could not find any results.');
            const data = body.list[type === 'top' ? 0 : Math.floor(Math.random() * body.list.length)];
            const embed = new MessageEmbed()
                .setFooter(`👍 ${data.thumbs_up} | 👎 ${data.thumbs_down}`)
                .setColor(0x32A8F0)
                .setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
                .setURL(data.permalink)
                .setTitle(data.word)
                .setDescription(shorten(data.definition))
                .addField('❯ Example', data.example ? shorten(data.example, 1000) : 'None');
            return msg.embed(embed);
        } catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};
