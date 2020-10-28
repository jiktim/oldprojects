const Command = require('../../Structures/Command');
const { get } = require('snekfetch');

module.exports = class GelbooruCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gelbooru',
            aliases: ['gelbooru-image'],
            group: 'nsfw',
            memberName: 'gelbooru',
            description: 'Responds with an image from Gelbooru, with optional query.',
            nsfw: true,
            args: [{
                key: 'query',
                prompt: 'What image would you like to search for?',
                type: 'string',
                default: ''
            }]
        });
    }

    async run(msg, { query }) {
        const random = str => Math.floor(Math.random() * str.length);
        try {
            const { body } = await get('https://gelbooru.com/index.php')
                .query({
                    page: 'dapi',
                    s: 'post',
                    q: 'index',
                    json: 1,
                    tags: query,
                    limit: 200
                });
            if (!body) return msg.say('Could not find any results.');
            return msg.say(`${body[random(body)].file_url}\n${body[random(body)].file_url}\n${body[random(body)].file_url}`);
        } catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};
