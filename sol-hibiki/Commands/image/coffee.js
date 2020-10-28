const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class Coffee extends Command {
    constructor(client) {
        super(client, {
            name: 'coffee',
            aliases: ['kofi'],
            group: 'image',
            memberName: 'coffee',
            description: 'Responds with a random coffee. ☕'
        });
    }

    async run(msg) {
        const { body } = await get('https://coffee.alexflipnote.xyz/random.json');
        try {
            return msg.say({ files: [{ attachment: body, name: 'coffee.png' }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
