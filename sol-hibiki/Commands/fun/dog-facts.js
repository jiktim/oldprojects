const Command = require('../../Structures/Command');
const facts = require('../../Assets/json/dog-facts');

module.exports = class DogFacts extends Command {
    constructor(client) {
        super(client, {
            name: 'dog-facts',
            aliases: ['dog-fact', 'puppy-fact'],
            group: 'fun',
            memberName: 'dog-facts',
            description: 'Responds with a random dog fact.'
        });
    }

    run(msg) {
        msg.say(facts[Math.floor(Math.random() * facts.length)]);
    }
};
