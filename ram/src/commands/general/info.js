const { Command } = require('discord-akairo');
const moment = require('moment');
require('moment-duration-format');
const config = require('../../../config');

class PingCommand extends Command {
    constructor() {
        super('info', {
            aliases: ['info', 'about', 'stats'],
            category: 'general',
            description: { content: 'About the bot.' }
        });
    }

    async exec(message) {
        const uptime = (ms) => {
            if (Math.abs(moment().diff(this)) < 1000) {
                return 'just now';
            }
            return moment(ms).fromNow();
        };

        return message.util.send(`ℹ About **${this.client.user.tag}**`, {
            embed: {
                color: 0xE91E63,
                thumbnail: { url: this.client.user.avatarURL({ format: 'png'}) },
                fields: [{
                    name: 'Last boot',
                    value: uptime(Date.now() - this.client.uptime),
                    inline: true
                }, {
                    name: 'Library',
                    value: 'discord-akairo',
                    inline: true
                }, {
                    name: `Developer${config.owner == 1 ? '' : 's'}`,
                    value: config.owner.map(c => this.client.users.get(c)).map(u => `${u.toString()}`).join(' '),
                    inline: true
                }, {
                    name: 'Commands loaded',
                    value: this.client.commandHandler.modules.size,
                    inline: true
                }, {
                    name: 'Servers',
                    value: this.client.guilds.size,
                    inline: true
                }, {
                    name: 'RAM',
                    value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`,
                    inline: true
                }]
            }
        });
    }
}

module.exports = PingCommand;