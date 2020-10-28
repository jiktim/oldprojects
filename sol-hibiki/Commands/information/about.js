const Command = require('../../Structures/Command');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');

module.exports = class About extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            aliases: ['info', 'information', 'stats'],
            group: 'information',
            memberName: 'about',
            description: 'Information about this bot.',
            guarded: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    run(msg) {
        const { duration } = this.client.modules.Util;
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setFooter('© TishyXT#6814')
            .setTitle(`Information about ${this.client.user.username}`, true)
            .addField('Uptime', duration(this.client.uptime), true)
            .addField('Repository', 'https://github.com/HibikiTeam/Hibiki', true)
            .addField('Statistics', stripIndents`
                ${this.client.guilds.size} servers
                ${this.client.channels.size} channels
                ${this.client.commands.size} commands
                ${this.client.users.size} users
                ${this.client.cmdsUsed} commands used in total.
            `, true);
        return msg.embed(embed);
    }
};