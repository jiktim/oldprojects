const fetch = require('./dist/index.js')

fetch({
    hostname: 'hastebin.com',
    port: 443,
    path: '/documents',
    method: 'POST',
    headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain',
    },
}, Buffer.from('sex')).then((res) => {
    console.log(res)
})
