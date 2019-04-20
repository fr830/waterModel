// app.controller('dataViewController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, viewColumnService, enumService) {
//     var emptyEntity = {};
//     var newEntity = angular.copy(emptyEntity);
//     enumService.query('ControlType').then(function (data) {
//         $scope.controlType = data;
//     })
//     enumService.query('Align').then(function (data) {
//         $scope.align = data;
//     })
//     enumService.query('ViewType').then(function (data) {
//         $scope.viewType = data;
//     })
//     enumService.query('ColumnWidth').then(function (data) {
//         $scope.columnWidth = data;
//     })
   
//     $scope.filter = {};
//     $scope.filterItem = {};
//     $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
//         getData: function (params) {
//             return dataViewService.query(params, $scope.filter);
//         }
//     });

//     $scope.reflash = function () {
//         $scope.tableParams.reload();
//     };

//     $scope.edit = function (data) {
//         if (!data) {
//             $scope.model = newEntity;
//         } else {
//             $scope.model = angular.copy(data);
//         }

//         $('#modal-edit').modal('show');
//     };

//     $scope.save = function () {
//         if (!$scope.model.ID) {
//             dataViewService.add($scope.model).then(function (data) {
//                 $scope.tableParams.reload();
//                 angular.copy(emptyEntity, newEntity);
//                 $scope.editForm.$setPristine();
//                 $('#modal-edit').modal('hide');
//             });
//         } else {
//             dataViewService.update($scope.model).then(function (data) {
//                 $scope.tableParams.reload();
//                 angular.copy(emptyEntity, newEntity);
//                 $scope.editForm.$setPristine();
//                 $('#modal-edit').modal('hide');
//             });
//         }
//     }

//     $scope.remove = function (data) {
//         if (confirm('确定要删除 ' + data.Name + ' 吗？')) {
//             dataViewService.remove(data.ID).then(function (data) {
//                 $scope.tableParams.reload();
//             });
//         }
//     };
//     $scope.showItem = function (item) {
//         $scope.filterItem.DataViewID = item.ID;
//         $scope.filterItem.Type = item.ViewType;
//         $scope.filterItem.IsGlobal = true;
//         $scope.tableItem = new NgTableParams({ sorting: { 'OrderNo': 'asc' } }, {
//             getData: function (params) {
//                 return viewColumnService.query(params, $scope.filterItem);
//             }
//         });
//         $('#modal-items').modal('show');
//     }

    

//     $scope.reflashseqItem = function () {
//         $scope.tableItem.reload();
//     };
//     $scope.editItem = function (data) {
//         if (!data) {
//             $scope.modelItem = newEntity;
//             $scope.modelItem.DataViewID = $scope.filterItem.DataViewID;
//             $scope.modelItem.IsShow = true;
//             $scope.modelItem.Align = '20';
//         } else {
//             $scope.modelItem = angular.copy(data);
//             if ($scope.modelItem.Align != null) {
//                 $scope.modelItem.Align = $scope.modelItem.Align.toString();
//             }
           
//         }

//         $('#modal-editItem').modal('show');
//     };

//     $scope.saveItem = function () {
//         if (!$scope.modelItem.ID) {
//             viewColumnService.add($scope.modelItem).then(function (data) {
//                 $scope.tableItem.reload();
//                 angular.copy(emptyEntity, newEntity);
//                 $scope.editDetailForm.$setPristine();
//                 $('#modal-editItem').modal('hide');
//             });
//         } else {
//             viewColumnService.update($scope.modelItem).then(function (data) {
//                 $scope.tableItem.reload();
//                 angular.copy(emptyEntity, newEntity);
//                 $scope.editDetailForm.$setPristine();
//                 $('#modal-editItem').modal('hide');
//             });
//         }
//     };
//     $scope.removeItem = function (data) {
//         if (confirm('确定要删除 ' + data.Name + ' 吗？')) {
//             viewColumnService.remove(data.ID).then(function (data) {
//                 $scope.tableItem.reload();
//             });
//         }
//     };
// });
