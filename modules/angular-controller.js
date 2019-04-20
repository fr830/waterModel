app.controller('homeController', function ($scope, $rootScope, $state) {
    $scope.init = function () {
        //alert('homeInit');
    };
});

app.controller('adminHomeController', function ($scope, $rootScope, $state, $stateParams,mumberManagerService, NgTableParams, $filter) {
    var projectManager=0;
    var custom=0;
    var params;
   $scope.classification=function () {
       userManageService.query(params, $scope.filter).then(function (data) {
           //console.log(data.length);
           for(i=0;i<data.length;i++){
           // console.log(data[i].role.RoleCode);
             if (data[i].role.RoleCode==1){
                 projectManager++;
             }else {
                 custom++;
             }
           };
           $scope.projectManager=projectManager;
           $scope.custom=custom;
           $scope.init();
            // console.log(projectManager);
            // console.log( custom);
       });

   };
   $scope.classification();
   // console.log(projectManager);
   //  console.log(custom);
   $scope.init=function () {
       projectManager=$scope.projectManager;
       custom= $scope.custom;
       // console.log($scope.projectManager);
       //  console.log($scope.custom);
       // option = {
       //     backgroundColor: '',
       //
       //     title: {
       //         text: '人数统计图',
       //         left: 'center',
       //         top: 20,
       //         textStyle: {
       //             color: 'black'
       //         }
       //     },
       //
       //     tooltip : {
       //         trigger: 'item',
       //         formatter: "{a} <br/>{b} : {c} ({d}%)"
       //     },
       //
       //     visualMap: {
       //         show: false,
       //         min: 80,
       //         max: 600,
       //         inRange: {
       //             colorLightness: [0, 1]
       //         }
       //     },
       //     series : [
       //         {
       //             name:'访问来源',
       //             type:'pie',
       //             radius : '55%',
       //             center: ['50%', '50%'],
       //             data:[
       //                 {value: projectManager, name:'项目管理员'},
       //                 {value:custom, name:'普通用户'}
       //             ].sort(function (a, b) { return a.value - b.value; }),
       //             roseType: 'radius',
       //             label: {
       //                 normal: {
       //                     textStyle: {
       //                         color: 'black'
       //                     }
       //                 }
       //             },
       //             labelLine: {
       //                 normal: {
       //                     lineStyle: {
       //                         color: 'black'
       //                     },
       //                     smooth: 0.2,
       //                     length: 10,
       //                     length2: 20
       //                 }
       //             },
       //             itemStyle: {
       //                 normal: {
       //                     color: '#c23531',//#c23531
       //                     shadowBlur: 200,
       //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
       //                 }
       //             },
       //
       //             animationType: 'scale',
       //             animationEasing: 'elasticOut',
       //             animationDelay: function (idx) {
       //                 return Math.random() * 200;
       //             }
       //         }
       //     ]
       // };
       app.title = '人员统计图';

       option = {
           tooltip: {
               trigger: 'item',
               formatter: "{a} <br/>{b}: {c} ({d}%)"
           },
           legend: {
               orient: 'vertical',
               x: 'left',
               data:['项目管理员','普通用户']
           },
           series: [
               {
                   name:'',
                   type:'pie',
                   radius: ['50%', '70%'],
                   avoidLabelOverlap: false,
                   label: {
                       normal: {
                           show: false,
                           position: 'center'
                       },
                       emphasis: {
                           show: true,
                           textStyle: {
                               fontSize: '30',
                               fontWeight: 'bold'
                           }
                       }
                   },
                   labelLine: {
                       normal: {
                           show: false
                       }
                   },
                   data:[
                       {value:projectManager, name:'项目管理员'},
                       {value:custom, name:'普通用户'}
                   ]
               }
           ]
       };
       //初始化echarts实例
       var myChart = echarts.init(document.getElementById('chartmain'));

       //使用制定的配置项和数据显示图表
       myChart.setOption(option,true);
       myChart.on('click', function (params) {
           // 控制台打印数据的名称
           console.log(params.name);
           $state.go('app.system.userManager');
       });
   }
});
app.controller('companyManagerController', function ($scope, $rootScope, $state, NgTableParams, companyManagerService, viewColumnService, roleService, enumService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);
    // enumService.query('ControlType').then(function (data) {
    //     $scope.controlType = data;
    // })
    // enumService.query('Align').then(function (data) {
    //     $scope.align = data;
    // })
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
    $scope.filter = {};
    $scope.filterItem = {};
    $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        getData: function (params) {
            return companyManagerService.query(params, $scope.filter);
        }
    });

    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    $scope.edit = function (data) {
        //console.log(data);
        if (!data) {
            $scope.model = newEntity;
            isModify=0;
            $('#modal-edit1').modal('show');
            $('#modal-edit1').val("");
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

    $scope.save = function () {

        if (!isModify) {
            if ($scope.model.CompanyName!=null&&$scope.model.LegalPerson!=null&&$scope.model.CompanyCode!=null&&$scope.model.Phone!=null&&$scope.model.Address!=null){

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
            //console.log(Param);
            companyManagerService.update(Param).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit2').modal('hide');
                $('#modal-edit2').val("");
            });
        }
    }

    $scope.remove = function (data) {
        //console.log(data);
        swal({
            title: "确认删除?",
            text: '确定要删除 ' + data.user.Name + ' 吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function(isConfirm){
            if (isConfirm.value) {
                mumberManagerService.remove(data.user.UserId).then(function (data) {
                    Swal({
                        title: '删除成功！',
                        type: 'success',
                        confirmButtonText: '确定'
                    })
                    $scope.tableParams.reload();
                });
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        });

        // if (confirm('确定要删除 ' + data.user.Name + ' 吗？')) {
        //     mumberManagerService.remove(data.user.UserId).then(function (data) {
        //         Swal({
        //             title: '删除成功！',
        //             type: 'success',
        //             confirmButtonText: '确定'
        //         })
        //         $scope.tableParams.reload();
        //     });
        // }
    };

    $scope.reset =function(data){
        if(confirm('确定要重置 ' + data.user.Name + ' 的密码吗？')){
            //console.log(data);
            mumberManagerService.reset(data.user.UserId).then(function(data){
                Swal({
                    title: '重置成功！',
                    type: 'success',
                    confirmButtonText: '确定'
                })
                //console.log(data);
                $scope.tableParams.reload();
            });
        }
    }

    $scope.freeze =function(data){
        //console.log(data);
        if(confirm('确定要冻结/解冻 ' + data.user.Name + ' 的账号吗？')){
            mumberManagerService.freeze(data.user.UserId).then(function(data){
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
        }
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
        if (confirm('确定要删除 ' + data.Name + ' 吗？')) {
            viewColumnService.remove(data.ID).then(function (data) {
                $scope.tableItem.reload();
            });
        }
    };
});

app.controller('customHomeController', function ($scope, $rootScope, $state, $stateParams, watchProjectService, NgTableParams, $filter) {
    var myBossProject=0;
    var normalProject=0;
    var params;
    $scope.classification=function () {
        watchProjectService.query(params, $scope.filter,$rootScope.identity.result.User.UserId).then(function (data) {
            //console.log(data.length);
            for(i=0;i<data.length;i++){
                // console.log(data[i].role.RoleCode);
                if (data[i].UserId==$rootScope.identity.result.User.UserId){
                    myBossProject++;
                }else {
                    normalProject++;
                }
            };
            $scope.myBossProject=myBossProject;
            $scope.normalProject=normalProject;
            $scope.init();
            console.log(myBossProject);
            console.log( normalProject);
        });

    };
    $scope.classification();
    // console.log(projectManager);
    //  console.log(custom);
    $scope.init=function () {
        myBossProject=$scope.myBossProject;
        normalProject= $scope.normalProject;
        // console.log($scope.projectManager);
        //  console.log($scope.custom);

        app.title = '项目统计图';

        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['负责项目','非负责项目']
            },
            series: [
                {
                    name:'',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:myBossProject, name:'负责项目'},
                        {value:normalProject, name:'非负责项目'}
                    ]
                }
            ]
        };
        //初始化echarts实例
        var myChart = echarts.init(document.getElementById('chartmain'));

        //使用制定的配置项和数据显示图表
        myChart.setOption(option,true);
        myChart.on('click', function (params) {
            // 控制台打印数据的名称
            console.log(params.name);
            $state.go('app.system.watchProject');
        });
    }
});
app.controller('dataManageController', function ($scope, $rootScope, $state, dataManageService, getPointDataDetailService,NgTableParams, userProjectService, $filter, Restangular,watchDataCsvService ) {
    var isModify=0;
    var emptyEntity = {};  
    var Selected=[];
    $scope.isCheckedAll = false;
    var newEntity = angular.copy(emptyEntity);
    $scope.filter = {};
    $scope.filterItem = {};
    $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        getData: function (params) {
            return userProjectService.query(params, $scope.filter,$rootScope.identity.result.User.UserId);
        }
    });

    $scope.reload = function(item){
        getPointDataDetailService.querydetail(item).then(function (data) {
            $scope.csvDetailTable = data.result.Data;
            // console.log($scope.csvDetailTable);
        })
    }
    
    $scope.edit= function (data) {
        //console.log(data);
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
    var DataSetId_temp = '';
    //查看一个数据组的经纬度
    $scope.watchData=function(data){
        // console.log(data);
        DataSetId_temp = data.DataSetId;
        // data = eval(data);
        // (data.ProjectId);
        //$scope.model = newEntity;
       
        $scope.csvTable = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        getData: function (params) {
            //alert(data.PointDataId);
                 return watchDataCsvService.query(params, $scope.filter,data.DataSetId);
                 // return watchDataCsvService.query(params, $scope.filter,data.DataSetId);
            }
        });
       // console.log(data);
        $scope.PointDataId=data.PointDataId;
        // console.log('1');
        //console.log($scope.DataSetId);
        $('#modal-watchDataCsv').modal('show');
       
    }
    
    //返回csv详细数据
    $scope.Datas='';
    $scope.PointDataTemp = '';
    $scope.watchDataDetail=function(data){

        // console.log(data);
        // $scope.csvDetailTable = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        // getData: function (params) {
        //     //alert(data.PointDataId);
        //          return getPointDataDetailService.querydetail(params, $scope.filter,data.PointDataId);
        //          // return watchDataCsvService.query(params, $scope.filter,data.DataSetId);
        //     }
        // });
        $scope.PointDataTemp = data.PointDataId;
        getPointDataDetailService.querydetail(data.PointDataId).then(function (data) {
            $scope.csvDetailTable = data.result.Data;
            console.log($scope.csvDetailTable);
        })
       // console.log(data);
        $scope.Datas=$scope.csvDetailTable;
        $scope.PointDataId=data.PointDataId;
        console.log($scope.Datas);
        //console.log($scope.DataSetId);
        $('#modal-watchPointDataDetail').modal('show');
       
    }
    
    //全选
    $scope.Selected = [] ;
   
    $scope.selectAll = function() {
        var checkbox = document.getElementsByName('selected');
        console.log(checkbox);
        if($scope.isCheckedAll == false) {
            for(var i = 0; i < checkbox.length; i++) {
                checkbox[i].checked = true;
            }
            console.log($scope.storePro);
            $scope.isCheckedAll = true;
        }
        else {
            for(var i = 0; i < checkbox.length; i++) {
               checkbox[i].checked = false;
            }
            $scope.isCheckedAll = false; 
        }
    }
       //  console.log($scope.selected);

        //     for(var key in data){
        //         if($scope.selected.indexOf(data[key].PointDataDetailId)>=0){ //判断数组中是否重复存在
        //                continue;
        //            }else{
        //                $scope.selected.push(data[key].PointDataDetailId);
        //            }
        //     }
        //     console.log($scope.selected);

        // }
        // else{
        //        $scope.x=false;
        //        $scope.selected=[];
        //    }
       
       // // console.log(checkbox);
       //  if($scope.isCheckedAll == false) {
       //      for(var i = 0; i < checkbox.length; i++) {
       //          checkbox[i].checked = true;
       //      }
       //     // console.log($scope.storePro);
       //      $scope.isCheckedAll = true;
       //  }
       //  else {
       //      for(var i = 0; i < checkbox.length; i++) {
       //         checkbox[i].checked = false;
       //      }
       //      $scope.isCheckedAll = false; 
       //  }
    // };
    
    //单选更新selected
    // $scope.isSelected = function($event,PointDataDetailId){ 
    //        var checkbox = $event.target ;  
    //        var checked = checkbox.checked ;  
          
    //        if(checked){  
    //            $scope.selected.push(PointDataDetailId);
    //        }else{  
    //            var idx = $scope.selected.indexOf(PointDataDetailId) ;  
    //            $scope.selected.splice(idx,1);  
    //        }  
    //        console.log($scope.selected);
    // };


    
    
    //删除数据
    var str = "";
    $scope.removeData= function(){
        $scope.Selected =[];
        console.log($scope.csvDetailTable);
         var checkboxfinal = document.getElementsByName('selected');
                for (var i = checkboxfinal.length - 1; i >= 0; i--) {
                    if(checkboxfinal[i].checked == true){
                        for (var j = $scope.csvDetailTable.length - 1; j >= 0; j--) {
                            if(checkboxfinal[i].defaultValue==$scope.csvDetailTable[j].PointDataDetailId&&JSON.stringify($scope.Selected).indexOf(JSON.stringify($scope.csvDetailTable[i].PointDataDetailId))==-1){
                                $scope.Selected.push($scope.csvDetailTable[i].PointDataDetailId);
                                break;
                            }      
                        }
                    }
                }
                //拼接字符串
                 str = "";
                 for (var k = 0; k <$scope.Selected.length; k++) {
                     str += $scope.Selected[k]+ ",";

                 }
                 //去掉最后一个逗号
                 if (str.length > 0) {
                    str = str.substr(0, str.length - 1);
                   // return str;
                }



       // console.log($scope.Selected);
       //  console.log(str);
       //  if (confirm('确定要删除以上数据吗？')) {
       //      getPointDataDetailService.remove(str).then(function (data) {
       //          //console.log(data);
       //          Swal({
       //              title: data.result,
       //              // type: 'success',
       //              confirmButtonText: '确定'
       //          })
       //          $scope.reload($scope.PointDataTemp);
       //     },function(error){
       //          alert('123344')
       //     });
       //  }

       //console.log($scope.Selected);
        //console.log(str);
        swal({
            title: "确认删除?",
            text: '确定要删除以上数据吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
            //closeOnConfirm: false,
           // closeOnCancel: false
        }).then(function(isConfirm){
            if (isConfirm.value) {
                getPointDataDetailService.remove(str).then(function (data) {
                    //console.log(data);
                    Swal({
                        title: data.result,
                        // type: 'success',
                        confirmButtonText: '确定'
                    })
                    $scope.reload($scope.PointDataTemp);;
                },function(error){
                    alert('操作异常，请重新登陆')
                });
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        });
       
    };
    
    //恢复数据
    $scope.recoeryData=function(data){
        console.log(data);

        // data = eval(data);
        //$scope.model = newEntity;

        swal({
            title: "确认恢复?",
            text: '确定要恢复所有数据吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
            // closeOnConfirm: false,
            // closeOnCancel: false
        }).then(function(isConfirm){
            if (isConfirm.value) {
                getPointDataDetailService.update(data.PointDataId).then(function (data) {
                    //console.log(data);
                    Swal({
                        title: '恢复成功！',
                        type: 'success',
                        confirmButtonText: '确定'
                    })
                    $scope.csvDetailTable.reload();
                });
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        });
        // if (confirm('确定要恢复所有数据吗？')) {
        //     getPointDataDetailService.update(data.PointDataId).then(function (data) {
        //         //console.log(data);
        //         Swal({
        //             title: '恢复成功！',
        //             type: 'success',
        //             confirmButtonText: '确定'
        //         })
        //         $scope.csvDetailTable.reload();
        //     });
        // }

    };
       
  
    
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

    

    $scope.remove= function(data){
        swal({
            title: "确认删除?",
            text: '确定要删除 ' + data.DataSetName + ' 吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
            // closeOnConfirm: false,
            // closeOnCancel: false
        }).then(function(isConfirm){
            if (isConfirm.value) {
                dataManageService.remove(data.DataSetId).then(function (data) {
                    //console.log(data);
                    if (data.code==200 ){
                        Swal({
                            title: '删除成功！',
                            type: 'success',
                            confirmButtonText: '确定'
                        })
                    }else{
                        Swal({
                            title: '该数据组下已有数据，不能删除！！',
                            type: 'error',
                            confirmButtonText: '确定'
                        })
                    }

                    $scope.datasTable.reload();
                });
            } else {
                swal("操作取消", "操作已取消 :)", "warning");
            }
        });

        // if (confirm('确定要删除 ' + data.DataSetName + ' 吗？')) {
        //     dataManageService.remove(data.DataSetId).then(function (data) {
        //         //console.log(data);
        //         if (data.code==200 ){
        //             Swal({
        //                 title: '删除成功！',
        //                 type: 'success',
        //                 confirmButtonText: '确定'
        //             })
        //         }else{
        //             Swal({
        //                 title: '该数据组下已有数据，不能删除！！',
        //                 type: 'error',
        //                 confirmButtonText: '确定'
        //             })
        //         }
        //
        //         $scope.datasTable.reload();
        //     });
        // }
       // $scope.datasTable.reload();
    };

    $scope.query= function(paraname){
        var i;
        for (i=0;i<$rootScope.Parameters.length;i++){
            if ($rootScope.Parameters[i].ParamName==paraname){
                //console.log($rootScope.Parameters[i].ParamName);
                //console.log($rootScope.Parameters[i].ParamDictionaryId);
                return $rootScope.Parameters[i].ParamDictionaryId;
            }
        }
    };
    $scope.save= function (data){

        if(!isModify){

            if ($scope.model.DataSetCode!=null&&$scope.model.DataSetName!=null&&$scope.model.Weather!=null){
                var Param1={
                    'DataSetCode':$scope.model.DataSetCode,
                    'DataSetName':$scope.model.DataSetName,
                    'ProjectId':$scope.ProjectId,//$scope.model.CompanyId,
                    'UploadPerson':$rootScope.identity.result.User.UserId,
                    'Weather':$scope.model.Weather

                }
                //console.log(Param1);
                dataManageService.add(Param1).then(function (data) {
                    //console.log(data);
                    $scope.datasTable.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.editForm.$setPristine();
                    $('#modal-creatNew').modal('hide');
                    $('#modal-creatNew').val("");
                });
            }else {
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
        }else{

            // $scope.binding();
            var Param2={
                'DataSetId':$scope.DataSetId,
                'DataSetCode':$scope.model.DataSetCode,
                'DataSetName':$scope.model.DataSetName,
                'ProjectId':$scope.ProjectId,//$scope.model.CompanyId,
                'UploadPerson':$rootScope.identity.result.User.UserId,
                'Weather':$scope.model.Weather
            }

            //console.log(Param2);
            dataManageService.update(Param2).then(function (data) {
                //console.log(data);
                $scope.datasTable.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-editSet').modal('hide');
                $('#modal-editSet').val("");

            });
        };


    };
    
    $scope.upload = function (data) {
        $('#modal-upload').modal('show');
        $scope.filter.longitude = '';
        $scope.filter.latitude = '';
        $scope.DataSetId=data.DataSetId;
    };

    //上传文件
    $scope.uploadFile = function() {
        console.log($scope.filter.longitude);


        // if($scope.filter.longitude!=''|| $scope.filter.latitude!=''){
        //     console.log(angular.isNumber($scope.filter.longitude));
        //     console.log(angular.isNumber($scope.filter.latitude));
        //     if(angular.isNumber($scope.filter.longitude)==false || angular.isNumber($scope.filter.latitude)==false){
        //         swal('输入必须为数字');
        //         return;
        //     }
        // }
        $('.page-loader-wrapper').show();
        var formData = new FormData($( "#uploadForm" )[0]);
        formData.append('DataSetId',$scope.DataSetId);
        formData.append('latitude',$scope.filter.latitude);
        formData.append('longitude',$scope.filter.longitude);
        var fileName=$('#fileName').val();
        var arr = fileName.split('.');
        //console.log(arr.length);
        var suffix = arr[arr.length-1];//取文件格式
        //console.log(suffix);
        //console.log(fileName);
        if(suffix!="csv"){
            swal("导入文件格式有误，请选择导入Excel文件");
            $('#modal-uploadfile').modal('hide');
            return;
        }
        var url="http://218.108.45.6:8086/api/PointData/postExcel";
        $.ajax({
            url: url,
            data: formData,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (request) {
                //owWait();
                request.setRequestHeader("Authorization", "Bearer "+$rootScope.identity.result.Token);
                //request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            },
            success: function (resp) {
                if (resp.code == 200) {
                    $('#modal-upload').modal('hide');
                    $('.page-loader-wrapper').fadeOut();
                    swal('文件上传成功！');
                    // $scope.tableParams = new NgTableParams({},{
                    //     getData: function(params){
                    //         return productplanService.query(params, $scope.filter);
                    //     }
                    // })
                }
                else {
                    swal(resp.message);
                }
            },
            error: function (data) {
                $('#modal-upload').modal('hide');
                 $('.page-loader-wrapper').fadeOut();
                swal('文件上传失败！');
            },
            complete: function(){
                console.log("complete");
                //angular.element('#fileName').val()='';
                 $('.page-loader-wrapper').fadeOut();
                // $.unblockUI();
                // hideWait();
            },
        });
    }

    $scope.resetPot = function(){
        // console.log(DataSetId_temp);
        $('#modal-watchDataCsv').modal('hide');
        $('#modal-edit').modal('hide');
        $state.go('app.system.resetMapPot',{DataSetId:DataSetId_temp});
    }


});

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

app.controller('homeController', function ($scope, $rootScope, $state) {
    $scope.init = function () {
        //alert('homeInit');
    };
});


app.controller('locationController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Location').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('LocationEdit').then(function (editView) {
        dataViewService.getFormViewByCode('LocationNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table
            });
        })
    })
})


