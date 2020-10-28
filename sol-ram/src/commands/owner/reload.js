const { Command } = require('discord-akairo');
const Logger = require('../../util/Logger');

class ReloadCommand extends Command {
    constructor() {
        super('reload', {
            aliases: ['reload', 'r'],
            category: 'owner',
            ownerOnly: true,
            quoted: false,
            args: [
                {
                    'id': 'type',
                    'match': 'content',
                    'prefix': ['type'],
                    'type': [['command', 'c'], ['inhibitor', 'i'], ['listener', 'l']],
                    'default': 'command'
                },
                {
                    id: 'module',
                    type: (phrase, message, { type }) => {
                        if (!phrase) return null;
                        const resolver = this.handler.resolver.type({
                            command: 'commandAlias',
                            inhibitor: 'inhibitor',
                            listener: 'listener'
                        }[type]);

                        return resolver(phrase);
                    }
                }
            ],
            description: {
                content: 'Reloads a module.',
                usage: '<module> [type:]'
            }
        });
    }

    exec(message, { type, module: mod }) {
        if (!mod) {
            return message.util.send(`**::** Invalid ${type} ${type === 'command' ? 'alias' : 'ID'} specified to reload.`);
        }

        try {
            mod.reload();
            return message.util.send(`**::** Successfully reloaded ${type} \`${mod.id}\`.`);
        } catch (err) {
            Logger.error(`**::**Error occured reloading ${type} ${mod.id}`);
            Logger.stacktrace(err);
            return message.util.send(`**::** Failed to reload ${type} \`${mod.id}\`.`);
        }
    }
}

module.exports = ReloadCommand;