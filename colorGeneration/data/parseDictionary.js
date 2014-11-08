var fs = require ('fs');
function extractFromJson(file){

  fs.readFile(file, function (err, data) {
    if (err) throw err;
    var output = mapDictionaryJson( JSON.parse(data));
    saveWords(output,file + '.parsed.json');
  });
}
function extractFromTxt(file){
  fs.readFile(file,'utf8', function (err, data) {
    if (err) throw err;
    var output = mapDictionaryText( data);
    saveWords(output,file + '.parsed.json');
  });
}
function mapDictionaryText (dic) {

  var words = dic.split('\n');
  var words_6_3 = [];
  var max = words.length;
  words.forEach(function(word){
    if (word.length == 6 || word.length == 3 ){
      words_6_3.push(word);
    }
  });
  return words_6_3;
}
function mapDictionaryJson (dic) {

  var words = Object.keys(dic);
  var words_6_3 = [];
  var max = words.length;
  words.forEach(function(word){
    if (word.length == 6 || word.length == 3 ){
      words_6_3.push(word);
    }
  });
  return words_6_3;
}

function saveWords(words,file) {
  var dictionary_6_3 = toObject(words);
  fs.writeFile(file, JSON.stringify(dictionary_6_3) , function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});

}
function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    if (arr[i] !== undefined) rv[i] = arr[i];
  return rv;
}
extractFromTxt('/Users/jpg/Desktop/bada55/colorGeneration/words.txt');
