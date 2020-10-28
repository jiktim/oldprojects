const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class Meme extends Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            aliases: ['memes'],
            group: 'image',
            memberName: 'meme',
            description: 'Responds with a random meme.',
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    async run(msg) {
        try {
            const { body } = await get('https://api.alexflipnote.xyz/memes');
            return msg.say({ files: [{ attachment: body.file, name: 'meme.png' }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
