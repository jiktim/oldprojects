const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class HTTPCat extends Command {
    constructor(client) {
        super(client, {
            name: 'http-cat',
            aliases: ['hc'],
            group: 'image',
            memberName: 'http-cat',
            description: 'Responds with a HTTP cat based on the code you wrote.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'code',
                prompt: 'What is the code?\n',
                type: 'integer'
            }]
        });
    }

    async run(msg, { code }) {
        try {
            const { body } = await get(`https://http.cat/${code}`);
            return msg.say({ files: [{ attachment: body, name: 'code.png' }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
