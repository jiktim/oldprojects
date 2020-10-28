const Command = require('../../Structures/Command');
const facts = require('../../Assets/json/discord-fun-facts');

module.exports = class DiscordFunFacts extends Command {
    constructor(client) {
        super(client, {
            name: 'discord-fun-facts',
            aliases: ['discord-facts', 'discord-email-fun-facts'],
            group: 'fun',
            memberName: 'discord-fun-facts',
            description: 'Responds with a random Discord\'s e-mail fun facts..'
        });
    }

    run(msg) {
        msg.say(facts[Math.floor(Math.random() * facts.length)]);
    }
};
