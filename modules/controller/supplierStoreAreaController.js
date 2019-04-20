
app.controller('supplierStoreAreaController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('SupplierStoreArea').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('SupplierStoreAreaEdit').then(function (editView) {
        dataViewService.getFormViewByCode('SupplierStoreAreaNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table
            });
        })
    })
})

