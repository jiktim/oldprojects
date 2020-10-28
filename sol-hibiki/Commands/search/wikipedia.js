const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { get } = require('snekfetch');

module.exports = class Wikipedia extends Command {
    constructor(client) {
        super(client, {
            name: 'wikipedia',
            aliases: ['wikipedia-article'],
            group: 'search',
            memberName: 'wikipedia',
            description: 'Gives Wikipedia article information about providen query.',
            args: [{
                key: 'query',
                prompt: 'What article would you like to search for?',
                type: 'string'
            }]
        });
    }

    async run(msg, { query }) {
        try {
            const { body } = await get('https://en.wikipedia.org/w/api.php')
                .query({
                    action: 'query',
                    prop: 'extracts|pageimages',
                    format: 'json',
                    titles: query,
                    exintro: '',
                    explaintext: '',
                    pithumbsize: 150,
                    redirects: '',
                    formatversion: 2
                });
            const data = body.query.pages[0];
            if (data.missing) return msg.say('No results.');
            const embed = new MessageEmbed()
                .setColor(0xE7E7E7)
                .setTitle(data.title)
                .setAuthor('Wikipedia', 'https://i.imgur.com/Z7NJBK2.png', 'https://www.wikipedia.org/')
                .setThumbnail(data.thumbnail ? data.thumbnail.source : null)
                .setURL(`https://en.wikipedia.org/wiki/${encodeURIComponent(query).replace(/\)/g, '%29')}`)
                .setDescription(this.client.modules.Util.shorten(data.extract.replace(/\n/g, '\n\n')));
            return msg.embed(embed);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};