'use strict';

var jobcrmApp = angular.module('jobcrmApp', ['ngRoute','ngDragDrop']);

jobcrmApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/dashboard', {
                templateUrl: 'partials/dashboard.html'
            }).
            when('/research', {
                templateUrl: 'partials/research.html'
            }).
            when('/resume', {
                templateUrl: 'partials/resume.html'
            }).
            when('/search', {
                templateUrl: 'partials/search.html'
            }).
            when('/profile', {
                templateUrl: 'partials/profile.html'
            }).
            when('/settings', {
                templateUrl: 'partials/settings.html'
            }).
            when('/analytics', {
                templateUrl: 'partials/analytics.html'
            }).
            when('/pipeline', {
                templateUrl: 'partials/pipeline.html'
            }).
            otherwise({
                redirectTo: '/dashboard'
            });

    }]);

jobcrmApp.controller('headerCtrl', function ($scope, $location) {
    $scope.isActive = function (route) {
        return route === $location.path();
    }
});

jobcrmApp.directive("header", function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/header.html'
    };
});

jobcrmApp.directive("footer", function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/footer.html'
    };
});


jobcrmApp.directive("pipelinenav", function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/pipelinenav.html'
    };
});

jobcrmApp.directive("jobitem", function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/jobitem.html'
    };
});

jobcrmApp.directive("jobitemdetail", function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/jobitemdetail.html'
    };
});


jobcrmApp.controller('jobitemCtrl', function ($scope, $http) {
    $http.get('DataStore/jobitems.json').success(function (data) {
        $scope.jobitems = data;
    });

    $http.post('DataStore/jobitems.json').success(function (data) {

    });

    function sortOn(collection, name) {
        collection.sort(
            function (a, b) {
                if (a[ name ] <= b[ name ]) {

                    return( -1 );
                }
                return( 1 );
            });
    }

    $scope.groupBy = function (attribute) {

        $scope.groups = [];

        sortOn($scope.jobitems, attribute);

        var groupValue = "_INVALID_GROUP_VALUE_";

        for (var i = 0; i < $scope.jobitems.length; i++) {
            var jobitem = $scope.jobitems[ i ];
            if (jobitem[ attribute ] !== groupValue) {
                var group = {
                    label: jobitem[ attribute ],
                    jobitems: []
                };
                groupValue = group.label;
                $scope.groups.push(group);
            }
            group.jobitems.push(jobitem);
        }
    };

    $scope.groups = [];

    var current = 0;
    var selectitem = 0;
    var edititem = false;

    $scope.phaseset = "search";

    $scope.setCurrent = function (index) {
        current = index;
    };

    $scope.isCurrent = function (index) {
        return index === current;
    };

    $scope.setPhase = function (index) {
        $scope.phaseset = index;
    };

    $scope.setDetail = function (index) {
        selectitem = index;
        console.log('Clicked to Edit ' + index)
    };

    $scope.isjobSelect = function () {
        return selectitem !== 0;
        console.log('isjobEdit')
    };

    $scope.getjobSelect = function () {
        return selectitem;
    }

    $scope.isEdit = function () {
        return edititem;
    };

    $scope.setEdit = function () {
        edititem = !edititem;
    };

    this.myCallback = function(event, ui, jobitem){
        console.log('Dropped into something' + jobitem);
    };

    $scope.items=[];

    $scope.handleDragStart = function(e){
        e.dataTransfer.setData(this.jobitem);
    };

    $scope.handleDrop = function(e){
        e.preventDefault();
        e.stopPropagation();
        var dataText = e.dataTransfer.getData(this.jobitem);
        $scope.$apply(function() {
            $scope.items.push(dataText);
        });
        console.log($scope.items);
    };


});

jobcrmApp.directive('droppable', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element[0].addEventListener('drop', scope.handleDrop, false);
            element[0].addEventListener('dragover', scope.handleDragOver, false);
        }
    }
});

jobcrmApp.directive('draggable', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element[0].addEventListener('dragstart', scope.handleDragStart, false);
        }
    }
});