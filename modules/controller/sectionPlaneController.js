app.controller('sectionPlaneController', function ($scope, $rootScope,Restangular,$state,getPointDataDetailService, $stateParams,$timeout,showDataService, NgTableParams, userProjectService, $filter, mapFocusService) {
    var str=sessionStorage.selected;
    var temp = JSON.parse(str);
    console.log('sessionStorage.selected',temp);
    $scope.goId=$stateParams.Id;
    console.log("goId",$scope.goId);
    $scope.filename = temp[$scope.goId-1].selected;
    var Drag = dnd.Drag;
    var Drop = dnd.Drop;
    $scope.maxDepth = 0;
    $scope.num = [1];
    $scope.files=[[],[]];
    $scope.allIndex = 1;
    var locations = [];
    $scope.addModel = function() {
        if($scope.files[$scope.allIndex].length==0&&$scope.num.indexOf($scope.allIndex)!=-1){
            swal('一次只能增加一个模态框，请保证当前模态框中有数据');
            return;
        }else{
            $scope.allIndex = $scope.allIndex + 1;
            $scope.num.push($scope.allIndex);
        }
        
        // $scope.onload();
    }
    
   
    // console.log(regulalar);
    $scope.csvDetail = '';
    $scope.model={};
    var mapAll='';
    //执行repeat完成后回调操作
    $scope.$on('repeatFinishCallback',function(){
    //这里写repeat后需要进行的操作
        // console.log(document.getElementsByClassName('droppable-box'));
        var droppableBoxs = document.getElementsByClassName('droppable-box');
        // for (var i = 0; i < droppableBoxs.length; i++) {
        //  console.log( droppableBoxs.length,$scope.allIndex);
            console.log(droppableBoxs);
            var indexOfBox = parseInt(droppableBoxs[droppableBoxs.length-1].id);//用最新模态框的id做数组的最新值
            $scope.files[indexOfBox]=[];
            new Drop(droppableBoxs[droppableBoxs.length-1], {
                onDragStart: function(params) {
                    params.el.style.background = 'rgba(0, 0, 255, 0.1)';
                },
                onDragEnter: function(params) {
                    params.methods.showStateIcon('add');
                    params.el.style.background = 'rgba(0, 0, 255, 0.2)';
                },
                onDragLeave: function(params) {
                    params.methods.hideStateIcon();
                    params.el.style.background = 'rgba(0, 0, 255, 0.1)';
                },
                onDragEnd: function(params) {
                    params.el.style.background = '#fff';
                    for (var j = 0; j < params.el.children.length; j++) {
                        if(params.el.children[j].id==''){continue;}
                        else{
                            // console.log(i);
                            var index = $scope.files[indexOfBox].indexOf(params.el.children[j].id);
                            if (index == -1) {
                                $scope.files[indexOfBox].push(params.el.children[j].id);
                            }
                        }
                    }
                },
                onDrop: function(params) {
                    var flag = false;
                    //判断复制的根节点是否在框中
                    for (var i = 0; i < params.el.children.length; i++) {
                        if(params.el.children[i].id==params.sourceNode.id){
                            flag=true;
                            break;
                        }
                    }
                    console.log(flag);
                    if(flag==true){
                        params.methods.removeDragedNode('back');//如果在框中不允许拖入
                    }else{
                        params.methods.removeDragedNode('fade');
                        var newNode = params.sourceNode.cloneNode(true);
                        params.el.appendChild(newNode);
                        console.log( params);   
                        createNewDrop(newNode);
                    }
                }
            })
        // }
    });

    $scope.delete = function(item) {
        if(item==1){
            swal('不允许删除初始模态框');
            return;
        }
        console.log(item);
        var index = $scope.num.indexOf(item);
        if (index > -1) {
            $scope.num.splice(index, 1);
        }
        // $scope.num.splice(item,1);
    }
    
    $scope.onload = function () {
        // console.log(document.getElementById('main1'));
        // $scope.createRadarmap('main1');
        
        var draggableNodes = document.getElementsByClassName('draggable-node');
        for (var i = 0; i < draggableNodes.length; i++) {
            new Drag(draggableNodes[i], {
                data: i + 1,
                onDragEnd: function(params) { ! params.target && params.methods.removeDragedNode('back')
                }
            })
            // var str=document.getElementById("text"+i).innerHTML;
            // var cd=str.length;
            // if(cd>13){document.getElementById("text"+i).innerHTML=str.substring(0,13)+"...";};
        }

        

        var droppableBoxs = document.getElementsByClassName('droppable-box');
        for (var i = 0; i < droppableBoxs.length; i++) {
            new Drop(droppableBoxs[i], {
                onDragStart: function(params) {
                    params.el.style.background = 'rgba(0, 0, 255, 0.1)';
                },
                onDragEnter: function(params) {
                    params.methods.showStateIcon('add');
                    params.el.style.background = 'rgba(0, 0, 255, 0.2)';
                },
                onDragLeave: function(params) {
                    params.methods.hideStateIcon();
                    params.el.style.background = 'rgba(0, 0, 255, 0.1)';
                },
                onDragEnd: function(params) {
                    console.log(params);
                    $scope.files[i]=[];
                    params.el.style.background = '#fff';
                    for (var j = 0; j < params.el.children.length; j++) {
                        if(params.el.children[j].id==''){continue;}
                        else{
                            console.log(i);
                            var index = $scope.files[i].indexOf(params.el.children[j].id);
                            if (index == -1) {
                                $scope.files[i].push(params.el.children[j].id);
                            }
                            
                        }
                    }
                    console.log($scope.files[i]);
                },
                onDrop: function(params) {
                    var flag = false;
                    //判断复制的根节点是否在框中
                    for (var i = 0; i < params.el.children.length; i++) {
                        if(params.el.children[i].id==params.sourceNode.id){
                            flag=true;
                            break;
                        }
                    }
                    console.log(flag);
                    if(flag==true){
                        params.methods.removeDragedNode('back');//如果在框中不允许拖入
                    }else{
                        params.methods.removeDragedNode('fade');
                        var newNode = params.sourceNode.cloneNode(true);
                        params.el.appendChild(newNode);
                        console.log( params);   
                        createNewDrop(newNode);
                    }
                    // alert('111');
                    
                }
            })
        }
    }

    function createNewDrop(element) {
        new Drag(element, {
            onDragEnd: function(params) {
                console.log(params.el);
                var parent = params.el.parentElement;
                parent.removeChild(params.el);
            }
        })
    }

    $(document).ready(function() { 
        $scope.onload();
        // console.log(document.getElementById('main1'));
        // $scope.createRadarmap('main1');
    });
    // console.log(document.getElementById('main'));
    $scope.createPlanGraph = function(ids,csvdata){
        // console.log(document.getElementById('main'));
        document.getElementById(ids).style.height = 550+'px';
        var myChart = echarts.init(document.getElementById(ids));
        if(csvdata.length==0){
            myChart.clear();
            return;
        }
      
        // alert('22222');
        myChart.setOption(option);
    }
    
 $scope.searchNode=function(PointDataSet){
        locations=[];
        // var model={
        //     'PointDataIdList':PointDataSet,
        // } 
        console.log(PointDataSet);
        if(PointDataSet.length==0){
            // console.log(mapAll);
            if(!mapAll){
                swal('请先选择需要展示的数据');
                return;
            }else{
                mapAll='';
            }
        }
        var modeltemp = {}
        getPointDataDetailService.queryNodeDetail(PointDataSet).then(function (data) {
            $scope.csvDetail = data.result;
            // console.log($scope.csvDetail);
            locations = $scope.csvDetail;
            for (var i = 0; i < locations.length; i++) {
                if(parseFloat(locations[i].MaxDepth)>$scope.maxDepth){
                    $scope.maxDepth=parseFloat(locations[i].MaxDepth);
                    
                }
            }
            
            $scope.selectedParam();
            $scope.init();
        }) 
        
    }
  // var locations = [
  //           {"LongitudeAfter":"120.668441","LatitudeAfter":"28.006415","des":"1"},
  //           {"LongitudeAfter":"120.6695","LatitudeAfter":"28.00645","des":"2"},
  //       ];
    var arr = new Array();
    function locationIndex(){}
    var i = 0;
 $scope.init = function () {
        document.getElementById('main1').style.height = 550+'px';
        var map = new BMap.Map('main1');
        // console.log(map);
        mapAll = map;
        map.centerAndZoom(new BMap.Point(locations[0].LongitudeAfter, locations[0].LatitudeAfter), 17);//116.404, 39.915
       
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
                                        "visibility": "off"
                              }
                    },
              ]
          });

       
        var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
        map.addControl(top_right_navigation); 
         //console.log(L);
        console.log(locations);
        Marker_temp=[];
        point_temp=[];
        for(L=0;L<locations.length;L++){
            var marker = new BMap.Marker(new BMap.Point(locations[L].LongitudeAfter, locations[L].LatitudeAfter));//创建图标
            if(marker.point.lat!=0&&marker.point.lng!=0){
                Marker_temp.push(marker);
            }
            point_temp.push(new BMap.Point(locations[L].LongitudeAfter, locations[L].LatitudeAfter));            
            var Lo = new locationIndex();
            Lo.mark = marker;
            Lo.x = locations[L].LongitudeAfter;
            Lo.y = locations[L].LatitudeAfter;
            // Lo.des = locations[L].des;
            arr[i++] = Lo;
             // var label = new BMap.Label(locations[L].des, {
             //        // offset : new BMap.Size(1, 1)
             //    }); 
            // label.setStyle({
            //       background:'none',color:'#fff',border:'none'//只要对label样式进行设置就可达到在标注图标上显示数字的效果
            //     });
            // marker.setLabel(label);//显示地理名称 a 
            map.addOverlay(marker);
            // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            // marker.enableDragging(); 
            marker.addEventListener("mouseover",function mousing(e){
            var p = e.target;
            var x = p.getPosition().lng;
            var y = p.getPosition().lat;
            // for(var k = 0;k<arr.length;k++){
            // if(x == arr[k].x && y == arr[k].y){
            //     var label = new BMap.Label(arr[k].des,{offset:new BMap.Size(10,25)});
            //                 arr[k].mark.setLabel(label);

            //                 //map.addOverlay(arr[k].mark);
            //                 return ;
            //             }
            //         }
            });
            marker.addEventListener("mouseout",function mouseLeave(e){
                    var p = e.target;
                    var x = p.getPosition().lng;
                    var y = p.getPosition().lat;
                    // alert(arr.length);
                    // for(var k = 0;k<arr.length;k++){
                    //     if(x == arr[k].x && y == arr[k].y){
                    //         // alert("xxxxxxxxx");
                    //         // var marker1 = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));
                    //         //var label = new BMap.Label(null,{offset:new BMap.Size(0,0)});
                    //         var label =  arr[k].mark.getLabel();
                    //         label.setContent("");//设置标签内容为空
                    //         label.setStyle({borderWidth:"0px"});//设置标签边框宽度为0

                    //         //map.addOverlay(arr[k].mark);
                    //         return ;
                    //     }
                    // }
                    // marker_1 = marker;
            });
            
        }
        console.log(point_temp);
        var polyline = new BMap.Polyline(point_temp,{strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});  //创建多边形
        map.addOverlay(polyline);   //增加多边形
        map.enableScrollWheelZoom();
    };

