const Command = require('../../Structures/Command');
const Merits = require('../../Models/Merits');

module.exports = class MeritRemoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'merit-remove',
            aliases: ['remove-merit', 'merit-rem', 'rem-merit', 'rmmerit', 'delmerit'],
            group: 'reputation',
            memberName: 'merit-remove',
            description: 'Removes a merit from a user.',
            guildOnly: true,

            args: [{
                key: 'merit',
                prompt: 'Which merit ID would you like to remove?\n',
                type: 'string',
                infinite: true
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }

    async run(msg, { merit }) {
        try {
            for (let i of merit) {
                await Merits.destroy({ where: { meritID: i, guildID: msg.guild.id } });
            }
            return msg.reply('Removed the merit(s).');
        } catch (err) {
            return this.client.logger.error(err);
        }
    }
};
