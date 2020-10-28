class Command {
	constructor(bot, db, commandName, info) {
		if (!info) throw new Error("Unknown command!");
		this.bot = bot;
		this.db = db;
		this.id = commandName;
		this.aliases = info.aliases && Array.isArray(info.aliases) ? info.aliases : [];
		this.usage = info.usage;
		this.category = info.category;
		this.description = info.description;
		this.requiredPerms = info.requiredPerms;
		this.allowDisable = info.allowDisable;
	}

	async exec(msg, args) {
		throw new Error("Please override this method.");
	}

	embed(...objects) {
		return Object.assign({
			timestamp: new Date(),
			color: 0x7289DA,
		}, ...objects);
	}
	succembed(...objects) {
		return Object.assign({
			timestamp: new Date(),
			color: 0x41ff70,
		}, ...objects);
	}
	errembed(...objects) {
		return Object.assign({
			timestamp: new Date(),
			color: 0xff4242,
		}, ...objects);
	}
}

module.exports = Command;
