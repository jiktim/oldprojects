const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const config = require("../../config");

class twitterCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["twit"],
      description: "Displays info about a Twitter profile.",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Fetches the API
    let res = await fetch(`https://api.twitter.com/1.1/users/show.json?screen_name=${encodeURIComponent(args)}`, {
      // Sets the required headers
      headers: {
        "Authorization": `Bearer ${config.twitter}`,
        "User-Agent": "Hibiki",
      }
    });

    // Turns the body into JSON
    let body = await res.json().catch(() => {});

    // Sends if the body sends a 403 error
    if (body.errors && body.errors[0].code === 403) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sends if the user isn't found
    if (body.errors && body.errors[0].code === 50) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sends if the user is suspended
    if (body.errors && body.errors[0].code === 63) return msg.channel.createMessage(this.bot.embed("❌ Error", "This user has been suspended.", "error"));

    // Sends if there's a proper body
    if (body) {
      // Initializes the fieldsconstruct array
      let fieldsConstruct = [];

      // Pushes to the construct if the user has any Tweets
      if (body.statuses_count) fieldsConstruct.push({
        name: "Tweets",
        value: `${body.statuses_count === 0 ? "No tweets" : body.statuses_count}`,
        inline: true
      });

      // Pushes to the construct if the user has any likes
      if (body.favourites_count) fieldsConstruct.push({
        name: "Likes",
        value: `${body.favourites_count === 0 ? "None" : body.favourites_count}`,
        inline: true
      });

      // Pushes to the construct if the user has any followers
      if (body.followers_count) fieldsConstruct.push({
        name: "Followers",
        value: `${body.followers_count === 0 ? "None" : body.followers_count}`,
        inline: true
      });

      // Pushes to the construct if the user is following anyone
      if (body.friends_count) fieldsConstruct.push({
        name: "Following",
        value: `${body.friends_count === 0 ? "Nobody" : body.friends_count}`,
        inline: true
      });

      // Pushes to the construct if the user has set a location
      if (body.location) fieldsConstruct.push({
        name: "Location",
        value: `${body.location || "No location"}`,
        inline: true
      });

      // Pushes to the construct if the user has set a URL
      if (body.url) fieldsConstruct.push({
        name: "Website",
        value: `[Website](${body.url})`,
        inline: true
      });

      // Pushes to the construct if the user is both verified & private
      if (body.protected === true && body.verified === true) fieldsConstruct.push({
        name: "Notes",
        value: "This account is private and verified.",
        inline: false
      });

      // Pushes to the construct if the user is verified and not private
      if (body.verified === true && body.protected === false) fieldsConstruct.push({
        name: "Notes",
        value: "This account is verified.",
        inline: false
      });

      // Pushes to the construct if the user is private and not verified
      if (body.protected === true && body.verified === false) fieldsConstruct.push({
        name: "Notes",
        value: "This account is private.",
        inline: false
      });

      // Sets the embed construct
      let construct = {
        title: `🐦 ${body.name || "Unknown"} (@${body.screen_name})`,
        thumbnail: {
          url: `https://avatars.io/twitter/${body.screen_name || null}`,
        },
        fields: fieldsConstruct,
        // Twitter's hex colour
        color: 0x00aced,
      };

      // Sets the image if the user has a banner
      if (body.profile_banner_url) construct.image = { url: body.profile_banner_url };
      // Sets the description as the user's bio
      if (body.description) construct.description = body.description;

      // Sends the embed using the construct
      await msg.channel.createMessage({
        embed: construct,
      });
    } else {
      // Posts an error message if nothing is found or if something else happens
      msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
    }
  }
}

module.exports = twitterCommand;
