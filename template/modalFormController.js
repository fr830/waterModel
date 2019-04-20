app.controller('modalFormController', function ($scope, $rootScope, $state, modelService, dataViewService) {
    // 初始化
    $scope.init = function (data) {
        $scope._$updateView = data.editView;
        $scope.table = data.table;
        $scope.onValidate = data.onValidate;

        if (data.newView == null) {
            $scope._$newView = data.editView;
        } else {
            $scope._$newView = data.newView;
        }

        if (data.commands != null) {
            $scope.commands = data.commands;
        } else {
            $scope.commands = [{
                title: '保存',
                css: 'btn-primary',
                icon: 'fa-save',
                isValidate: true,
                onClick: function () {
                    $scope.save();
                }
            }];
        }

        $scope.defaultModel = $scope._$newView.getDefault();
    }

    // 点击新增、编辑按钮
    $scope.edit = function (data) {
        if (!data) {
            $scope.$editView = $scope._$newView;
            if ($scope.model == null || $scope.model.ID != null) {
                $scope.model = angular.copy($scope.defaultModel);
                $scope.$editView.loadData($scope.model);
            }
        }
        else {
            $scope.$editView = $scope._$updateView;
            $scope.model = angular.copy(data);
            $scope.$editView.loadData($scope.model);
        }

        $('#' + $scope.id).modal('show');
    }

    // 保存
    $scope.save = function () {
        $scope.$editView.fillData($scope.model);

        // 验证
        if ($scope.onValidate) {
            if ($scope.onValidate($scope.model) == false) {
                return;
            }
        }

        if (!$scope.model.ID) {
            modelService.add($scope.$editView.Model, $scope.model).then(function (data) {
                $scope.table.reflash();
                $scope.model = null;
                $scope.editForm.$setPristine();
                $('#' + $scope.id).modal('hide');
            });
        } else {
            modelService.update($scope.$editView.Model, $scope.model).then(function (data) {
                $scope.table.reflash();
                $scope.editForm.$setPristine();
                $('#' + $scope.id).modal('hide');
            });
        }
    }

    // 设置默认值
    $scope.setDefault = function (data) {
        $scope.defaultModel = $scope._$newView.getDefault();

        for (item in data) {
            $scope.defaultModel[item] = data[item];
        }

        // 重置数据
        $scope.model = null;
    }
});
