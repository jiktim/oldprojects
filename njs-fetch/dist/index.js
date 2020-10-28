"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _url = _interopRequireDefault(require("url"));
var _http = _interopRequireDefault(require("http"));
var _https = _interopRequireDefault(require("https"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fetch = function fetch(inUrl, pData) {
  // parse url
  var reqUrl = '';

  if (_typeof(inUrl) !== 'object') {
    reqUrl = _url["default"].parse(inUrl);
  }

  var client;
  var reqfunc; // see if its a valid http address

  /*eslint-disable */

  if (reqUrl.hostname && reqUrl.protocol.startsWith('http') || _typeof(inUrl) === 'object' && inUrl.method) {
    /* eslint-enable */
    // which lib to use?

    /*eslint-disable */
    if (reqUrl.protocol == 'http:' || inUrl.port != 443 || inUrl.protocol != "https") {
      // if http
      client = _http["default"];
    } else {
      // https
      client = _https["default"];
    }
    /* eslint-enable */


    return new Promise(function (output) {
      if (_typeof(inUrl) === 'object') {
        reqfunc = client.request;
      } else {
        reqfunc = client.get;
      }

      var req = reqfunc(inUrl, function (hand) {
        // pull a get request
        var data = ''; // make an output thing

        hand.on('data', function (chunk) {
          // when recieve data
          data += chunk; // add to output
        });
        hand.on('end', function () {
          // when you are over
          // hacky as shit way to make a request object but it works soo ¯\_(ツ)_/¯
          output({
            headers: hand.headers,
            status: hand.statusCode,
            statusMessage: hand.statusMessage,
            body: {
              text: data,
              json: JSON.parse(data)
            }
          });
        });
      }).on('error', function (err) {
        // xD error
        throw err;
      });

      if (pData) {
        req.write(pData);
      }

      req.end();
    });
  }
  // else
  throw Error('invalid url');
};

var _default = fetch;
module.exports = _default;