$scope.sectionPlaneGraph = function(id){
    if($scope.files[id].length==0){
        swal('请先选择要展示的数据');
        return;
    }
    if($scope.files[id].length==1){
        swal('至少需要选择2个及其以上得数据');
        return;
    }
    if(!mapAll){
        swal('请先展示地图');
        return;
    }

 
    var temp = $scope.files[id];
    var str_node = '';
    for (var i = 0; i < temp.length; i++) {
        if(i!=temp.length-1){
            str_node=str_node+temp[i]+',';
        }else{
            str_node=str_node+temp[i];
        }
        
    }
  
    var model={
        
        'PointDataIdStr':str_node,//点id
        'ParamDictionaryId':$scope.model.ParamDictionaryId,//参数id
        
    }
    console.log(model);
    $('.page-loader-wrapper').show();
    
    getPointDataDetailService.showSectionGraph(model).then(function (data) {
        console.log(data);
        var str_regular = Restangular.configuration.baseUrl;
        var regulalar = str_regular.substring(0,str_regular.length-4);
       
        $scope.model.imgSectionSrc=regulalar+data.result.sectionImg;
        // $scope.model.imgBarSrc=regulalar+data.result.barImg;
        $('.page-loader-wrapper').fadeOut();
        $('#modal-imgShow').modal('show');
    })
	
}

