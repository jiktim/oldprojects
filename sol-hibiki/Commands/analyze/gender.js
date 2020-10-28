const Command = require('../../Structures/Command');
 

module.exports = class Gender extends Command {
    constructor(client) {
        super(client, {
            name: 'gender',
            aliases: ['guess-gender'],
            group: 'analyze',
            memberName: 'gender',
            description: 'Determines the gender of a real name.',
            args: [{
                key: 'first',
                label: 'first name',
                prompt: 'What first name do you want to determine the gender of?',
                type: 'string',
                max: 500,
                parse: first => encodeURIComponent(first)
            }, {
                key: 'last',
                label: 'last name',
                prompt: 'What last name do you want to determine the gender of?',
                type: 'string',
                default: 'null',
                max: 500,
                parse: last => encodeURIComponent(last)
            }]
        });
    }

    async run(msg, { first, last }) {
        const { gender } = this.client.modules.API;
        try {
            const gen = await gender(first, last);
            return msg.say(gen);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
