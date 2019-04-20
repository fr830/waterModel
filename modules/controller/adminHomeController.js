app.controller('adminHomeController', function ($scope, $rootScope, $state, $stateParams,userManageService, NgTableParams, $filter) {
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
       option = {
           title : {
               text: '人员统计图',
               x:'center'
           },
           tooltip : {
               trigger: 'item',
               formatter: "{a} <br/>{b} : {c} ({d}%)"
           },
           legend: {
               x : 'center',
               y : 'bottom',
               data:['项目管理员','普通用户']
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
                       {value:projectManager, name:'项目管理员'},
                       {value:custom, name:'普通用户'}
                   ]
               }
           ]
       };

       // app.title = '人员统计图';
       //
       // option = {
       //     tooltip: {
       //         trigger: 'item',
       //         formatter: "{a} <br/>{b}: {c} ({d}%)"
       //     },
       //     legend: {
       //         orient: 'vertical',
       //         x: 'left',
       //         data:['项目管理员','普通用户']
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
       //                 {value:projectManager, name:'项目管理员'},
       //                 {value:custom, name:'普通用户'}
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
           $state.go('app.system.userManage');
       });
   }
});