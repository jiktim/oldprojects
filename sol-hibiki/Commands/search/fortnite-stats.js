const Command = require('../../Structures/Command');
const rp = require('request-promise-native');
const { FORTNITE_KEY } = process.env;
const platforms = ['pc', 'xbl', 'psn'];

module.exports = class FortniteStats extends Command {
    constructor(client) {
        super(client, {
            name: 'fortnite-stats',
            aliases: ['fortnite', 'fortnite-statistics'],
            group: 'search',
            memberName: 'fortnite-stats',
            description: 'Get statistics of a Fortnite player.',
            details: 'Platforms are `pc` (PC), `xbl` (Xbox Live), and `psn` (PlayStation Network).',
            examples: ['fortnite-statistics pc Zaccubus', 'fortnite-stats pc "WBG Strafesh0t"'],
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                key: 'platform',
                prompt: 'What platform do you want to search on?',
                type: 'string',
                parse: platform => platform.toLowerCase(),
                oneOf: platforms
            }, {
                key: 'username',
                prompt: 'What user do you want to look up?',
                type: 'string'
            }]
        });
    }

    async run(msg, { platform, username }) {
        try {
            
            const options = {
                uri: `https://api.fortnitetracker.com/v1/profile/${platform}/${username}`,
                json: true,
                headers: { 'TRN-Api-Key': FORTNITE_KEY }
            };

            const stats = await rp(options).catch(err => {
                return msg.say(`❎ | Something happened with the Fortnite API tracker and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
            });

            if (stats.error === 'Player Not Found') {
                return msg.say('❎ | Player not found.');
            }

            return msg.embed({
                color: 0xFF0000,
                title: stats.epicUserHandle,
                url: `https://fortnitetracker.com/profile/${platform}/${encodeURIComponent(username)}`,
                footer: { text: this.client.version },
                fields: [{
                    name: '🏆 Wins',
                    value: `${stats.lifeTimeStats[8].value || '0'} wins (${stats.lifeTimeStats[9].value || '0'})`,
                    inline: true
                }, {
                    name: '💀 Kills',
                    value: `${stats.lifeTimeStats[10].value || '0'} kills. ${stats.lifeTimeStats[11].value || '0'} K/D ratio.`,
                    inline: true
                }, {
                    name: '🎮 Matches Played',
                    value: stats.lifeTimeStats[7].value || '0',
                    inline: true
                }, {
                    name: '🔢 Score',
                    value: stats.lifeTimeStats[6].value || '0',
                    inline: true
                }]
            });
        } catch (err) {
            this.captureError(err);
            return msg.say(`❎ | This command has errored and the devs have been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};