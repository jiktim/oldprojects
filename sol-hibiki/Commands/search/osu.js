const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { get } = require('snekfetch');
const { OSU_KEY } = process.env;

module.exports = class Osu extends Command {
    constructor(client) {
        super(client, {
            name: 'osu',
            aliases: ['osu-user', 'osu-stats'],
            group: 'search',
            memberName: 'osu',
            description: 'Searches osu! user and returns information.',
            examples: ['osu <osu! username here>'],
            args: [{
                key: 'user',
                prompt: 'Please, provide the osu! username of the user.\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { user }) {
        try {
            const { body } = await get('https://osu.ppy.sh/api/get_user')
                .query({
                    k: OSU_KEY,
                    u: user,
                    type: 'string'
                });
            if (!body.length) return msg.say('404 Results not found.');
            const data = body[0];
            const embed = new MessageEmbed()
                .setColor(0xFF66AA)
                .setAuthor('osu!', 'https://i.imgur.com/hWrw2Sv.png', 'https://osu.ppy.sh/')
                .addField('❯ Username',
                    data.username, true)
                .addField('❯ ID',
                    data.user_id, true)
                .addField('❯ Level',
                    data.level || 'N/A', true)
                .addField('❯ Accuracy',
                    data.accuracy || 'N/A', true)
                .addField('❯ Rank',
                    data.pp_rank || 'N/A', true)
                .addField('❯ Plays',
                    data.playcount || 'N/A', true)
                .addField('❯ Country',
                    data.country || 'N/A', true)
                .addField('❯ Score',
                    data.ranked_score || 'N/A', true)
                .addField('❯ Total score',
                    data.total_score || 'N/A', true)
                .addField('❯ SS',
                    data.count_rank_ss || 'N/A', true)
                .addField('❯ S',
                    data.count_rank_s || 'N/A', true)
                .addField('❯ A',
                    data.count_rank_a || 'N/A', true);
            return msg.embed(embed);
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
