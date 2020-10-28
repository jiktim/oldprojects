const Client = require('fortnite');
const fortnite = new Client('d4dd5075-f93a-4638-b655-29b6e8025561');
module.exports = function(param, clientArg, args) { // it sends cats
    if (args) {
        try {
            fortnite.user(args, 'pc').then(data => {
                let stats = data.stats.lifetime
                console.log(stats)
                let score = stats[6]['Score']
                let kills = stats[10]['Kills']
                let kd = stats[11]['K/d']
                let winperc = stats[9]['Win%'] // oWO
                let wins = stats[8]['Wins']
                let matches = stats[7]['Matches Played']

                const leembed = {
                    "embed": {
                        "title": data.username,
                        "color": 2076421,
                        "timestamp": new Date(),
                        "footer": {
                            "text": "~fortnite"
                        },
                        "fields": [{
                                "name": "Kills",
                                "value": kills,
                                "inline": true
                            },
                            {
                                "name": "K/D",
                                "value": kd,
                                "inline": true
                            },
                            {
                                "name": "Score",
                                "value": score,
                                "inline": true
                            },
                            {
                                "name": "Matches played",
                                "value": matches,
                                "inline": true
                            },
                            {
                                "name": "Wins",
                                "value": wins,
                                "inline": true
                            },
                            {
                                "name": "Win percentage",
                                "value": winperc,
                                "inline": true
                            }
                        ]
                    }
                };
                param.channel.createMessage(leembed);
            });
        } catch (err) {
            if (err) {
                param.channel.createMessage(":x: ``User not found!``");
            }
        }
    } else {
        param.channel.createMessage(":x: ``You need to specify a username!``");
    }
};