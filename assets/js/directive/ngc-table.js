app.directive('ngcTable', function ($rootScope) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'template/table.html',
        link: function (scope, element, attr) {
            scope.$parent[attr.ngcTable] = scope.$$childHead;
        }
    }
});