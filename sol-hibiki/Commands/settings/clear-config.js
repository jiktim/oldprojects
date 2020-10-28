const Command = require('../../Structures/Command');
const settings = require('../../Assets/json/settings');

module.exports = class ClearConfig extends Command {
    constructor(client) {
        super(client, {
            name: 'clear-config',
            aliases: ['clear-setting'],
            group: 'settings',
            memberName: 'clear-config',
            description: 'Removes a custom configuration from your server.',
            guildOnly: true,
            args: [{
                key: 'setting',
                prompt: 'What custom setting do you want to clear?',
                type: 'string',
                validate: (setting) => {
                    if (settings.includes(setting)) return true;
                    else return `Please enter one of the following: ${settings.join(', ')}.`;
                }
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }

    run(msg, { setting }) {
        msg.guild.settings.remove(setting);
        return msg.say(`✅ | **${setting}** has been removed from your server configurations.`);
    }
};
