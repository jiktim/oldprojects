var request = require('request');
var libxmljs = require("libxmljs");
//beta

module.exports = function(param,clientArg, args) { // it sends help
    request('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags='+encodeURI(args), function (error, response, body) {
	var xmlDoc = libxmljs.parseXml(body);
	var children = xmlDoc.root().childNodes();
    var child = children[Math.floor(children.length * Math.random())];
	try {
    param.channel.createMessage(":weary: :ok_hand: http:" + child.attr("file_url").value());
	} catch (e) {
	param.channel.createMessage(":rage: :ok_hand: There isn't porn out of it! How? :thinking:");
    }		
    });
}
