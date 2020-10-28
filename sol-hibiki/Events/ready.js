const { activities } = require('../Assets/json/messages');

module.exports = async (client) => {
    await client.logger.info(`[DISCORD]: ${client.user.tag} ${client.version} is ready.`);
    if (client.guilds.size == 0) await client.logger.info(`[DISCORD]: ${client.user.username} is in zero servers! Invite it by using this link: ${await client.generateInvite(['ADMINISTRATOR'])}.`);
    await client.user.setActivity(`in ${client.guilds.size} servers!`);
    await setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)]
            .replace(/(<servers>)/, client.guilds.size)
            .replace(/(<prefix>)/, client.commandPrefix);
        client.user.setActivity(activity);
    }, 900000);
};