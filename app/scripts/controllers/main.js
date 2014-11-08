'use strict';
angular.module('workspaceApp').controller('MainCtrl', ['$route', '$location', '$scope', '$http', '$routeParams',
    function($route, $location, $scope, $http, $routeParams) {
        var _active;
        var langLoad = 0;
        var spa = [],
            eng = [],
            words_eng = [],
            words_spa = [];

        function emptyObj(obj) {
            console.log(obj);
            obj.length = 0;
        }

        function reset() {
            words_eng = JSON.parse(JSON.stringify(eng));
            words_spa = JSON.parse(JSON.stringify(spa));
        }

        function replaceObj(from, to, hardcopy) {
            for(var i = 0; i < from.length; i++) {
                to[i] = from[i];
            }
            reset();
        }

        function mergeObj(obj1, obj2) {
            return obj2.concat(obj1);
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
        if(langLoad <= 2) {
            $http.get('../colorGeneration/englishDictionary.array.json').success(function(data) {
                eng = data;
                langLoad += 1;
                setLang();
            });
            $http.get('../colorGeneration/spanishDictionary.array.json').success(function(data) {
                spa = data;
                langLoad += 1;
                setLang();
            });
        }
        var original = $location.path;
        $location.path = function(path, reload) {
            if(reload === false) {
                var lastRoute = $route.current;
                var un = $scope.$on('$locationChangeSuccess', function() {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };

        function changeUrl(lang, query) {
            lang = lang || $routeParams.lang;
            query = typeof query == 'string' ? query : $routeParams.query;
            var hash = window.location.hash.replace('#', '');
            var newhash = '/lang/' + lang;
            if(query) {
                newhash += '/search/' + query;
            }
            var off = $scope.$on('$routeUpdate', function(e) {
                e.preventDefault();
                off();
            });
            $location.path(newhash, false);
            $scope.eng_active = lang == 'english' ? 'active' : '';
            $scope.spa_active = lang == 'spanish' ? 'active' : '';
            $scope.all_active = lang == 'all' ? 'active' : '';
            $scope.baseUrl =  $location.absUrl().replace(/lang.{0,}/,'');
        }
//         $scope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
//             if($routeParams.anchor) {
//                 $location.hash($routeParams.anchor);
//                 $anchorScroll();
//             }
//         });
        $scope.$watch('query', function(query) {
            changeUrl(undefined, query);
            $('#search').focus();
        });
        var showEng = function() {
            if(_active != "words_eng") {
                replaceObj(words_eng, $scope.colors, eng);
                _active = "words_eng";
                changeUrl('english');
            }
        };
        var showSpa = function() {
            if(_active != "words_spa") {
                replaceObj(words_spa, $scope.colors, spa);
                _active = "words_spa";
                changeUrl('spanish')
            }
        };
        var showAll = function() {
            if(_active != "words_all") {
                replaceObj(mergeObj(words_eng, words_spa), $scope.colors);
                _active = "words_all";
                changeUrl('all')
            }
        };
        $scope.eng = showEng;
        $scope.spa = showSpa;
        $scope.all = showAll;
        if($routeParams.query) $scope.query = decodeURI($routeParams.query);
        $scope.colors = [];
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