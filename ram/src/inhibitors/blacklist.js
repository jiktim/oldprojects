const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        });
    }

    exec(message) {
        const blacklist = this.client.settings.get('global', 'blacklist', []);
        if (blacklist.includes(message.author.id)) {
            return message.util.send(`**${message.author.tag}**, it seems that you're blacklisted from using the bot.`);
        }
    }
}

module.exports = BlacklistInhibitor;