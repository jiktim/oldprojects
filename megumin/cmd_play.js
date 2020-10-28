// WORK IN PROGRESS (PROBABLY NOT CURRENTLY WORKING CAUSE FIREC IS AN IDIOT) (r u sure)
const {
    google
} = require('googleapis');
const key = 'AIzaSyBXcfJ5kwQ9t8xvppno8yjkJZkc9PwreXs'
const ytdl = require("ytdl-core");
const fs = require("fs");
const queue = {};
const connections = {};
const guildsplaying = [];
const youtube = google.youtube({
    version: 'v3',
    auth: key
});

//oh yeah get the latest ffmpeg binary before you run this
module.exports = function (msg, bot, args) {

    async function play(video) {
        let c = connections[msg.channel.guild.id];
        if (!c) {
            try {
                c = connections[msg.channel.guild.id] = await bot.joinVoiceChannel(msg.member.voiceState.channelID) 
            } catch (e) {
                msg.channel.createMessage(`Error joining voice channel: ${e.message}`);
            }
        }
      let q  = queue[msg.channel.guild.id];
      if (!q) q = queue[msg.channel.guild.id] = [];
        if (c.playing) c.stopPlaying();
        const url = "https://www.youtube.com/watch?v=" + video.id.videoId
        const stream = ytdl(url, {
            filter: 'audioonly'
        });

        msg.channel.createMessage({
            embed: {
                title: video.snippet.title,
                description: video.snippet.description,
                url: "https://www.youtube.com/watch?v=" + video.id.videoId,
                color: 58623,
                timestamp: new Date(),
                footer: {
                    icon_url: "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
                    text: "~play"
                },
                thumbnail: {
                    url: video.snippet.thumbnails.high.url
                },
                author: {
                    name: "ðŸŽ¶ Now playing:",
                    icon_url: "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png"
                }
            }
        })
        console.log(video.snippet)
      try {
        c.play(stream); // Play the file and notify the user
      } catch (e) { // no opus stream fuck
        const stream = ytdl(url, {
            filter: 'audioonly'
        });
        c.play(stream);
      }
        c.once("end", () => {
          msg.channel.createMessage({
            embed: {
                title: video.snippet.title,
                description: video.snippet.description.slice(0,20)+"...",
                url: "https://www.youtube.com/watch?v=" + video.id.videoId,
                color: 327424,
                timestamp: new Date(),
                footer: {
                    icon_url: "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png",
                    text: "~play"
                },
                thumbnail: {
                    url: video.snippet.thumbnails.high.url
                },
                author: {
                    name: "âœ… Finished:",
                    icon_url: "https://cdn.discordapp.com/avatars/255397678492418048/a8e516d198c913fb897aa592ce21e260.png"
                }
            }
        })
            //isplaying = false;
            if (q.length == 0) {
                bot.leaveVoiceChannel(msg.member.voiceState.channelID);
                delete queue[msg.channel.guild.id];
                delete connections[msg.channel.guild.id];
            } else {
              console.log(q.length)
                const link = q.shift();
                if (link.includes("://www.youtube.com")) {
                    manageYoutubeLink(link)
                } else if (link.includes("://youtu.be")) {
                    manageYoutuDotBe(link);
                } else {
                    search(link);
                }
            }
        });
    }
    async function search(query) {
        try {
            var res = await youtube.search.list({
                part: 'id, snippet',
                q: query // NO CONFUSION ON MY QRISTIAN SERVER
            });
            console.log(query);
            var video = res.data.items[0];
            if (typeof (video.id.videoId) === "undefined") {
                console.log("oops");
                video = res.data.items[1];
                console.log(video);
            }
          
          if (typeof (video.id.videoId) === "undefined") {
                console.log("oops");
                video = res.data.items[2];
                console.log(video);
            }
          if (typeof (video.id.videoId) === "undefined") {
                console.log("oops");
                video = res.data.items[3];
                console.log(video);
            }
          
          if (typeof (video.id.videoId) === "undefined") {
                console.log("oops");
                video = res.data.items[4];
                console.log(video);
            }
            play(video);
        } catch (e) {
            console.log(e);
        }
    }

    function manageYoutuDotBe(link) {
        try {
            //that much pain for a fucking title
            const res = youtube.search.list({
                part: 'id, snippet',
                q: link.split('.be/')[1]
            }, (err, response) => {
                if (err) return;
                play(response.data.items[0])
            });
        } catch (e) {
            console.log(e);
        }
    }

    function manageYoutubeLink(link) {
        try {
            //that much pain for a fucking title
            const res = youtube.search.list({
                part: 'id, snippet',
                q: link.split('v=')[1]
            }, (err, response) => {
                if (err) return;
                play(response.data.items[0])
            });
        } catch (e) {
            console.log(e);
        }
    }
    if (args.length > 1) {
        if (!msg.member.voiceState.channelID) {
            msg.channel.createMessage('You have to be in a voice channel!');
        } else {
            console.log(args);
            if (queue[msg.channel.guild.id]) {
                bot.createMessage(msg.channel.id, "Adding to queue");
                queue[msg.channel.guild.id].push(args);
            } else {
                if (typeof (args) === "undefined") {
                    bot.createMessage("Queue empty :smiley:");
                } else {
                    if (args.includes("://www.youtube.com")) {
                        manageYoutubeLink(args)
                    } else if (args.includes("://youtu.be")) {
                        manageYoutuDotBe(args);
                    } else {
                        search(args);
                    }
                }
            }

        }
    } else {
        msg.channel.createMessage('You have to specify a song!');
        return;
    }
};