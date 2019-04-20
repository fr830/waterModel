app.controller('customHomeController', function ($scope, $rootScope, $state, $stateParams, watchProjectService, NgTableParams, $filter) {
    var myBossProject=0;
    var normalProject=0;
    // var ProjectName = "";
    $scope.filter = {};
    var params;
    $scope.classification=function () {
        watchProjectService.query(params, $scope.filter,$rootScope.identity.result.User.UserId).then(function (data) {
            console.log(data);
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
                data:['负责项目','非负责项目']
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
                        {value:myBossProject, name:'负责项目'},
                        {value:normalProject, name:'非负责项目'}
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
        //         data:['负责项目','非负责项目']
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
        //                 {value:myBossProject, name:'负责项目'},
        //                 {value:normalProject, name:'非负责项目'}
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
            $state.go('app.system.watchProject');
        });
    }
});