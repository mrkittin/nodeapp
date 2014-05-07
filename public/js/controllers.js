var appControllers = angular.module('appControllers', []);

appControllers.controller('locationListCtrl', ['$scope', '$http',
    function ($scope, $http) {
    $http.get('api/locations').success(function(data) {
        var newArr = _.map(data, function(element) {
            return _.extend({}, element, {imageUrl: 'img/location.jpg'});
        });

        $scope.locations = newArr;
        $scope.headers = ['Name', 'City', 'Country', 'Address', 'Modified'];
    });

    $scope.columnSort_sortColumn = 'date_modified';
    $scope.columnSort_reverse = true;

    $scope.reverseSort = function() {
        $scope.columnSort_reverse = !$scope.columnSort_reverse;
    };

    $scope.setSortColumnOrJustReverse = function(columnName) {
        var currSort = $scope.columnSort_sortColumn;
        var newSort = columnName.toLowerCase();
        if (newSort === 'address') newSort = 'formatted_address';
        if (newSort === 'modified') newSort = 'date_modified';

        if (currSort == newSort) $scope.reverseSort();
        $scope.columnSort_sortColumn = newSort;
    };
}]);

appControllers.controller('locationDetailCtrl', ['$scope', '$routeParams', '$http',
    function ($scope, $routeParams, $http) {
        $http.get('api/locations/' + $routeParams.locationId ).success(function(data) {
            var newData = _.extend({}, data, {imageUrl: ['img/location.jpg', 'img/location2.jpg', 'img/location3.jpg']});
            $scope.location = newData;
            $scope.imgIndex = $routeParams.imgIndex;
        })
    }]);