app.controller('logController', function ($scope, $rootScope, $state, logService, enumService) {
    // $scope.filter = {};

    // enumService.query('LogLevel').then(function (data) {
    //    $scope.logLevels = data;
    // });

    // $scope.tableParams = new NgTableParams({ sorting: { 'LogTime': 'desc' } }, {
    //    getData: function (params) {
    //        return logService.query(params, $scope.filter);
    //    }
    // });

    // $scope.reflash = function () {
    //    $scope.tableParams.reload();
    // }
    
});

app.controller('loginController', function ($scope, $rootScope, $state, $cookies, Restangular, userService) {//, permissionService
    $scope.loginRequest = {
        UserName: null,
        Password: null//,
        //Flag:1
    }
    $scope.login = function (e) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;

            if (!keycode) {
                return;
            }

            if (keycode != 0 && keycode != 1 && keycode != 13) {
                return;
            }
        }

        if ($scope.loginRequest.UserName != null && $scope.loginRequest.Password != null) {
            userService.login($scope.loginRequest).then(function (data) {
                console.log(data);
                //console.log(data.result.Token);
                 //console.log(data);
                // console.log(data.result.Token);
                $rootScope.identity = data;
                //console.log($rootScope.identity.result.Menu);
                function replacer(key, value) {
                     if (key === "UserProjectRelList") {
                         return value[0];
                      }
                      return value;
                 }
               
                //console.log(Restangular);
                // 权限
                if (data.code==200)
                { 
                    $cookies.put('identity', JSON.stringify($rootScope.identity, replacer));//data中包括的东西过多，此处删减
                    Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.result.Token });
                    $rootScope.permissions = data;
                    //console.log( $rootScope.identity);
                    if (data.result.Role.RoleCode==0){
                        $state.go('app.system.adminHome');
                    }else if (data.result.Role.RoleCode==1){
                        $state.go('app.system.pmHome');
                    }else{
                        $state.go('app.system.customHome');
                    }
                   // $state.go('app.home');
                }
                else{

                    Swal("用户或密码输入错误！");
                }
                // permissionService.queryPermission().then(function (data) {
                //
                //
                // });
            });
        }
        else {
            Swal({
                title: '请输入用户名和密码！',
                text: 'Enter your account and password please!',
                type: 'error',
                confirmButtonText: '确定'
            })
        }
    };
    $scope.close = function () {
        window.location.href = "about:blank";
        window.close();
    };
});

