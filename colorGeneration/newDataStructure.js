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
                "lang": "english"
            });
        }
        fs.writeFile(file.replace('obj', 'array'), JSON.stringify(newer), function(err) {
            if(err) throw err;
            console.log('It\'s saved!');
        });
    });
}

function merge(f1, f2) {
    
    var fs = require('fs');
    fs.readFile(f1, function(err, data) {
        if(err) throw err;
        f1 = JSON.parse(data);
        fs.readFile(f2, function(err, data) {
            if(err) throw err;
            f2 = JSON.parse(data);
            var f3 = f1.concat(f2);
            fs.writeFile('all.array.json', JSON.stringify(f3), function(err) {
                if(err) throw err;
                console.log('It\'s saved!');
            });
        });
    });
}

merge('englishDictionary.array.json','spanishDictionary.array.json');