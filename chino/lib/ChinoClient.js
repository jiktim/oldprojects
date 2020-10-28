const {
	Client,
	Collection,
} = require("eris");
const get = require("snekfetch");
const Taihou = require("taihou");
const {
	CommandCategories,
	OwnerID,
} = require("./Constants");
const Command = require("./Command");
const {
	readdir,
} = require("fs");
const {
	promisify,
} = require("util");

class ChinoClient extends Client {
	constructor(token, options, db) {
		super(token, options);
		this.db = db;
		this.commands = new Collection(Command);
	}

	canRunCommand(command, {
		member,
		channel,
	}) {
		if (command.requiredPerms) return member.permission.has(command.requiredPerms) || member.permission.has("administrator");
		if (command.category === CommandCategories.GENERAL || command.category === CommandCategories.FUN || command.category === CommandCategories.MISC) return true;
		if (command.category === CommandCategories.MODERATION && command.requiredPerms != undefined) return member.permission.has(command.requiredPerms) || member.permission.has("administrator");
		if (command.category === CommandCategories.OWNER) return OwnerID.includes(member.id);
		if (command.category === CommandCategories.NSFW) return channel.nsfw;
		return true;
	}

	async hastebin(data) {
		const hastebin = await get.post("https://hastebin.com/documents", {
			data: data,
		});
		return hastebin.body.key;
	}

	passesRoleHierarchy(member1, member2) {
		if (member1.guild != member2.guild) throw new TypeError("Members aren't in the same guild");
		if (member1.guild.ownerID == member1.id) return true;
		if (member1.guild.ownerID == member2.id) return false;
		if (member1.roles.length == 0) return false;
		if (member2.roles.length == 0) return true;
		let member1Roles = member1.roles.map(r => member1.guild.roles.get(r));
		let member2Roles = member2.roles.map(r => member2.guild.roles.get(r));
		member1Roles = member1Roles.sort((a, b) => b.position - a.position);
		member2Roles = member2Roles.sort((a, b) => b.position - a.position);
		return member1Roles[0].position > member2Roles[0].position;
	}

	toHHMMSS(date) {
		let sec_num = parseInt(date, 10);
		let hours = Math.floor(sec_num / 3600);
		let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		let seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours < 10) {
			hours = `0${hours}`;
		}
		if (minutes < 10) {
			minutes = `0${minutes}`;
		}
		if (seconds < 10) {
			seconds = `0${seconds}`;
		}
		let time = `${hours} hours, ${minutes} minutes`;
		return time;
	}

	dateFormat(EpochDate) {
		let date = new Date(EpochDate);
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let month = monthNames[date.getMonth()];
		let day = date.getDate();
		if (day == 1) day = "1st";
		if (day == 2) day = "2nd";
		if (day == 3) day = "3rd";
		if (day > 3 && day != 3) day = `${date.getDate()}th`;
		let year = date.getFullYear();
		let time = `${date.getUTCHours()}:${(date.getUTCMinutes() < 10 ? "0" : "") + date.getUTCMinutes()}`;
		// optional: add UTC at the end
		return `${day} ${month} ${year} ${time}`;
	}

	async loadCommands() {
		const files = await promisify(readdir)("./commands");
		files
			.map(file => file.toLowerCase())
			.filter(file => /.+\.js$/.test(file))
			.forEach(async file => {
				let command;
				try {
					command = require(`${process.cwd()}/commands/${file}`);
				} catch (e) {
					console.error(`Error while loading ${file}:\n${e.stack}`);
					return;
				}
				if (!(command.prototype instanceof Command)) return;
				this.commands.add(new command(this, this.db, file.match(/(.+)\.js$/)[1].toLowerCase()));
				console.log(`Loaded ${file}`);
			});
	}

	tag(user) {
		if (user) {
			return `${user.username}#${user.discriminator}`;
		} else {
			return undefined;
		}
	}

	waitForEvent(event, timeout, check) {
		let t;
		if (!check || typeof check !== "function") check = () => true;
		return new Promise((rs, rj) => {
			const listener = (...args) => {
				if (check && typeof check == "function" && check(...args) === true) {
					dispose();
					rs([...args]);
				}
			};
			const dispose = () => {
				this.removeListener(event, listener);
				if (t) clearTimeout(t);
			};

			if (timeout) {
				t = setTimeout(() => {
					dispose();
					rj("timeout");
				}, timeout);
			}

			this.on(event, listener);
		});
	}
}

module.exports = ChinoClient;