app.controller('mapFocusController', function ($scope, $rootScope, $state, $stateParams,showDataService, NgTableParams, userProjectService, $filter, mapFocusService) {
	var DataSetId=$stateParams.DataSetId;
    var locations = [];
    $scope.model={};
    var X,Y;
    var rootData={};
    var valueList=[];
    var valueForEchart={};
    $scope.DataTypes=["pH","饱和","ECuS","Sal","浊度","ORP", "水温","Chla","DOmg","水深"];//根据数据类型输出相应的表格
    $scope.query=function (data) {
        // locations = [];
        showDataService.getData(DataSetId).then(function (data) {
            // console.log("1111111");
            rootData=data;
            // console.log(rootData);
            var i;
            for (i=0;i<data.result.pointDataMores.length;i++){
                var Des="经度："+data.result.pointDataMores[i].LongitudeAfter+"纬度:"+data.result.pointDataMores[i].LatitudeAfter;
                var location={
                    "x":data.result.pointDataMores[i].LongitudeAfter,
                    "y":data.result.pointDataMores[i].LatitudeAfter,
                    "des":Des
                };
                locations.push(location);
            }
            $scope.init();
        });
        //console.log(1);
    };

    var arr = new Array();
    function locationIndex(){}
    var i = 0;

     $scope.getLocation=function () {
         var Location=[];
         var i;
         // for (i=0;)
     };

	$scope.init = function () {
        var map = new BMap.Map("container");
        map.centerAndZoom(new BMap.Point(locations[0].x, locations[0].y), 17);//116.404, 39.915

          //去除路网,建筑为物
        map.setMapStyle({
                  styleJson:[
                    {
                              "featureType": "road",
                              "elementType": "all",
                              "stylers": {
                                        "color": "#ffffff",
                                        "visibility": "off"
                              }
                    },
                    {
                              "featureType": "building",
                              "elementType": "all",
                              "stylers": {
                                        "visibility": "off"
                              }
                    },
                    {
                              "featureType": "poilabel",
                              "elementType": "all",
                              "stylers": {
                                        "visibility": "off"
                              }
                    },
                    {
                              "featureType": "manmade",
                              "elementType": "all",
                              "stylers": {
                                        "visibility": "on"
                              }
                    },
              ]
          });

        var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
        map.addControl(top_right_navigation); 
         //console.log(L);
        for(L in locations){
            var marker = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));//创建图标
            var Lo = new locationIndex();
            Lo.mark = marker;
            Lo.x = locations[L].x;
            Lo.y = locations[L].y;
            Lo.des = locations[L].des;
            arr[i++] = Lo;
            map.addOverlay(marker);
            marker.addEventListener("mouseover",function mousing(e){
            var p = e.target;
            var x = p.getPosition().lng;
            var y = p.getPosition().lat;
            for(var k = 0;k<arr.length;k++){
            if(x == arr[k].x && y == arr[k].y){
                var label = new BMap.Label(arr[k].des,{offset:new BMap.Size(10,25)});
                            arr[k].mark.setLabel(label);

                            //map.addOverlay(arr[k].mark);
                            return ;
                        }
                    }
                });
                marker.addEventListener("mouseout",function mouseLeave(e){
                    var p = e.target;
                    var x = p.getPosition().lng;
                    var y = p.getPosition().lat;
                    // alert(arr.length);
                    for(var k = 0;k<arr.length;k++){
                        if(x == arr[k].x && y == arr[k].y){
                            // alert("xxxxxxxxx");
                            // var marker1 = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));
                            //var label = new BMap.Label(null,{offset:new BMap.Size(0,0)});
                            var label =  arr[k].mark.getLabel();
                            label.setContent("");//设置标签内容为空
                            label.setStyle({borderWidth:"0px"});//设置标签边框宽度为0

                            //map.addOverlay(arr[k].mark);
                            return ;
                        }
                    }
                });


                marker.addEventListener("click",function showChart(e){//展示表格
                    // console.log(rootData);
                    var p = e.target;
                    var x = p.getPosition().lng;
                    var y = p.getPosition().lat;
                    // alert(arr.length);
                    for(var k = 0;k<arr.length;k++){
                        if(x == arr[k].x && y == arr[k].y){
                        
                            $scope.model.X=arr[k].x;
                            $scope.model.Y=arr[k].y;
                            // console.log($scope.model.dataType);
                            //指定图标的配置和数据
                            var pDatas=[];
                            var valueInfo=[[],[],[],[],[],[],[],[],[],[]];//用于计算最值
                            var dataInfo=[[],[],[],[],[],[],[],[],[],[]];//一般数据,用于生成表格
                            var XAxis;
                            valueList=[];
                            valueForEchart=[];
                            var i,j;
                            var id;
                            for (i=0;i<rootData.result.pointDataMores.length;i++){
                                if($scope.model.X==rootData.result.pointDataMores[i].LongitudeAfter&&$scope.model.Y==rootData.result.pointDataMores[i].LatitudeAfter){
                                	id=rootData.result.pointDataMores[i].PointDataId;
                                    console.log($scope.model.X,rootData.result.pointDataMores[i].LongitudeAfter);
                                    console.log($scope.model.Y,rootData.result.pointDataMores[i].LatitudeAfter);
                                	break;
                                } 
                            };//找到对应点的id获取点的数据
                            if(!id) console.log("no id");
                            // console.log(rootData.result.pointDataMores[i].PointDataId);
                        	mapFocusService.showPoint(id).then(function(data){
                                pDatas=data.result.Data;
                                if($scope.model.dataTypeX=="水温") pDatas=pDatas.sort(sortByTemp);
                                else if($scope.model.dataTypeX=="饱和") pDatas=pDatas.sort(sortBySat);
                                else if($scope.model.dataTypeX=="浊度") pDatas=pDatas.sort(sortByTemp);
                                else if($scope.model.dataTypeX=="水深") pDatas=pDatas.sort(sortByDepth);
                                else if($scope.model.dataTypeX=="Sal") pDatas=pDatas.sort(sortBySal);
                                else if($scope.model.dataTypeX=="ORP") pDatas=pDatas.sort(sortByORP);
                                else if($scope.model.dataTypeX=="Chla") pDatas=pDatas.sort(sortByChla);
                                else if($scope.model.dataTypeX=="DOmg") pDatas=pDatas.sort(sortByDOmg);
                                else if($scope.model.dataTypeX=="ECuS") pDatas=pDatas.sort(sortByECuS);
                                else pDatas=pDatas.sort(sortBypH);
                                //根据x轴的数据来排序

                                for(j=0;pDatas[j];j++){
                                	for(var k=0;k<10;k++){
										var n=sift($scope.DataTypes[k],pDatas[j]);
										dataInfo[k].push(n);
										valueInfo[k].push(n);
                                	}
                                };
                                XAxis=dataInfo[judgeX($scope.model.dataTypeX)];//x轴
                                // console.log(dataInfo,valueInfo,valueList.length,XAxis);
                                //根据valueist的元素个数，一个按原来的数值处理，两个以上进行规划处理
                            if(valueList.length==1){
                                for(var a=0;valueList[a];a++){
                                    
                                    var Line={
                                        name:valueList[a],
                                        type:'line',
                                        showSymbol: true,
                                        data:dataInfo[judgeX(valueList[a])]
                                    }

                                    valueForEchart.push(Line);
                                }

                                var temp=valueInfo[judgeX(valueList[0])];
                                temp=temp.sort();
                                var scale=(parseFloat(temp[temp.length-1])-parseFloat(temp[0]))/6;
                                var Max=parseFloat(temp[temp.length-1])+parseFloat(scale)+0.5;
                                var Min=parseFloat(temp[0])-parseFloat(scale)-0.5;
                                Max=Max.toFixed(0);
                                Min=Min.toFixed(0);
                                var Xmin=parseFloat(XAxis[0]);
                                var Xmax=parseFloat(XAxis[XAxis.length-1]);
                                // console.log(Xmin,Xmax);
                                Xmin=Xmin.toFixed(0);
                                Xmax=Xmax.toFixed(0);
                                // console.log(Xmin,Xmax);
                                var option = {
                                    // visualMap: {
                                    //     show: true,
                                    //     type: 'continuous',
                                    //     seriesIndex: 0,
                                    //     min: 0,
                                    //     max: 400
                                    // },
                                    title:{
                                        // text:$scope.model.dataType
                                        // text:'数据统计'
                                    },
                                    tooltip:{
                                        trigger: 'axis'
                                    },
                                    legend:{
                                        data:valueList
                                    },
                                    xAxis:{
                                        min: Xmin,
                                        max: Xmax,
                                        name:$scope.model.dataTypeX,
                                        data:XAxis
                                    },
                                    yAxis:{
                                        min:Min,
                                        max:Max,
                                        type:'value',
                                        // name:$scope.model.dataType,
                                        splitLine: {show: true},
                                        splitNumber: 10 
                                    },
                                    series:valueForEchart
                                };
                            //初始化echarts实例
                            var myChart = echarts.init(document.getElementById('chartmain'));

                             //使用制定的配置项和数据显示图表
                            myChart.setOption(option,true);
                            $('#modal-chart').modal('show');
                            $('#modal-chart').val("");

                            }else{
                                for(var a=0;valueList[a];a++){
                                    var num=judgeX(valueList[a]);
                                    // console.log(num);
                                    var sum=0;
                                    var averange=0;
                                    var max=min=valueInfo[num][0];
                                    for(var b=0;b<valueInfo[num].length;b++){

                                        if(max<valueInfo[num][b]) max=valueInfo[num][b];
                                        if(min>valueInfo[num][b]) min=valueInfo[num][b];
                                        sum=sum+parseFloat(valueInfo[num][b]);
                                    } 
                                    averange=parseFloat(sum)/parseFloat(valueInfo[num].length);
                                    // console.log(sum,max,min,averange);
                                    //  console.log(valueInfo[num]);
                                    for(var b=0;b<valueInfo[num].length;b++){
                                        if((max-min)==0) valueInfo[num][b]=0;
                                        else valueInfo[num][b]=parseFloat(valueInfo[num][b]-averange)/parseFloat(max-min);
                                    }

                                     // console.log(valueInfo[num]);
                                    var Line={
                                        name:valueList[a],
                                        type:'line',
                                        showSymbol: true,
                                        data:valueInfo[num]
                                    } ;
                                    // console.log(Line);
                                    valueForEchart.push(Line);
                                }
                                var Xmin=parseFloat(XAxis[0]);
                                var Xmax=parseFloat(XAxis[XAxis.length-1]);
                                // console.log(Xmin,Xmax);
                                Xmin=Xmin.toFixed(0);
                                Xmax=Xmax.toFixed(0);
                                // console.log(Xmin,Xmax);
                                var option = {
                                    // visualMap: {
                                    //     show: true,
                                    //     type: 'continuous',
                                    //     seriesIndex: 0,
                                    //     min: 0,
                                    //     max: 400
                                    // },
                                    title:{
                                        // text:$scope.model.dataType
                                        // text:'数据统计'
                                    },
                                    tooltip:{
                                        trigger: 'axis'
                                    },
                                    legend:{
                                        data:valueList
                                    },
                                    xAxis:{
                                        min: Xmin,
                                        max: Xmax,
                                        name:$scope.model.dataTypeX,
                                        data:XAxis
                                    },
                                    yAxis:{
                                        min:-1,
                                        max:1,
                                        type:'value',
                                        // name:$scope.model.dataType,
                                        splitLine: {show: true},
                                        splitNumber: 10 
                                    },
                                    series:valueForEchart
                                };
                            //初始化echarts实例
                            var myChart = echarts.init(document.getElementById('chartmain'));

                             //使用制定的配置项和数据显示图表
                            myChart.setOption(option,true);
                            $('#modal-chart').modal('show');
                            $('#modal-chart').val("");



                            }

                                
                        });
                        
                            return ;
                        }
                    }

                });


        	}
     	map.enableScrollWheelZoom();
 	};
    
    $scope.update=function(){
    	var pDatas=[];
        var valueInfo=[[],[],[],[],[],[],[],[],[],[]];//用于计算最值
        var dataInfo=[[],[],[],[],[],[],[],[],[],[]];//一般数据,用于生成表格
        var XAxis;
        valueForEchart=[];
        var i,j;
        var id;
        for (i=0;i<rootData.result.pointDataMores.length;i++){
            if($scope.model.X==rootData.result.pointDataMores[i].LongitudeAfter&&$scope.model.Y==rootData.result.pointDataMores[i].LatitudeAfter){
                id=rootData.result.pointDataMores[i].PointDataId;
                console.log($scope.model.X,rootData.result.pointDataMores[i].LongitudeAfter);
                console.log($scope.model.Y,rootData.result.pointDataMores[i].LatitudeAfter);
                break;
            } 
        };//找到对应点的id获取点的数据
        if(!id) console.log("no id");
            // console.log(rootData.result.pointDataMores[i].PointDataId);
        mapFocusService.showPoint(id).then(function(data){
            pDatas=data.result.Data;
            if($scope.model.dataTypeX=="水温") pDatas=pDatas.sort(sortByTemp);
            else if($scope.model.dataTypeX=="饱和") pDatas=pDatas.sort(sortBySat);
            else if($scope.model.dataTypeX=="浊度") pDatas=pDatas.sort(sortByTemp);
            else if($scope.model.dataTypeX=="水深") pDatas=pDatas.sort(sortByDepth);
            else if($scope.model.dataTypeX=="Sal") pDatas=pDatas.sort(sortBySal);
            else if($scope.model.dataTypeX=="ORP") pDatas=pDatas.sort(sortByORP);
            else if($scope.model.dataTypeX=="Chla") pDatas=pDatas.sort(sortByChla);
            else if($scope.model.dataTypeX=="DOmg") pDatas=pDatas.sort(sortByDOmg);
            else if($scope.model.dataTypeX=="ECuS") pDatas=pDatas.sort(sortByECuS);
            else pDatas=pDatas.sort(sortBypH);
                                //根据x轴的数据来排序

            for(j=0;pDatas[j];j++){
                for(var k=0;k<10;k++){
                    var n=sift($scope.DataTypes[k],pDatas[j]);
                    dataInfo[k].push(n);
                    valueInfo[k].push(n);
                }
            };
            XAxis=dataInfo[judgeX($scope.model.dataTypeX)];//x轴
                                // console.log(dataInfo,valueInfo,valueList.length,XAxis);
                                //根据valueist的元素个数，一个按原来的数值处理，两个以上进行规划处理
            if(valueList.length==1){
                for(var a=0;valueList[a];a++){
                                    
                    var Line={
                            name:valueList[a],
                            type:'line',
                            showSymbol: true,
                            data:dataInfo[judgeX(valueList[a])]
                        }

                        valueForEchart.push(Line);
                    }


            var temp=valueInfo[judgeX(valueList[0])];
            temp=temp.sort();
            var scale=(parseFloat(temp[temp.length-1])-parseFloat(temp[0]))/6;
            var Max=parseFloat(temp[temp.length-1])+parseFloat(scale)+0.5;
            var Min=parseFloat(temp[0])-parseFloat(scale)-0.5;
            Max=Max.toFixed(0);
            Min=Min.toFixed(0);
            var Xmin=parseFloat(XAxis[0]);
            var Xmax=parseFloat(XAxis[XAxis.length-1]);
                                // console.log(Xmin,Xmax);
            Xmin=Xmin.toFixed(0);
            Xmax=Xmax.toFixed(0);
                                // console.log(Xmin,Xmax);
            var option = {
                                    // visualMap: {
                                    //     show: true,
                                    //     type: 'continuous',
                                    //     seriesIndex: 0,
                                    //     min: 0,
                                    //     max: 400
                                    // },
                    title:{
                                        // text:$scope.model.dataType
                                        // text:'数据统计'
                    },
                    tooltip:{
                                trigger: 'axis'
                    },
                    legend:{
                            data:valueList
                    },
                    xAxis:{
                            min:Xmin,
                            max:Xmax,
                            name:$scope.model.dataTypeX,
                            data:XAxis
                        },
                    yAxis:{
                            min:Min,
                            max:Max,
                            type:'value',
                                        // name:$scope.model.dataType,
                            splitLine: {show: true},
                            splitNumber: 10 
                        },
                    series:valueForEchart
                };
                            //初始化echarts实例
                var myChart = echarts.init(document.getElementById('chartmain'));

                             //使用制定的配置项和数据显示图表
                myChart.setOption(option,true);
                $('#modal-chart').modal('show');
                $('#modal-chart').val("");

                }else{
                    for(var a=0;valueList[a];a++){
                        var num=judgeX(valueList[a]);
                                    // console.log(num);
                        var sum=0;
                        var averange=0;
                        var max=min=valueInfo[num][0];
                        for(var b=0;b<valueInfo[num].length;b++){

                            if(max<valueInfo[num][b]) max=valueInfo[num][b];
                            if(min>valueInfo[num][b]) min=valueInfo[num][b];
                            sum=sum+parseFloat(valueInfo[num][b]);
                        } 
                        averange=parseFloat(sum)/parseFloat(valueInfo[num].length);
                                    // console.log(sum,max,min,averange);
                                    //  console.log(valueInfo[num]);
                        for(var b=0;b<valueInfo[num].length;b++){
                                if((max-min)==0) valueInfo[num][b]=0;
                                else valueInfo[num][b]=parseFloat(valueInfo[num][b]-averange)/parseFloat(max-min);
                            }

                                     // console.log(valueInfo[num]);
                            var Line={
                                    name:valueList[a],
                                    type:'line',
                                    showSymbol: true,
                                    data:valueInfo[num]
                                } ;
                                    // console.log(Line);
                                valueForEchart.push(Line);
                            }
                                var Xmin=parseFloat(XAxis[0]);
                                var Xmax=parseFloat(XAxis[XAxis.length-1]);
                                // console.log(Xmin,Xmax);
                                Xmin=Xmin.toFixed(0);
                                Xmax=Xmax.toFixed(0);
                                // console.log(Xmin,Xmax);
                                var option = {
                                    // visualMap: {
                                    //     show: true,
                                    //     type: 'continuous',
                                    //     seriesIndex: 0,
                                    //     min: 0,
                                    //     max: 400
                                    // },
                                    title:{
                                        // text:$scope.model.dataType
                                        // text:'数据统计'
                                    },
                                    tooltip:{
                                        trigger: 'axis'
                                    },
                                    legend:{
                                        data:valueList
                                    },
                                    xAxis:{
                                        min:Xmin,
                                        max:Xmax,
                                        name:$scope.model.dataTypeX,
                                        data:XAxis
                                    },
                                    yAxis:{
                                        min:-1,
                                        max:1,
                                        type:'value',
                                        // name:$scope.model.dataType,
                                        splitLine: {show: true},
                                        splitNumber: 10 
                                    },
                                    series:valueForEchart
                                };
                            //初始化echarts实例
                            var myChart = echarts.init(document.getElementById('chartmain'));

                             //使用制定的配置项和数据显示图表
                            myChart.setOption(option,true);
                            $('#modal-chart').modal('show');
                            $('#modal-chart').val("");



                            }

                                
                        });
    }

    $scope.showAll=function(){
        var pDatas=[];
        var valueInfo=[[],[],[],[],[],[],[],[],[],[]];//用于计算最值
        var dataInfo=[[],[],[],[],[],[],[],[],[],[]];//一般数据,用于生成表格
        var XAxis;
        valueList=$scope.DataTypes;
        valueForEchart=[];
        var i,j;
        var id;
        for (i=0;i<rootData.result.pointDataMores.length;i++){
            if($scope.model.X==rootData.result.pointDataMores[i].LongitudeAfter&&$scope.model.Y==rootData.result.pointDataMores[i].LatitudeAfter){
                id=rootData.result.pointDataMores[i].PointDataId;
                console.log($scope.model.X,rootData.result.pointDataMores[i].LongitudeAfter);
                console.log($scope.model.Y,rootData.result.pointDataMores[i].LatitudeAfter);
                break;
            } 
        };//找到对应点的id获取点的数据
        if(!id) console.log("no id");
        mapFocusService.showPoint(id).then(function(data){
            pDatas=data.result.Data;
            if($scope.model.dataTypeX=="水温") pDatas=pDatas.sort(sortByTemp);
            else if($scope.model.dataTypeX=="饱和") pDatas=pDatas.sort(sortBySat);
            else if($scope.model.dataTypeX=="浊度") pDatas=pDatas.sort(sortByTemp);
            else if($scope.model.dataTypeX=="水深") pDatas=pDatas.sort(sortByDepth);
            else if($scope.model.dataTypeX=="Sal") pDatas=pDatas.sort(sortBySal);
            else if($scope.model.dataTypeX=="ORP") pDatas=pDatas.sort(sortByORP);
            else if($scope.model.dataTypeX=="Chla") pDatas=pDatas.sort(sortByChla);
            else if($scope.model.dataTypeX=="DOmg") pDatas=pDatas.sort(sortByDOmg);
            else if($scope.model.dataTypeX=="ECuS") pDatas=pDatas.sort(sortByECuS);
            else pDatas=pDatas.sort(sortBypH);
                                //根据x轴的数据来排序

            for(j=0;pDatas[j];j++){
                for(var k=0;k<10;k++){
                    var n=sift($scope.DataTypes[k],pDatas[j]);
                        dataInfo[k].push(n);
                        valueInfo[k].push(n);
                    }
                };
            XAxis=dataInfo[judgeX($scope.model.dataTypeX)];//x轴
                                // console.log(dataInfo,valueInfo,valueList.length,XAxis);
                                //根据valueist的元素个数，一个按原来的数值处理，两个以上进行规划处理
                           
            for(var a=0;valueList[a];a++){
                var num=judgeX(valueList[a]);
                                    // console.log(num);
                var sum=0;
                var averange=0;
                var max=min=valueInfo[num][0];
                for(var b=0;b<valueInfo[num].length;b++){

                    if(max<valueInfo[num][b]) max=valueInfo[num][b];
                    if(min>valueInfo[num][b]) min=valueInfo[num][b];
                    sum=sum+parseFloat(valueInfo[num][b]);
                } 
                averange=parseFloat(sum)/parseFloat(valueInfo[num].length);
                // console.log(sum,max,min,averange);
                //  console.log(valueInfo[num]);
                for(var b=0;b<valueInfo[num].length;b++){
                    if((max-min)==0) valueInfo[num][b]=0;
                    else valueInfo[num][b]=parseFloat(valueInfo[num][b]-averange)/parseFloat(max-min)+2*a;
                }

                                     // console.log(valueInfo[num]);
                var Line={
                    name:valueList[a],
                    type:'line',
                    showSymbol: true,
                    data:valueInfo[num]
                } ;
                                    // console.log(Line);
                    valueForEchart.push(Line);
            }
            // console.log(valueInfo);
                var Xmin=parseFloat(XAxis[0]);
                var Xmax=parseFloat(XAxis[XAxis.length-1]);
                                // console.log(Xmin,Xmax);
                Xmin=Xmin.toFixed(0);
                Xmax=Xmax.toFixed(0);
                                // console.log(Xmin,Xmax);
                            var option = {
                                    // visualMap: {
                                    //     show: true,
                                    //     type: 'continuous',
                                    //     seriesIndex: 0,
                                    //     min: 0,
                                    //     max: 400
                                    // },
                                    title:{
                                        // text:$scope.model.dataType
                                        // text:'数据统计'
                                    },
                                    tooltip:{
                                        trigger: 'axis'
                                    },
                                    legend:{
                                        data:valueList
                                    },
                                    xAxis:{
                                        min: Xmin,
                                        max: Xmax,
                                        name:$scope.model.dataTypeX,
                                        data:XAxis
                                    },
                                    yAxis:{
                                        min:0,
                                        max:20,
                                        type:'value',
                                        // name:$scope.model.dataType,
                                        splitLine: {show: true},
                                        splitNumber: 10 
                                    },
                                    series:valueForEchart
                                };
                            //初始化echarts实例
                            var myChart = echarts.init(document.getElementById('chartmain'));

                             //使用制定的配置项和数据显示图表
                            myChart.setOption(option,true);
                            $('#modal-chart').modal('show');
                            $('#modal-chart').val("");
                        });
    }

    var sift=function(string,data){
        // console.log(data);
        if(string=="水温") return data.Temperature;
        else if(string=="饱和") return data.Saturation;
        else if(string=="浊度") return data.Turbidity;
        else if(string=="水深") return data.Depth;
        else if(string=="Sal") return data.Sal;
        else if(string=="ORP") return data.ORP;
        else if(string=="Chla") return data.Chla;
        else if(string=="DOmg") return data.DOmg;
        else if(string=="ECuS") return data.ECuS;
        else return data.pH;

    }

    var judgeX=function(string){
        // console.log(data);
        if(string=="水温") return 6;
        else if(string=="饱和") return 1;
        else if(string=="浊度") return 4;
        else if(string=="水深") return 9;
        else if(string=="Sal") return 3;
        else if(string=="ORP") return 5;
        else if(string=="Chla") return 7;
        else if(string=="DOmg") return 8;
        else if(string=="ECuS") return 2;
        else return 0;

    }
