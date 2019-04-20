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