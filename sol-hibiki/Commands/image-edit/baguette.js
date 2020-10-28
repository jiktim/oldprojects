const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class Baguette extends Command {
    constructor(client) {
        super(client, {
            name: 'baguette',
            group: 'image-edit',
            memberName: 'baguette',
            description: 'Baguettes your image.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'image',
                prompt: 'Who do you want to baguette?\n',
                type: 'image|avatar',
            }]
        });
    }

    async run(msg, { image }) {
        const { body } = await get('https://nekobot.xyz/api/imagegen?type=baguette')
            .query({ url: image });
        try {
            return msg.say({ files: [{ attachment: body.message, name: 'baguette.png' }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
