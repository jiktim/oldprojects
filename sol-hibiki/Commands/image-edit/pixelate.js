const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class Pixelate extends Command {
    constructor(client) {
        super(client, {
            name: 'pixelate',
            aliases: ['pixel'],
            group: 'image-edit',
            memberName: 'pixelate',
            description: 'Pixelates your image.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'image',
                prompt: 'Who do you want to pixelate?\n',
                type: 'image|avatar',
            }]
        });
    }

    async run(msg, { image }) {
        const { body } = await get('https://api.alexflipnote.xyz/pixelate')
            .query({ image });
        try {
            return msg.say({ files: [{ attachment: body, name: 'pixelate.png' }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
