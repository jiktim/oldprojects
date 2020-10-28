const { inspect } = require('util');

module.exports = async (client, err) => {
    await client.logger.error(`[ERROR]:\n$${inspect(err, { depth: 0 })}`);
};