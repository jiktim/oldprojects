//par cth103
//truc de merde
var dashes = "";
cowsay = function(texte) { 
	//encore du code de merde
    dashes = "";
	for (var i = 0; i < texte.length; i++) {
   		dashes = dashes + "-";
    }
	dashes = " -" + dashes + "- ";
	//ah voila
	return "\n" + dashes + "\n" + "< " + texte + " >\n" + dashes + "\n" + "  |  ^__^\n   - (oo)|_______\n     (__)|       )/|/\n         ||----w |\n         ||     ||\n";
}
//polok
module.exports = function(param, clientArg, args) { 
	param.channel.createMessage("```\n" + cowsay(args) +"\n```");
}
