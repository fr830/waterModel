app.controller('modalTableController', function ($scope, $rootScope, $state, modelService, dataViewService) {
    $scope.filter = {};
    $scope.table = {};

    // 初始化
    $scope.init = function (data) {
        $scope.$queryView = data.queryView;
        $scope.form = data.form;

        $scope.table.init({
            queryView: data.queryView,
            form: data.form,
            commands: data.commands,
            filter: $scope.filter,
        });
    }

    // 打开
    $scope.open = function (data) {
        // 设置筛选
        for (item in data) {
            $scope.filter[item] = data[item];
        }

        // 设置表单默认值
        $scope.form.setDefault(data);

        $scope.reflash();
        $('#' + $scope.id).modal('show');
    }

    // 刷新
    $scope.reflash = function () {
        $scope.table.reflash();
    }

    // 删除
    $scope.remove = function (item) {
        $scope.table.remove(item);
    }
});
