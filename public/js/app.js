var nodeApp = angular.module('nodeApp', ['ngRoute', 'appControllers']);

nodeApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/locations', {
                templateUrl: 'partials/location-list.html',
                controller: 'locationListCtrl'
            }).
            when('/locations/:locationId', {
                templateUrl: 'partials/location-detail.html',
                controller: 'locationDetailCtrl'
            }).
            otherwise({
                redirectTo: '/locations'
            });
    }]);