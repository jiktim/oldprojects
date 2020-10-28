const Command = require('../../Structures/Command');
const { get } = require('snekfetch');
 

module.exports = class Pun extends Command {
    constructor(client) {
        super(client, {
            name: 'pun',
            group: 'fun',
            memberName: 'pun',
            description: 'Responds with a random pun.'
        });
    }

    async run(msg) {
        const { body } = await get('https://getpuns.herokuapp.com/api/random');
        try {
            return msg.say(JSON.parse(body).Pun);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
