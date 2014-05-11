var nodeApp = angular.module('nodeApp', ['ngRoute', 'appControllers', 'locationsAnimations']);

nodeApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/locations/list', {
                templateUrl: 'partials/location-list.html',
                controller: 'locationListCtrl'
            }).
            when('/locations/:locationId/edit', {
                templateUrl: 'partials/location-detail.html',
                controller: 'locationDetailCtrl'
            }).
            when('/locations/:locationId/fullImage/:imgIndex', {
                templateUrl: 'partials/location-detail-fullImage.html',
                controller: 'locationDetailCtrl'
            }).
            when('/locations/add', {
                templateUrl: 'partials/location-add.html',
                controller: 'locationAddCtrl'
            }).
            otherwise({
                redirectTo: '/locations/list'
            });
    }]);