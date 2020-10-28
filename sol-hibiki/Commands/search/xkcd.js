const Command = require('../../Structures/Command');
const { get } = require('snekfetch');

module.exports = class XKCD extends Command {
    constructor(client) {
        super(client, {
            name: 'xkcd',
            group: 'search',
            memberName: 'xkcd',
            description: 'Responds with a XKCD comic..',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'comic',
                prompt: 'What comic ID would you like to search?\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { comic }) {
        try {
            const { body } = await get(`https://xkcd.com/${comic}/info.0.json`);
            const description = body.transcript
                .replace('{{', '')
                .replace('}}', '');
            return msg.say(`**${body.safe_title}**\n\n${description}`, { files: [{ attachment: body.img, name: 'comic.png' }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};