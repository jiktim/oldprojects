const { Command } = require('discord-akairo');
const { owner } = require('../../../config');

class BlacklistCommand extends Command {
    constructor() {
        super('blacklist', {
            aliases: ['blacklist', 'unblacklist'],
            category: 'owner',
            ownerOnly: true,
            quoted: false,
            args: [
                {
                    id: 'member',
                    match: 'content',
                    type: 'member',
                    prompt: {
                        start: 'Which user do you want to blacklist or unblacklist?',
                        retry: 'Please provide a valid user.'
                    }
                }
            ],
            description: {
                content: 'Blacklists or unblacklists someone from using bot.',
                usage: '<user>',
                examples: ['@BadPerson', 'someone#1234']
            }
        });
    }

    async exec(message, { member }) {
        if (owner.includes(member.id)) return message.util.send(`**::** **${member.user.tag}** is a bot owner and cannot be set to a blacklist.`);
        const blacklist = this.client.settings.get('global', 'blacklist', []);

        if (blacklist.includes(member.id)) {
            const index = blacklist.indexOf(member.id);
            blacklist.splice(index, 1);
            await this.client.settings.set('global', 'blacklist', blacklist);

            return message.util.send(`**::** **${member.user.tag}** has been removed from the blacklist.`);
        }
        
        blacklist.push(member.id);
        await this.client.settings.set('global', 'blacklist', blacklist);

        return message.util.send(`**::** **${member.user.tag}** has been blacklisted from using the bot.`);
    }
}

module.exports = BlacklistCommand;