//排序函数
    var sortByORP=function(a,b){
        return a.ORP-b.ORP;
    }

    var sortByDepth=function(a,b){
        return a.Depth-b.Depth;
    }

    var sortByTemp=function(a,b){
        return a.Temperature-b.Temperature;
    }

    var sortBySat=function(a,b){
        return a.Saturation-b.Saturation;
    }

    var sortByTurbidity=function(a,b){
        return a.Turbidity-b.Turbidity;
    }

    var sortBySal=function(a,b){
        return a.Sal-b.Sal;
    }

    var sortByECuS=function(a,b){
        return a.ECuS-b.ECuS;
    }

    var sortByDOmg=function(a,b){
        return a.DOmg-b.DOmg;
    }

    var sortByChla=function(a,b){
        return a.Chla-b.Chla;
    }

     var sortBypH=function(a,b){
        return a.pH-b.pH;
    }

    var sortDataByData=function(a,b){
        return a[0]-b[0];
    }

    var sortDatasetByData=function(a,b){
        return a.Depth-b.Depth;
    }

    var sortDataByValue=function(a,b){
        return a[1]-b[1];
    }

    $scope.isSelected=function(item,$event){
    	// console.log(item);
        var action=event.target;
        if(action.checked){
            // if($scope.conf[$index]){
            var j;
            var repeat=0;
            for(j=0;valueList[j];j++){
                if(item==valueList[j]){
                    // console.log(id);
                    // console.log($scope.MemberList[j].user.UserId);
                    repeat=1;
                    break;
                }
            }

        if(repeat==0){
                valueList.push(item);
        }
                
        }else{
        	var j;
            for(j=0;valueList[j];j++){
                if(item==valueList[j]){
                    // console.log(id);
                    // console.log($scope.MemberList[j].user.UserId);
                    valueList.splice(j,1);
                    break;
                }
            }
        }
        console.log(valueList);
        $scope.update();
    };

    $scope.defult=function(item){
        // if(item=="pH") return true;
    	return false;
    };

	$scope.query();
});
// app.controller('mapFocusController', function ($scope, $rootScope, $state, $stateParams,showDataService, NgTableParams, userProjectService, $filter, mapFocusService) {
//     var DataSetId=$stateParams.DataSetId;
//     var locations = [];
//     $scope.model={};
//     var X,Y;
//     var rootData={};
    
//     $scope.DataTypes=["pH","饱和","ECuS","Sal","浊度","ORP", "水温","Chla","DOmg"];//根据数据类型输出相应的表格
//     $scope.query=function (data) {
//         // locations = [];
//         showDataService.getData(DataSetId).then(function (data) {
//             // console.log("1111111");
//             rootData=data;
//             // console.log(rootData);
//             var i;
//             for (i=0;i<data.result.pointDataMores.length;i++){
//                 var Des="经度："+data.result.pointDataMores[i].LongitudeAfter+"纬度:"+data.result.pointDataMores[i].LatitudeAfter;
//                 var location={
//                     "x":data.result.pointDataMores[i].LongitudeAfter,
//                     "y":data.result.pointDataMores[i].LatitudeAfter,
//                     "des":Des
//                 };
//                 locations.push(location);
//             }
//             $scope.init();
//         });
//         //console.log(1);
//     };
//     $scope.query();
//     //console.log(locations);

//     //console.log($scope.Data);
//     //     var locations = [
//     //         {"x":"116.384502","y":"39.932241","des":"你猜!!!"},
//     //         {"x":"116.383752","y":"39.91334","des":"哈哈!!!"},
//     //         {"x":"116.040","y":"39.915","des":"嘿嘿!!!"}
//     //     ];
//        // console.log(locations);
//         var arr = new Array();
//         function locationIndex(){}
//         var i = 0;

//      $scope.getLocation=function () {
//          var Location=[];
//          var i;
//          // for (i=0;)
//      };
//      $scope.init = function () {
//             var map = new BMap.Map("container");
//             map.centerAndZoom(new BMap.Point(locations[0].x, locations[0].y), 15);//116.404, 39.915
//          //console.log(L);
//             for(L in locations){
//                 //console.log(L);
//                 //document.write("x:" + locations[L].x+ " y:" +locations[L].y + " des:" + locations[L].des + "<br />" );
//                 var marker = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));//创建图标
//                 //marker.setTitle(locations[L].des);
//                 //var label = new BMap.Label(locations[L].des,{offset:new BMap.Size(20,-20)});
//                 //label.setStyle({width:"100px",height:"50px"});
//                 var Lo = new locationIndex();
//                 Lo.mark = marker;
//                 Lo.x = locations[L].x;
//                 Lo.y = locations[L].y;
//                 Lo.des = locations[L].des;
//                 // alert("dddddd");
//                 arr[i++] = Lo;
//                 //alert(arr.length);
//                 map.addOverlay(marker);
//                 marker.addEventListener("mouseover",function mousing(e){
//                     var p = e.target;
//                     var x = p.getPosition().lng;
//                     var y = p.getPosition().lat;
//                     // alert(arr.length);
//                     for(var k = 0;k<arr.length;k++){
//                         if(x == arr[k].x && y == arr[k].y){
//                             // alert("xxxxxxxxx");
//                             // var marker1 = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));
//                             var label = new BMap.Label(arr[k].des,{offset:new BMap.Size(10,25)});
//                             arr[k].mark.setLabel(label);

//                             //map.addOverlay(arr[k].mark);
//                             return ;
//                         }
//                     }
//                 });
//                 marker.addEventListener("mouseout",function mouseLeave(e){
//                     var p = e.target;
//                     var x = p.getPosition().lng;
//                     var y = p.getPosition().lat;
//                     // alert(arr.length);
//                     for(var k = 0;k<arr.length;k++){
//                         if(x == arr[k].x && y == arr[k].y){
//                             // alert("xxxxxxxxx");
//                             // var marker1 = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));
//                             //var label = new BMap.Label(null,{offset:new BMap.Size(0,0)});
//                             var label =  arr[k].mark.getLabel();
//                             label.setContent("");//设置标签内容为空
//                             label.setStyle({borderWidth:"0px"});//设置标签边框宽度为0

//                             //map.addOverlay(arr[k].mark);
//                             return ;
//                         }
//                     }
//                 });


//                 marker.addEventListener("click",function showChart(e){
//                     // console.log(rootData);
//                     var p = e.target;
//                     var x = p.getPosition().lng;
//                     var y = p.getPosition().lat;
//                     // alert(arr.length);
//                     for(var k = 0;k<arr.length;k++){
//                         if(x == arr[k].x && y == arr[k].y){
                        
//                             X=arr[k].x;
//                             Y=arr[k].y;
//                             // console.log($scope.model.dataType);
//                             //指定图标的配置和数据
//                             var pDatas=[];
//                             var valueInfo=[];
//                             var dataInfo=[];
//                             var i,j;
//                             for (i=0;i<rootData.result.pointDataMores.length;i++){
//                                 if(X==rootData.result.pointDataMores[i].LongitudeAfter&&Y==rootData.result.pointDataMores[i].LatitudeAfter) break;
//                             };
//                             console.log(i);
//                             console.log(rootData.result.pointDataMores[i]);
//                         mapFocusService.showPoint(rootData.result.pointDataMores[i].PointDataId).then(function(data){
//                                 // console.log(rootData.result.pointDataMores[i]);
//                                 pDatas=data.result.Data;
                                
//                                 for(j=0;pDatas[j];j++){
//                                     var t=sift($scope.model.dataType,pDatas[j]);

//                                     dataInfo.push([pDatas[j].Depth,t]);
//                                     valueInfo.push([pDatas[j].Depth,t]);
//                                 };
                                
