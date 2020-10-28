const Command = require('../../Structures/Command');
 

module.exports = class BlacklistUser extends Command {
    constructor(client) {
        super(client, {
            name: 'blacklist-user',
            aliases: ['blacklist'],
            group: 'system',
            memberName: 'blacklist-user',
            ownerOnly: true,
            description: 'Prohibit a user from using this bot.\n',
            details: 'Only the bot owner may use this command.\n',
            examples: ['blacklist @User#1234'],
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'user',
                prompt: 'Which user do you want to blacklist?\n',
                type: 'user'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(msg, { user }) {
        if (this.client.isOwner(user.id)) return msg.say('❎ | Why would you want to blacklist an bot owner?');

        const blacklist = await this.client.provider.get('global', 'blacklistUsers', []);
        if (blacklist.includes(user.id)) return msg.say('❎ | That user is already blacklisted.');

        try {
            await blacklist.push(user.id);
            await this.client.provider.set('global', 'blacklistUsers', blacklist);
        
            await msg.react('✅');
        } catch (err) {
            this.captureError(err);
            this.client.logger.error('[BLACKLIST ERROR]:\n %s', err.stack);
        }
    }
};
