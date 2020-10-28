const { post } = require('snekfetch'); 

module.exports = async (value) => {
    const { body } = await post('https://hastebin.com/documents').send(value.code);

    return `https://hastebin.com/${body.key}.${value.lang || 'js'}`;
};