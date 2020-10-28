class Logging {
	constructor(db) {
		this.db = db;
	}
	// Finds the logging events.
	async getLoggingForGuild(guild) {
		const l = await this.db.table("guildconfig").get(guild.id ? guild.id : guild);
		return l ? l.loggingEvents : [];
	}
	// Finds the logging channel.
	async getLoggingChannel(guild) {
		const l = await this.db.table("guildconfig").get(guild.id ? guild.id : guild);
		return l ? l.loggingChannel : null;
	}
	// Finds the logging events if all is set.
	async canLog(guild, event) {
		const loggingEvents = await this.getLoggingForGuild(guild);
		return loggingEvents && Array.isArray(loggingEvents) && (loggingEvents.includes(event) || loggingEvents.includes("all"));
	}
}

module.exports = Logging;
