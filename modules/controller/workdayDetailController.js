
app.controller('workdayDetailController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('WorkdayDetail').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('WorkdayDetailEdit').then(function (editView) {
        dataViewService.getFormViewByCode('WorkdayDetailNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table,
                onValidate: function (model) {
                    console.log(model.MaterialType);
                    if (model.MaterialType == null) {
                        $scope.alert('名称必须包含测试');
                        return false;
                    }
                }
            });
        })
    })
})

