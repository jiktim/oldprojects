const Command = require('../../Structures/Command');
 

module.exports = class Hastebin extends Command {
    constructor(client) {
        super(client, {
            name: 'hastebin',
            aliases: ['hb', 'haste'],
            group: 'utility',
            memberName: 'hastebin',
            description: 'Uploads a text to Hastebin.',
            args: [{
                key: 'code',
                prompt: 'What code would you like to upload to Hastebin?',
                type: 'code'
            }]
        });
    }

    async run(msg, { code }) {
        try {
            const result = await this.client.modules.Hastebin(code);
            return msg.say(result);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
