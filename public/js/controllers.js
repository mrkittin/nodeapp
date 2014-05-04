var appControllers = angular.module('appControllers', []);

appControllers.controller('locationListCtrl', ['$scope', '$http',
    function ($scope, $http) {
    $http.get('api/locations').success(function(data) {
        var newArr = _.map(data, function(element) {
            return _.extend({}, element, {imageUrl: 'img/location.jpg'});
        });

        $scope.locations = newArr;
    });

    $scope.orderProp = 'name';
}]);

appControllers.controller('locationDetailCtrl', ['$scope', '$routeParams', '$http',
    function ($scope, $routeParams, $http) {
        $http.get('api/locations/' + $routeParams.locationId ).success(function(data) {
            var newData = _.extend({}, data, {imageUrl: 'img/location.jpg'});
            $scope.location = newData;
        })
    }]);