//                                 dataInfo=dataInfo.sort(sortDataByData);
//                                 valueInfo=valueInfo.sort(sortDataByValue);
//                                 var scale=(parseFloat(valueInfo[valueInfo.length-1][1])-parseFloat(valueInfo[0][1]))/8;
//                                 var Max=parseFloat(valueInfo[valueInfo.length-1][1])+parseFloat(scale)+0.5;
//                                 var Min=parseFloat(valueInfo[0][1])-parseFloat(scale)-1;
//                                 Max=Max.toFixed(0);
//                                 Min=Min.toFixed(0);
//                                 var depthList = dataInfo.map(function (item) {
//                                     // console.log(item);
//                                     return item[0];
//                                     });
//                                 var valueList = dataInfo.map(function (item) {
//                                     return item[1];
//                                     });
//                                 // console.log(dataInfo);
//                                 // console.log(valueInfo);
//                                 var option = {
//                                     // visualMap: {
//                                     //     show: true,
//                                     //     type: 'continuous',
//                                     //     seriesIndex: 0,
//                                     //     min: 0,
//                                     //     max: 400
//                                     // },
//                                     title:{
//                                         // text:$scope.model.dataType
//                                         // text:'数据统计'
//                                     },
//                                     tooltip:{
//                                         trigger: 'axis'
//                                     },
//                                     legend:{
//                                         data:[$scope.model.dataType]
//                                     },
//                                     xAxis:{
//                                         name:'水深',
//                                         data:depthList
//                                     },
//                                     yAxis:{
//                                         min:Min,
//                                         max:Max,
//                                         // type:'value',
//                                         name:$scope.model.dataType,
//                                         splitLine: {show: true},
//                                         splitNumber: 5 
//                                     },
//                                     series:[{
//                                         name:$scope.model.dataType,
//                                         type:'line',
//                                         showSymbol: true,
//                                         data:valueList
//                                     }]
//                                 };
//                             //初始化echarts实例
//                             var myChart = echarts.init(document.getElementById('chartmain'));

//                              //使用制定的配置项和数据显示图表
//                             myChart.setOption(option,true);
//                             $('#modal-chart').modal('show');
//                             $('#modal-chart').val("");


//                             });
                        
//                             // var marker1 = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));
//                             //var label = new BMap.Label(null,{offset:new BMap.Size(0,0)});
//                             return ;
//                         }
//                     }

//                 });


//         }
            
           
//             // alert(arr.length + "zzzzzzzzzzz");
            
//                var x = e.point.lng;
//                var y = e.point.lat;

//                //map.removeOverlay(LocationPonint);
//                // marker.dispose(); // 1.1 版本不需要这样调用
//                //   var oldMarker;


//                var marker = new BMap.Marker(new BMap.Point(x, y));
//               // var label = new BMap.Label("我是文字标注哦",{offset:new BMap.Size(20,-20)});
//              //  marker.setLabel(label);

//                map.addOverlay(marker);



//             map.enableScrollWheelZoom();  //使用鼠标可以滑动

//     };

//     $scope.update=function(){
//         // console.log(X,Y);
//         var pDatas=[];
//         var valueInfo=[];
//         var dataInfo=[];
//         console.log(rootData);
//         var i,j;
//         for (i=0;i<rootData.result.pointDataMores.length;i++){
//                 if(X==rootData.result.pointDataMores[i].LongitudeAfter&&Y==rootData.result.pointDataMores[i].LatitudeAfter) break;
//         };
//         console.log(rootData.result.pointDataMores[i]);
//         console.log(rootData.result.pointDataMores[i].PointDataId);
//         mapFocusService.showPoint(rootData.result.pointDataMores[i].PointDataId).then(function(data){
//             pDatas=data.result.Data;
                                
//             for(j=0;pDatas[j];j++){
//                 var t=sift($scope.model.dataType,pDatas[j]);

//                 dataInfo.push([pDatas[j].Depth,t]);
//                 valueInfo.push([pDatas[j].Depth,t]);
//             };
            
//             // console.log(dataInfo,valueInfo);
//             dataInfo=dataInfo.sort(sortDataByData);
//             valueInfo=valueInfo.sort(sortDataByValue);
//             var scale=(parseFloat(valueInfo[valueInfo.length-1][1])-parseFloat(valueInfo[0][1]))/8;
//             var Max=parseFloat(valueInfo[valueInfo.length-1][1])+parseFloat(scale)+0.5;
//             var Min=parseFloat(valueInfo[0][1])-parseFloat(scale)-1;
//             Max=Max.toFixed(0);
//             Min=Min.toFixed(0);
//             // console.log(dataInfo,valueInfo);
//             var depthList = dataInfo.map(function (item) {
//                                     // console.log(item);
//                 return item[0];
//             });
//             var valueList = dataInfo.map(function (item) {
//                 return item[1];
//             });
//                                 // console.log(dataInfo);
//                                 // console.log(valueInfo);
//             var option = {
//                                     // visualMap: {
//                                     //     show: true,
//                                     //     type: 'continuous',
//                                     //     seriesIndex: 0,
//                                     //     min: 0,
//                                     //     max: 400
//                                     // },
//                 title:{
//                                         // text:$scope.model.dataType
//                                         // text:'数据统计'
//                  },
//             tooltip:{
//                 trigger: 'axis'
//             },
//                 legend:{
//                     data:[$scope.model.dataType]
//             },
//             xAxis:{
//                     name:'水深',
//                     data:depthList
//             },
//             yAxis:{
//                 min:Min,
//                 max:Max,
//                                         // type:'value',
//                 name:$scope.model.dataType,
//                 splitLine: {show: true},
//                 splitNumber: 5 
//                 },
//             series:[{
//                     name:$scope.model.dataType,
//                     type:'line',
//                     showSymbol: true,
//                     data:valueList
//                 }]
//             };
//                             //初始化echarts实例
//             var myChart = echarts.init(document.getElementById('chartmain'));

//             //使用制定的配置项和数据显示图表
//             myChart.setOption(option,true);


//         });
//     };

//     var sift=function(string,data){
//         // console.log(data);
//         if(string=="水温") return data.Temperature;
//         else if(string=="饱和") return data.Saturation;
//         else if(string=="浊度") return data.Turbidity;
//         else if(string=="水深") return data.Depth;
//         else if(string=="Sal") return data.Sal;
//         else if(string=="ORP") return data.ORP;
//         else if(string=="Chla") return data.Chla;
//         else if(string=="DOmg") return data.DOmg;
//         else if(string=="ECuS") return data.ECuS;
//         else return data.pH;

//     }

//     var sortDataByData=function(a,b){
//         return a[0]-b[0];
//     }

//     var sortDatasetByData=function(a,b){
//         return a.Depth-b.Depth;
//     }

//     var sortDataByValue=function(a,b){
//         return a[1]-b[1];
//     }
//         // window.onload = Fun;
//         // if(!window.init){
//         // 	var script = document.createElement('script');
//         // 	script.type = 'text/javascript';
//         // 	script.src = ' http://api.map.baidu.com/getscript?v=2.0&ak=dgEHcP88uc8TNolGapL9ymupTSAtIeZg&services=&t=20180629105709'
//         // 	document.body.appendChild(script);
//         // }
//         $scope.showAll=function(){
//             // console.log(rootData);
//             var i,j;
//             var pDatas=[];
//             for (i=0;i<rootData.result.pointDataMores.length;i++){
//                 if(X==rootData.result.pointDataMores[i].LongitudeAfter&&Y==rootData.result.pointDataMores[i].LatitudeAfter) break;
//             };
//             var id=rootData.result.pointDataMores[i].PointDataId;
//             console.log(id);
//             mapFocusService.showPoint(rootData.result.pointDataMores[i].PointDataId).then(function(data){
//                 pDatas=data.result.Data;
//                 pDatas.sort(sortDatasetByData);
//                 // console.log(pDatas);
//                 var depthList = pDatas.map(function (item) {
//                     // console.log(item.Depth);
//                     return item.Depth;
//                 });
//                 var valueListPH = pDatas.map(function (item) {
//                     // console.log(item.pH);
//                     return item.pH;
//                 });
//                 var valueListChla = pDatas.map(function (item) {
//                     // console.log(item.Chla);
//                     return item.Chla;
//                 });
//                 var valueListDomg = pDatas.map(function (item) {
//                     // console.log(item.DOmg);
//                     return item.DOmg;
//                 });
//                 var valueListT = pDatas.map(function (item) {
//                     // console.log(item.Temperature);
//                     return item.Temperature;
//                 });
//                 var valueListTub = pDatas.map(function (item) {
//                     return item.Turbidity;
//                 });
//                 var valueListS = pDatas.map(function (item) {
//                     return item.Saturation;
//                 });
//                 var valueListECus = pDatas.map(function (item) {
//                     return item.ECuS;
//                 });
//                 var valueListORP = pDatas.map(function (item) {
//                     return item.ORP;
//                 });
//                 var valueListSal = pDatas.map(function (item) {
//                     return item.Sal;
//                 });
//                 // console.log($scope.DataTypes);
//                 var allOption = {
//                                     // visualMap: {
//                                     //     show: true,
//                                     //     type: 'continuous',
//                                     //     seriesIndex: 0,
//                                     //     min: 0,
//                                     //     max: 400
//                                     // },
//                         title:{
//                                         // text:$scope.model.dataType
//                                         // text:'数据统计'
//                         },
//                         tooltip:{
//                             trigger: 'axis'
//                         },
//                         legend:{
//                             data:$scope.DataTypes
//                         },
//                         xAxis:{
//                             name:'水深',
//                             data:depthList
//                         },
//                         yAxis:{
//                             min:0,
//                             max:500,
//                                         type:'value',
//                             name:'数据',
//                             splitLine: {show: true},
//                             splitNumber: 8 
//                         },
//                         series:[{
//                                 name:$scope.DataTypes[0],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListPH
//                             },{
//                                 name:$scope.DataTypes[1],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListS
//                             },{
//                                 name:$scope.DataTypes[2],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListECus
//                             },{
//                                 name:$scope.DataTypes[3],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListSal
//                             },{
//                                 name:$scope.DataTypes[4],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListTub
//                             },{
//                                 name:$scope.DataTypes[5],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListORP
//                             },{
//                                 name:$scope.DataTypes[6],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListT
//                             },{
//                                 name:$scope.DataTypes[7],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListChla
//                             },{
//                                 name:$scope.DataTypes[8],
//                                 type:'line',
//                                 showSymbol: true,
//                                 data:valueListDomg
//                             }]
//                     };
//                             //初始化echarts实例
//             var myChart = echarts.init(document.getElementById('chartmain'));

//             //使用制定的配置项和数据显示图表
//             myChart.setOption(allOption,true);
//             });
//         }
       
// });

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



// app.controller('materialController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
//     $scope.filter = {};
//     $scope.table = {};
//     $scope.form = {};

//     // 查询视图
//     dataViewService.getQueryViewByCode('Material').then(function (data) {
//         $scope.$queryView = data;

//         $scope.table.init({
//             queryView: $scope.$queryView,
//             filter: $scope.filter,
//             form: $scope.form,

//         });
//     })

//     // 表单视图
//     dataViewService.getFormViewByCode('MaterialEdit').then(function (editView) {
       
//             $scope.form.init({
                
//                 editView: editView,
//                 table: $scope.table
//             });
//         })
    
// })


app.controller('modifyController',function($scope,$rootScope,$state,$cookies,$timeout,Restangular, modifyPasswordService){
	$scope.Updatapassword = {
		UserName:$rootScope.identity.result.User.UserName,
        OldPassword: null,
        NewPassword: null,
        rNewPassword:null
    }
	$scope.modifyPassword =function (){
		
		if(!($scope.Updatapassword.OldPassword&&$scope.Updatapassword.NewPassword&&$scope.Updatapassword.rNewPassword)){
			// alert("不能为空！");
			swal( '不能为空！');
		}		
		else if($scope.Updatapassword.NewPassword!=$scope.Updatapassword.rNewPassword){
			// alert("两次密码不一致！");
			swal('两次密码不一致！');
		}
		else if ($scope.Updatapassword.NewPassword==$scope.Updatapassword.rNewPassword){   
			
			modifyPasswordService.modify($scope.Updatapassword).then(function (data){
            	// console.log(data);
            	// 
            	var code = data.code;

            	if(code == 400){
            		swal('当前密码不正确!');
            	}else if(code == 200){

            		 swal(
            		 	{
            		 		title: '修改成功!',
            		 		//showCancelButton:"true",
        	                showConfirmButton:"true",
        	                confirmButtonText:"OK",
        	                //closeOnConfirm: false
            		 		//timer:  '1000',
            		 		//closeOnConfirm:'true'
            		 		//
            		 		//
            		 		//
            		 	// },function(isConfirm) {          //语法错误
                //              //alert(11);
                //              if(isConfirm){
                //              	swal(111);
                //              	$timeout($scope.back,1000);
                //          }
            		 	}).then(function(isConfirm){        
    		 	                $state.go('views.login');
    		 	                //$timeout($scope.back,1000);
            		 
            		    });
            		 // $timeout($scope.back,1000);
            		  // setInterval(back,3000);s
            		  //setTimeout("$scope.back()",500);
            		  //$scope.back(); 
            	}         
            });
		}
	}
   // $scope.back = function () {

   //       $rootScope.identity = null;
   //       $cookies.remove('identity');
   //       $state.go('views.login');   
   //  };
})


