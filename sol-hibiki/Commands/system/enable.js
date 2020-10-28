const { oneLine } = require('common-tags');
const Command = require('../../Structures/Command');

module.exports = class Enable extends Command {
    constructor(client) {
        super(client, {
            name: 'enable',
            aliases: ['enable-command', 'cmd-on', 'command-on'],
            group: 'system',
            memberName: 'enable',
            description: 'Enables a command or command group.',
            details: oneLine`
				The argument must be the name/ID (partial or whole) of a command or command group.
				Only administrators may use this command.
			`,
            examples: ['enable util', 'enable Utility', 'enable prefix'],
            guarded: true,

            args: [{
                key: 'cmdOrGrp',
                label: 'command/group',
                prompt: 'Which command or group would you like to enable?\n',
                type: 'group|command'
            }]
        });
    }

    hasPermission(msg) {
        if (!msg.guild) return this.client.isOwner(msg.author);
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_SERVER');
    }

    run(msg, { cmdOrGrp, group }) {
        if(cmdOrGrp.isEnabledIn(msg.guild, true)) {
            return msg.say(
                `❎ | The \`${cmdOrGrp.name}\` ${cmdOrGrp.group ? 'command' : 'group'} is already enabled${
                    group && !group.enabled ? `, but the \`${group.name}\` group is disabled, so it still can't be used` : ''
                }.`
            );
        }
        cmdOrGrp.setEnabledIn(msg.guild, true);
        return msg.say(
            `✅ | Enabled the \`${cmdOrGrp.name}\` ${group ? 'command' : 'group'}${
                group && !group.enabled ? `, but the \`${group.name}\` group is disabled, so it still can't be used` : ''
            }.`
        );
    }
};
