'use strict';
angular.module('workspaceApp').controller('MainCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {
        var _active;
        var langLoad = 0;
        var spa ={},
            eng = {},
            words_eng = {},
            words_spa = {};

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

        function setLang() {
            if(langLoad >= 2) {
                reset();
                switch($routeParams.lang) {
                    case "english":
                        showEng();
                        break;
                    case "spanish":
                        showSpa();
                        break;
                    case "all":
                        showAll();
                        break;
                   
                }
            }
        }
        $http.get('../../colorGeneration/englishDictionary.colors.json').success(function(data) {
            eng = data;
            langLoad += 1;
            setLang();
        });
        $http.get('../../colorGeneration/spanishdict.txt.parsed.json.colors.json').success(function(data) {
            spa = data;
            langLoad += 1;
            setLang();
        });
        var showEng = function() {
            if(_active != "words_eng") {
                replaceObj(words_eng, $scope.colors, eng);
                _active = "words_eng";
            }
        };
        var showSpa = function() {
            if(_active != "words_spa") {
                replaceObj(words_spa, $scope.colors, spa);
                _active = "words_spa";
            }
        };
        var showAll = function() {
            if(_active != "words_all") {
                replaceObj(mergeObj(words_eng, words_spa), $scope.colors);
                _active = "words_all";
            }
        };
        $scope.eng = showEng;
        $scope.spa = showSpa;
        $scope.all = showAll;
        $scope.lang = $routeParams.lang;
        $scope.colors = {};
    }
]).filter('complementaryColor', function() {
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