app.controller('myProjectController', function ($scope, $rootScope, $state, mumberManagerService, NgTableParams, viewColumnService, parameterService,$filter, myProjectService, companyManagerService) {
	var isModify=0;
	var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);
    parameterService.Parameterquery().then(function (data) {
        $rootScope.Parameters=data.result;
        //$scope.query("水深");
        //console.log($rootScope.Parameters);
    })
    companyManagerService.query().then(function (data) {
        //console.log("data",data.result);


        $scope.Companys =data;
        //console.log($scope.roleType);
    })
    $scope.filter = {};
    $scope.filterItem = {};
    $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        getData: function (params) {
            return myProjectService.query(params, $scope.filter);
        }
    });

    mumberManagerService.query().then(function (data) {
        //console.log(data);
        $scope.userList = data;
        //console.log($scope.userList);
    })

    // $scope.queryNameById= function(paraId){
    //     var i;
    //     //console.log(paraId);
    //     for (i=0;$scope.userList[i];i++){
    //         //console.log($scope.userList[i].user.UserId);
    //         if ($scope.userList[i].user.UserId==paraId){
    //             //console.log($scope.userList[i].user.Name);
    //             return $scope.userList[i].user.Name;
    //         }
    //     }
    // }

    $scope.edit= function (data) {
    	//console.log(data);
    	if (!data){
            var day = new Date();
            day.setTime(day.getTime());
            var s = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
    		$scope.model = newEntity;
            $scope.model.StartTime=$scope.model.EndTime=new Date(s);
    		isModify=0;
            $('#modal-edit1').val("");
    		$('#modal-edit1').modal('show');

    	}else{
            $scope.model = angular.copy(data);
            $scope.model.project=data.ProjectName;
            $scope.model.ProjectId=data.ProjectId;
            $scope.model.ProjectCode=data.ProjectCode;
            $scope.model.leader=data.UserId;

            var stime=$filter('limitTo')(data.StartTime,10);
            $scope.model.StartTime=new Date(stime);
            var etime=$filter('limitTo')(data.EndTime,10);
            $scope.model.EndTime=new Date(etime);
            //console.log(etime);
    		isModify=1;
            $('#modal-edit2').val("");
    		$('#modal-edit2').modal('show');

    	};
    	
    };

    $scope.info= function(data){
        //console.log(data);
        $scope.model = newEntity;
        $('#modal-edit3').val("");
        var stime=$filter('limitTo')(data.StartTime,10);
        $scope.model.StartTimeS=stime;
        var etime=$filter('limitTo')(data.EndTime,10);
        $scope.model.EndTimeS=etime;
        $scope.model.project=data.ProjectName;
        $scope.model.ProjectCode=data.ProjectCode;
        $scope.model.leader=data.UserName;
        $scope.model.company=data.CompanyName;
        $scope.model.description=data.Description;
        $('#modal-edit3').modal('show');
    }

    $scope.save= function (data){
        //console.log(data);
    	if(!isModify){
            var now = new Date();
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日
            var hh = now.getHours();            //时
            var mm = now.getMinutes();          //分
            var ss = now.getSeconds();           //秒
            var projectCode = year;
            if(month < 10)
                projectCode += "0";
            projectCode += month;
        
            if(day < 10)
                projectCode += "0";
            
            projectCode += day;
        
            if(hh < 10)
                projectCode += "0";
            
            projectCode += hh;
            if (mm < 10) projectCode += '0'; 
            projectCode += mm; 
            if (ss < 10) projectCode += '0'; 
            projectCode += ss; 
		//console.log( $("#ECuScolorS").spectrum("get").toRgbString());
        // $scope.binding();
        var hasSon=0;
        if($scope.model.HasSon){
            hasSon=1;
        }else{
            hasSon=0;
        };

            if ($scope.model.project!=null&&$scope.model.CompanyId!=null&&$scope.model.leader!=null){
                var Param1={
                    'ProjectCode':projectCode,
                    'ProjectName':$scope.model.project,
                    'CompanyId':$scope.model.CompanyId,//$scope.model.CompanyId,
                    'UserId':$scope.model.leader,
                    'StartTime':$filter('date')($scope.model.StartTime, 'yyyy-MM-dd'),
                    'EndTime':$filter('date')($scope.model.EndTime, 'yyyy-MM-dd'),
                    'version':"1",//$scope.model.version,
                    'HasSon' :hasSon,
                    'description' :$scope.model.description,
                    'FatherId':"",//$scope.model.FatherId,
                    'ColorList':[
                        {
                            'ParamDictionaryId':$scope.query("水深"),
                            'BeginColor':"128,255,255",
                            'EndColor':"0,0,255"
                        },
                        {
                            'ParamDictionaryId':$scope.query("水温"),
                            'BeginColor':"0,128,255",
                            'EndColor':"255,0,0"
                        },
                        {
                            'ParamDictionaryId':$scope.query("ECuS"),
                            'BeginColor':"0,0,0",
                            'EndColor':"255,0,255"
                        },
                        {
                            'ParamDictionaryId':$scope.query("DOmg"),
                            'BeginColor':"0,0,0",
                            'EndColor':"255,0,255"
                        },
                        {
                            'ParamDictionaryId':$scope.query("Sal"),
                            'BeginColor':"255,255,255",
                            'EndColor':"128,0,255"
                        },
                        {
                            'ParamDictionaryId':$scope.query("pH"),
                            'BeginColor':"0,0,255",
                            'EndColor':"255,0,0"
                        },
                        {
                            'ParamDictionaryId':$scope.query("ORP"),
                            'BeginColor':"0,0,0",
                            'EndColor':"255,0,255"
                        },
                        {
                            'ParamDictionaryId':$scope.query("Chla"),
                            'BeginColor':"0,0,0",
                            'EndColor':"255,0,255"
                        },
                        {
                            'ParamDictionaryId':$scope.query("浊度"),
                            'BeginColor':"0,0,0",
                            'EndColor':"128,255,255"
                        },
                        {
                            'ParamDictionaryId':$scope.query("饱和"),
                            'BeginColor':"255,128,0",
                            'EndColor':"255,255,128"
                        }
                    ]
                }
                //console.log(Param1);
                myProjectService.add(Param1).then(function (data) {
                    //console.log(data);
                    $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.editForm.$setPristine();
                    $('#modal-edit1').modal('hide');
                    $('#modal-edit1').val("");
                });
            }else {
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

    	}else{
            
            // $scope.binding();
    		var Param2={
    			'ProjectId':$scope.model.ProjectId,
    			'ProjectCode':$scope.model.ProjectCode,
      			'ProjectName':$scope.model.project,
      			'CompanyId':$scope.model.CompanyId,//$scope.model.CompanyId,
      			'UserId':$scope.model.leader,
      			'StartTime':$filter('date')($scope.model.StartTime, 'yyyy-MM-dd'),
      			'EndTime':$filter('date')($scope.model.EndTime, 'yyyy-MM-dd'),
      			'FatherId':"dbb259f6-4d78-4bc5-94ce-d85fe3bdb78e",//$scope.model.FatherId,
                'ColorList':[
                    {
                        'ParamDictionaryId':$scope.query("水深"),
                        'BeginColor':$scope.model.deepthcolorS,
                        'EndColor':$scope.model.deepthcolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("水温"),
                        'BeginColor':$scope.model.temperaturecolorS,
                        'EndColor':$scope.model.temperaturecolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("ECuS"),
                        'BeginColor':$scope.model.ECuScolorS,
                        'EndColor':$scope.model.ECuScolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("DOmg"),
                        'BeginColor':$scope.model.DOmgcolorS,
                        'EndColor':$scope.model.DOmgcolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("Sal"),
                        'BeginColor':$scope.model.SalcolorS,
                        'EndColor':$scope.model.SalcolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("pH"),
                        'BeginColor':$scope.model.pHcolorS,
                        'EndColor':$scope.model.pHcolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("ORP"),
                        'BeginColor':$scope.model.ORPcolorS,
                        'EndColor':$scope.model.ORPcolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("Chla"),
                        'BeginColor':$scope.model.ChlacolorS,
                        'EndColor':$scope.model.ChlacolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("浊度"),
                        'BeginColor':$scope.model.turbiditycolorS,
                        'EndColor':$scope.model.turbiditycolorE
                    },
                    {
                        'ParamDictionaryId':$scope.query("饱和"),
                        'BeginColor':$scope.model.saturatedcolorS,
                        'EndColor':$scope.model.saturatedcolorE
                    }
                ]
            }
            //console.log(Param2);
            myProjectService.update(Param2).then(function (data) {
            	//console.log(data);
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit2').modal('hide');
                $('#modal-edit2').val("");
            
    		});
    	};


    };

    $scope.remove= function(data){
    	if (confirm('确定要删除 ' + data.ProjectName + ' 吗？')) {
            myProjectService.remove(data.ProjectId).then(function (data) {
            	//console.log(data);
                Swal({
                title: '删除成功！',
                type: 'success',
                confirmButtonText: '确定'
            })
                $scope.tableParams.reload();
            });
        }
    };

    $scope.query= function(paraname){
    	var i;
		for (i=0;i<$rootScope.Parameters.length;i++){
			if ($rootScope.Parameters[i].ParamName==paraname){
				//console.log($rootScope.Parameters[i].ParamName);
                //console.log($rootScope.Parameters[i].ParamDictionaryId);
				return $rootScope.Parameters[i].ParamDictionaryId;
			}
		}
    }

  //   $scope.binding=function () {
		// $scope.model.deepthcolorS=$("#deepthcolorS").spectrum("get").toRgbString();
  //       $scope.model.deepthcolorE=$("#deepthcolorE").spectrum("get").toRgbString();
  //       $scope.model.ORPcolorS=$("#ORPcolorS").spectrum("get").toRgbString();
  //       $scope.model.ORPcolorE=$("#ORPcolorE").spectrum("get").toRgbString();
  //       $scope.model.ECuScolorS=$("#ECuScolorS").spectrum("get").toRgbString();
  //       $scope.model.ECuScolorE=$("#ECuScolorE").spectrum("get").toRgbString();
  //       $scope.model.DOmgcolorS=$("#DOmgcolorS").spectrum("get").toRgbString();
  //       $scope.model.DOmgcolorE=$("#DOmgcolorE").spectrum("get").toRgbString();
  //       $scope.model.SalcolorS=$("#SalcolorS").spectrum("get").toRgbString();
  //       $scope.model.SalcolorE=$("#SalcolorE").spectrum("get").toRgbString();
  //       $scope.model.pHcolorS=$("#pHcolorS").spectrum("get").toRgbString();
  //       $scope.model.pHcolorE=$("#pHcolorE").spectrum("get").toRgbString();
  //       $scope.model.ChlacolorS=$("#ChlacolorS").spectrum("get").toRgbString();
  //       $scope.model.ChlacolorE=$("#ChlacolorE").spectrum("get").toRgbString();
  //       $scope.model.turbiditycolorS=$("#turbiditycolorS").spectrum("get").toRgbString();
  //       $scope.model.turbiditycolorE=$("#turbiditycolorE").spectrum("get").toRgbString();
  //       $scope.model.temperaturecolorS=$("#temperaturecolorS").spectrum("get").toRgbString();
  //       $scope.model.temperaturecolorE=$("#temperaturecolorE").spectrum("get").toRgbString();
  //       $scope.model.saturatedcolorS=$("#saturatedcolorS").spectrum("get").toRgbString();
  //       $scope.model.saturatedcolorE=$("#saturatedcolorE").spectrum("get").toRgbString();
  //   }
//     $("#deepthcolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(128, 255, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]

//     });
//     $("#deepthcolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });

//     $("#deepthcolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(128, 255, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]

//     });
//     $("#deepthcolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });

//     $("#ORPcolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ORPcolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ORPcolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ORPcolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ECuScolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ECuScolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ECuScolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ECuScolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#DOmgcolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#DOmgcolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#DOmgcolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#DOmgcolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#SalcolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 255, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#SalcolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(128, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#SalcolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 255, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#SalcolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(128, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#pHcolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#pHcolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#pHcolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#pHcolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ChlacolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ChlacolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//      $("#ChlacolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#ChlacolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#turbiditycolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#turbiditycolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(128, 255, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#turbiditycolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#turbiditycolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(128, 255, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#saturatedcolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 128, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#saturatedcolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 255, 128);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#saturatedcolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 128, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#saturatedcolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 255, 128);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#temperaturecolorS").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 128, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#temperaturecolorE").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#temperaturecolorS1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(0, 128, 255);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
//     $("#temperaturecolorE1").spectrum({
//         showPaletteOnly: true,
//         showPalette:true,
//         hideAfterPaletteSelect:true,
//         color: 'rgb(255, 0, 0);',
//         palette: [
//             ['rgb(0, 0, 0);', 'rgb(0, 0, 127.5);', 'rgb(0, 127.5, 0);', 'rgb(0, 255, 0);',
//                 'rgb(0, 255, 127.5);'],
//             ['rgb(0, 0, 255);', 'rgb(127.5, 0, 255);', 'rgb(0, 127.5, 255);', 'rgb(0, 255, 255);',
//                 'rgb(127.5, 255, 255);'],
//             ['rgb(255, 0, 255);', 'rgb(255, 0, 127.5);', 'rgb(255, 127.5, 255);', 'rgb(255, 255, 255);',
//                 'rgb(255, 255, 127.5);'],
//             ['rgb(255, 0, 0);', 'rgb(127.5, 0, 0);', 'rgb(255, 127.5, 0);', 'rgb(255, 255, 0);',
//                 'rgb(127.5, 255, 0);']
//         ]
//     });
});

app.controller('plant2Controller', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    $scope.dockTable = {};
    $scope.dockForm = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Plant').then(function (data) {
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
            }, {
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
                    $scope.table.remove(item);
                }
            },]
        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('PlantEdit').then(function (data) {
        $scope.form.init({
            editView: data,
            table: $scope.table,
            onValidate: function (model) {
                if (model.Name.indexOf('测试') < 0) {
                    $scope.alert('名称必须包含测试');
                    return false;
                }
            }
        });
    })

    // 道口查询视图
    dataViewService.getQueryViewByCode('Dock').then(function (data) {
        $scope.$queryView = data;

        $scope.dockTable.init({
            queryView: $scope.$queryView,
            form: $scope.dockForm
        });
    })

    // 道口表单视图
    dataViewService.getFormViewByCode('DockEdit').then(function (data) {
        $scope.dockForm.init({
            editView: data,
            table: $scope.dockTable
        });
    })
});

