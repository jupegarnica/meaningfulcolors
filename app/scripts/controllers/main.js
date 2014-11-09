'use strict';
angular.module('workspaceApp').controller('MainCtrl', ['$route', '$location', '$scope', '$http', '$routeParams',
    function($route, $location, $scope, $http, $routeParams) {
        var dictionary = [],
            currentDictionary = [],
            indexLoaded = -1,
            maxtoLoad = 5;
        if($routeParams.query) $scope.query = decodeURI($routeParams.query);
        $scope.colors = [];
        $scope.lang = $routeParams.lang;
        $scope.eng_active = $scope.lang == 'english' ? 'active' : '';
        $scope.spa_active = $scope.lang == 'spanish' ? 'active' : '';
        $scope.all_active = $scope.lang == 'all' ? 'active' : '';
        $(function() {
            var navbarHeight = $('.navbar2').outerHeight(); //mas el margin del footer
            $('.colors').css('margin-bottom', navbarHeight);
        });

        function loadWords(max) {
            max = max == 'all' ? Infinity : maxtoLoad; // if explicited or default
            var from = 0
            $scope.colors.length = 0; // empty receptor
            for(var i = from; i < currentDictionary.length && i <= max; i++) {
                $scope.colors.push(currentDictionary[i]);
            }
            indexLoaded = i;
        }

        function loadRandom() {
            currentDictionary = JSON.parse(JSON.stringify(dictionary));
            currentDictionary.sort(function() {
                return(Math.round(Math.random()) - 0.5);
            });
            loadWords();
        }

        function filterDictionary() {
            var filter = $scope.lang;
            currentDictionary = [];
            for(var i = 0; i < dictionary.length; i++) {
                if(filter === 'all' || dictionary[i].lang === filter) {
                    currentDictionary.push(dictionary[i]);
                }
            }
        }

        function changeUrl(lang, query) {
            lang = lang || $routeParams.lang;
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
            $scope.query = query;
            $scope.lang = lang;
            $routeParams.lang = lang;
            $routeParams.query = query;
            $scope.eng_active = lang == 'english' ? 'active' : '';
            $scope.spa_active = lang == 'spanish' ? 'active' : '';
            $scope.all_active = lang == 'all' ? 'active' : '';
            $scope.baseUrl = $location.absUrl().replace(/lang.{0,}/, '');
        }
        $scope.$watch('query', function(query, oldquery) {
            if($scope.colors.length < dictionary.length && typeof query == 'string') {
                currentDictionary = JSON.parse(JSON.stringify(dictionary));
                loadWords('all');
                changeUrl('all', query);
            } else if(typeof query == 'string') {
                changeUrl(undefined, query);
            }
            $('#search').focus();
        });
        $scope.loadMore = function() {
            var all, from, max;
            if($scope.colors.length == 0) return;
            all = JSON.parse(JSON.stringify(currentDictionary));
            from = indexLoaded + 1;
            max = from + maxtoLoad;
            for(var i = from; i < all.length && i <= max; i++) {
                if(all[i]) {
                    $scope.colors.push(all[i]);
                } else {
                    return;
                }
            }
            indexLoaded = i;
        };

        function init() {
            var query = $routeParams.query;
            if(query) {
                currentDictionary = JSON.parse(JSON.stringify(dictionary));
                loadWords('all');
                changeUrl('all', query);
            } else {
                filterDictionary();
                loadWords();
            }
        }
        $scope.eng = function() {
            changeUrl('english', undefined);
            filterDictionary();
            loadWords();
        };
        $scope.spa = function() {
            changeUrl('spanish', undefined);
            filterDictionary();
            loadWords();
        };
        $scope.all = function() {
            changeUrl('all', undefined);
            filterDictionary();
            loadWords();
        };
        $scope.rnd = function() {
            loadRandom();
            changeUrl('all', undefined);
        };
        $http.get('../colorGeneration/all.array.json').success(function(data) {
            dictionary = data;
            init();
        });
//         var lastQuery = "";
//         var lastQueries = [];

//         function parseQuery(busqueda) {
//             var queries, query;
//             if(busqueda !== lastQuery) {
//                 console.log('parseQuery');
//                 queries = busqueda.toLowerCase().split(' ');
//                 for(var i = 0; i < queries.length; i++) {
//                     if(queries[i].match('@')) {
//                         queries[i] = '^' + queries[i].replace('@', '') + '$';
//                     }
//                 }
//                 lastQuery = busqueda;
//                 lastQueries = queries;
//                 return queries;
//             } else {
//                 return lastQueries;
//             }
//         }
        $scope.containsComparator = function(actual, expected) {
            var queries = expected.toLowerCase().split(' ');
            for(var i = 0; i < queries.length; i++) {
                if(queries[i].match('@')) {
                    queries[i] = '^' + queries[i].replace('@', '') + '$';
                }
                if(actual.toLowerCase().match(queries[i])) {
                    return true;
                }
            }
            return false;
        };
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