'use strict';

var jobcrmApp = angular.module('jobcrmApp', ['ngRoute', 'ngDragDrop']);

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

jobcrmApp.directive("advance", function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/advance.html'
    };
});


jobcrmApp.controller('jobitemCtrl', function ($scope, $http) {

    $http.get('DataStore/jobitems.json').success(function (data) {
        $scope.jobitems = data;
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

    $scope.current = 0;
    $scope.selectitem = 0;
    //var edititem = false;

    $scope.phaseset = "search";

    $scope.setCurrent = function (index) {
        $scope.current = index;
    };

    $scope.isCurrent = function (index) {
        return index === $scope.current;
    };

    $scope.setPhase = function (index) {
        $scope.phaseset = index;
    };

    $scope.setDetail = function (index) {
        $scope.selectitem = index;
        console.log('Clicked to Edit ' + $scope.jobitems[index])
    };

    $scope.isjobSelect = function () {
        return $scope.selectitem !== 0;
        console.log('isjobEdit')
    };

    $scope.getjobSelect = function () {
        return $scope.selectitem;
    }

    $scope.startCallback = function (event, ui, jobitem) {
        console.log('You started draggin: ' + jobitem.name);
        $scope.draggedJobitem = jobitem;
    };

    $scope.dragCallback = function (event, ui) {
        document.body.style.cursor = '-webkit-grabbing';
    };

    $scope.myCallback = function (event, ui, jobitem) {
        moveNext(jobitem.id);
        console.log('Dropped into something ' + jobitem);
    };

    $scope.items = [];

    function moveNext(index) {
        switch ($scope.jobitems[index - 1].phase) {
            case 'search':
                $scope.jobitems[index - 1].phase = 'qualified';
                break;
            case 'qualified':
                $scope.jobitems[index - 1].phase = 'applied';
                break;
            case 'applied':
                $scope.jobitems[index - 1].phase = 'response';
                break;
            case 'response':
                $scope.jobitems[index - 1].phase = 'interview';
                break;
            case 'interview':
                $scope.jobitems[index - 1].phase = 'negotiation';
                break;
        }
    }

    $scope.promote = function (index) {
        moveNext(index);
    };

    $scope.demote = function () {

    };

//-----------------------------

    var edititem = false;

    $scope.holdforedit = [];

    $scope.isEdit = function () {
        return edititem;
    };

    $scope.setEdit = function () {
        //holdforedit = $scope.jobitems[index];
        edititem = !edititem;
    };

    $scope.updatejobItem = function (index, holdforedit) {
        $scope.jobitems[index].name = holdforedit.name;

//        $http.put('DataStore/jobitems.json', {: holdforedit.name});
    };

    $scope.reset = function () {
        $scope.holdforedit = angular.copy($scope.jobitems[$scope.selectitem - 1]);
        edititem = false;
    };


});