app.controller('storeAreaController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('StoreArea').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,
            
        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('StoreAreaEdit').then(function (editView) {
        dataViewService.getFormViewByCode('StoreAreaNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table
            });
        })
    })
})

