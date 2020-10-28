const { readdir } = require('fs');

module.exports = (client) => {
    readdir('./Events/', (err, files) => {
        if (err) return this.client.logger.error(err);
        files.forEach(file => {
            const event = require(`../Events/${file}`);
            let eventName = file.split('.')[0];
            client.on(eventName, event.bind(null, client));
            delete require.cache[require.resolve(`../Events/${file}`)];
        });
    });
};