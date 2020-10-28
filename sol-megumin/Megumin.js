const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = class extends Client {
    constructor(config, options) {
        super(config, options);
        
        this.config = config;
        this.commands = new Collection();
        this.cooldowns = new Collection();
    } 
    
    async initCommands() {
        const commandFiles = await readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            await this.commands.set(command.name, command);
        }
    }

    async logEvent(event, type = 'Info', message) {
        console.log(`[${event}] (${type}): ${message}`);
    }

    async build() {
        await this.initCommands();
        await this.login(this.config.token);
    }
};