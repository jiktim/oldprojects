const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class Bill extends Command {
    constructor(client) {
        super(client, {
            name: 'bill',
            group: 'image',
            memberName: 'bill',
            description: 'Responds with a random Be like Bill image.',
            examples: ['bill']
        });
    }

    async run(msg) {
        const { body } = await get('http://belikebill.azurewebsites.net/billgen-API.php?default=1');
        try {
            return msg.say({ files: [{ attachment: body, name: 'bill.png' }] });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
