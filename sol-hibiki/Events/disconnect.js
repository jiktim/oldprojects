const { inspect } = require('util');

module.exports = (client, err) => {
    client.logger.warn(`[DISCONNECT]: Disconnected from Discord, reason: ${inspect(err, { depth: 0 })}.`);
};