const Command = require('../../Structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class Settings extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            aliases: ['config', 'config-list', 'setting-list'],
            group: 'settings',
            memberName: 'settings',
            description: 'Shows a guild list configuration.',
            guildOnly: true
        });
    }

    run(msg) {
        const memberLog = msg.guild.channels.get(msg.guild.settings.get('memberLog'));
        const antiInvite = msg.guild.roles.get(msg.guild.settings.get('antiInvite'));
        const autoRole = msg.guild.roles.get(msg.guild.settings.get('joinRole'));
        const starboard = msg.guild.channels.get(msg.guild.settings.get('starboard'));
        return msg.say(stripIndents`
            \`Command prefix\`: ${msg.guild.commandPrefix}
            \`Starboard\`: ${starboard ? starboard.name : 'None'}.
            \`Auto role\`: ${autoRole ? autoRole.name : 'None'}.
            \`Member log\`: ${memberLog ? memberLog.name : 'None'}.
            \`Anti Invite\`: ${antiInvite ? antiInvite : 'None'}.
            \`Welcome message\`: ${msg.guild.settings.get('joinMsg', 'Welcome <user>! (Default)')}.
            \`Leave message\`: ${msg.guild.settings.get('leaveMsg', 'Bye <user>... (Default)')}.
        `);
    }
};