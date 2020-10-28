const Command = require('../../Structures/Command');
const request = require('request-promise');
const { LYRICS_KEY } = process.env;

module.exports = class LyricsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            group: 'search',
            memberName: 'lyrics',
            description: 'Searches for a song on Genius.',
            details: 'Searches for a song on Genius.',
            examples: ['!lyrics Element Kendrick Lamar', '!lyrics Marvin Gaye Let\'s get it on'],
            format: '[query]',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to search Genius for?',
                    type: 'string',
                },
            ],
        });
    }

    async run(msg, { query }) {
        if (msg.member.currentSearch && !msg.member.currentSearch.ended) msg.member.currentSearch.stop();
        const sayFunction = async (resultsArray) => {
            try {
                const targetResult = resultsArray.splice(0, 1)[0].result;
                this.client.logger.info(targetResult);
                const embed = {
                    color: 0xFFFF64,
                    description: `[${targetResult.primary_artist.name} - ${targetResult.title}](https://genius.com${targetResult.api_path})`,
                    thumbnail: { url: targetResult.song_art_image_thumbnail_url },
                    fields: [{ 
                        name: 'Link', 
                        value: `https://genius.com${targetResult.api_path}`
                    }, {
                        name: 'Verified Lyrics', 
                        value: targetResult.is_verified ? 'No' : 'Yes'
                    }]
                };
                msg.say('🔎 | Type `next` for the next search result.', { embed });
            } catch (e) {
                this.captureError(e);
                this.client.logger.error(e.message);
                return msg.say('❎ | There are no more results for this search.');
            }
            msg.member.currentSearch = msg.channel.createMessageCollector((m) => m.author.id == msg.author.id && m.channel.id == msg.channel.id && m.content.toLowerCase() == 'next', { time: 30000, maxMatches: 1 });
            msg.member.currentSearch.on('collect', () => sayFunction(resultsArray));
        };
        return request(`https://api.genius.com/search?access_token=${LYRICS_KEY}}&q=${query}`, { json: true })
            .then(async (d) => {
                sayFunction(d.response.hits);
            })
            .catch((err) => {
                this.client.logger.error(err.message);
                msg.say('❎ | I didn\'t find a song by that title, try another.');
            });
    }
};