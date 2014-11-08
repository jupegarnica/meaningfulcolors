/**
 * Created with Bada55.
 * User: jupegarnica
 * Date: 2014-11-07
 * Time: 04:48 PM
 */

function old2new(file) {
    var fs = require('fs');
    fs.readFile(file, function(err, data) {
        if(err) throw err;
        var old = JSON.parse(data);
        var words = Object.keys(old);
        var newer = [];
        for(var i = 0; i < words.length; i++) {
            newer.push({
                "word": words[i],
                "color": old[words[i]],
                "lang":"english"
            });
        }
        fs.writeFile(file.replace('obj','array'), JSON.stringify(newer), function(err) {
            if(err) throw err;
            console.log('It\'s saved!');
        });
    });
}
old2new('englishDictionary.obj.json');