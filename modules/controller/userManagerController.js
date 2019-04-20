app.controller('userManagerController', function ($scope, $rootScope, $state, NgTableParams, userManageService, viewColumnService, roleService, $filter,enumService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);
    // enumService.query('ControlType').then(function (data) {
    //     $scope.controlType = data;
    // })
    // enumService.query('Align').then(function (data) {
    //     $scope.align = data;
    // })
    enumService.Rolequery().then(function (data) {
        //console.log("data",data.result);
        var objectManager=data.result[0];
        var normal=data.result[2];
        $scope.roleType = [
            objectManager,
            normal
        ]
        //console.log($scope.roleType);
    })
    // enumService.query('ColumnWidth').then(function (data) {
    //     $scope.columnWidth = data;
    // })
    var isModify=0;
    $scope.filter = {};
    $scope.filterItem = {};
    $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        getData: function (params) {
            return userManageService.query(params, $scope.filter);
        }
    });

    $scope.reflash = function () {
        console.log($scope.filter);
        $scope.tableParams.reload();
    };

    // 设置过滤器
    
    // $scope.userNameFilter = function(){
    //     //swal('ok');

        
    //      // swal('okk');
    //     console.log($scope.filter.UserName);
    //     if ($scope.filter.keyword==$scope.filter.Name) {
    //         $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
    //             getData: function (params) {
    //                return userManageService.query(params, $scope.filter.UserName);
    //            }
    //         });
    //         // return userManageService.query(params, $scope.filter.Name);
    //     }
       
        //swal('ok');
        //$scope.lists = $scope.data;

        
         //return $scope.filter.keyword==item.user.UserName || $scope.filter.keyword==null;
         // $scope.lists = $scope.data;
         // $scope.$watch('filter.keyword',function(n,o){
         //    $scope.lists = $filter('filter')($scope.data,n);
         // });
        // $scope.data = $scope.lists;
    //     $scope.tableParams.reload();

    // };

    $scope.edit = function (data) {
        //console.log(data);
        if (!data) {
            $scope.model = newEntity;
            $scope.model.RoleType=$scope.roleType[1].RoleId;
            isModify=0;
            $scope.model.UserName=null;
            $scope.model.Name=null;
            $scope.model.Email=null;
            $scope.model.Phone=null;
            $('#modal-edit1').modal('show');
            
        } else {
            $scope.model = angular.copy(data);
            $scope.model.Name=data.user.Name;
            $scope.model.Email=data.user.Email;
            $scope.model.Phone=data.user.Phone;
            $scope.model.RoleType=data.role.RoleId;
            //console.log($scope.model.roleType);
            isModify=1;
            $('#modal-edit2').modal('show');
            $('#modal-edit2').val("");
        }
    };

    $scope.save = function () {

        if ((!isModify && $scope.model.UserName==null) || $scope.model.Name==null || $scope.model.Phone==null){
            swal({
                title: '必填项不能为空或输入不正确！',
                text: '',
                type: 'warning',
               // showCancelButton: true,
                confirmButtonColor: '#EE5C42',
               // cancelButtonColor: '#71C671',
                confirmButtonText: '确定',
               // cancelButtonText: '留着吧'
            })
            return;
        }

        if (!isModify) {
            var Param={
                'UserName':$scope.model.UserName,
                'Name':$scope.model.Name,
                'Phone':$scope.model.Phone,
                'Email': $scope.model.Email,
                'RoleId':$scope.model.RoleType
            }
            userManageService.add(Param).then(function (data) {
                if (data.code!=200) {
                	mess='新增用户失败：'+data.message;
                	swal(mess);
                }
                else {
                	swal('增加成功！').then( function(data) {
                        $scope.tableParams.reload();
                        angular.copy(emptyEntity, newEntity);
                        $scope.editForm.$setPristine();
                        $('#modal-edit1').modal('hide');
                        $('#modal-edit1').val("");
                	});
               	}
            });
        } else {
            var Param={
                'UserId':$scope.model.user.UserId,
                'Name':$scope.model.Name,
                'Phone':$scope.model.Phone,
                'Email': $scope.model.Email,
                'RoleId':$scope.model.RoleType
            }
            //console.log(Param);
            userManageService.update(Param).then(function (data) {
            	if (data.code!=200)	{
                	mess='修改用户失败：'+data.message;
                	swal(mess);
            	}
            	else {
					swal('修改成功！').then( function (data) {
		                $scope.tableParams.reload();
		                angular.copy(emptyEntity, newEntity);
		                $scope.editForm.$setPristine();
		                $('#modal-edit2').modal('hide');
		                $('#modal-edit2').val("");
					});
            	}
            });
        }
    }

     $scope.remove = function (data) {
        //console.log(data);
        if (confirm('确定要删除 ' + data.user.Name + ' 吗？')) {
            userManageService.remove(data.user.UserId).then(function (data) {
                Swal({
                title: '删除成功！',
                type: 'success',
                confirmButtonText: '确定'
            })
                $scope.tableParams.reload();
            });
        }
    };

    $scope.reset =function(data){

        swal({
                title: "确认重置?",
                text: '确定要重置 ' + data.user.Name + ' 的密码吗？',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
            }).then(function(isConfirm){
            if (isConfirm.value) {
                userManageService.reset(data.user.UserId).then(function(data){
                    Swal({
                        title: '重置成功！',
                        type: 'success',
                        confirmButtonText: '确定'
                    })
                    //console.log(data);
                    $scope.tableParams.reload();
                });
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        });




        // if(confirm('确定要重置 ' + data.user.Name + ' 的密码吗？')){
        //     //console.log(data);
        //     userManagerService.reset(data.user.UserId).then(function(data){
        //         Swal({
        //         title: '重置成功！',
        //         type: 'success',
        //         confirmButtonText: '确定'
        //     })
        //         //console.log(data);
        //         $scope.tableParams.reload();
        //     });
        // }
    }

    $scope.freeze =function(data){
         //console.log(data);
        swal({
            title: "确认冻结/解冻?",
            text: '确定要冻结/解冻 ' + data.user.Name + ' 的账号吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function(isConfirm){
            if (isConfirm.value) {
                userManageService.freeze(data.user.UserId).then(function(data){
                    //console.log(data.result.Status);
                    if(data.result.Status==2){
                        Swal({
                            title: '冻结成功！',
                            type: 'success',
                            confirmButtonText: '确定'
                        })
                    }else{
                        Swal({
                            title: '解冻成功！',
                            type: 'success',
                            confirmButtonText: '确定'
                        })
                    }
                    //console.log(data);
                    $scope.tableParams.reload();
                });
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        });

        // if(confirm('确定要冻结/解冻 ' + data.user.Name + ' 的账号吗？')){
        //     userManagerService.freeze(data.user.UserId).then(function(data){
        //         //console.log(data.result.Status);
        //         if(data.result.Status==2){
        //             Swal({
        //                 title: '冻结成功！',
        //                 type: 'success',
        //                 confirmButtonText: '确定'
        //             })
        //         }else{
        //             Swal({
        //                 title: '解冻成功！',
        //                 type: 'success',
        //                 confirmButtonText: '确定'
        //             })
        //         }
        //         //console.log(data);
        //         $scope.tableParams.reload();
        //     });
        // }
    }


    $scope.showItem = function (item) {
        $scope.filterItem.DataViewID = item.ID;
        $scope.filterItem.Type = item.ViewType;
        $scope.filterItem.IsGlobal = true;
        $scope.tableItem = new NgTableParams({ sorting: { 'OrderNo': 'asc' } }, {
            getData: function (params) {
                return viewColumnService.query(params, $scope.filterItem);
            }
        });
        $('#modal-items').modal('show');
    }



    $scope.reflashseqItem = function () {
        $scope.tableItem.reload();
    };
    $scope.editItem = function (data) {
        if (!data) {
            $scope.modelItem = newEntity;
            $scope.modelItem.DataViewID = $scope.filterItem.DataViewID;
            $scope.modelItem.IsShow = true;
            $scope.modelItem.Align = '20';
        } else {
            $scope.modelItem = angular.copy(data);
            if ($scope.modelItem.Align != null) {
                $scope.modelItem.Align = $scope.modelItem.Align.toString();
            }

        }

        $('#modal-editItem').modal('show');
    };

    $scope.saveItem = function () {
        if (!$scope.modelItem.ID) {
            viewColumnService.add($scope.modelItem).then(function (data) {
                $scope.tableItem.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editDetailForm.$setPristine();
                $('#modal-editItem').modal('hide');
            });
        } else {
            viewColumnService.update($scope.modelItem).then(function (data) {
                $scope.tableItem.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editDetailForm.$setPristine();
                $('#modal-editItem').modal('hide');
            });
        }
    };
    $scope.removeItem = function (data) {
        swal({
            title: "确认删除?",
            text: '确定要删除 ' + data.Name + ' 吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function(isConfirm){
            if (isConfirm.value) {
                viewColumnService.remove(data.ID).then(function (data) {
                    $scope.tableItem.reload();
                });
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        });

        // if (confirm('确定要删除 ' + data.Name + ' 吗？')) {
        //     viewColumnService.remove(data.ID).then(function (data) {
        //         $scope.tableItem.reload();
        //     });
        // }
    };
});