$scope.selectedParam = function(){
    var model = {
        'Version':1,
    }
    getPointDataDetailService.searchCsv(model).then(function (data) {
        console.log(data);
        $scope.ParamDictionaryId = data.result;
        $scope.model.ParamDictionaryId =  $scope.ParamDictionaryId[0].ParamDictionaryId
    })
}
$scope.showPlanGraph = function(id){
        console.log($scope.allIndex);
        // if($scope.files[id].length==0){
        //     $scope.createRadarmap('main'+id,[]);//如果数组为空，直接清空图的对象
        // }else{
            
            // for (var j = 0; j < $scope.files[id].length; j++) {
            //     console.log($scope.files[id][j]);
            //     $scope.watchDataDetail(id,$scope.files[id][j]);
            // }

            $scope.searchNode($scope.files[id]);
        
        // }
        
    
        console.log(document.getElementById(id));
        console.log(document.getElementById('main'+id));
        // $scope.watchDataDetail()
    }   
})


//定义repeat完成指令
app.directive('repeatFinish',function($timeout){
    return {
        restrict: 'A',
        link: function(scope,elem,attr){
            //当前循环至最后一个
            // console.log(1111111)
            if (scope.$last === true) {
                $timeout(function () {
                    //向父控制器传递事件消息
                    scope.$emit('repeatFinishCallback');
                },100);
            }
        }
    }
});
