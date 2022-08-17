module.exports = function(msg, ErisClient) {
var osu = require('node-osu')
var osuApi = new osu.Api(osuApi, {
    notFoundAsError: true,
    completeScores: false
})
    osuApi.getUser({u: msg.content.slice(6)}).then(user => {
    var percentage = Math.floor((user.scores.ranked / user.scores.total) * 100);
    ErisClient.createMessage(msg.channel.id, "" + user.name + "'s profile information\nUsername: " + user.name + " (ID: " + user.id + ")\nPlays: " + Math.ceil(user.counts.plays).toLocaleString('en') + " (SS: " + Math.ceil(user.counts.SS).toLocaleString('en') + " | S: " + Math.ceil(user.counts.S).toLocaleString('en') + " | A: " + Math.ceil(user.counts.A).toLocaleString('en') + ")\nScoring: (50: " + Math.ceil(user.counts[50]).toLocaleString('en') + " | 100: " + Math.ceil(user.counts[100]).toLocaleString('en') + " | 300: " + Math.ceil(user.counts[300]).toLocaleString('en') + ")\nTotal score: " + Math.ceil(user.scores.total).toLocaleString('en') + " (" + Math.ceil(percentage) + "% ranked)\nPP: " + Math.ceil(user.pp.raw).toLocaleString('en') + "pp\nRank: #" + Math.ceil(user.pp.rank).toLocaleString('en') + "\nCountry: :flag_" + user.country.toLowerCase() + ": (#" + Math.ceil(user.pp.countryRank).toLocaleString('en') + ")\nAccuracy: " + user.accuracyFormatted + "\nAvatar: https://a.ppy.sh/" + user.id + "\nProfile: <https://osu.ppy.sh/u/" + user.id + ">");
    }).catch((error) => {
    ErisClient.createMessage(msg.channel.id, ":x: | Can't find that user.");
  })
}
