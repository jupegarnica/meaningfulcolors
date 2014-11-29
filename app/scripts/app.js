'use strict';

angular.module('workspaceApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'infinite-scroll',
  'firebase'
])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/lang/:lang', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
    .when('/lang/:lang/search/:query', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/lang/all'
      });
  });