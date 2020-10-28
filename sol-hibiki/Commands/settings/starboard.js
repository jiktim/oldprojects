const Command = require('../../Structures/Command');

module.exports = class Starboard extends Command {
    constructor(client) {
        super(client, {
            name: 'starboard',
            group: 'settings',
            memberName: 'starboard',
            description: 'Sets a starboard channel for this server.',
            guildOnly: true,
            args: [{
                key: 'channel',
                prompt: 'What channel do you want to set as starboard?\n',
                type: 'channel'
            }]
        });
    }
    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }
    run(msg, { channel }) {
        msg.guild.settings.set('starboard', channel.id);
        return msg.say(`✅ | Succesfully set starboard channel to <#${channel.id}> (\`${channel.name}\`) in this server.`);
    }
};
