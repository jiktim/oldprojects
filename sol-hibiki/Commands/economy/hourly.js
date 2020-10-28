const Command = require('../../Structures/Command');
const moment = require('moment');
require('moment-duration-format');
const { MessageEmbed } = require('discord.js');

const Currency = require('../../Structures/Currency');
const Hourly = require('../../Structures/Hourly');

module.exports = class HourlyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hourly',
            group: 'economy',
            memberName: 'hourly',
            description: `Receive or gift your hourly ${Currency.textPlural}.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [{
                key: 'member',
                prompt: 'whom do you want to give your hourly?\n',
                type: 'member',
                default: ''
            }]
        });
    }

    async run(msg, args) {
        const member = args.member || msg.member;
        const received = await Hourly.received(msg.author.id);
        if (received) {
            const nextHourly = await Hourly.nextHourly(msg.author.id);
            const embed = new MessageEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ format: 'png' }))
                .setColor(0xFF0000)
                .setDescription(`You have already received your hourly ${Currency.textPlural}.`)
                .setFooter(`Wait ${moment.duration(nextHourly).format('hh [hours] mm [minutes]')} to receive your next hourly ${Currency.textPlural}.`);
            return msg.embed(embed);
        }

        if (member.id !== msg.author.id) {
            Hourly.receive(msg.author.id, member.id);
            return msg.reply(
                `${member} has successfully received your hourly ${Currency.convert(Hourly.hourlyDonationPayout)}.`
            );
        }

        Hourly.receive(msg.author.id);

        const embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ format: 'png' }))
            .setColor(0x00ff00)
            .setDescription(`You received your hourly ${Currency.convert(Hourly.hourlyPayout)}.`);
        return msg.embed(embed);
    }
};
