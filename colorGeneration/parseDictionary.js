var fs = require ('fs');
fs.readFile('dictionary.json', function (err, data) {
  if (err) throw err;
  var dictionary_6_3 = mapDictionary( JSON.parse(data));
  saveWords(dictionary_6_3);
});
function mapDictionary (dic) {

  var words = Object.keys(dic);
  var words_6_3 = [];
  var max = words.length;
  console.log(max);
  words.forEach(function(word){
    if (word.length == 6 || word.length == 3 ){
      words_6_3.push(word);
    }
  });
  return words_6_3;
}

function saveWords(words) {
  var dictionary_6_3 = toObject(words);
  fs.writeFile('dictionary_6_3.json', JSON.stringify(dictionary_6_3) , function (err) {
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
