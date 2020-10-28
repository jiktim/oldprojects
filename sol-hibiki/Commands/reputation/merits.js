const { Command } = require('discord.js-commando');
const Merits = require('../../Models/Merits');

module.exports = class MeritsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'merits',
            aliases: ['show-merits'],
            group: 'reputation',
            memberName: 'merits',
            description: 'Display the merits from a user who has received it from other people.',
            guildOnly: true,
            args: [{
                key: 'user',
                prompt: 'whom merits do you want to view?',
                type: 'user',
                default: msg => msg.author
            }, {
                key: 'page',
                prompt: 'which page do you want to view?',
                type: 'integer',
                default: 1
            }]
        });
    }

    async run(msg, { user }) {
        const merits = await Merits.findAll({ where: { guildID: msg.guild.id, userID: user.id } });

        return msg.embed({
            color: 0xE93F3C,
            author: {
                name: `${user.tag} (${user.id})`,
                icon_url: user.displayAvatarURL({ format: 'png' }) // eslint-disable-line camelcase
            },
            fields: merits.map(m => ({
                name: m.meritID,
                value: `${m.meritMessage} by ${this.client.users.get(m.meritBy).tag}`
            })),
            footer: { text: `${merits.length} merits in total.` }
        });
    }
};
