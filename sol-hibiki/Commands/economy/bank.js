const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

const Bank = require('../../Structures/Bank');
const Currency = require('../../Structures/Currency');

module.exports = class BankInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bank',
            group: 'economy',
            memberName: 'bank',
            description: 'Displays info about the bank.',
            details: 'Displays the balance and interest rate of the bank.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    async run(msg) {
        const balance = await Currency.getBalance('bank');
        const interestRate = await Bank.getInterestRate();
        const nextUpdate = await Bank.nextUpdate();


        const embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ format: 'png' }))
            .setColor(0x00FF00)
            .setDescription(`${Currency.convert(balance)} in stock.\n${(interestRate * 100).toFixed(3)}% is the current rate.`)
            .setFooter(`Applying interest in ${moment.duration(nextUpdate).format('hh [hours] mm [minutes]')}.`);
        return msg.embed(embed);
    }
};
