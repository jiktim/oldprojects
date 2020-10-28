// getting a random comic
function GarfieldRandom() {
    let month = Math.floor(Math.random() * 12) + 1;
    var day;
    // since not all months have equal days we will have to do if checks (havent found a better solution yet)
    if (month === 2) {
        var day = Math.floor(Math.random() * 29) + 1; // this month has 28 days
        // what about the uhh
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
        var day = Math.floor(Math.random() * 30) + 1; // all of these months have 30 days
    }
    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
        var day = Math.floor(Math.random() * 31) + 1; // all of these months have 31 days
    }
    let todayYear = today.getFullYear();
    let randomYear = Math.floor(Math.random() * (todayYear - 1978) + 1978); // get a random year from 1978 to today
    let randomizedMonth = (month < 9 ? '0' : '') + month;
    let randomizedDay = (day < 9 ? '0' : '') + day;
    let archive = 'https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/'; // archive :thinking:
    let url = archive + randomYear + '/' + randomYear + '-' + randomizedMonth + '-' + randomizedDay + '.gif';
    return url;
}
// counting the total number of comics
var start = new Date('1978-06-19'); // june 19 1978 is when garfield started
var today = new Date();
var dayLength = 24 * 60 * 60 * 1000;
var comicCount = Math.round(Math.abs((start.getTime() - today.getTime()) / (dayLength))); // do math to get the total number of comics

module.exports = function(param, clientArg, args) { // it sends shit
    let garfield = GarfieldRandom(); // run the function so it returns a url
    param.channel.createMessage(garfield + '\n:cat:. Total comics: **' + comicCount + '**'); // it sends a message.
};