var fs = require('fs');
var words = [];
var colors = {}; //  word : color
fs.readFile('dictionary_6_3.json', function(err, data) {
  if (err) throw err;
  words = toArray(JSON.parse(data));
  console.log(words);
  var color = "";
  for (var i = 0; i < words.length; i++) {

    color = word2color(words[i]);
    if (color) {
      colors[words[i]] = color;
    }

  }
  fs.writeFile('colors-bada55.json', JSON.stringify(colors), function(err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
});

function toArray(obj) {
  var i = 0,
  array = [];
  while (obj[i]) {
    array.push(obj[i++]);
  }
  return array;
}

var rosetaHex2Letter = {};
rosetaHex2Letter['1'] = ['L', 'I'];
rosetaHex2Letter['2'] = ['Q', 'Z', 'R'];
rosetaHex2Letter['3'] = ['E', 'B'];
rosetaHex2Letter['4'] = ['A', 'P'];
rosetaHex2Letter['5'] = ['S'];
rosetaHex2Letter['6'] = ['G'];
rosetaHex2Letter['7'] = ['T'];
rosetaHex2Letter['8'] = ['B', 'O'];
rosetaHex2Letter['9'] = ['G', 'Q'];
rosetaHex2Letter['0'] = ['O'];
rosetaHex2Letter['A'] = ['A'];
rosetaHex2Letter['B'] = ['B'];
rosetaHex2Letter['C'] = ['C'];
rosetaHex2Letter['D'] = ['D'];
rosetaHex2Letter['E'] = ['E'];
rosetaHex2Letter['F'] = ['F'];

var rosetaLetter2Hex = {};
rosetaLetter2Hex['A'] = ['4', 'A'];
rosetaLetter2Hex['B'] = ['8', 'B'];
rosetaLetter2Hex['C'] = ['C'];
rosetaLetter2Hex['D'] = ['D'];
rosetaLetter2Hex['E'] = ['E'];
rosetaLetter2Hex['F'] = ['F'];
rosetaLetter2Hex['G'] = ['6'];
rosetaLetter2Hex['I'] = ['1'];
rosetaLetter2Hex['L'] = ['1'];
rosetaLetter2Hex['O'] = ['0'];
rosetaLetter2Hex['P'] = ['4'];
rosetaLetter2Hex['Q'] = ['9'];
rosetaLetter2Hex['R'] = ['2'];
rosetaLetter2Hex['S'] = ['5'];
rosetaLetter2Hex['T'] = ['7'];
rosetaLetter2Hex['Z'] = ['2'];

function word2color(word) {
  var color = "#";
  var splited = word.split('');
  for (var i = 0; i < splited.length; i++) {
    if (rosetaLetter2Hex[splited[i]]) {
      color += rosetaLetter2Hex[splited[i]][0];
    } else {
      return false;
    }
  }
  return color;
}
