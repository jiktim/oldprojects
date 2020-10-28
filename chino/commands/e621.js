const {
	get,
} = require("snekfetch");
const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class e621Command extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.NSFW,
			description: "Posts an image from e621.",
			usage: "<tags>",
			allowdisable: true,
		});
	}

	async run(msg, args) {
		if (msg.channel.nsfw) {
			if (!args[0]) {
				var {
					body,
				// Gets the core e621 API.
				} = await get("https://e621.net/post/index.json");
			} else {
				var {

					body,

				// Gets the e621 API that allows tags.
				} = await get(`https://e621.net/post/index.json?tags=${args.join("%20")}`);
			}
			if (body.size == 0) {
				msg.channel.createMessage({
					embed: this.errembed({
						title: `Error!`,
						description: `404 Not Found`,
					}),
				});
			}
			// Posts the image requested, if found.
			const random = Math.floor(Math.random() * 99) + 1;
			if (body.toString("utf8").length != 0 && typeof body[random] != "undefined") {
				await msg.channel.createMessage({
					embed: {
						color: 0x7289DA,
						image: {
							url: body[random].file_url,
						},
					},
				});
			} else {
				// Error out if no results are found.
				msg.channel.createMessage({
					embed: this.errembed({
						title: `Error!`,
						description: `No results found.`,
					}),
				});
			}
		} else {
			// If the channel is not marked as NSFW, error out. Deprecated.
			await await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: `This is not a NSFW channel`,
				}),
			});
		}
	}
}

module.exports = e621Command;
