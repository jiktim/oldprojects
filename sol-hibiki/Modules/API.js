const { get } = require('snekfetch');

module.exports = class API {
    static async gender(first, last) {
        const { body } = await get(`https://api.namsor.com/onomastics/api/json/gender/${first}/${last}`);
        if (body.gender === 'unknown') return `I have no idea what gender ${body.firstName} is..`;
        return `I'm **${Math.abs(body.scale * 100)}**% sure **${body.firstName}** is a **${body.gender}** name.`;
    }

    static async spoopy(link) {
        const { body } = await get(`https://spoopy.link/api/${link}`);
        return `
            ${body.safe ? 'Safe!' : 'Not safe...'}
            ${body.chain.map(url => `<${url.url}> ${url.safe ? '✅' : `❌ (${url.reasons.join(', ')})`}`).join('\n')}
        `;
    }
};