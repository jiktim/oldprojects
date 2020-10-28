const { ownerIDs } = require("../config.json");
const Constants = {
	CommandCategories: {
		GENERAL: 0,
		FUN: 1,
		MODERATION: 2,
		OWNER: 5,
		MISC: 3,
		NSFW: 4,
	},
	OwnerID: ownerIDs,
	DiscordEpoch: 1420070400000,
};
Constants.CommandCategoriesText = {
	[Constants.CommandCategories.GENERAL]: "🤖 General commands",
	[Constants.CommandCategories.FUN]: "🎉 Fun commands",
	[Constants.CommandCategories.MODERATION]: "🔨 Moderation commands",
	[Constants.CommandCategories.MISC]: "❓ Miscellaneous commands",
	[Constants.CommandCategories.NSFW]: "🔞 NSFW commands",
	[Constants.CommandCategories.OWNER]: "⛔ Owner commands",
};
Constants.CommandCategoriesColor = {
	[Constants.CommandCategories.GENERAL]: 0x7289DA,
	[Constants.CommandCategories.FUN]: 0xb987ff,
	[Constants.CommandCategories.MODERATION]: 0x59ff82,
	[Constants.CommandCategories.MISC]: 0x4fa9ff,
	[Constants.CommandCategories.NSFW]: 0xff6666,
	[Constants.CommandCategories.OWNER]: 0xa8a8a8,
};

module.exports = Constants;
