const { oneLine } = require('common-tags');
const Command = require('../../Structures/Command');
 

module.exports = class Reload extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            aliases: ['reload-command'],
            group: 'system',
            memberName: 'reload',
            description: 'Reloads a command or command group.',
            details: oneLine`
				The argument must be the name/ID (partial or whole) of a command or command group.
				Providing a command group will reload all of the commands in that group.
				Only the bot owner(s) may use this command.
			`,
            examples: ['reload command-name'],
            ownerOnly: true,
            guarded: true,

            args: [{
                key: 'cmdOrGrp',
                label: 'command/group',
                prompt: 'Which command or group would you like to reload?\n',
                type: 'group|command'
            }]
        });
    }

    async run(msg, { cmdOrGrp }) {
        const isCmd = Boolean(cmdOrGrp.groupID);
        cmdOrGrp.reload();

        if(this.client.shard) {
            try {
                await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) {
						this.registry.${isCmd ? 'commands' : 'groups'}.get('${isCmd ? cmdOrGrp.name : cmdOrGrp.id}').reload();
					}
				`);
            } catch(err) {
                this.captureError(err);
                this.client.emit('warn', '❎ | Error when broadcasting command reload to other shards.');
                this.client.emit('error', err);
                if(isCmd) {
                    await msg.say(`✅ | Succesfully reloaded \`${cmdOrGrp.name}\` command, but failed to reload on other shards.`);
                } else {
                    await msg.say(
                        `✅ | Succesfully reloaded all of the commands in the \`${cmdOrGrp.name}\` group, but failed to reload on other shards.`
                    );
                }
                return null;
            }
        }

        if(isCmd) {
            await msg.say(`✅ | Reloaded \`${cmdOrGrp.name}\` command${this.client.shard ? ' on all shards' : ''}.`);
        } else {
            await msg.say(
                `✅ | Reloaded all of the commands in the \`${cmdOrGrp.name}\` group${this.client.shard ? ' on all shards' : ''}.`
            );
        }
        return null;
    }
};
