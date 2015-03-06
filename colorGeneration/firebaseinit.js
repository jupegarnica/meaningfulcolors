/**
 * Created with meaningfulcolors.
 * User: jupegarnica
 * Date: 2014-11-29
 * Time: 03:02 PM
 */
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://fiery-heat-8886.firebaseio.com/colors");
var colors;
var fs = require('fs');
fs.readFile('all.array.json', function(err, data) {
    if(err) throw err;
    colors = JSON.parse(data);
    ff
//     myFirebaseRef.set({
//         'olddata': colors,
//         'colors':'hola mundo'
//     });
});