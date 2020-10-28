const Command = require('../../Structures/Command');
const moment = require('moment');
require('moment-duration-format');
const { oneLine, stripIndents } = require('common-tags');

const Currency = require('../../Structures/Currency');
const Daily = require('../../Structures/Daily');

module.exports = class DailyRandomCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'daily-random',
            aliases: ['daily-ran', 'daily-rng'],
            group: 'economy',
            memberName: 'daily-random',
            description: `Gift your daily ${Currency.textPlural} to a random online user.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    async run(msg) {
        const member = await msg.guild.members.filter(mem => mem.presence.status === 'online' && !mem.user.bot).random();
        const received = await Daily.received(msg.author.id);

        if (received) {
            const nextDaily = await Daily.nextDaily(msg.author.id);
            return msg.reply(stripIndents`
				you have already gifted your daily ${Currency.textPlural}.
				You can gift away your next daily in ${moment.duration(nextDaily).format('hh [hours] mm [minutes]')}
			`);
        }

        Daily.receive(msg.author.id, member.id);

        return msg.reply(oneLine`
			${member.user.tag} (${member.id}) has successfully received your daily
			${Currency.convert(Daily.dailyDonationPayout)}.
		`);
    }
};
