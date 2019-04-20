app.controller('dataManageController', function ($scope, $rootScope,Restangular, $state,showDataService, dataManageService, getPointDataDetailService,NgTableParams, userProjectService, $filter, Restangular,watchDataCsvService ) {
    var isModify=0;
    var locations = [];
    var emptyEntity = {};  
    var Selected=[];
    $scope.isCheckedAll = false;
    var newEntity = angular.copy(emptyEntity);
    $scope.filter = {};
    $scope.filter1 = {};
    $scope.filterItem = {};
    $scope.WeatherList=['晴','雨','阴','雪'];
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
            $scope.model.Weather=$scope.WeatherList[0];
            isModify=0;
            $scope.model.DataSetCode=null;
            $scope.model.DataSetName=null;
           // console.log('2');
            // console.log($scope.ProjectId);
            $('#creatDataSetCode').text('新建'+$scope.projectName+'的数据组：');
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
        console.log(data);
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
        console.log($scope.PointDataId);
        // if($scope.PointDataId==undefined){
        //     swal('未获取到数据，请先上传数据');
        //     return;
        // }
        $scope.queryPoints();
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
        // if($scope.par!= null){
        //     alert($scope.par);
        // }
        // $scope.par
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
        console.log(data);
        $('#dataManageTitle').text('数据管理：'+data.ProjectName);
        $scope.projectName=data.ProjectName;
        $scope.ProjectId=data.ProjectId;
        // console.log('1');
        // console.log($scope.ProjectId);
        $('#modal-edit').val('')
        $('#modal-edit').modal('show');
    }
    
    

    $scope.infoSon= function(data){
       console.log(data);
        if(data.SubProjects.length==0){
            swal("无子项目,请先添加子项目");
            return;
        }
        $scope.model = newEntity;
        // $scope.sonTable=new NgTableParams({ sorting: { 'ID': 'asc' } }, {
        //     getData:data.SubProjects
        // });
        $scope.subProjects=data.SubProjects;
        $('#sonProjectseditTitle').text('子项目列表：'+data.ProjectName);
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
                    title: '必填项不能为空,或数据格式不对！',
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
            if ($scope.model.DataSetCode!=null&&$scope.model.DataSetName!=null&&$scope.model.Weather!=null){
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
            }else{
                 swal({
                    title: '必填项不能为空,或数据格式不对！',
                    text: '',
                    type: 'warning',
                    // showCancelButton: true,
                    confirmButtonColor: '#EE5C42',
                    // cancelButtonColor: '#71C671',
                    confirmButtonText: '确定',
                    // cancelButtonText: '留着吧'
                })
            }
        };


    };
    $scope.closeViewdata=function(){
        $('#modal-watchPointDataDetail').modal('hide');
    }
    $scope.upload = function (data) {
        $('#modal-upload').modal('show');
        $scope.filter.longitude = '';
        $scope.filter.latitude = '';
        $scope.DataSetId=data.DataSetId;
    };

    //上传文件
    $scope.uploadFile = function() {
        console.log($scope.filter.longitude);
        console.log($rootScope.identity.result.Token)

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
        var url=Restangular.configuration.baseUrl+"/PointData/postExcel";
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

    $scope.filter1.xPoint = '';
    $scope.filter1.yPoint = '';
    // var Marker = '';
    var Marker_temp = new Array();
    var marker_1 = '';
    var nowPoint = '';
    $scope.queryPoints=function () {
        locations = [];
        showDataService.getData(DataSetId_temp).then(function (data) {
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

    var arr = new Array();
    function locationIndex(){}
    var i = 0;
    $scope.init = function () {
        var map = new BMap.Map("container");
        console.log(locations[0].LongitudeAfter);
        map.centerAndZoom(new BMap.Point(locations[0].LongitudeAfter,locations[0].LatitudeAfter), 17);//116.404, 39.915
       
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
        console.log(locations);
        Marker_temp=[];
        for(L in locations){
            var marker = new BMap.Marker(new BMap.Point(locations[L].LongitudeAfter, locations[L].LatitudeAfter));//创建图标
            if(marker.point.lat!=0&&marker.point.lng!=0){
                Marker_temp.push(marker);
            }
            var Lo = new locationIndex();
            Lo.mark = marker;
            Lo.x = locations[L].LongitudeAfter;
            Lo.y = locations[L].LatitudeAfter;
            Lo.des = locations[L].des;
            arr[i++] = Lo;
             var label = new BMap.Label(locations[L].des, {
                    // offset : new BMap.Size(1, 1)
                }); 
            label.setStyle({
                  background:'none',color:'#fff',border:'none'//只要对label样式进行设置就可达到在标注图标上显示数字的效果
                });
            marker.setLabel(label);//显示地理名称 a 
            map.addOverlay(marker);
            // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
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
                    // marker_1 = marker;
            });
            marker.addEventListener("dragend", function (e) {
                var p = e.target;
                var x1 = p.getPosition().lng;
                var y1 = p.getPosition().lat;
                for(var k = 0;k<arr.length;k++){
                        if(x1 == arr[k].mark.getPosition().lng && y1 == arr[k].mark.getPosition().lat){
                            marker_1 = arr[k].mark;
                            break;
                        }
                    }
                
                // console.log(arr);
                
                // alert("拖到的地点的经纬度：" + x + "，" + y);
                // console.log(locations);
                // for (var i = 0; i < locations.length; i++) {
                //     if(locations[i].des == e.currentTarget.Bc.innerText){
                //         locations[i].LongitudeAfter =e.point.lng;
                //         locations[i].LatitudeAfter = e.point.lat;
                //     } 
                // }
                document.getElementById('xPoint').value = x1;
                document.getElementById('yPoint').value = y1;
                // Marker = marker;
                // console.log(Marker);
                // alert("拖到的地点的经纬度：" +x + "，" + y);
                // showDataService.updateLocation(locations).then(function (data) { 
                //     swal("操作成功");
                //     $scope.csvTable.reload();
                // })
            });
            // marker.addEventListener("click", function (e) {
               
            //     var x = e.point.lng; //经度
            //     var y = e.point.lat; //纬度
            //     // alert("点击的地点的经纬度：" + x + "，" + y);
            //     // console.log(locations);
            //     // for (var i = 0; i < locations.length; i++) {
            //     //     if(locations[i].des == e.currentTarget.Bc.innerText){
            //     //         locations[i].LongitudeAfter =e.point.lng;
            //     //         locations[i].LatitudeAfter = e.point.lat;
            //     //     } 
            //     // }
            //     // showDataService.updateLocation(locations).then(function (data) { 
            //     //     swal("操作成功");
            //     //     $scope.csvTable.reload();
            //     // })
            // });
            
        }
        // console.log(map.getPanes());
        map.enableScrollWheelZoom();
    };
    $scope.closeMapModel = function(){
        Marker_temp=[];
        $('#modal-watchDataCsv').modal('hide');
    }
    $scope.resetPoint = function(){
        var x=document.getElementById('xPoint').value;
        var y=document.getElementById('yPoint').value;
        marker_1.setPosition(new BMap.Point(x,y));
    }
    $scope.resetPot = function(){
        console.log(Marker_temp);
       for (var i = 0; i < Marker_temp.length; i++) {
            locations[i].LongitudeAfter =Marker_temp[i].point.lng;
            locations[i].LatitudeAfter = Marker_temp[i].point.lat;
       }
       showDataService.updateLocation(locations).then(function (data) { 
                    swal("操作成功");
                    document.getElementById('xPoint').value = '';
                    document.getElementById('yPoint').value = '';
                    $scope.csvTable.reload();
                })
    }

});
