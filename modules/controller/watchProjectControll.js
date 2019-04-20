app.controller('watchProjectController', function($scope, $rootScope, parameterService, userManageService, $state, NgTableParams, $filter, watchProjectService, myProjectService, companyManagerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);
    var group = [];
    var subgroup = [];
    $scope.sub_pro_datas = [];
    var userData = {};
    //var userList1 = {};
    var projectname = "";
    var projectid = "";
    parameterService.Parameterquery().then(function(data) {
        $rootScope.Parameters = data.result;
    })
    companyManagerService.query().then(function(data) {
        console.log("data",data.result);
        $scope.Companys = data;

        //console.log($scope.Companys);
    })
    $scope.matchId = function(companyName) {
        var i;
        for (i = 0; i < $scope.Companys.length; i++) {
            if (companyName == $scope.Companys[i].CompanyName) return $scope.Companys[i].CompanyId;
        }
    }
    $scope.filter = {};
    $scope.filterItem = {};
    $scope.curProjectName = '';
    $scope.tableParams = new NgTableParams({
        sorting: {
            'ID': 'asc'
        }
    }, {
        getData: function(params) {
            return watchProjectService.query(params, $scope.filter, $rootScope.identity.result.User.UserId);
        }
    });

    userManageService.query().then(function(data) {
        console.log(data);
        $scope.userList = data;
    });



    // watchProjectService.query().then(function(data) {
    //     console.log(data);
    //     $scope.userList1 = data;
    // });
    // $scope.userData = {};
    // userData = item;
    // projectid = ProjectId;
    
    // watchProjectService.queryMembers().then(function(params, filter, projectid){

    //     projectid = userData.ProjectId;
    //    // console.log(data);
    //     $scope.userList1 = ;
    // });


    $scope.reflash = function () {
         console.log($scope.filter);
        $scope.tableParams.reload();
    };

    $scope.query = function(paraname) {
        var i;
        for (i = 0; i < $rootScope.Parameters.length; i++) {
            if ($rootScope.Parameters[i].ParamName == paraname) {
                //console.log($rootScope.Parameters[i].ParamName);
                //console.log($rootScope.Parameters[i].ParamDictionaryId);
                return $rootScope.Parameters[i].ParamDictionaryId;
            }
        }
    }

   //添加子项目
    var fatherId;
    $scope.edit = function(data) {
        //console.log(data);
        $scope.model = newEntity;


        if (!data) {
            fatherId = userData.ProjectId;
            projectid = userData.ProjectId;
            // console.log(userData.ProjectId);
            $scope.model.CompanyId = $scope.fatherCompanyId;//默认为父公司的id
            var stime = $filter('limitTo')(userData.StartTime, 10);
            $scope.model.StartTime = new Date(stime);
            var etime = $filter('limitTo')(userData.EndTime, 10);
            $scope.model.EndTime = new Date(etime);
            $scope.model.project=null;
            $scope.model.leader=null;
            $scope.model.CompanyId=null;
            $scope.model.description=null;
            watchProjectService.getMembers(fatherId).then(function(data) {
                //console.log(data);
                $scope.userList1 = data.result.Data;

            });

            // $scope.SubParams.reload();
            $('#subProjectEditTitle').text('新建 '+$scope.ProjectName+' 的子项目');

            $('#modal-subEdit').modal('show');
            $('#modal-subEdit').val("");
            // $scope.SubParams.reload();
        }

    }

    $scope.add = function() {
        if(!$scope.model.CompanyId&&$scope.model.project&&$scope.model.leader){swal("请填写必填项！");return;} 
        console.log($scope.fatherId);
        var now = new Date();
        var year = now.getFullYear().toString(); //年
        var month = (now.getMonth() + 1).toString(); //月
        var day = now.getDate().toString(); //日
        var hh = now.getHours().toString(); //时
        var mm = now.getMinutes().toString(); //分
        var ss = now.getSeconds().toString(); //秒
        // console.log(year,month,day,hh,mm,ss);
        var projectCode = year;
        if (month < 10)
            projectCode += "0";
        projectCode += month;

        if (day < 10)
            projectCode += "0";

        projectCode += day;

        if (hh < 10)
            projectCode += "0";

        projectCode += hh;
        if (mm < 10) projectCode += '0';
        projectCode += mm;
        if (ss < 10) projectCode += '0';
        projectCode += ss;

        if ($scope.model.project != null && $scope.model.leader != null) {
            var Param = {
                'ProjectCode': projectCode,
                'ProjectName': $scope.model.project,
                'CompanyId': $scope.model.CompanyId, //$scope.model.CompanyId,
                'UserId': $scope.model.leader,
                'StartTime': $filter('date')($scope.model.StartTime, 'yyyy-MM-dd'),
                'EndTime': $filter('date')($scope.model.EndTime, 'yyyy-MM-dd'),
                'version': "1", //$scope.model.version,
                'HasSon': "0",
                'description': $scope.model.description,
                'FatherId': fatherId,
                'ColorList': [{
                        'ParamDictionaryId': $scope.query("水深"),
                        'BeginColor': "128,255,255",
                        'EndColor': "0,0,255"
                    },
                    {
                        'ParamDictionaryId': $scope.query("水温"),
                        'BeginColor': "0,128,255",
                        'EndColor': "255,0,0"
                    },
                    {
                        'ParamDictionaryId': $scope.query("ECuS"),
                        'BeginColor': "0,0,0",
                        'EndColor': "255,0,255"
                    },
                    {
                        'ParamDictionaryId': $scope.query("DOmg"),
                        'BeginColor': "0,0,0",
                        'EndColor': "255,0,255"
                    },
                    {
                        'ParamDictionaryId': $scope.query("Sal"),
                        'BeginColor': "255,255,255",
                        'EndColor': "128,0,255"
                    },
                    {
                        'ParamDictionaryId': $scope.query("pH"),
                        'BeginColor': "0,0,255",
                        'EndColor': "255,0,0"
                    },
                    {
                        'ParamDictionaryId': $scope.query("ORP"),
                        'BeginColor': "0,0,0",
                        'EndColor': "255,0,255"
                    },
                    {
                        'ParamDictionaryId': $scope.query("Chla"),
                        'BeginColor': "0,0,0",
                        'EndColor': "255,0,255"
                    },
                    {
                        'ParamDictionaryId': $scope.query("浊度"),
                        'BeginColor': "0,0,0",
                        'EndColor': "128,255,255"
                    },
                    {
                        'ParamDictionaryId': $scope.query("饱和"),
                        'BeginColor': "255,128,0",
                        'EndColor': "255,255,128"
                    }
                ]
            }
            myProjectService.add(Param).then(function(data) {
                if (data.code!=200) {
                    mess='增加失败：'+data.message;
                    swal(mess);
                    return;
                }
                else {
                    // $scope.SubParams.reload();
                    // $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.editForm.$setPristine();
                    $('#modal-subEdit').modal('hide');
                    $('#modal-subEdit').val("");
                    watchProjectService.queryOneProject($scope.fatherId).then(function(data){
                        console.log(data);
                        $scope.sub_pro_datas=data.result.Data[0].SubProjects;
                          $scope.SubParams = new NgTableParams({
                            page: 1,
                            count: 10,
                            total: $scope.sub_pro_datas.length,
                        }, {
                            counts: [10, 25, 50, 100],
                            dataset: $scope.sub_pro_datas
                        });
                        $scope.SubParams.reload();
                    })
                    $scope.tableParams.reload();

                }
            });
           
            //var param;var filter;
            // var a = $scope.sub_pro_datas[length - 1];
            // var b = $scope.model.ProjectId;
          
            // watchProjectService.queryProject($scope.ProjectsManager).then(function(tempData) {
            //     var dataArray = tempData.result.Data;
            //     console.log(dataArray.length);
            //     for (var i = 0; i < dataArray.length; i++) {
            //         if (dataArray[i].ProjectName == projectname) $scope.sub_pro_datas = dataArray[i].SubProjects;
            //     }
            //     // console.log($scope.sub_pro_datas);
            //     $scope.SubParams = new NgTableParams({

            //         page: 1,
            //         count: 10,
            //         // total: $scope.sub_pro_datas.length,
            //     }, {
            //         // $scope.sub_pro_datas.splice(a,0,Param);
            //         // myProjectService.queryProject(param,filter,$scope.ProjectName).then(function (data) {
            //         //     console.log("..",data);
            //         //     $scope.sub_pro_datas = data.SubProjects;
            //         //
            //         //     $scope.SubParams = new NgTableParams({
            //         //
            //         //         page: 1,
            //         //         count: 10,
            //         //         // total: $scope.sub_pro_datas.length,
            //         //     },{
            //         //
            //         //         counts:[10,25,50,100],
            //         //         dataset: $scope.sub_pro_datas
            //         //     });
            //         //
            //         //     $scope.ProjectsManager=data.UserId;
            //         // });

            //         counts: [10, 25, 50, 100],
            //         dataset: $scope.sub_pro_datas
            //     });
            // });
            // $scope.SubParams.reload();
        } else {
            swal({
                title: '必填项不能为空！',
                text: '',
                type: 'warning',
                // showCancelButton: true,
                confirmButtonColor: '#EE5C42',
                // cancelButtonColor: '#71C671',
                confirmButtonText: '确定',
                // cancelButtonText: '留着吧'
            })
        }

        // var a=$scope.sub_pro_datas[$scope.sub_pro_datas.length-1]
        // $scope.sub_pro_datas.splice(a,0,Param);
        $scope.SubParams.reload();
    }



    
    $scope.inquiry = function(data) {
        console.log(data);
        console.log($rootScope.identity.result.User.UserId,data.UserId);
        if(data.SubProjects.length==0&&data.UserId!==$rootScope.identity.result.User.UserId){
            swal("该项目还没有子项目！");
            return;
        }
        
        userData = {};
        userData = data;
        $scope.fatherId=data.ProjectId;
        $scope.sub_pro_datas = data.SubProjects;
        // console.log("项目",data);
        $scope.fatherManager=data.UserId;
        $('#subProjectTitle').text(data.ProjectName+' 子项目列表');
        $scope.ProjectName = data.ProjectName;

        $scope.SubParams = new NgTableParams({

            page: 1,
            count: 10,
            // total: $scope.sub_pro_datas.length,
        }, {

            counts: [10, 25, 50, 100],
            dataset: $scope.sub_pro_datas
        });
        console.log($scope.sub_pro_datas);
        $scope.ProjectsManager = data.UserId;
        projectname = data.ProjectName;
        $scope.fatherCompanyId = $scope.matchId(data.CompanyName);
        // console.log(projectname);
        $('#modal-subShow').modal('show');
        $('#modal-subShow').val("");
        // }
    }

    $scope.subJudge=function (data) {
        if ($rootScope.identity.result.User.UserId==data.UserId||$rootScope.identity.result.User.UserId==$scope.fatherManager){
            return true;
        }else {
            return false;
        }
    }

    $scope.editMember = function(item) {
        if (!item) {
            projectid = userData.ProjectId;
        } else {
            projectid = item.ProjectId;
        }

        group = [];
        watchProjectService.getMembers(projectid).then(function(data) {
             if (data.code!=200) {
                    mess='加载失败：'+data.message;
                    swal(mess);
                    return;
            }

            var i;
            for (i = 0; data.result.Data[i]; i++) {
                var member = {
                    'UserId': data.result.Data[i].UserId,
                    'ProjectId': projectid
                }
                group.push(member);
            }
            // console.log(group);
        });

        $scope.MemberList = $scope.userList;
        $scope.addParams = new NgTableParams({

            page: 1,
            count: 10,
            // total: $scope.sub_pro_datas.length,
        }, {

            counts: [10, 25, 50, 100],
            dataset: $scope.MemberList
        });
        // console.log($scope.MemberList);
        $('#modal-MemberEdit').modal('show');
        $('#modal-MemberEdit').val('');

    }

    $scope.isSelected = function(id, $event) {
        // console.log($scope.hasSelected(id));
        var action = event.target;
        if (action.checked) {
            // if($scope.conf[$index]){
            var j;
            var repeat = 0;
            for (j = 0; group[j]; j++) {
                if (id == group[j].UserId ) {
                    // console.log(id);
                    // console.log($scope.MemberList[j].user.UserId);
                    repeat = 1;
                    break;
                }
            }

            if (repeat == 0) {
                var member = {
                    'UserId': id,
                    'ProjectId': projectid
                }
                group.push(member);
            }

        } else {
            group.removeMember(id);
        }
    }

    $scope.hasSelected = function(id) {
        // console.log(group);
        var i;
        for (i = 0; group[i]; i++) {
            if (id == group[i].UserId) return true;
        }
        return false;
    }

    $scope.addMember = function() {
        // console.log(group);
        if (!group[0]) {
            var member = {
                'UsrId': "",
                'ProjectId': projectid
            }
            group.push(member);
        }
        watchProjectService.update(group).then(function(data) {
             if (data.code!=200) {
                    mess='增加失败：'+data.message;
                    swal(mess);
                    return;
            }else{
                Swal({
                    title: '操作成功！',
                    type: 'success',
                    confirmButtonText: '确定'
                });
                $scope.MemberParams.reload();
                $('#modal-MemberEdit').modal('hide');
                $('#modal-MemberEdit').val("");                
            }
            //console.log(data);

        });
        group = [];
    }
 
    
    

    $scope.queryMember = function(item) {
        console.log(item);
        userData = {};
        userData = item;
        projectid = item.ProjectId;
        // console.log(data);
        //console.log(data);
        // data.result.TotalCount
        // Swal({
        //          title: '该项目还没有成员！',
        //          type: 'error',
        //          confirmButtonText: '确定'
        //      });
        $scope.MemberParams = new NgTableParams({
            sorting: {
                'ID': 'asc'
            }
        }, {
            getData: function(params) {
                // console.log(watchProjectService.queryMembers(params, $scope.filter,projectid));
                return watchProjectService.queryMembers(params, $scope.filter, projectid);
            }
        });

        $scope.ProjectsManager = item.UserId;
        console.log(item);
        // $scope.userList1 = item;
        $('#modal-MemberShow').modal('show');
        $('#modal-MemberShow').val("");
    }
    
   // $scope.ProjectId1=userData.ProjectId;
   //console.log(userData.ProjectId);
    // watchProjectService.queryMembers1(ProjectId).then(function(data) {
    //     console.log(userData.ProjectId);
    //    // console.log($scope.ProjectId);
    //     //console.log(data);
    //     // userData = {};
    //    // id = item.ProjectId;
    //    // userList1 = {};
    //     $scope.userList1 = data;
    // });

    $scope.JudgeShow = function(data) {
        // console.log(data.UserId);
        // console.log($rootScope.identity.result.User.UserId);
        if (data) {
            if (String(data.UserId) == String($rootScope.identity.result.User.UserId)) {
                return true;
            } else {
                return false;
            }
        } else {
            //console.log("join in");
            if (String($scope.ProjectsManager) == String($rootScope.identity.result.User.UserId)) {
                return true;
            } else {
                return false;
            }
        }

    }
    // $scope.Judge=function (data) {
    //
    //     if (String($scope.ProjectsManager)==String($rootScope.identity.result.User.UserId)){
    //         return true;
    //     }else {
    //         return false;
    //     }
    //
    // }
    $scope.remove = function(data) {
        // console.log(data.UserName)
        // console.log($rootScope.identity.result.User.Name);
        // console.log(data.UserName==$rootScope.identity.result.User.Name);
        swal({
            title: "确认删除?",
            text: '确定要删除 ' + data.ProjectName + ' 吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function(isConfirm) {
            if (isConfirm.value) {
                myProjectService.remove(data.ProjectId).then(function(data) {
                    //console.log(data);
                    if (data.code!=200) {
                        mess='删除失败:'+data.message;
                        swal(mess);
                    }
                    else {
                        swal({
                            title: '删除成功！',
                            type: 'success',
                            confirmButtonText: '确定'
                        })
                        $scope.tableParams.reload();
                    }
                });
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        });
        // if (confirm('确定要删除 ' + data.ProjectName + ' 吗？')) {
        //     myProjectService.remove(data.ProjectId).then(function (data) {
        //         //console.log(data);
        //         Swal({
        //         title: '删除成功！',
        //         type: 'success',
        //         confirmButtonText: '确定'
        //     })
        //         $scope.tableParams.reload();
        //     });
        // }
    };

    $scope.modify = function(data) {
     
         //console.log(data);
        $('#modifyProject').text('修改项目'+data.ProjectName);
        
        $scope.model = angular.copy(data);
        $scope.model.project = data.ProjectName;
        $scope.model.ProjectId = data.ProjectId;
        $scope.model.HasSon = data.HasSon;
        $scope.model.Version = data.Version;
        $scope.model.ProjectCode = data.ProjectCode;
        $scope.model.CompanyName = data.CompanyName;
        $scope.model.CompanyId = $scope.matchId(data.CompanyName);
        $scope.model.leader = $rootScope.identity.result.User.UserId;
        $scope.model.description = data.Description;
        $scope.model.fatherId = data.FatherId;
        var stime = $filter('limitTo')(data.StartTime, 10);
        $scope.model.StartTime = new Date(stime);
        var etime = $filter('limitTo')(data.EndTime, 10);
        $scope.model.EndTime = new Date(etime);
        //console.log(etime);
        watchProjectService.getMembers(data.ProjectId).then(function(data) {
            //console.log(data);
            $scope.userList1 = data.result.Data;
        })
        isModify = 1;
        $('#modal-edit2').val("");
        $('#modal-edit2').modal('show');
    }

    $scope.editMemberson = function(item) {
        //console.log(item);
        projectid = item.ProjectId;

        subgroup = [];
        watchProjectService.getMembers(item.FatherId).then(function(data) {
            //console.log(data.result.Data);
             if (data.code!=200) {
                    mess='增加失败：'+data.message;
                    swal(mess);
                    return;
            }
            $scope.MemberList = data.result.Data;
            $scope.addSonParams = new NgTableParams({

                page: 1,
                count: 10,
                // total: $scope.sub_pro_datas.length,
            }, {

                counts: [10, 25, 50, 100],
                dataset: $scope.MemberList
            });
        });
        // subgroup=[];
        console.log("project id", projectid);
        watchProjectService.getMembers(projectid).then(function(data) {
             if (data.code!=200) {
                    mess='增加失败：'+data.message;
                    swal(mess);
                    return;
            }
            var i;
            console.log(data);
            for (i = 0; data.result.Data[i]; i++) {
                var member = {
                    'UserId': data.result.Data[i].UserId,
                    'ProjectId': projectid
                }
                subgroup.push(member);
            }
            // console.log(group);
        });

        // $scope.MemberList=$scope.userList;
        // console.log($scope.MemberList);
        $('#modal-MemberEdit1').modal('show');
        $('#modal-MemberEdit1').val('');

    }

    $scope.isSelectedson = function(id, $event) {
        //console.log(id);
        // console.log($scope.hasSelected(id));
        var action = event.target;
        if (action.checked) {
            // if($scope.conf[$index]){
            var j;
            var repeat = 0;
            for (j = 0; subgroup[j]; j++) {
                if (id == subgroup[j].UserId ) {
                    // console.log(id);
                    // console.log($scope.MemberList[j].user.UserId);
                    repeat = 1;
                    break;
                }
            }

            if (repeat == 0) {
                var member = {
                    'UserId': id,
                    'ProjectId': projectid
                }
                subgroup.push(member);
            }

        } else {
            subgroup.removeMember(id);
        }
        //console.log(subgroup);
    }

    $scope.hasSelectedson = function(id) {
        // console.log(id);
        // console.log(subgroup);
        var i;
        for (i = 0; subgroup[i]; i++) {
            if (id == subgroup[i].UserId) return true;
        }
        return false;
    }

    $scope.addMemberson = function() {
          console.log(subgroup);
        if (!subgroup[0]) {
            var member = {
                'UsrId': "",
                'ProjectId': projectid
            }
            subgroup.push(member);
        }
        // for (var i = 0; i < subgroup.length; i++) {
        //     // subgroup[i].UserId==
        // }
        watchProjectService.update(subgroup).then(function(data) {
            //console.log(data);
             if (data.code!=200) {
                    mess='增加失败：'+data.message;
                    swal(mess);
                    return;
            }else{
                Swal({
                    title: '操作成功！',
                    type: 'success',
                    confirmButtonText: '确定'
                });
                $scope.SubParams.reload();
                $('#modal-MemberEdit1').modal('hide');
                $('#modal-MemberEdit1').val("");            
            }

        });
        subgroup = [];
    }

    $scope.queryMemberson = function(item) {
        // userData = {};
        // userData = item;
        projectid = item.ProjectId;
        //console.log(item);
        /*console.log(data);
        if (data.result.TotalCount==0) {
            swal({
                title: '该项目还没有成员！',
                type: 'error',
                confirmButtonText: '确定'
            });
            return;
        }*/

       // console.log(data);

        $scope.MemberParams = new NgTableParams({
            sorting: {
                'ID': 'asc'
            }
        }, {
            getData: function(params) {
                // console.log(watchProjectService.queryMembers(params, $scope.filter,projectid));
                return watchProjectService.queryMembers(params, $scope.filter, projectid);
            }
        });

        $('#modal-MemberShow1').modal('show');
        $('#modal-MemberShow1').val("");
    }

    // $scope.JudgeShow=function (data) {
    //     if (String(data.UserId)==String($rootScope.identity.result.User.UserId)){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

    $scope.removeson = function(data) {
        console.log($scope.fatherId);
        // console.log($scope.SubParams)
        // console.log($scope.sub_pro_datas);
        // console.log($rootScope.identity.result.User.Name);
        // console.log(data.UserName==$rootScope.identity.result.User.Name);
        var a;
      
        console.log($scope.sub_pro_datas);
        swal({
            title: "确认删除?",
            text: '确定要删除 ' + data.ProjectName + ' 吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function(isConfirm) {
            if (isConfirm.value) {
                myProjectService.remove(data.ProjectId).then(function(data) {
                     if (data.code!=200) {
                    mess='删除失败：'+data.message;
                    swal(mess);
                    return;
                }else{
                    Swal({
                        title: '删除成功！',
                        type: 'success',
                        confirmButtonText: '确定'
                    })
                    console.log(data.ProjectId);
                    watchProjectService.queryOneProject($scope.fatherId).then(function(data){
                        console.log(data);
                        $scope.sub_pro_datas=data.result.Data[0].SubProjects;
                          $scope.SubParams = new NgTableParams({
                            page: 1,
                            count: 10,
                            total: $scope.sub_pro_datas.length,
                        }, {
                            counts: [10, 25, 50, 100],
                            dataset: $scope.sub_pro_datas
                        });
                        $scope.SubParams.reload();
                        $scope.tableParams.reload();
                    })
                 
                }

                });
                console.log($scope.sub_pro_datas);
                $scope.SubParams.reload();
                // console.log('初始表')
               
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        }); 

    };


    $scope.modifyson = function(data) {
        console.log("see",data);
        $('#modifySubProject').text('修改子项目'+data.ProjectName);
        $scope.model = angular.copy(data);
        $scope.model.project = data.ProjectName;
        $scope.model.ProjectId = data.ProjectId;
        $scope.model.HasSon = data.HasSon;
        $scope.model.Version = data.Version;
        $scope.model.ProjectCode = data.ProjectCode;
        $scope.model.CompanyName = data.CompanyName;
        $scope.model.CompanyId = $scope.matchId(data.CompanyName);
        $scope.model.leader = data.UserId;
        $scope.model.description = data.Description;
        $scope.model.fatherId = data.FatherId;
        var stime = $filter('limitTo')(data.StartTime, 10);
        $scope.model.StartTime = new Date(stime);
        var etime = $filter('limitTo')(data.EndTime, 10);
        $scope.model.EndTime = new Date(etime);
        //console.log(etime);
        projectid = data.ProjectId;
        watchProjectService.getMembers(projectid).then(function(data) {
            console.log(data);
            $scope.userList1 = data.result.Data;
            console.log(data.result.Data);
            console.log(UserIdEntity);
            // console.log(data.result.Data.ProjectId);


            console.log(data.result.Data.UserId);
            // $scope.SubParams.reload();


        });
        $scope.SubParams.reload();
        isModify = 1;
        $('#modal-edit3').val("");
        $('#modal-edit3').modal('show');


    }

    $scope.observe = function(data) {
         console.log("see2",data);
        $scope.model = angular.copy(data);
        $scope.model.project = data.ProjectName;
        $scope.model.ProjectId = data.ProjectId;
        $scope.model.HasSon = data.HasSon;
        $scope.model.Version = data.Version;
        $scope.model.ProjectCode = data.ProjectCode;
        $scope.model.CompanyName = data.CompanyName;
        $scope.model.CompanyId = $scope.matchId(data.CompanyName);
        $scope.model.leader = data.UserId;
        $scope.model.description = data.Description;
        $scope.model.fatherId = data.FatherId;
        var stime = $filter('limitTo')(data.StartTime, 10);
        $scope.model.StartTime = new Date(stime);
        var etime = $filter('limitTo')(data.EndTime, 10);
        $scope.model.EndTime = new Date(etime);
        //console.log(etime);
        projectid = userData.ProjectId;
        watchProjectService.getMembers(projectid).then(function(data) {
            console.log(data);
            $scope.userList1 = data.result.Data;
            console.log(data.result.Data);
            console.log(UserIdEntity);
            // console.log(data.result.Data.ProjectId);


            console.log(data.result.Data.UserId);
            // $scope.SubParams.reload();


        });
        $scope.SubParams.reload();
        isModify = 1;
        $('#modal-see').val("");
        $('#modal-see').modal('show');


    }

    $scope.modifyProject = function() {
        if (!$scope.model.project || !$scope.model.leader || !$scope.model.EndTime || !$scope.model.StartTime) {
            Swal('请填写信息');
            return;
        }
        if ($scope.model.EndTime < $scope.model.StartTime) {
            Swal('开始时间应小于结束时间');
            return
        }
        
        var Param = {
            'ProjectId': $scope.model.ProjectId,
            'ProjectCode': $scope.model.ProjectCode,
            'ProjectName': $scope.model.project,
            'CompanyId': $scope.model.CompanyId, //$scope.model.CompanyId,
            'UserId': $scope.model.leader,
            'StartTime': $filter('date')($scope.model.StartTime, 'yyyy-MM-dd'),
            'EndTime': $filter('date')($scope.model.EndTime, 'yyyy-MM-dd'),
            'version': $scope.model.Version, //$scope.model.version,
            'HasSon': $scope.model.HasSon,
            'description': $scope.model.description,
            'FatherId': $scope.model.fatherId,
            'ColorList': [{
                    'ParamDictionaryId': $scope.query("水深"),
                    'BeginColor': "128,255,255",
                    'EndColor': "0,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("水温"),
                    'BeginColor': "0,128,255",
                    'EndColor': "255,0,0"
                },
                {
                    'ParamDictionaryId': $scope.query("ECuS"),
                    'BeginColor': "0,0,0",
                    'EndColor': "255,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("DOmg"),
                    'BeginColor': "0,0,0",
                    'EndColor': "255,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("Sal"),
                    'BeginColor': "255,255,255",
                    'EndColor': "128,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("pH"),
                    'BeginColor': "0,0,255",
                    'EndColor': "255,0,0"
                },
                {
                    'ParamDictionaryId': $scope.query("ORP"),
                    'BeginColor': "0,0,0",
                    'EndColor': "255,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("Chla"),
                    'BeginColor': "0,0,0",
                    'EndColor': "255,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("浊度"),
                    'BeginColor': "0,0,0",
                    'EndColor': "128,255,255"
                },
                {
                    'ParamDictionaryId': $scope.query("饱和"),
                    'BeginColor': "255,128,0",
                    'EndColor': "255,255,128"
                }
            ]
        }
        myProjectService.update(Param).then(function(data) {
            //console.log(data);
            if (data.code!=200) {
                mess='修改项目失败：'+data.message;
                swal(mess);
            }
            else {
                swal('修改成功！').then(function(){
                    angular.copy(emptyEntity, newEntity);
                    $scope.editForm.$setPristine();
                    $('#modal-edit2').modal('hide');
                    $('#modal-edit2').val("");
                    $('#modal-edit3').modal('hide');
                    $('#modal-edit3').val("");
                    $scope.tableParams.reload();
                });
            }
        });

    }

    $scope.modifyProjectson = function() {

        if (!$scope.model.project || !$scope.model.leader || !$scope.model.EndTime || !$scope.model.StartTime) {
            Swal('请填写信息');
            return;
        }
        if ($scope.model.EndTime < $scope.model.StartTime) {
            Swal('开始时间应小于结束时间');
            return
        }

        var Param = {
            'ProjectId': $scope.model.ProjectId,
            'ProjectCode': $scope.model.ProjectCode,
            'ProjectName': $scope.model.project,
            'CompanyId': $scope.model.CompanyId, //$scope.model.CompanyId,
            'UserId': $scope.model.leader,
            'StartTime': $filter('date')($scope.model.StartTime, 'yyyy-MM-dd'),
            'EndTime': $filter('date')($scope.model.EndTime, 'yyyy-MM-dd'),
            'version': $scope.model.Version, //$scope.model.version,
            'HasSon': $scope.model.HasSon,
            'description': $scope.model.description,
            'FatherId': $scope.model.fatherId,
            'ColorList': [{
                    'ParamDictionaryId': $scope.query("水深"),
                    'BeginColor': "128,255,255",
                    'EndColor': "0,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("水温"),
                    'BeginColor': "0,128,255",
                    'EndColor': "255,0,0"
                },
                {
                    'ParamDictionaryId': $scope.query("ECuS"),
                    'BeginColor': "0,0,0",
                    'EndColor': "255,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("DOmg"),
                    'BeginColor': "0,0,0",
                    'EndColor': "255,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("Sal"),
                    'BeginColor': "255,255,255",
                    'EndColor': "128,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("pH"),
                    'BeginColor': "0,0,255",
                    'EndColor': "255,0,0"
                },
                {
                    'ParamDictionaryId': $scope.query("ORP"),
                    'BeginColor': "0,0,0",
                    'EndColor': "255,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("Chla"),
                    'BeginColor': "0,0,0",
                    'EndColor': "255,0,255"
                },
                {
                    'ParamDictionaryId': $scope.query("浊度"),
                    'BeginColor': "0,0,0",
                    'EndColor': "128,255,255"
                },
                {
                    'ParamDictionaryId': $scope.query("饱和"),
                    'BeginColor': "255,128,0",
                    'EndColor': "255,255,128"
                }
            ]
        }
        myProjectService.update(Param).then(function(data) {
            //console.log(data);
            if (data.code!=200) {
                    mess='修改失败：'+data.message;
                    swal(mess);
                    return;
            }
            angular.copy(emptyEntity, newEntity);
            $scope.editForm.$setPristine();
            $('#modal-edit2').modal('hide');
            $('#modal-edit2').val("");
            $('#modal-edit3').modal('hide');
            $('#modal-edit3').val("");
            $scope.tableParams.reload();
            //$scope..reload();
        });

        var a;

        //var b=$scope.model.ProjectId; 

        for (var i = 0; i < $scope.sub_pro_datas.length; i++) {
            if ($scope.sub_pro_datas[i].ProjectId == Param.ProjectId) {
                a = i;
                break;
            }
        }

        $scope.sub_pro_datas.splice(a, 1, Param);
        $scope.SubParams.reload();

        //$scope.SubParams.reload();


    }

    Array.prototype.indexOfMember = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].UserId == val) return i;
        }
        return -1;
    };
    Array.prototype.removeMember = function(val) {
        var index = this.indexOfMember(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    $scope.info = function(data) {
        $scope.model = newEntity;
        $('#modal-info').val("");
        var stime = $filter('limitTo')(data.StartTime, 10);
        $scope.model.StartTimeS = stime;
        var etime = $filter('limitTo')(data.EndTime, 10);
        $scope.model.EndTimeS = etime;
        $scope.model.project = data.ProjectName;
        $scope.model.ProjectCode = data.ProjectCode;
        $scope.model.leader = data.UserName;
        $scope.model.company = data.CompanyName;
        $scope.model.description = data.Description;
        $('#modal-info').modal('show');
    }
});