app.controller('plantController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Plant').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,
            commands: [{
                title: '编辑',
                css: 'btn-primary',
                icon: 'fa-edit',
                onClick: function (item) {
                    $scope.form.edit(item);
                }
            } ]
        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('PlantEdit').then(function (data) {
        $scope.form.init({
            editView: data,
            table: $scope.table
        });
    })

})
app.controller('pmHomeController', function ($scope, $rootScope, $state, $stateParams, myProjectService, NgTableParams, $filter) {
    var mycProject=0;
    var otherProject=0;
    var params;
    $scope.classification=function () {
        myProjectService.query(params, $scope.filter).then(function (data) {
            //console.log(data.length);
            for(i=0;i<data.length;i++){
                // console.log(data[i].role.RoleCode);
                if (data[i].UserName==$rootScope.identity.result.User.Name){
                    mycProject++;
                }else {
                    otherProject++;
                }
            };
            $scope.mycProject=mycProject;
            $scope.otherProject=otherProject;
            $scope.init();
            // console.log(mycProject);
            // console.log( otherProject);
        });

    };
    $scope.classification();
    // console.log(projectManager);
    //  console.log(custom);
    $scope.init=function () {
        mycProject=$scope.mycProject;
        otherProject= $scope.otherProject;
        // console.log($scope.projectManager);
        //  console.log($scope.custom);

        app.title = '项目统计图';

        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['我负责的项目','系统内其他项目']
            },
            series: [
                {
                    name:'',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value: mycProject, name:'我负责的项目'},
                        {value:otherProject, name:'系统内其他项目'}
                    ]
                }
            ]
        };
        //初始化echarts实例
        var myChart = echarts.init(document.getElementById('chartmain'));

        //使用制定的配置项和数据显示图表
        myChart.setOption(option,true);
        myChart.on('click', function (params) {
            // 控制台打印数据的名称
            console.log(params.name);
            $state.go('app.system.myProject');
        });
    }
});
app.controller('resetMapPotController', function ($scope, $rootScope, $state, $stateParams,showDataService, NgTableParams, userProjectService, $filter, mapFocusService) {
	var DataSetId=$stateParams.DataSetId;
    var locations = [];
    $scope.model={};
    var X,Y;
    var rootData={};
    var valueList=[];
    var valueForEchart={};
   
    $scope.query=function (data) {
        // locations = [];
        showDataService.getData(DataSetId).then(function (data) {
            // console.log("1111111");
            rootData=data;
            // console.log(rootData);
            var i;
            for (i=0;i<data.result.pointDataMores.length;i++){
                // var Des="经度："+data.result.pointDataMores[i].LongitudeAfter+"纬度:"+data.result.pointDataMores[i].LatitudeAfter;
                var Des = i+1;
                var location={
                    "PointDataId":data.result.pointDataMores[i].PointDataId,
                    "LongitudeAfter":data.result.pointDataMores[i].LongitudeAfter,
                    "LatitudeAfter":data.result.pointDataMores[i].LatitudeAfter,
                    "des":Des
                };
                locations.push(location);
            }
            $scope.init();
        });
        //console.log(1);
    };

    console.log(locations);
    var arr = new Array();
    function locationIndex(){}
    var i = 0;

     $scope.getLocation=function () {
         var Location=[];
         var i;
         // for (i=0;)
     };

	$scope.init = function () {
        var map = new BMap.Map("container");
        map.centerAndZoom(new BMap.Point(locations[0].LongitudeAfter, locations[0].LatitudeAfter), 18);//116.404, 39.915
       
        //去除路网,建筑为物
         map.setMapStyle({
                  styleJson:[
                    {
                              "featureType": "road",
                              "elementType": "all",
                              "stylers": {
                                        "color": "#ffffff",
                                        "visibility": "off"
                              }
                    },
                    {
                              "featureType": "building",
                              "elementType": "all",
                              "stylers": {
                                        "visibility": "off"
                              }
                    },
                    {
                              "featureType": "poilabel",
                              "elementType": "all",
                              "stylers": {
                                        "visibility": "off"
                              }
                    },
                    {
                              "featureType": "manmade",
                              "elementType": "all",
                              "stylers": {
                                        "visibility": "on"
                              }
                    },
              ]
          });

       
        var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
        map.addControl(top_right_navigation); 
         //console.log(L);
        for(L in locations){
            var marker = new BMap.Marker(new BMap.Point(locations[L].LongitudeAfter, locations[L].LatitudeAfter));//创建图标
            var Lo = new locationIndex();
            Lo.mark = marker;
            Lo.x = locations[L].LongitudeAfter;
            Lo.y = locations[L].LatitudeAfter;
            Lo.des = locations[L].des;
            arr[i++] = Lo;
            map.addOverlay(marker);
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            marker.enableDragging(); 
            marker.addEventListener("mouseover",function mousing(e){
            var p = e.target;
            var x = p.getPosition().lng;
            var y = p.getPosition().lat;
            for(var k = 0;k<arr.length;k++){
            if(x == arr[k].x && y == arr[k].y){
                var label = new BMap.Label(arr[k].des,{offset:new BMap.Size(10,25)});
                            arr[k].mark.setLabel(label);

                            //map.addOverlay(arr[k].mark);
                            return ;
                        }
                    }
            });
            marker.addEventListener("mouseout",function mouseLeave(e){
                    var p = e.target;
                    var x = p.getPosition().lng;
                    var y = p.getPosition().lat;
                    // alert(arr.length);
                    for(var k = 0;k<arr.length;k++){
                        if(x == arr[k].x && y == arr[k].y){
                            // alert("xxxxxxxxx");
                            // var marker1 = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));
                            //var label = new BMap.Label(null,{offset:new BMap.Size(0,0)});
                            var label =  arr[k].mark.getLabel();
                            label.setContent("");//设置标签内容为空
                            label.setStyle({borderWidth:"0px"});//设置标签边框宽度为0

                            //map.addOverlay(arr[k].mark);
                            return ;
                        }
                    }
            });
            marker.addEventListener("dragend", function (e) {
                console.log(e.currentTarget.Bc.innerText);
                var x = e.point.lng; //经度
                var y = e.point.lat; //纬度
                // alert("拖到的地点的经纬度：" + x + "，" + y);
                console.log(locations);
                for (var i = 0; i < locations.length; i++) {
                    if(locations[i].des == e.currentTarget.Bc.innerText){
                        locations[i].LongitudeAfter =e.point.lng;
                        locations[i].LatitudeAfter = e.point.lat;
                    } 
                }

                showDataService.updateLocation(locations).then(function (data) { 
                    swal("操作成功");
                })
            });
            console.log(locations);
        }
     	map.enableScrollWheelZoom();
 	};
    
    $scope.savePot = function(){
        $state.go('app.system.dataManage');
    }

	$scope.query();
});

app.controller('routeController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Route').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('RouteEdit').then(function (editView) {
        dataViewService.getFormViewByCode('RouteNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table
            });
        })
    })
})


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


app.controller('stockController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Stock').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('StockEdit').then(function (editView) {

        $scope.form.init({

            editView: editView,
            table: $scope.table
        });
    })

})


app.controller('storeAreaController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('StoreArea').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,
            
        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('StoreAreaEdit').then(function (editView) {
        dataViewService.getFormViewByCode('StoreAreaNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table
            });
        })
    })
})



app.controller('supplierController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('Supplier').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('SupplierEdit').then(function (editView) {
       
            $scope.form.init({
               
                editView: editView,
                table: $scope.table
            });
        })
   
})


app.controller('SupplierRespondTimeController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService, appService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};


    // 查询视图
    dataViewService.getQueryViewByCode('SupplierRespondTime').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('SupplierRespondTimeEdit').then(function (editView) {
        dataViewService.getFormViewByCode('SupplierRespondTimeNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table
            });
        })
    })

    
});


app.controller('supplierStoreAreaController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('SupplierStoreArea').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('SupplierStoreAreaEdit').then(function (editView) {
        dataViewService.getFormViewByCode('SupplierStoreAreaNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table
            });
        })
    })
})


