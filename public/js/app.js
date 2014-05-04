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
            when('/locations/:locationId/fullImage/:imgIndex', {
                templateUrl: 'partials/location-detail-fullImage.html',
                controller: 'locationDetailCtrl'
            }).
            otherwise({
                redirectTo: '/locations'
            });
    }]);