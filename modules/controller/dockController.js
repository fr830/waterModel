// app.controller('dockController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
//     $scope.filter = {};

//     // 查询视图
//     dataViewService.getQueryViewByCode('Dock').then(function (data) {
//         $scope.$queryView = data;

//         $scope.$broadcast("table.init", {
//             queryView: data,
//             filter: $scope.filter,
//             showCheck: true,
//             commands: [{
//                 title: '编辑',
//                 css: 'btn-primary',
//                 icon: 'fa-edit',
//                 onClick: function (item) {
//                     $scope.edit(item);
//                 }
//             }, {
//                 title: '删除',
//                 css: 'btn-danger',
//                 icon: 'fa-trash-o',
//                 onClick: function (item) {
//                     $scope.$broadcast("table.remove", item);
//                 }
//             }, {
//                 title: '测试',
//                 css: 'btn-warning',
//                 icon: 'fa-calendar',
//                 onClick: function (item) {
//                     $scope.alert('测试');
//                 }
//             }]
//         });
//     })

//     // 表单视图
//     dataViewService.getFormViewByCode('DockEdit').then(function (editView) {
//         dataViewService.getFormViewByCode('DockNew').then(function (newView) {
//             $scope.$broadcast("modalForm.init", {
//                 editView: editView,
//                 newView: newView,
//                 commands: [{
//                     title: '保存',
//                     css: 'btn-primary',
//                     icon: 'fa-save',
//                     isValidate: true,
//                     disabledInNew: false,
//                     disabledInEdit: false,
//                     onClick: function () {
//                         $scope.$broadcast("modalForm.save");
//                     }
//                 }, {
//                     title: '测试',
//                     css: 'btn-danger',
//                     icon: 'fa-trash-o',
//                     isValidate: false,
//                     disabledInNew: true,
//                     disabledInEdit: false,
//                     onClick: function (item) {
//                         $scope.alert('测试');
//                     }
//                 }]
//             });
//         })
//     })

//     $scope.edit = function (data) {
//         $scope.$broadcast("modalForm.edit", data);
//     };

//     $scope.reflash = function () {
//         $scope.$broadcast("table.reflash");
//     };
// });
