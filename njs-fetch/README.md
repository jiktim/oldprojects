<div align="center">

# njs-fetch
fetch for node.js

<a href="https://www.npmjs.com/package/njs-fetch"><img src="https://img.shields.io/npm/v/njs-fetch.svg?maxAge=3600" alt="NPM version" /></a>
<a href="https://www.npmjs.com/package/njs-fetch"><img src="https://img.shields.io/npm/dt/njs-fetch.svg?maxAge=3600" alt="NPM downloads" /></a>
<p>
    <a href="https://nodei.co/npm/njs-fetch/"><img src="https://nodei.co/npm/njs-fetch.png?downloads=true&stars=true" alt="npm installnfo" /></a>
</p>

## examples

### simple get request
```js
var fetch = require("njs-fetch");
fetch("http://example.com").then(res => {
  console.log(res.body);
})
```
### advanced https request
```js
var fetch = require("njs-fetch");
fetch({
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET'
}).then(res => {
  console.log(res.body);
})
```
### simple post request
```js
var fetch = require("njs-fetch");
var postData = JSON.stringify({question: cool});
fetch({
  hostname: 'www.test.com',
  port: 80,
  path: '/cool',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
}, postData).then(res => {
  console.log(res.body);
})
```