app.controller('userManagerController', function ($scope, $rootScope, $state, NgTableParams, mumberManagerService, viewColumnService, roleService, enumService) {
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
            return mumberManagerService.query(params, $scope.filter);
        }
    });

    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    $scope.edit = function (data) {
        //console.log(data);
        if (!data) {
            $scope.model = newEntity;
            $scope.model.RoleType=$scope.roleType[1].RoleId;
            isModify=0;
            $('#modal-edit1').modal('show');
            $('#modal-edit1').val("");
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

        if (!isModify) {

            if ($scope.model.UserName!=null&&$scope.model.Name!=null&&$scope.model.Phone!=null){
                var Param={
                    'UserName':$scope.model.UserName,
                    'Name':$scope.model.Name,
                    'Phone':$scope.model.Phone,
                    'Email': $scope.model.Email,
                    'RoleId':$scope.model.RoleType
                }
                mumberManagerService.add(Param).then(function (data) {
                    $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.editForm.$setPristine();
                    $('#modal-edit1').modal('hide');
                    $('#modal-edit1').val("");
                });
            }else {
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


        } else {
            var Param={
                'UserId':$scope.model.user.UserId,
                'Name':$scope.model.Name,
                'Phone':$scope.model.Phone,
                'Email': $scope.model.Email,
                'RoleId':$scope.model.RoleType
            }
            //console.log(Param);
            mumberManagerService.update(Param).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit2').modal('hide');
                $('#modal-edit2').val("");
            });
        }
    }

     $scope.remove = function (data) {
        //console.log(data);
        if (confirm('确定要删除 ' + data.user.Name + ' 吗？')) {
            mumberManagerService.remove(data.user.UserId).then(function (data) {
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
                mumberManagerService.reset(data.user.UserId).then(function(data){
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
        //     mumberManagerService.reset(data.user.UserId).then(function(data){
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
                mumberManagerService.freeze(data.user.UserId).then(function(data){
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
        //     mumberManagerService.freeze(data.user.UserId).then(function(data){
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

app.controller('watchProjectController', function ($scope, $rootScope, parameterService, mumberManagerService, $state, NgTableParams, $filter, watchProjectService, myProjectService,companyManagerService) {
	var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);
    var group=[];
    var subgroup=[];
    var userData={};
    var projectname="";
    var projectid="";
    parameterService.Parameterquery().then(function (data) {
        $rootScope.Parameters=data.result;
    })
    companyManagerService.query().then(function (data) {
         //console.log("data",data.result);
        $scope.Companys =data;
        console.log($scope.Companys);
    })
    $scope.matchId=function (companyName) {
        var i;
        for (i=0;i<$scope.Companys.length;i++){
            if (companyName==$scope.Companys[i].CompanyName)return $scope.Companys[i].CompanyId;
        }
    }
	$scope.filter = {};
    $scope.filterItem = {};
    $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        getData: function (params) {
            return watchProjectService.query(params, $scope.filter,$rootScope.identity.result.User.UserId);
        }
    });

    mumberManagerService.query().then(function (data) {
        $scope.userList = data;
    });

    $scope.query= function(paraname){
    	var i;
		for (i=0;i<$rootScope.Parameters.length;i++){
			if ($rootScope.Parameters[i].ParamName==paraname){
				//console.log($rootScope.Parameters[i].ParamName);
                //console.log($rootScope.Parameters[i].ParamDictionaryId);
				return $rootScope.Parameters[i].ParamDictionaryId;
			}
		}
    }


    var fatherId=0;
    $scope.edit= function(data){
        $scope.model = newEntity;
        if(!data){
            fatherId=userData.ProjectId;
            $scope.model.CompanyId=$scope.fatherCompanyId;
            var stime=$filter('limitTo')(userData.StartTime,10);
            $scope.model.StartTime=new Date(stime);
            var etime=$filter('limitTo')(userData.EndTime,10);
            $scope.model.EndTime=new Date(etime);
        // }else{
        //     fatherId=data.ProjectId;
        //     var stime=$filter('limitTo')(data.StartTime,10);
        //     $scope.model.StartTime=new Date(stime);
        //     var etime=$filter('limitTo')(data.EndTime,10);
        //     $scope.model.EndTime=new Date(etime);
        $scope.SubParams.reload();
        }
    	
    	$scope.SubParams.reload();
        $('#modal-subEdit').modal('show');
        $('#modal-subEdit').val("");
    }

    $scope.add= function(){
    	var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss = now.getSeconds();           //秒
        var projectCode = year;
        if(month < 10)
            projectCode += "0";
        projectCode += month;
        
        if(day < 10)
            projectCode += "0";
            
        projectCode += day;
        
        if(hh < 10)
            projectCode += "0";
            
        projectCode += hh;
        if (mm < 10) projectCode += '0'; 
        projectCode += mm; 
        if (ss < 10) projectCode += '0'; 
        projectCode += ss;
        if ($scope.model.project!=null&&$scope.model.leader!=null){
            var Param={
                'ProjectCode':projectCode,
                'ProjectName':$scope.model.project,
                'CompanyId':$scope.model.CompanyId,//$scope.model.CompanyId,
                'UserId':$scope.model.leader,
                'StartTime':$filter('date')($scope.model.StartTime, 'yyyy-MM-dd'),
                'EndTime':$filter('date')($scope.model.EndTime, 'yyyy-MM-dd'),
                'version':"1",//$scope.model.version,
                'HasSon' :"0",
                'description' :$scope.model.description,
                'FatherId':fatherId,
                'ColorList':[
                    {
                        'ParamDictionaryId':$scope.query("水深"),
                        'BeginColor':"128,255,255",
                        'EndColor':"0,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("水温"),
                        'BeginColor':"0,128,255",
                        'EndColor':"255,0,0"
                    },
                    {
                        'ParamDictionaryId':$scope.query("ECuS"),
                        'BeginColor':"0,0,0",
                        'EndColor':"255,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("DOmg"),
                        'BeginColor':"0,0,0",
                        'EndColor':"255,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("Sal"),
                        'BeginColor':"255,255,255",
                        'EndColor':"128,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("pH"),
                        'BeginColor':"0,0,255",
                        'EndColor':"255,0,0"
                    },
                    {
                        'ParamDictionaryId':$scope.query("ORP"),
                        'BeginColor':"0,0,0",
                        'EndColor':"255,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("Chla"),
                        'BeginColor':"0,0,0",
                        'EndColor':"255,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("浊度"),
                        'BeginColor':"0,0,0",
                        'EndColor':"128,255,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("饱和"),
                        'BeginColor':"255,128,0",
                        'EndColor':"255,255,128"
                    }
                ]
            }
            myProjectService.add(Param).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-subEdit').modal('hide');
                $('#modal-subEdit').val("");
            });
            //var param;var filter;
            var a=$scope.sub_pro_datas[length-1];
            var b=$scope.model.ProjectId;
            // for(var i=0;i<$scope.sub_pro_datas.length;i++){
            //     if($scope.sub_pro_datas[i].ProjectId==x.ProjectId)
            //     {
            //           a=i;
            //           break;
            //     }
            // }
            watchProjectService.queryProject($scope.ProjectsManager).then(function(tempData){
                var dataArray=tempData.result.Data;
                console.log(dataArray.length);
                for(var i=0;i<dataArray.length;i++){
                    if(dataArray[i].ProjectName==projectname) $scope.sub_pro_datas=dataArray[i].SubProjects;
                }
                // console.log($scope.sub_pro_datas);
                $scope.SubParams = new NgTableParams({

                    page: 1,
                    count: 10,
                    // total: $scope.sub_pro_datas.length,
                },{
                    // $scope.sub_pro_datas.splice(a,0,Param);
                    // myProjectService.queryProject(param,filter,$scope.ProjectName).then(function (data) {
                    //     console.log("..",data);
                    //     $scope.sub_pro_datas = data.SubProjects;
                    //
                    //     $scope.SubParams = new NgTableParams({
                    //
                    //         page: 1,
                    //         count: 10,
                    //         // total: $scope.sub_pro_datas.length,
                    //     },{
                    //
                    //         counts:[10,25,50,100],
                    //         dataset: $scope.sub_pro_datas
                    //     });
                    //
                    //     $scope.ProjectsManager=data.UserId;
                    // });

                    counts:[10,25,50,100],
                    dataset: $scope.sub_pro_datas
                });
            });
            $scope.SubParams.reload();
        }else {
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
    
    
    
    $scope.sub_pro_datas = [];
    $scope.inquiry= function(data){
        // console.log(data.SubProjects.length);
        userData={};
        userData=data;
    	$scope.sub_pro_datas = data.SubProjects;
         //console.log("项目",data);
    	$scope.ProjectName=data.ProjectName;
         $scope.SubParams = new NgTableParams({

            page: 1,
            count: 10,
            // total: $scope.sub_pro_datas.length,
           },{
            
            counts:[10,25,50,100],
            dataset: $scope.sub_pro_datas
        });

    		 $scope.ProjectsManager=data.UserId;
             projectname=data.ProjectName;
            $scope.fatherCompanyId=$scope.matchId(data.CompanyName);
    		 // console.log(projectname);
    		$('#modal-subShow').modal('show');
            $('#modal-subShow').val("");
    	// }
    }


    $scope.editMember= function(item){
        if(!item){
            projectid=userData.ProjectId;
        }else{
            projectid=item.ProjectId;
        }
    	
         group=[];
        watchProjectService.getMembers(projectid).then(function(data){
            var i;
            for(i=0;data.result.Data[i];i++){
                var member={
                'UserId': data.result.Data[i].UserId,
                'ProjectId':projectid
                }
                group.push(member);
            }
            // console.log(group);
        });
       
        $scope.MemberList=$scope.userList;
        $scope.addParams = new NgTableParams({

            page: 1,
            count: 10,
            // total: $scope.sub_pro_datas.length,
           },{
            
            counts:[10,25,50,100],
            dataset: $scope.MemberList
        });
    	// console.log($scope.MemberList);
    	$('#modal-MemberEdit').modal('show');
        $('#modal-MemberEdit').val('');

    }

    $scope.isSelected=function(id,$event){
    	// console.log($scope.hasSelected(id));
    	var action=event.target;
    	if(action.checked){
            // if($scope.conf[$index]){
            var j;
            var repeat=0;
            for(j=0;group[j];j++){
                if(id==group[j].UserId||id==$rootScope.identity.result.User.UserId){
                    // console.log(id);
                    // console.log($scope.MemberList[j].user.UserId);
                    repeat=1;
                    break;
                }
            }

            if(repeat==0){
                var member={
                    'UserId': id,
                    'ProjectId':projectid
                }
                group.push(member);
            }
    			
    	}else{
            group.removeMember(id);
        }
    }

    $scope.hasSelected=function(id){
        // console.log(group);
        var i;
        for(i=0;group[i];i++){
            if(id==group[i].UserId) return true;
        }
        return false;
    }

    $scope.addMember=function(){
    	// console.log(group);
        if(!group[0]){
            var member={
                'UsrId': "",
                'ProjectId': projectid
            }
            group.push(member);
        }
    	watchProjectService.update(group).then(function(data){
    		//console.log(data);
    		Swal({
                title: '操作成功！',
                type: 'success',
                confirmButtonText: '确定'
            });
            $scope.MemberParams.reload();
    		$('#modal-MemberEdit').modal('hide');
    		$('#modal-MemberEdit').val("");
    	});
    	group=[];
    }

    $scope.queryMember=function(item){
        userData={};
        userData=item;
    	projectid=item.ProjectId;
    		// console.log(data);
    		//console.log(data);
    		// data.result.TotalCount
    				// Swal({
        //         	title: '该项目还没有成员！',
        //         	type: 'error',
        //         	confirmButtonText: '确定'
        //     	});
        $scope.MemberParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
                getData: function (params) {
                    // console.log(watchProjectService.queryMembers(params, $scope.filter,projectid));
                return watchProjectService.queryMembers(params, $scope.filter,projectid);
            }
        });
        $scope.ProjectsManager=item.UserId;
    	$('#modal-MemberShow').modal('show');
        $('#modal-MemberShow').val("");
    }

    $scope.JudgeShow=function (data) {
        // console.log(data.UserId);
        // console.log($rootScope.identity.result.User.UserId);
        if(data){
            if (String(data.UserId)==String($rootScope.identity.result.User.UserId)){
                return true;
            }else {
                return false;
            }
        }else
        {
            //console.log("join in");
            if (String($scope.ProjectsManager)==String($rootScope.identity.result.User.UserId)){
                return true;
            }else {
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
     $scope.remove= function(data){
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
         }).then(function(isConfirm){
             if (isConfirm.value) {
                 myProjectService.remove(data.ProjectId).then(function (data) {
                     //console.log(data);
                     Swal({
                         title: '删除成功！',
                         type: 'success',
                         confirmButtonText: '确定'
                     })
                     $scope.tableParams.reload();
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

    $scope.modify= function(data){
        // console.log(data);
            $scope.model = angular.copy(data);
            $scope.model.project=data.ProjectName;
            $scope.model.ProjectId=data.ProjectId;
            $scope.model.HasSon=data.HasSon;
            $scope.model.Version=data.Version;
            $scope.model.ProjectCode=data.ProjectCode;
            $scope.model.CompanyName=data.CompanyName;
            $scope.model.CompanyId=$scope.matchId(data.CompanyName);
            $scope.model.leader=$rootScope.identity.result.User.UserId;
            $scope.model.description=data.Description;
            $scope.model.fatherId=data.FatherId;
            var stime=$filter('limitTo')(data.StartTime,10);
            $scope.model.StartTime=new Date(stime);
            var etime=$filter('limitTo')(data.EndTime,10);
            $scope.model.EndTime=new Date(etime);
            //console.log(etime);
            isModify=1;
            $('#modal-edit2').val("");
            $('#modal-edit2').modal('show');
    }
    
    $scope.editMemberson= function(item){
        //console.log(item);
        projectid=item.ProjectId;
        
        subgroup=[];
        watchProjectService.getMembers(item.FatherId).then(function(data){
             //console.log(data.result.Data);
            $scope.MemberList=data.result.Data;
            $scope.addSonParams = new NgTableParams({

            page: 1,
            count: 10,
            // total: $scope.sub_pro_datas.length,
           },{
            
            counts:[10,25,50,100],
            dataset: $scope.MemberList
            });
        });
       // subgroup=[];
          console.log("project id",projectid);
        watchProjectService.getMembers(projectid).then(function(data){
            var i;
            console.log(data);
            for(i=0;data.result.Data[i];i++){
                var member={
                'UserId': data.result.Data[i].UserId,
                'ProjectId':projectid
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

    $scope.isSelectedson=function(id,$event){
        //console.log(id);
        // console.log($scope.hasSelected(id));
        var action=event.target;
        if(action.checked){
            // if($scope.conf[$index]){
            var j;
            var repeat=0;
            for(j=0;subgroup[j];j++){
                if(id==subgroup[j].UserId||id==$rootScope.identity.result.User.UserId){
                    // console.log(id);
                    // console.log($scope.MemberList[j].user.UserId);
                    repeat=1;
                    break;
                }
            }

            if(repeat==0){
                var member={
                    'UserId': id,
                    'ProjectId':projectid
                }
                subgroup.push(member);
            }
                
        }else{
            subgroup.removeMember(id);
        }
        //console.log(subgroup);
    }
    
    $scope.hasSelectedson=function(id){
         // console.log(id);
         // console.log(subgroup);
        var i;
        for(i=0;subgroup[i];i++){
            if(id==subgroup[i].UserId) return true;
        }
        return false;
    }

    $scope.addMemberson=function(){
     //   console.log(subgroup);
        if(!subgroup[0]){
            var member={
                'UsrId': "",
                'ProjectId': projectid
            }
            subgroup.push(member);
        }
        watchProjectService.update(subgroup).then(function(data){
            //console.log(data);
            Swal({
                title: '操作成功！',
                type: 'success',
                confirmButtonText: '确定'
            });
            $scope.SubParams.reload();
            $('#modal-MemberEdit1').modal('hide');
            $('#modal-MemberEdit1').val("");
        });
        subgroup=[];
    }

    $scope.queryMemberson=function(item){
        userData={};
        userData=item;
        projectid=item.ProjectId;
            // console.log(item);
            //console.log(data);
            // data.result.TotalCount
                    // Swal({
        //          title: '该项目还没有成员！',
        //          type: 'error',
        //          confirmButtonText: '确定'
        //      });
        $scope.MemberParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
                getData: function (params) {
                    // console.log(watchProjectService.queryMembers(params, $scope.filter,projectid));
                return watchProjectService.queryMembers(params, $scope.filter,projectid);
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

    $scope.removeson= function(data){
        // console.log(data.UserName)
        // console.log($rootScope.identity.result.User.Name);
        // console.log(data.UserName==$rootScope.identity.result.User.Name);
        var a;   
        for(var i=0;i<$scope.sub_pro_datas.length;i++){
            if($scope.sub_pro_datas[i].ProjectId==data.ProjectId)
            {
                      a=i;
                      break;
            }
        }

        $scope.sub_pro_datas.splice(a,1);

        swal({
            title: "确认删除?",
            text:'确定要删除 ' + data.ProjectName + ' 吗？',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function(isConfirm){
            if (isConfirm.value) {
                myProjectService.remove(data.ProjectId).then(function (data) {
                    //console.log(data);
                    Swal({
                        title: '删除成功！',
                        type: 'success',
                        confirmButtonText: '确定'
                    })

                });
                $scope.SubParams.reload();
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
        //         })
        //
        //     });
        //     $scope.SubParams.reload();
        // }

    };
    
   
    $scope.modifyson= function(data){
        // console.log(data);
            $scope.model = angular.copy(data);
            $scope.model.project=data.ProjectName;
            $scope.model.ProjectId=data.ProjectId;
            $scope.model.HasSon=data.HasSon;
            $scope.model.Version=data.Version;
            $scope.model.ProjectCode=data.ProjectCode;
            $scope.model.CompanyName=data.CompanyName;
            $scope.model.CompanyId=$scope.matchId(data.CompanyName);
            $scope.model.leader=$rootScope.identity.result.User.UserId;
            $scope.model.description=data.Description;
            $scope.model.fatherId=data.FatherId;
            var stime=$filter('limitTo')(data.StartTime,10);
            $scope.model.StartTime=new Date(stime);
            var etime=$filter('limitTo')(data.EndTime,10);
            $scope.model.EndTime=new Date(etime);
            //console.log(etime);
            isModify=1;
            $('#modal-edit3').val("");
            $('#modal-edit3').modal('show');

           
    }


    $scope.modifyProject=function(){
        

        var Param={
                'ProjectId':$scope.model.ProjectId,
                'ProjectCode':$scope.model.ProjectCode,
                'ProjectName':$scope.model.project,
                'CompanyId':$scope.model.CompanyId,//$scope.model.CompanyId,
                'UserId':$scope.model.leader,
                'StartTime':$filter('date')($scope.model.StartTime, 'yyyy-MM-dd'),
                'EndTime':$filter('date')($scope.model.EndTime, 'yyyy-MM-dd'),
                'version':$scope.model.Version,//$scope.model.version,
                'HasSon' :$scope.model.HasSon,
                'description' :$scope.model.description, 
                'FatherId':$scope.model.fatherId,
                'ColorList':[
                    {
                        'ParamDictionaryId':$scope.query("水深"),
                        'BeginColor':"128,255,255",
                        'EndColor':"0,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("水温"),
                        'BeginColor':"0,128,255",
                        'EndColor':"255,0,0"
                    },
                    {
                        'ParamDictionaryId':$scope.query("ECuS"),
                        'BeginColor':"0,0,0",
                        'EndColor':"255,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("DOmg"),
                        'BeginColor':"0,0,0",
                        'EndColor':"255,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("Sal"),
                        'BeginColor':"255,255,255",
                        'EndColor':"128,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("pH"),
                        'BeginColor':"0,0,255",
                        'EndColor':"255,0,0"
                    },
                    {
                        'ParamDictionaryId':$scope.query("ORP"),
                        'BeginColor':"0,0,0",
                        'EndColor':"255,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("Chla"),
                        'BeginColor':"0,0,0",
                        'EndColor':"255,0,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("浊度"),
                        'BeginColor':"0,0,0",
                        'EndColor':"128,255,255"
                    },
                    {
                        'ParamDictionaryId':$scope.query("饱和"),
                        'BeginColor':"255,128,0",
                        'EndColor':"255,255,128"
                    }
                ]
            }
            myProjectService.update(Param).then(function (data) {
                //console.log(data);
                
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

            for(var i=0;i<$scope.sub_pro_datas.length;i++){
                if($scope.sub_pro_datas[i].ProjectId==Param.ProjectId)
                {
                      a=i;
                      break;
                }
            }
            
            $scope.sub_pro_datas.splice(a,1,Param);
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
    $scope.info=function(data){
        $scope.model = newEntity;
        $('#modal-info').val("");
        var stime=$filter('limitTo')(data.StartTime,10);
        $scope.model.StartTimeS=stime;
        var etime=$filter('limitTo')(data.EndTime,10);
        $scope.model.EndTimeS=etime;
        $scope.model.project=data.ProjectName;
        $scope.model.ProjectCode=data.ProjectCode;
        $scope.model.leader=data.UserName;
        $scope.model.company=data.CompanyName;
        $scope.model.description=data.Description;
        $('#modal-info').modal('show');
    }
});

app.controller('workdayDetailController', function ($scope, $rootScope, $state, NgTableParams, dataViewService, modelService) {
    $scope.filter = {};
    $scope.table = {};
    $scope.form = {};

    // 查询视图
    dataViewService.getQueryViewByCode('WorkdayDetail').then(function (data) {
        $scope.$queryView = data;

        $scope.table.init({
            queryView: $scope.$queryView,
            filter: $scope.filter,
            form: $scope.form,

        });
    })

    // 表单视图
    dataViewService.getFormViewByCode('WorkdayDetailEdit').then(function (editView) {
        dataViewService.getFormViewByCode('WorkdayDetailNew').then(function (newView) {
            $scope.form.init({
                newView: newView,
                editView: editView,
                table: $scope.table,
                onValidate: function (model) {
                    console.log(model.MaterialType);
                    if (model.MaterialType == null) {
                        $scope.alert('名称必须包含测试');
                        return false;
                    }
                }
            });
        })
    })
})

