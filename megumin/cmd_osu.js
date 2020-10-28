const osu = require('node-osu');
var osuApi = new osu.Api('9616a3ac1052a3ef6dfb71ddb5ab5e6164bdde61', { //dont touchy touchy
    // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
    notFoundAsError: true, // Reject on not found instead of returning nothing. (default: true)
    completeScores: false // When fetching scores also return the beatmap (default: false)
})
module.exports = function(param, clientArg, args) {
  
	osuApi.getUser({u: args}).then(user => {
    console.log(user)
    const data = {
  "embed": {
    "color": 14572227,
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
      "text": "~osu"
    },
    "thumbnail": {
      "url": "https://a.ppy.sh/"+user.id+"?cth103issexy.png"
    },
    "author": {
      "name": user.name,
      "url": "https://osu.ppy.sh/users/"+user.id,
      "icon_url": "https://i.imgur.com/zNHG9dC.png"
    },
    "fields": [
      {
        "name": "ID",
        "value": user.id,
        "inline": true
      },
      {
        "name": "PP",
        "value": user.pp.raw,
        "inline": true
      },
      {
        "name": "Rank",
        "value": user.pp.rank,
        "inline": true
      },
      {
        "name": "Country rank",
        "value": user.country+" #"+user.pp.countryRank,
        "inline": true
      },
      {
        "name": "Level",
        "value": user.level,
        "inline": true
      },
      {
        "name": "Accuracy",
        "value": user.accuracy,
        "inline": true
      },
      {
        "name": "Plays",
        "value": user.counts.plays,
        "inline": true
      }
    ]
  }
};
    param.channel.createMessage(data);
});
};