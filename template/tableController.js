app.controller('tableController', function ($scope, $rootScope, $state, NgTableParams, modelService, dataViewService) {
    // 初始化
    $scope.init = function (data) {
        $scope.$queryView = data.queryView;
        $scope.form = data.form;
        $scope.filter = data.filter;
        $scope.showCheck = data.showCheck;


        if (data.commands != null) {
            $scope.commands = data.commands;
        } else {
            $scope.commands = [{
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
                    $scope.remove(item);
                }
            }];
        }

        $scope.columns = $scope.$queryView.columns.map(function (item) {
            var column = {
                setting: item,
                title: item.Name,
                sortable: item.Code,
                filter: {},
                align: item.AlignKey,
                show: item.IsShow,
            }

            column.filter[item.Code] = 'text';

            return column;
        });

        $scope.columns.unshift({
            type: 'sn',
            title: '序号',
            align: 'Center',
            show: true
        })

        if ($scope.showCheck) {
            $scope.columns.unshift({
                type: 'check',
                title: '',
                headerTemplateURL: "template/headerCheckbox.html",
                align: 'Center',
                show: true
            })
        }

        $scope.columns.push({
            type: 'command',
            title: '',
            align: 'Center',
            show: true
        })

        $scope.tableParams = new NgTableParams({ sorting: $scope.$queryView.Sorting }, {
            getData: function (params) {
                return modelService.query($scope.$queryView.Model, params, $scope.filter);
            }
        });
    }

    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    // 删除
    $scope.remove = function (item) {
        $scope.confirm('确定要删除该项吗？', function () {
            modelService.remove($scope.$queryView.Model, item.ID).then(function () {
                $scope.tableParams.reload();
            });
        });
    };

    $scope.checkAll = function () {
        $scope.checkedAll = !$scope.checkedAll;

        $scope.tableParams.data.forEach(function (item) {
            item.checked = $scope.checkedAll;
        });
    };
});
