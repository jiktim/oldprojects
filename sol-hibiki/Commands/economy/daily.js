const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

const moment = require('moment');
require('moment-duration-format');

const Currency = require('../../Structures/Currency');
const Daily = require('../../Structures/Daily');

module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'daily',
            group: 'economy',
            memberName: 'daily',
            description: `Receive or gift your daily ${Currency.textPlural}.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [{
                key: 'member',
                prompt: 'whom do you want to give your daily?\n',
                type: 'member',
                default: ''
            }]
        });
    }

    async run(msg, args) {
        const member = args.member || msg.member;
        const received = await Daily.received(msg.author.id);
        if (received) {
            const nextDaily = await Daily.nextDaily(msg.author.id);
            const embed = new MessageEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ format: 'png' }))
                .setColor(0xFF0000)
                .setDescription(`You have already received your daily ${Currency.textPlural}.`)
                .setFooter(`Wait ${moment.duration(nextDaily).format('hh [hours] mm [minutes]')} to receive your next daily ${Currency.textPlural}.`);
            return msg.embed(embed);
        }

        if (member.id !== msg.author.id) {
            Daily.receive(msg.author.id, member.id);
            return msg.reply(
                `${member} has successfully received your daily ${Currency.convert(Daily.dailyDonationPayout)}.`
            );
        }

        Daily.receive(msg.author.id);

        const embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ format: 'png' }))
            .setColor(0x00ff00)
            .setDescription(`You received your daily ${Currency.convert(Daily.dailyPayout)}.`);
        return msg.embed(embed);
    }
};
