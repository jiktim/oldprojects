const Starboard = require('../Structures/Starboard');

module.exports = async (client, reaction, user) => {
    const blacklist = client.provider.get('global', 'blacklistUsers', []);
    if (blacklist.includes(user.id)) return;

    if (reaction.emoji.name !== '⭐') return;
    const { message } = reaction;
    const starboard = message.guild.channels.get(message.guild.settings.get('starboard'));
    if (!starboard) return;
    const isAuthor = await Starboard.isAuthor(message.id, user.id);
    if (isAuthor || message.author.id === user.id) {
        reaction.users.remove(user);
        return message.channel.send(`${user}, you can't star your own messages.`); 
    }
    const hasStarred = await Starboard.hasStarred(message.id, user.id);
    if (hasStarred) return;
    const isStarred = await Starboard.isStarred(message.id);
    if (isStarred) return Starboard.addStar(message, starboard, user.id);
    else Starboard.createStar(message, starboard, user.id);
};