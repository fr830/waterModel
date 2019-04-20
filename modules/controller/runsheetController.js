app.controller('runsheetController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    $scope.dockTable = {};
    $scope.dockForm = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Runsheet').then(function (data) {
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
            } ]
        });
    })

  
    // 道口查询视图
    dataViewService.getQueryViewByCode('RunsheetDetail').then(function (data) {
        $scope.$queryView = data;

        $scope.dockTable.init({
            queryView: $scope.$queryView,
            form: $scope.dockForm
        });
    })

});
