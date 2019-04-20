
// app.controller('materialBaseController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
//     $scope.filter = {};
//     $scope.table = {};
//     $scope.form = {};

//     // 查询视图
//     dataViewService.getQueryViewByCode('MaterialBase').then(function (data) {
//         $scope.$queryView = data;

//         $scope.table.init({
//             queryView: $scope.$queryView,
//             filter: $scope.filter,
//             form: $scope.form,

//         });
//     })

//     // 表单视图
//     dataViewService.getFormViewByCode('MaterialBaseEdit').then(function (editView) {

//         $scope.form.init({

//             editView: editView,
//             table: $scope.table
//         });
//     })

// })

