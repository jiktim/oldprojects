const Command = require('../../Structures/Command');
const Merits = require('../../Models/Merits');

const random = require('randomstring');

module.exports = class MeritCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'merit',
            group: 'reputation',
            memberName: 'merit',
            description: 'Add a merit to a user.',
            guildOnly: true,

            args: [{
                key: 'member',
                prompt: 'whom would you like to give a merit?',
                type: 'member'
            }, {
                key: 'message',
                prompt: 'add a nice message.',
                type: 'string',
                max: 200,
                default: ''
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }

    async run(msg, { member, message }) {
        await Merits.create({
            meritID: random.generate({
                length: 6,
                charset: 'alphabetic'
            }),
            userID: member.id,
            guildID: msg.guild.id,
            meritBy: msg.author.id,
            meritMessage: message || null
        });

        return msg.reply(`you've successfully added a merit to ${member.displayName}.`);
    }
};
