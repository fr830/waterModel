app.directive('ngcModalForm', function ($rootScope) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'template/modalForm.html',
        link: function (scope, element, attr) {
            scope.$parent[attr.ngcModalForm] = scope.$$childHead;
            scope.id = 'form-' + attr.ngcModalForm;
        }
    }
});