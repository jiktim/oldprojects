const {
	get,
} = require("snekfetch");
const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class rule34Comamnd extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.NSFW,
			description: "Posts an image from Rule 34.",
			aliases: ["r34", "pahael"],
			usage: "<tags>",
			allowdisable: true,
		});
	}

	async run(msg, args) {
		if (msg.channel.nsfw) {
			if (!args[0]) {
				var {
					body,
					// API
				} = await get("https://custom-r34-api.herokuapp.com/posts?tags=");
			} else {
				var {

					body,

				} = await get(`https://custom-r34-api.herokuapp.com/posts?tags=${args.join("%20")}`);
			}
			// 404
			if (body.size == 0) {
				msg.channel.createMessage({
					embed: this.errembed({
						title: `Error!`,
						description: `404 Not Found`,
					}),
				});
			}
			// Posts image
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
				// No results
				msg.channel.createMessage({
					embed: this.errembed({
						title: `Error!`,
						description: `No results found.`,
					}),
				});
			}
		} else {
			// Not NSFW channel
			await await msg.channel.createMessage({
				embed: {
					title: "Error!",
					description: `This is not an NSFW channel`,
					color: 0x7289DA,
				},
			});
		}
	}
}

module.exports = rule34Comamnd;
