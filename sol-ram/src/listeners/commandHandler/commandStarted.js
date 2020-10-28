const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class CommandStartedListener extends Listener {
    constructor() {
        super('commandStarted', {
            event: 'commandStarted',
            emitter: 'commandHandler',
            category: 'commandHandler'
        });
    }

    exec(message, command) {
        Logger.log(`=> ${command.id}`, { tag: message.guild ? `${message.guild.name} (${message.guild.id}) by ${message.author.tag} (${message.author.id})` : `${message.author.tag}/PM` });
    }
}

module.exports = CommandStartedListener;