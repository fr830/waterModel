app.controller('companyManagerController', function ($scope, $rootScope, $state, NgTableParams, companyManagerService, viewColumnService, roleService, enumService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);
    // enumService.query('ControlType').then(function (data) {
    //     $scope.controlType = data;
    // })
    // enumService.query('Align').then(function (data) {
    //     $scope.align = data;
    // })
    $scope.model={
        'CompanyName':'',
    }
    enumService.Rolequery().then(function (data) {
        //console.log(data.result);
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
    $scope.filter = {
        'Status': 2,
    };
    $scope.filterItem = {};
    $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        getData: function (params) {
            return companyManagerService.query(params, $scope.filter);
        }
    });

    $scope.reflash = function () {
         console.log($scope.filter);
        $scope.tableParams.reload();
    };

    $scope.edit = function (data) {
        if (!data) {
            //$scope.model = null;
            $scope.model = newEntity;
            isModify=0;
            $scope.model.CompanyName=null;
            $scope.model.LegalPerson=null;
            $scope.model.Phone=null;
            $scope.model.Address=null;
            $('#modal-edit1').modal('show');
        } else {
            $scope.model = angular.copy(data);
            $scope.model.CompanyName=data.CompanyName;
            $scope.model.LegalPerson=data.LegalPerson;
            $scope.model.Phone=data.Phone;
            $scope.model.Address=data.Address;
            $scope.model.CompanyCode=data.CompanyCode;
            $scope.model.ManageScope=data.ManageScope;
            $scope.CompanyId=data.CompanyId;
            //$scope.model.RoleType=data.role.RoleId;
            //console.log($scope.model.roleType);
            isModify=1;
            $('#modal-edit2').modal('show');
            $('#modal-edit2').val("");
        }
    };


    $scope.freeze =function(data){
         //console.log(data);
        swal({
            title: "确认冻结/解冻?",
            text: '确定要冻结/解冻 ' + data.CompanyName + '公司吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function(isConfirm){
            if (isConfirm.value) {
                companyManagerService.freeze(data.CompanyId).then(function(data){
                    //console.log(data.result.Status);
                    if(data.result.Status==1){
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
    }
    $scope.save = function () {
        console.log($scope.model.CompanyName,isModify);
        if(!$scope.model.CompanyName){
            swal('公司名称不能为空');
            return;
        }
        if (!isModify) {
            if ($scope.model.CompanyName!=null&&$scope.model.Phone!=null){

                var Param={
                    'CompanyName':$scope.model.CompanyName,
                    'LegalPerson':$scope.model.LegalPerson,
                    'CompanyCode':$scope.model.CompanyCode,
                    'Phone': $scope.model.Phone,
                    'Address':$scope.model.Address,
                    'ManageScope':$scope.model.ManageScope
                }
                companyManagerService.add(Param).then(function (data) {
                    $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.editForm.$setPristine();
                    $('#modal-edit1').modal('hide');
                    $('#modal-edit1').val("");
                });
            }else {
                swal({
                    title: '必填项不能为空或输入错误！',
                    text: '',
                    type: 'warning',
                    // showCancelButton: true,
                    confirmButtonColor: '#EE5C42',
                    // cancelButtonColor: '#71C671',
                    confirmButtonText: '确定',
                    // cancelButtonText: '留着吧'
                })
            }

        } else {

            var Param={
                'CompanyId':$scope.CompanyId,
                'CompanyName':$scope.model.CompanyName,
                'LegalPerson':$scope.model.LegalPerson,
                'CompanyCode':$scope.model.CompanyCode,
                'Phone': $scope.model.Phone,
                'Address':$scope.model.Address,
                'ManageScope':$scope.model.ManageScope
            }

            console.log(Param);
            if ($scope.model.CompanyName.length == 0 || $scope.model.CompanyName == ""){
                swal('请输入企业名!');
                return ;
            }

            if ($scope.model.Phone==null){
                swal({
                    title: '请输入电话或正确的电话号码',
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

            //console.log(Param);
            companyManagerService.update(Param).then(function (data) {
                if (data.code==200){
                    $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.editForm.$setPristine();
                    $('#modal-edit2').modal('hide');
                    $('#modal-edit2').val("");
                }else {
                    swal({
                        title: data.message,
                        text: '',
                        type: 'warning',
                        confirmButtonColor: '#EE5C42',
                        confirmButtonText: '确定',
                    })
                }

            });
        }
    }


});
