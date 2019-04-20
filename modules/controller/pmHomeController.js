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

        option = {
            title : {
                text: '项目统计图',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:['我负责的项目','系统内其他项目']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'数据统计',
                    type:'pie',
                    radius : [50, 150],
                    center : ['50%', '50%'],
                    roseType : 'area',
                    data:[
                        {value: mycProject, name:'我负责的项目'},
                        {value:otherProject, name:'系统内其他项目'}
                    ]
                }
            ]
        };

        // app.title = '项目统计图';
        //
        // option = {
        //     tooltip: {
        //         trigger: 'item',
        //         formatter: "{a} <br/>{b}: {c} ({d}%)"
        //     },
        //     legend: {
        //         orient: 'vertical',
        //         x: 'left',
        //         data:['我负责的项目','系统内其他项目']
        //     },
        //     series: [
        //         {
        //             name:'',
        //             type:'pie',
        //             radius: ['50%', '70%'],
        //             avoidLabelOverlap: false,
        //             label: {
        //                 normal: {
        //                     show: false,
        //                     position: 'center'
        //                 },
        //                 emphasis: {
        //                     show: true,
        //                     textStyle: {
        //                         fontSize: '30',
        //                         fontWeight: 'bold'
        //                     }
        //                 }
        //             },
        //             labelLine: {
        //                 normal: {
        //                     show: false
        //                 }
        //             },
        //             data:[
        //                 {value: mycProject, name:'我负责的项目'},
        //                 {value:otherProject, name:'系统内其他项目'}
        //             ]
        //         }
        //     ]
        // };
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