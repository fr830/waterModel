app.controller('showDataController', function ($scope, $rootScope, $state, showDataService, NgTableParams, userProjectService, $filter, dataManageService) {
    var isModify=0;
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);
    $scope.filter = {};
    $scope.filterItem = {};
    $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        getData: function (params) {
            return userProjectService.query(params, $scope.filter,$rootScope.identity.result.User.UserId);
        }
    });

    $scope.toMap=function (data) {
        $('#modal-edit').modal('hide');
        $('#modal-sonProjectsedit').modal('hide');
        $state.go('app.system.mapFocus',{DataSetId:data.DataSetId});
    };
    $scope.jump=function (data) {
        $state.go('app.system.dataSelect',{ProjectId:data.ProjectId});
    }
    $scope.edit= function (data) {
        //console.log(data);a
        if (!data){
            $scope.model = newEntity;
            isModify=0;
            // console.log('2');
            // console.log($scope.ProjectId);
            $('#modal-creatNew').modal('show');
            $('#modal-creatNew').val("");
        }else{
            $scope.model = angular.copy(data);
            $scope.model.DataSetCode=data.DataSetCode;
            $scope.model.DataSetName=data.DataSetName;
            $scope.model.Weather=data.Weather;
            // $scope.model.project=data.ProjectName;
            // $scope.model.ProjectId=data.ProjectId;
            // $scope.model.ProjectCode=data.ProjectCode;
            // $scope.model.leader=data.UserId;
            // var stime=$filter('limitTo')(data.StartTime,10);
            // $scope.model.StartTime=new Date(stime);
            // var etime=$filter('limitTo')(data.EndTime,10);
            // $scope.model.EndTime=new Date(etime);
            // //console.log(etime);
            isModify=1;
            //console.log(data);
            $scope.DataSetId=data.DataSetId;
            $('#modal-editSet').modal('show');
            $('#modal-editSet').val("");
        };

    };

    $scope.infoSon= function(data){
        // console.log(data);
        $scope.model = newEntity;
        // $scope.sonTable=new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        //     getData:data.SubProjects
        // });
        $scope.subProjects=data.SubProjects;
        $('#modal-sonProjectsedit').modal('show');
    }
    $scope.judgeShow=function (data) {
        if (data.HasSon==1){
            return false;
        }else {
            return true;
        }
    }
    $scope.dataManager=function (data) {
        $scope.datasTable = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
            getData: function (params) {
                return dataManageService.query(params, $scope.filter,data.ProjectId);
            }
        });
        //console.log(data);
        $scope.ProjectId=data.ProjectId;
        // console.log('1');
        // console.log($scope.ProjectId);
        $('#modal-edit').modal('show');
    }
    // $scope.remove= function(data){
    //     if (confirm('确定要删除 ' + data.DataSetName + ' 吗？')) {
    //         dataManageService.remove(data.DataSetId).then(function (data) {
    //             //console.log(data);
    //             Swal({
    //                 title: '删除成功！',
    //                 type: 'success',
    //                 confirmButtonText: '确定'
    //             })
    //             $scope.datasTable.reload();
    //         });
    //     }
    // };

    // $scope.query= function(paraname){
    //     var i;
    //     for (i=0;i<$rootScope.Parameters.length;i++){
    //         if ($rootScope.Parameters[i].ParamName==paraname){
    //             //console.log($rootScope.Parameters[i].ParamName);
    //             //console.log($rootScope.Parameters[i].ParamDictionaryId);
    //             return $rootScope.Parameters[i].ParamDictionaryId;
    //         }
    //     }
    // };
    // $scope.save= function (data){
    //
    //     if(!isModify){
    //
    //         var Param1={
    //             'DataSetCode':$scope.model.DataSetCode,
    //             'DataSetName':$scope.model.DataSetName,
    //             'ProjectId':$scope.ProjectId,//$scope.model.CompanyId,
    //             'UploadPerson':$rootScope.identity.result.User.UserId,
    //             'Weather':$scope.model.Weather
    //
    //         }
    //         //console.log(Param1);
    //         dataManageService.add(Param1).then(function (data) {
    //             //console.log(data);
    //             $scope.datasTable.reload();
    //             angular.copy(emptyEntity, newEntity);
    //             $scope.editForm.$setPristine();
    //             $('#modal-creatNew').modal('hide');
    //             $('#modal-creatNew').val("");
    //         });
    //     }else{
    //
    //         // $scope.binding();
    //         var Param2={
    //             'DataSetId':$scope.DataSetId,
    //             'DataSetCode':$scope.model.DataSetCode,
    //             'DataSetName':$scope.model.DataSetName,
    //             'ProjectId':$scope.ProjectId,//$scope.model.CompanyId,
    //             'UploadPerson':$rootScope.identity.result.User.UserId,
    //             'Weather':$scope.model.Weather
    //         }
    //
    //         //console.log(Param2);
    //         dataManageService.update(Param2).then(function (data) {
    //             //console.log(data);
    //             $scope.datasTable.reload();
    //             angular.copy(emptyEntity, newEntity);
    //             $scope.editForm.$setPristine();
    //             $('#modal-editSet').modal('hide');
    //             $('#modal-editSet').val("");
    //
    //         });
    //     };
    //
    //
    // };
    //
    // $scope.upload = function (data) {
    //     $('#modal-upload').modal('show');
    // };
    //
    // //上传文件
    // $scope.uploadFile = function() {
    //     var formData = new FormData($( "#uploadForm" )[0]);
    //     var fileName=$('#fileName').val();
    //     var arr = fileName.split('.');
    //     console.log(arr.length);
    //     var suffix = arr[arr.length-1];//取文件格式
    //     console.log(suffix);
    //     console.log(fileName);
    //     if(suffix!="csv"){
    //         swal("导入文件格式有误，请选择导入Excel文件");
    //         $('#modal-uploadfile').modal('hide');
    //         return;
    //     }
    //     var url="http://218.108.45.6:8082/api/PointData/postExcel";
    //     $.ajax({
    //         url: url,
    //         data: formData,
    //         type: 'POST',
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //         beforeSend: function (request) {
    //             //owWait();
    //             request.setRequestHeader("Authorization", "Bearer "+$rootScope.identity.result.Token);
    //             //request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    //         },
    //         success: function (resp) {
    //             if (resp.code == 200) {
    //                 $('#modal-upload').modal('hide');
    //                 swal('文件上传成功！');
    //                 // $scope.tableParams = new NgTableParams({},{
    //                 //     getData: function(params){
    //                 //         return productplanService.query(params, $scope.filter);
    //                 //     }
    //                 // })
    //             }
    //             else {
    //                 swal(resp.message);
    //             }
    //         },
    //         error: function (data) {
    //             $('#modal-upload').modal('hide');
    //             swal('文件上传失败！');
    //         },
    //         complete: function(){
    //             console.log("complete");
    //             //angular.element('#fileName').val()='';
    //
    //             // $.unblockUI();
    //             // hideWait();
    //         },
    //     });
    // }


});
