'use strict';
var eng = {
    "BESTAR": "#8E5742",
    "SEA": "#5E4",
    "PIG": "#416",
    "DOGATE": "#D0647E"
};
var spa = {
    "ABA": "#484",
    "ABABOL": "#484801",
    "ABACAL": "#484C41",
    "ABALAR": "#484142"
};
var words_eng = JSON.parse(JSON.stringify(eng));
var words_spa = JSON.parse(JSON.stringify(spa));
angular.module('workspaceApp').controller('MainCtrl', function($scope) {
    var _active;

    function emptyObj(obj) {
        var keys = Object.keys(obj);
        for(var i = 0; i < keys.length; i++) {
            delete obj[keys[i]];
        }
    }

    function reset() {    
        words_eng = JSON.parse(JSON.stringify(eng));
        words_spa = JSON.parse(JSON.stringify(spa));
    }

    function replaceObj(from, to, hardcopy) {
        emptyObj(to);
        var keys = Object.keys(from);
        for(var i = 0; i < keys.length; i++) {
            to[keys[i]] = from[keys[i]];
        }
        reset();
        console.log(words_eng, 'words_eng');
        console.log(words_spa, 'words_spa');
        console.log(eng, 'eng');
        console.log(spa, 'spa');
    }

    function mergeObj(obj1, obj2) {
        var keys = Object.keys(obj1);
        for(var i = 0; i < keys.length; i++) {
            obj2[keys[i]] = obj1[keys[i]];
        }
        return obj2;
    }
    $scope.eng = function() {
        if(_active != "words_eng") {
            replaceObj(words_eng, $scope.colors, eng);
            _active = "words_eng";
        }
    };
    $scope.spa = function() {
        if(_active != "words_spa") {
            replaceObj(words_spa, $scope.colors, spa);
            _active = "words_spa";
        }
    };
    $scope.all = function() {
        if(_active != "words_all") {
            replaceObj(mergeObj(words_eng, words_spa), $scope.colors);
            _active = "words_all";
        }
    };
    $scope.colors = words_eng;
    _active = "words_eng";
}).filter('complementaryColor', function() {
    return function(c) {
        var paddedHex = function(n) {
            var hex = ((n < 10) ? "0" : "") + n.toString(16);
            return(hex.length === 1) ? "0" + hex : hex;
        };
        var hex2rgb = function(h) {
            h = h.replace("#", "");
            if(h.length === 6) {
                return Utils.render([parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)], "rgb");
            } else {
                return parseInt(h, 16);
            }
        };
        var rtn;
        if(typeof c == "string" && /(#([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?)/.test(c)) {
            c = c.replace("#", "");
            rtn = "#";
            if(c.length === 6) {
                rtn += paddedHex(255 - hex2rgb(c.substr(0, 2)));
                rtn += paddedHex(255 - hex2rgb(c.substr(2, 2)));
                rtn += paddedHex(255 - hex2rgb(c.substr(4, 2)));
            }
            if(c.length === 3) {
                rtn += paddedHex(255 - hex2rgb(c.substr(0, 1) + c.substr(0, 1)));
                rtn += paddedHex(255 - hex2rgb(c.substr(1, 1) + c.substr(1, 1)));
                rtn += paddedHex(255 - hex2rgb(c.substr(2, 1) + c.substr(2, 1)));
            }
            return rtn;
        } else {
            return c;
        }
    };
});