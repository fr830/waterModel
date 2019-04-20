app.directive('ngcModalTable', function ($rootScope) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'template/modalTable.html',
        link: function (scope, element, attr) {
            scope.$parent[attr.ngcModalTable] = scope.$$childHead;
            scope.id = 'table-' + attr.ngcModalForm;
        }
    }
});