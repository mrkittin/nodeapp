var appControllers = angular.module('appControllers', []);

appControllers.controller('stateCtrl', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
        $rootScope.$on('deleteEvent', function(event, data) {
            $timeout(function () {
                $rootScope.successTextAlert = "Deleted location with id: " + data.id;
                $rootScope.showUndo = true;
                $rootScope.showSuccessAlert = true;
            }, 500);
        });
        $rootScope.$on('updateEvent', function(event, data) {
            $timeout(function () {
                $rootScope.successTextAlert = "Updated location with id: " + data.id;
                $rootScope.showUndo = true;
                $rootScope.showSuccessAlert = true;
            }, 500);
        });
        $rootScope.showUndoAlert = function() {
            $timeout(function () {
                $rootScope.successTextAlert = "Not implemented yet";
                $rootScope.showSuccessAlert = true;
                $rootScope.showUndo = false;
            }, 500);
        };

        $rootScope.hideAlert = function() {
            $rootScope.showSuccessAlert = false;
        };
    }]
);

appControllers.controller('locationListCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.$root.hideAlert();
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

appControllers.controller('locationDetailCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope',
    function ($scope, $routeParams, $http, $location, $rootScope) {
        $http.get('api/locations/' + $routeParams.locationId ).success(function(data) {
            var newData = _.extend({}, data, {imageUrl: ['img/location.jpg', 'img/location2.jpg', 'img/location3.jpg']});
            $scope.location = newData;
            $scope.imgIndex = $routeParams.imgIndex;
        });

        $scope.delete = function() {
            $http.delete('api/locations/' + $routeParams.locationId).
                success(function(data) {
                    $location.path('/');
                    $rootScope.$broadcast('deleteEvent', {
                        'id': $routeParams.locationId
                    });

                });
        };

        $scope.update = function () {
            $http.put('api/locations/' + $routeParams.locationId, $scope.location).
                success(function(data) {
                    $location.path('/');
                    $rootScope.$broadcast('updateEvent', {
                        'id': $routeParams.locationId
                    });
                });
        };
    }]);

