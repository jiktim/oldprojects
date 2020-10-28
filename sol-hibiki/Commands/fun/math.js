const Command = require('../../Structures/Command');
const math = require('mathjs');
 

module.exports = class Math extends Command {
    constructor(client) {
        super(client, {
            name: 'math',
            group: 'fun',
            memberName: 'math',
            description: 'Responds with a math calculation.',
            guildOnly: true,
            args: [{
                key: 'query',
                prompt: 'What do you want to evaluate?\n',
                type: 'string'
            }]
        });
    }

    run(msg, { query }) {
        const num = math.eval(query);
        try {
            if (query.includes('eval')) {
                if (this.client.isOwner(msg.author)) {
                    math.eval(query);
                } else return msg.say('You do not have permissions to execute this.');
            }

            return msg.say(num);
        } catch (err) {
            this.captureError(err);
            msg.say(err.message);
        }
    }
};
