module.exports = (client, member) => {
    const role = member.guild.roles.get(member.guild.settings.get('autoRole'));
    if (role && member.guild.me.hasPermission('MANAGE_ROLES')) {
        member.roles.add(role).catch(() => null);
    }
    const channel = member.guild.channels.get(member.guild.settings.get('welcomeLog'));
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    const msg = member.guild.settings.get('welcomeMsg', 'Welcome, <user>~')
        .replace(/(<user>)/gi, member.user.username)
        .replace(/(<server>)/gi, member.guild.name)
        .replace(/(<mention>)/gi, member);
    channel.send(msg);
};