const Command = require('../../Structures/Command');

module.exports = class Discrim extends Command {
    constructor(client) {
        super(client, {
            name: 'discrim',
            aliases: ['discriminator'],
            group: 'search',
            memberName: 'discrim',
            description: 'Find the usernames of a certain discriminator.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [{
                key: 'discrim',
                prompt: 'What discrminator would you like to search?\n',
                type: 'string'
            }]
        });
    }

    fetch (bot, discrim) {
        return new Promise((resolve, reject) => {  // eslint-disable-line
            resolve(bot.users.filter(user => user.discriminator === discrim).map(user => user.username));
        });
    }
    async run(msg, { discrim }) {
        this.fetch(msg.client, discrim).then(results => {
            if (!results) return msg.say(`No users found with discriminator **${discrim}**.`);
            return msg.say(`ℹ | I found **${results.length}** users with discriminator **${discrim}**:\n\`\`\`fix\n${results.join(', ')}\`\`\``);
        });
    }
};

