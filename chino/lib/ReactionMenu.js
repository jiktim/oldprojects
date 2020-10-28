class ReactionMenu {
	constructor(messageID, channelID, authorID, bot, options) {
		this.messageID = messageID;
		this.channelID = channelID;
		this.authorID = authorID;
		this.options = options;
		this.bot = bot;
		this.handleReaction = this.handleReactionAdd.bind(this);
		this.handleMessageDelete = this.handleDeleteMessage.bind(this);
		this.handleChannel = this.handleChannelDelete.bind(this);
	}

	bind() {
		this.bot.on("messageReactionAdd", this.handleReaction);
		this.bot.on("messageDelete", this.handleMessageDelete);
		this.bot.on("messageDeleteBulk", this.handleMessageDelete);
		this.bot.on("channelDelete", this.handleChannel);
	}

	unbind() {
		this.bot.removeListener("messageReactionAdd", this.handleReaction);
		this.bot.removeListener("messageDelete", this.handleMessageDelete);
		this.bot.removeListener("messageDeleteBulk", this.handleMessageDelete);
		this.bot.removeListener("channelDelete", this.handleChannel);
	}

	start() {
		this.bind();
	}

	handleChannelDelete(c) {
		if (this.stopped) return;
		if (c.id !== this.channelID) return;
		this.unbind();
		this.options.stopCallback(ReactionMenu.CHANNEL_DELETE);
	}

	handleDeleteMessage(msg) {
		if (this.stopped) return;
		if (Array.isArray(msg)) {
			if (msg.find(m => m.id === this.messageID)) {
				this.unbind();
				return this.options.stopCallback(ReactionMenu.MESSAGE_DELETE);
			}
		} else {
			if (msg.id !== this.messageID) return;
			this.unbind();
			return this.options.stopCallback(ReactionMenu.MESSAGE_DELETE);
		}
	}

	handleReactionAdd(msg, emoji, ID) {
		if (this.stopped) return false;
		if (msg.id !== this.messageID) return false;
		if (ID !== this.authorID) return false;
		if (emoji.name === ReactionMenu.STOP) {
			if (this.options.stopCallback && !this.stopped) {
				this.stopped = true;
				this.unbind();
				return this.options.stopCallback(ReactionMenu.MANUAL_EXIT);
			} else { throw new Error("The stop callback is missing."); }
		}
		return true;
	}
}
ReactionMenu.STOP = "⏹";
ReactionMenu.MANUAL_EXIT = 0;
ReactionMenu.MESSAGE_DELETE = 1;
ReactionMenu.CHANNEL_DELETE = 2;
ReactionMenu.TIMEOUT = 3;

module.exports = ReactionMenu;
