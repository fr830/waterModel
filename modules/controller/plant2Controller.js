app.controller('plant2Controller', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    $scope.dockTable = {};
    $scope.dockForm = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Plant').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,
            commands: [{
                title: '明细',
                css: 'btn-info',
                icon: 'fa-bars',
                onClick: function (item) {
                    $scope.dockTable.open({
                        'PlantID': item.ID
                    })
                }
            }, {
                title: '编辑',
                css: 'btn-primary',
                icon: 'fa-edit',
                onClick: function (item) {
                    $scope.form.edit(item);
                }
            }, {
                title: '删除',
                css: 'btn-danger',
                icon: 'fa-trash-o',
                onClick: function (item) {
                    $scope.table.remove(item);
                }
            },]
        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('PlantEdit').then(function (data) {
        $scope.form.init({
            editView: data,
            table: $scope.table,
            onValidate: function (model) {
                if (model.Name.indexOf('测试') < 0) {
                    $scope.alert('名称必须包含测试');
                    return false;
                }
            }
        });
    })

    // 道口查询视图
    dataViewService.getQueryViewByCode('Dock').then(function (data) {
        $scope.$queryView = data;

        $scope.dockTable.init({
            queryView: $scope.$queryView,
            form: $scope.dockForm
        });
    })

    // 道口表单视图
    dataViewService.getFormViewByCode('DockEdit').then(function (data) {
        $scope.dockForm.init({
            editView: data,
            table: $scope.dockTable
        });
    })
});
