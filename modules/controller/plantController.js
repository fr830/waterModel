app.controller('plantController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Plant').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,
            commands: [{
                title: '编辑',
                css: 'btn-primary',
                icon: 'fa-edit',
                onClick: function (item) {
                    $scope.form.edit(item);
                }
            } ]
        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('PlantEdit').then(function (data) {
        $scope.form.init({
            editView: data,
            table: $scope.table
        });
    })

})