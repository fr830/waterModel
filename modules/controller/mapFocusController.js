app.controller('mapFocusController',
function($scope, $rootScope, $state, $stateParams, showDataService, NgTableParams, userProjectService, $filter, mapFocusService) {
    var DataSetId = $stateParams.DataSetId;
    var locations = [];
    $scope.model = {};
    var X, Y;
    var rootData = {};
    var valueList = [];
    var valueForEchart = {};
    $scope.DataTypes = ["pH", "饱和", "ECuS", "Sal", "浊度", "ORP", "水温", "Chla", "DOmg", "水深"]; //根据数据类型输出相应的表格
    $scope.query = function(data) {
        // locations = [];
        // showDataService.getData(DataSetId).then(function (data) {
        //     // console.log("1111111");
        //     rootData=data;
        //     // console.log(rootData);
        //     var i;
        //     for (i=0;i<data.result.pointDataMores.length;i++){
        //         var Des="经度："+data.result.pointDataMores[i].LongitudeAfter+"纬度:"+data.result.pointDataMores[i].LatitudeAfter;
        //         var location={
        //             "x":data.result.pointDataMores[i].LongitudeAfter,
        //             "y":data.result.pointDataMores[i].LatitudeAfter,
        //             "des":Des
        //         };
        //         locations.push(location);
        //     }
        //     $scope.init();
        // });
        //console.log(1);
    };
    console.log(localStorage.userId);
    $scope.map = localStorage.userId;
    // $("body").toggleClass("ls-toggle-menu");
    var arr = new Array();
    function locationIndex() {}
    var i = 0;

    $scope.getLocation = function() {
        var Location = [];
        var i;
        // for (i=0;)
    };

    $scope.init = function() {
        var map = new BMap.Map("container");
        map.centerAndZoom(new BMap.Point(locations[0].x, locations[0].y), 17); //116.404, 39.915
        //去除路网,建筑为物
        map.setMapStyle({
            styleJson: [{
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

        var top_right_navigation = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_SMALL
        }); //右上角，仅包含平移和缩放按钮
        map.addControl(top_right_navigation);
        //console.log(L);
        for (L in locations) {
            var marker = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y)); //创建图标
            var Lo = new locationIndex();
            Lo.mark = marker;
            Lo.x = locations[L].x;
            Lo.y = locations[L].y;
            Lo.des = locations[L].des;
            arr[i++] = Lo;
            map.addOverlay(marker);
            marker.addEventListener("mouseover",
            function mousing(e) {
                var p = e.target;
                var x = p.getPosition().lng;
                var y = p.getPosition().lat;
                for (var k = 0; k < arr.length; k++) {
                    if (x == arr[k].x && y == arr[k].y) {
                        var label = new BMap.Label(arr[k].des, {
                            offset: new BMap.Size(10, 25)
                        });
                        arr[k].mark.setLabel(label);

                        //map.addOverlay(arr[k].mark);
                        return;
                    }
                }
            });
            marker.addEventListener("mouseout",
            function mouseLeave(e) {
                var p = e.target;
                var x = p.getPosition().lng;
                var y = p.getPosition().lat;
                // alert(arr.length);
                for (var k = 0; k < arr.length; k++) {
                    if (x == arr[k].x && y == arr[k].y) {
                        // alert("xxxxxxxxx");
                        // var marker1 = new BMap.Marker(new BMap.Point(locations[L].x, locations[L].y));
                        //var label = new BMap.Label(null,{offset:new BMap.Size(0,0)});
                        var label = arr[k].mark.getLabel();
                        label.setContent(""); //设置标签内容为空
                        label.setStyle({
                            borderWidth: "0px"
                        }); //设置标签边框宽度为0
                        //map.addOverlay(arr[k].mark);
                        return;
                    }
                }
            });

            marker.addEventListener("click",
            function showChart(e) { //展示表格
                // console.log(rootData);
                var p = e.target;
                var x = p.getPosition().lng;
                var y = p.getPosition().lat;
                // alert(arr.length);
                for (var k = 0; k < arr.length; k++) {
                    if (x == arr[k].x && y == arr[k].y) {

                        $scope.model.X = arr[k].x;
                        $scope.model.Y = arr[k].y;
                        // console.log($scope.model.dataType);
                        //指定图标的配置和数据
                        var pDatas = [];
                        var valueInfo = [[], [], [], [], [], [], [], [], [], []]; //用于计算最值
                        var dataInfo = [[], [], [], [], [], [], [], [], [], []]; //一般数据,用于生成表格
                        var XAxis;
                        valueList = [];
                        valueForEchart = [];
                        var i, j;
                        var id;
                        for (i = 0; i < rootData.result.pointDataMores.length; i++) {
                            if ($scope.model.X == rootData.result.pointDataMores[i].LongitudeAfter && $scope.model.Y == rootData.result.pointDataMores[i].LatitudeAfter) {
                                id = rootData.result.pointDataMores[i].PointDataId;
                                console.log($scope.model.X, rootData.result.pointDataMores[i].LongitudeAfter);
                                console.log($scope.model.Y, rootData.result.pointDataMores[i].LatitudeAfter);
                                break;
                            }
                        }; //找到对应点的id获取点的数据
                        if (!id) console.log("no id");
                        // console.log(rootData.result.pointDataMores[i].PointDataId);
                        mapFocusService.showPoint(id).then(function(data) {
                            pDatas = data.result.Data;
                            if ($scope.model.dataTypeX == "水温") pDatas = pDatas.sort(sortByTemp);
                            else if ($scope.model.dataTypeX == "饱和") pDatas = pDatas.sort(sortBySat);
                            else if ($scope.model.dataTypeX == "浊度") pDatas = pDatas.sort(sortByTemp);
                            else if ($scope.model.dataTypeX == "水深") pDatas = pDatas.sort(sortByDepth);
                            else if ($scope.model.dataTypeX == "Sal") pDatas = pDatas.sort(sortBySal);
                            else if ($scope.model.dataTypeX == "ORP") pDatas = pDatas.sort(sortByORP);
                            else if ($scope.model.dataTypeX == "Chla") pDatas = pDatas.sort(sortByChla);
                            else if ($scope.model.dataTypeX == "DOmg") pDatas = pDatas.sort(sortByDOmg);
                            else if ($scope.model.dataTypeX == "ECuS") pDatas = pDatas.sort(sortByECuS);
                            else pDatas = pDatas.sort(sortBypH);
                            //根据x轴的数据来排序
                            for (j = 0; pDatas[j]; j++) {
                                for (var k = 0; k < 10; k++) {
                                    var n = sift($scope.DataTypes[k], pDatas[j]);
                                    dataInfo[k].push(n);
                                    valueInfo[k].push(n);
                                }
                            };
                            XAxis = dataInfo[judgeX($scope.model.dataTypeX)]; //x轴
                            // console.log(dataInfo,valueInfo,valueList.length,XAxis);
                            //根据valueist的元素个数，一个按原来的数值处理，两个以上进行规划处理
                            if (valueList.length == 1) {
                                for (var a = 0; valueList[a]; a++) {

                                    var Line = {
                                        name: valueList[a],
                                        type: 'line',
                                        showSymbol: true,
                                        data: dataInfo[judgeX(valueList[a])]
                                    }

                                    valueForEchart.push(Line);
                                }

                                var temp = valueInfo[judgeX(valueList[0])];
                                temp = temp.sort();
                                var scale = (parseFloat(temp[temp.length - 1]) - parseFloat(temp[0])) / 6;
                                var Max = parseFloat(temp[temp.length - 1]) + parseFloat(scale) + 0.5;
                                var Min = parseFloat(temp[0]) - parseFloat(scale) - 0.5;
                                Max = Max.toFixed(0);
                                Min = Min.toFixed(0);
                                var Xmin = parseFloat(XAxis[0]);
                                var Xmax = parseFloat(XAxis[XAxis.length - 1]);
                                // console.log(Xmin,Xmax);
                                Xmin = Xmin.toFixed(0);
                                Xmax = Xmax.toFixed(0);
                                // console.log(Xmin,Xmax);
                                var option = {
                                    // visualMap: {
                                    //     show: true,
                                    //     type: 'continuous',
                                    //     seriesIndex: 0,
                                    //     min: 0,
                                    //     max: 400
                                    // },
                                    title: {
                                        // text:$scope.model.dataType
                                        // text:'数据统计'
                                    },
                                    tooltip: {
                                        trigger: 'axis'
                                    },
                                    legend: {
                                        data: valueList
                                    },
                                    xAxis: {
                                        min: Xmin,
                                        max: Xmax,
                                        name: $scope.model.dataTypeX,
                                        data: XAxis
                                    },
                                    yAxis: {
                                        min: Min,
                                        max: Max,
                                        type: 'value',
                                        // name:$scope.model.dataType,
                                        splitLine: {
                                            show: true
                                        },
                                        splitNumber: 10
                                    },
                                    series: valueForEchart
                                };
                                //初始化echarts实例
                                var myChart = echarts.init(document.getElementById('chartmain'));

                                //使用制定的配置项和数据显示图表
                                myChart.setOption(option, true);
                                $('#modal-chart').modal('show');
                                $('#modal-chart').val("");

                            } else {
                                for (var a = 0; valueList[a]; a++) {
                                    var num = judgeX(valueList[a]);
                                    // console.log(num);
                                    var sum = 0;
                                    var averange = 0;
                                    var max = min = valueInfo[num][0];
                                    for (var b = 0; b < valueInfo[num].length; b++) {

                                        if (max < valueInfo[num][b]) max = valueInfo[num][b];
                                        if (min > valueInfo[num][b]) min = valueInfo[num][b];
                                        sum = sum + parseFloat(valueInfo[num][b]);
                                    }
                                    averange = parseFloat(sum) / parseFloat(valueInfo[num].length);
                                    // console.log(sum,max,min,averange);
                                    //  console.log(valueInfo[num]);
                                    for (var b = 0; b < valueInfo[num].length; b++) {
                                        if ((max - min) == 0) valueInfo[num][b] = 0;
                                        else valueInfo[num][b] = parseFloat(valueInfo[num][b] - averange) / parseFloat(max - min);
                                    }

                                    // console.log(valueInfo[num]);
                                    var Line = {
                                        name: valueList[a],
                                        type: 'line',
                                        showSymbol: true,
                                        data: valueInfo[num]
                                    };
                                    // console.log(Line);
                                    valueForEchart.push(Line);
                                }
                                var Xmin = parseFloat(XAxis[0]);
                                var Xmax = parseFloat(XAxis[XAxis.length - 1]);
                                // console.log(Xmin,Xmax);
                                Xmin = Xmin.toFixed(0);
                                Xmax = Xmax.toFixed(0);
                                // console.log(Xmin,Xmax);
                                var option = {
                                    // visualMap: {
                                    //     show: true,
                                    //     type: 'continuous',
                                    //     seriesIndex: 0,
                                    //     min: 0,
                                    //     max: 400
                                    // },
                                    title: {
                                        // text:$scope.model.dataType
                                        // text:'数据统计'
                                    },
                                    tooltip: {
                                        trigger: 'axis'
                                    },
                                    legend: {
                                        data: valueList
                                    },
                                    xAxis: {
                                        min: Xmin,
                                        max: Xmax,
                                        name: $scope.model.dataTypeX,
                                        data: XAxis
                                    },
                                    yAxis: {
                                        min: -1,
                                        max: 1,
                                        type: 'value',
                                        // name:$scope.model.dataType,
                                        splitLine: {
                                            show: true
                                        },
                                        splitNumber: 10
                                    },
                                    series: valueForEchart
                                };
                                //初始化echarts实例
                                var myChart = echarts.init(document.getElementById('chartmain'));

                                //使用制定的配置项和数据显示图表
                                myChart.setOption(option, true);
                                $('#modal-chart').modal('show');
                                $('#modal-chart').val("");

                            }

                        });

                        return;
                    }
                }

            });

        }
        map.enableScrollWheelZoom();
    };

    $scope.update = function() {
        var pDatas = [];
        var valueInfo = [[], [], [], [], [], [], [], [], [], []]; //用于计算最值
        var dataInfo = [[], [], [], [], [], [], [], [], [], []]; //一般数据,用于生成表格
        var XAxis;
        valueForEchart = [];
        var i, j;
        var id;
        for (i = 0; i < rootData.result.pointDataMores.length; i++) {
            if ($scope.model.X == rootData.result.pointDataMores[i].LongitudeAfter && $scope.model.Y == rootData.result.pointDataMores[i].LatitudeAfter) {
                id = rootData.result.pointDataMores[i].PointDataId;
                console.log($scope.model.X, rootData.result.pointDataMores[i].LongitudeAfter);
                console.log($scope.model.Y, rootData.result.pointDataMores[i].LatitudeAfter);
                break;
            }
        }; //找到对应点的id获取点的数据
        if (!id) console.log("no id");
        // console.log(rootData.result.pointDataMores[i].PointDataId);
        mapFocusService.showPoint(id).then(function(data) {
            pDatas = data.result.Data;
            if ($scope.model.dataTypeX == "水温") pDatas = pDatas.sort(sortByTemp);
            else if ($scope.model.dataTypeX == "饱和") pDatas = pDatas.sort(sortBySat);
            else if ($scope.model.dataTypeX == "浊度") pDatas = pDatas.sort(sortByTemp);
            else if ($scope.model.dataTypeX == "水深") pDatas = pDatas.sort(sortByDepth);
            else if ($scope.model.dataTypeX == "Sal") pDatas = pDatas.sort(sortBySal);
            else if ($scope.model.dataTypeX == "ORP") pDatas = pDatas.sort(sortByORP);
            else if ($scope.model.dataTypeX == "Chla") pDatas = pDatas.sort(sortByChla);
            else if ($scope.model.dataTypeX == "DOmg") pDatas = pDatas.sort(sortByDOmg);
            else if ($scope.model.dataTypeX == "ECuS") pDatas = pDatas.sort(sortByECuS);
            else pDatas = pDatas.sort(sortBypH);
            //根据x轴的数据来排序
            for (j = 0; pDatas[j]; j++) {
                for (var k = 0; k < 10; k++) {
                    var n = sift($scope.DataTypes[k], pDatas[j]);
                    dataInfo[k].push(n);
                    valueInfo[k].push(n);
                }
            };
            XAxis = dataInfo[judgeX($scope.model.dataTypeX)]; //x轴
            // console.log(dataInfo,valueInfo,valueList.length,XAxis);
            //根据valueist的元素个数，一个按原来的数值处理，两个以上进行规划处理
            if (valueList.length == 1) {
                for (var a = 0; valueList[a]; a++) {

                    var Line = {
                        name: valueList[a],
                        type: 'line',
                        showSymbol: true,
                        data: dataInfo[judgeX(valueList[a])]
                    }

                    valueForEchart.push(Line);
                }

                var temp = valueInfo[judgeX(valueList[0])];
                temp = temp.sort();
                var scale = (parseFloat(temp[temp.length - 1]) - parseFloat(temp[0])) / 6;
                var Max = parseFloat(temp[temp.length - 1]) + parseFloat(scale) + 0.5;
                var Min = parseFloat(temp[0]) - parseFloat(scale) - 0.5;
                Max = Max.toFixed(0);
                Min = Min.toFixed(0);
                var Xmin = parseFloat(XAxis[0]);
                var Xmax = parseFloat(XAxis[XAxis.length - 1]);
                // console.log(Xmin,Xmax);
                Xmin = Xmin.toFixed(0);
                Xmax = Xmax.toFixed(0);
                // console.log(Xmin,Xmax);
                var option = {
                    // visualMap: {
                    //     show: true,
                    //     type: 'continuous',
                    //     seriesIndex: 0,
                    //     min: 0,
                    //     max: 400
                    // },
                    title: {
                        // text:$scope.model.dataType
                        // text:'数据统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: valueList
                    },
                    xAxis: {
                        min: Xmin,
                        max: Xmax,
                        name: $scope.model.dataTypeX,
                        data: XAxis
                    },
                    yAxis: {
                        min: Min,
                        max: Max,
                        type: 'value',
                        // name:$scope.model.dataType,
                        splitLine: {
                            show: true
                        },
                        splitNumber: 10
                    },
                    series: valueForEchart
                };
                //初始化echarts实例
                var myChart = echarts.init(document.getElementById('chartmain'));

                //使用制定的配置项和数据显示图表
                myChart.setOption(option, true);
                $('#modal-chart').modal('show');
                $('#modal-chart').val("");

            } else {
                for (var a = 0; valueList[a]; a++) {
                    var num = judgeX(valueList[a]);
                    // console.log(num);
                    var sum = 0;
                    var averange = 0;
                    var max = min = valueInfo[num][0];
                    for (var b = 0; b < valueInfo[num].length; b++) {

                        if (max < valueInfo[num][b]) max = valueInfo[num][b];
                        if (min > valueInfo[num][b]) min = valueInfo[num][b];
                        sum = sum + parseFloat(valueInfo[num][b]);
                    }
                    averange = parseFloat(sum) / parseFloat(valueInfo[num].length);
                    // console.log(sum,max,min,averange);
                    //  console.log(valueInfo[num]);
                    for (var b = 0; b < valueInfo[num].length; b++) {
                        if ((max - min) == 0) valueInfo[num][b] = 0;
                        else valueInfo[num][b] = parseFloat(valueInfo[num][b] - averange) / parseFloat(max - min);
                    }

                    // console.log(valueInfo[num]);
                    var Line = {
                        name: valueList[a],
                        type: 'line',
                        showSymbol: true,
                        data: valueInfo[num]
                    };
                    // console.log(Line);
                    valueForEchart.push(Line);
                }
                var Xmin = parseFloat(XAxis[0]);
                var Xmax = parseFloat(XAxis[XAxis.length - 1]);
                // console.log(Xmin,Xmax);
                Xmin = Xmin.toFixed(0);
                Xmax = Xmax.toFixed(0);
                // console.log(Xmin,Xmax);
                var option = {
                    // visualMap: {
                    //     show: true,
                    //     type: 'continuous',
                    //     seriesIndex: 0,
                    //     min: 0,
                    //     max: 400
                    // },
                    title: {
                        // text:$scope.model.dataType
                        // text:'数据统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: valueList
                    },
                    xAxis: {
                        min: Xmin,
                        max: Xmax,
                        name: $scope.model.dataTypeX,
                        data: XAxis
                    },
                    yAxis: {
                        min: -1,
                        max: 1,
                        type: 'value',
                        // name:$scope.model.dataType,
                        splitLine: {
                            show: true
                        },
                        splitNumber: 10
                    },
                    series: valueForEchart
                };
                //初始化echarts实例
                var myChart = echarts.init(document.getElementById('chartmain'));

                //使用制定的配置项和数据显示图表
                myChart.setOption(option, true);
                $('#modal-chart').modal('show');
                $('#modal-chart').val("");

            }

        });
    }

    $scope.showAll = function() {
        var pDatas = [];
        var valueInfo = [[], [], [], [], [], [], [], [], [], []]; //用于计算最值
        var dataInfo = [[], [], [], [], [], [], [], [], [], []]; //一般数据,用于生成表格
        var XAxis;
        valueList = $scope.DataTypes;
        valueForEchart = [];
        var i, j;
        var id;
        for (i = 0; i < rootData.result.pointDataMores.length; i++) {
            if ($scope.model.X == rootData.result.pointDataMores[i].LongitudeAfter && $scope.model.Y == rootData.result.pointDataMores[i].LatitudeAfter) {
                id = rootData.result.pointDataMores[i].PointDataId;
                console.log($scope.model.X, rootData.result.pointDataMores[i].LongitudeAfter);
                console.log($scope.model.Y, rootData.result.pointDataMores[i].LatitudeAfter);
                break;
            }
        }; //找到对应点的id获取点的数据
        if (!id) console.log("no id");
        mapFocusService.showPoint(id).then(function(data) {
            pDatas = data.result.Data;
            if ($scope.model.dataTypeX == "水温") pDatas = pDatas.sort(sortByTemp);
            else if ($scope.model.dataTypeX == "饱和") pDatas = pDatas.sort(sortBySat);
            else if ($scope.model.dataTypeX == "浊度") pDatas = pDatas.sort(sortByTemp);
            else if ($scope.model.dataTypeX == "水深") pDatas = pDatas.sort(sortByDepth);
            else if ($scope.model.dataTypeX == "Sal") pDatas = pDatas.sort(sortBySal);
            else if ($scope.model.dataTypeX == "ORP") pDatas = pDatas.sort(sortByORP);
            else if ($scope.model.dataTypeX == "Chla") pDatas = pDatas.sort(sortByChla);
            else if ($scope.model.dataTypeX == "DOmg") pDatas = pDatas.sort(sortByDOmg);
            else if ($scope.model.dataTypeX == "ECuS") pDatas = pDatas.sort(sortByECuS);
            else pDatas = pDatas.sort(sortBypH);
            //根据x轴的数据来排序
            for (j = 0; pDatas[j]; j++) {
                for (var k = 0; k < 10; k++) {
                    var n = sift($scope.DataTypes[k], pDatas[j]);
                    dataInfo[k].push(n);
                    valueInfo[k].push(n);
                }
            };
            XAxis = dataInfo[judgeX($scope.model.dataTypeX)]; //x轴
            // console.log(dataInfo,valueInfo,valueList.length,XAxis);
            //根据valueist的元素个数，一个按原来的数值处理，两个以上进行规划处理
            for (var a = 0; valueList[a]; a++) {
                var num = judgeX(valueList[a]);
                // console.log(num);
                var sum = 0;
                var averange = 0;
                var max = min = valueInfo[num][0];
                for (var b = 0; b < valueInfo[num].length; b++) {

                    if (max < valueInfo[num][b]) max = valueInfo[num][b];
                    if (min > valueInfo[num][b]) min = valueInfo[num][b];
                    sum = sum + parseFloat(valueInfo[num][b]);
                }
                averange = parseFloat(sum) / parseFloat(valueInfo[num].length);
                // console.log(sum,max,min,averange);
                //  console.log(valueInfo[num]);
                for (var b = 0; b < valueInfo[num].length; b++) {
                    if ((max - min) == 0) valueInfo[num][b] = 0;
                    else valueInfo[num][b] = parseFloat(valueInfo[num][b] - averange) / parseFloat(max - min) + 2 * a;
                }

                // console.log(valueInfo[num]);
                var Line = {
                    name: valueList[a],
                    type: 'line',
                    showSymbol: true,
                    data: valueInfo[num]
                };
                // console.log(Line);
                valueForEchart.push(Line);
            }
            // console.log(valueInfo);
            var Xmin = parseFloat(XAxis[0]);
            var Xmax = parseFloat(XAxis[XAxis.length - 1]);
            // console.log(Xmin,Xmax);
            Xmin = Xmin.toFixed(0);
            Xmax = Xmax.toFixed(0);
            // console.log(Xmin,Xmax);
            var option = {
                // visualMap: {
                //     show: true,
                //     type: 'continuous',
                //     seriesIndex: 0,
                //     min: 0,
                //     max: 400
                // },
                title: {
                    // text:$scope.model.dataType
                    // text:'数据统计'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: valueList
                },
                xAxis: {
                    min: Xmin,
                    max: Xmax,
                    name: $scope.model.dataTypeX,
                    data: XAxis
                },
                yAxis: {
                    min: 0,
                    max: 20,
                    type: 'value',
                    // name:$scope.model.dataType,
                    splitLine: {
                        show: true
                    },
                    splitNumber: 10
                },
                series: valueForEchart
            };
            //初始化echarts实例
            var myChart = echarts.init(document.getElementById('chartmain'));

            //使用制定的配置项和数据显示图表
            myChart.setOption(option, true);
            $('#modal-chart').modal('show');
            $('#modal-chart').val("");
        });
    }

    var sift = function(string, data) {
        // console.log(data);
        if (string == "水温") return data.Temperature;
        else if (string == "饱和") return data.Saturation;
        else if (string == "浊度") return data.Turbidity;
        else if (string == "水深") return data.Depth;
        else if (string == "Sal") return data.Sal;
        else if (string == "ORP") return data.ORP;
        else if (string == "Chla") return data.Chla;
        else if (string == "DOmg") return data.DOmg;
        else if (string == "ECuS") return data.ECuS;
        else return data.pH;

    }

    var judgeX = function(string) {
        // console.log(data);
        if (string == "水温") return 6;
        else if (string == "饱和") return 1;
        else if (string == "浊度") return 4;
        else if (string == "水深") return 9;
        else if (string == "Sal") return 3;
        else if (string == "ORP") return 5;
        else if (string == "Chla") return 7;
        else if (string == "DOmg") return 8;
        else if (string == "ECuS") return 2;
        else return 0;

    }
    //排序函数
    var sortByORP = function(a, b) {
        return a.ORP - b.ORP;
    }

    var sortByDepth = function(a, b) {
        return a.Depth - b.Depth;
    }

    var sortByTemp = function(a, b) {
        return a.Temperature - b.Temperature;
    }

    var sortBySat = function(a, b) {
        return a.Saturation - b.Saturation;
    }

    var sortByTurbidity = function(a, b) {
        return a.Turbidity - b.Turbidity;
    }

    var sortBySal = function(a, b) {
        return a.Sal - b.Sal;
    }

    var sortByECuS = function(a, b) {
        return a.ECuS - b.ECuS;
    }

    var sortByDOmg = function(a, b) {
        return a.DOmg - b.DOmg;
    }

    var sortByChla = function(a, b) {
        return a.Chla - b.Chla;
    }

    var sortBypH = function(a, b) {
        return a.pH - b.pH;
    }

    var sortDataByData = function(a, b) {
        return a[0] - b[0];
    }

    var sortDatasetByData = function(a, b) {
        return a.Depth - b.Depth;
    }

    var sortDataByValue = function(a, b) {
        return a[1] - b[1];
    }

    $scope.isSelected = function(item, $event) {
        // console.log(item);
        var action = event.target;
        if (action.checked) {
            // if($scope.conf[$index]){
            var j;
            var repeat = 0;
            for (j = 0; valueList[j]; j++) {
                if (item == valueList[j]) {
                    // console.log(id);
                    // console.log($scope.MemberList[j].user.UserId);
                    repeat = 1;
                    break;
                }
            }

            if (repeat == 0) {
                valueList.push(item);
            }

        } else {
            var j;
            for (j = 0; valueList[j]; j++) {
                if (item == valueList[j]) {
                    // console.log(id);
                    // console.log($scope.MemberList[j].user.UserId);
                    valueList.splice(j, 1);
                    break;
                }
            }
        }
        console.log(valueList);
        $scope.update();
    };

    $scope.defult = function(item) {
        // if(item=="pH") return true;
        return false;
    };

    $scope.query();
});