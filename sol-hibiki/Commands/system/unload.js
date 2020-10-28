const { oneLine } = require('common-tags');
const Command = require('../../Structures/Command');
 

module.exports = class Unload extends Command {
    constructor(client) {
        super(client, {
            name: 'unload',
            aliases: ['unload-command'],
            group: 'system',
            memberName: 'unload',
            description: 'Unloads a command.',
            details: oneLine`
				The argument must be the name/ID (partial or whole) of a command.
				Only the bot owner(s) may use this command.
			`,
            examples: ['unload command-name'],
            ownerOnly: true,
            guarded: true,

            args: [{
                key: 'command',
                prompt: 'Which command would you like to unload?\n',
                type: 'command'
            }]
        });
    }

    async run(msg, { command }) {
        command.unload();

        if(this.client.shard) {
            try {
                await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) this.registry.commands.get('${command.name}').unload();
				`);
            } catch(err) {
                this.captureError(err);
                this.client.emit('warn', '❎ | Error when broadcasting command unload to other shards.');
                this.client.emit('error', err);
                await msg.say(`✅ | Succesfully unloaded \`${command.name}\` command, but failed to unload on other shards.`);
                return null;
            }
        }

        await msg.say(`✅ | Succesfully unloaded \`${command.name}\` command${this.client.shard ? ' on all shards' : ''}.`);
        return null;
    }
};
