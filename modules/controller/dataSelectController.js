app.controller('dataSelectController', function ($scope, $rootScope, $state,  $stateParams,dataSelectService, NgTableParams, userProjectService, $filter, dataManageService) {
    $scope.ProjectId=$stateParams.ProjectId;
    console.log("ProjectId",$scope.ProjectId);
    // $scope.linechart=true;
    // $scope.floatchart=false;
    // $scope.cutchart=false;
    // $scope.threedchart=false;
    // $scope.radarchart=false;
    $scope.selectedType=null;
    $scope.checkedTable=[];
    $scope.fileName=[];
    $scope.selectedId=[];
    var selectedId=[];

    if (sessionStorage.counterNum==null||isNaN(sessionStorage.counterNum)){
        //console.log('2222222');
        sessionStorage.counterNum=1;
    }
    // if (sessionStorage.selected==undefined){
    //     // var item=[];
    //     // var str = JSON.stringify(item);
    //     console.log('11111');
    //     sessionStorage.selected=[];
    // }
    // console.log(sessionStorage.counterNum,sessionStorage.selected);
    $scope.getTree=function () {
        dataSelectService.getTree($scope.ProjectId).then(function (data) {
            if(data.code==200){
                console.log("$scope.treeData",$scope.treeData);
                $scope.treeData=data.result;
                $('#jstree').jstree({
                    'core': {
                        'data': $scope.treeData,
                        "themes": {
                            "theme": "classic",
                            "dots": true,
                            "icons": false
                        },
                    },
                    "plugins": ["themes", "json_data", "search", "checkbox"]
                });
                $('#jstree').bind("click.jstree", function (e) {
                    // 获取当前节点
                    var id = $(e.target).parents('li').attr('id');
                    //var PremaryId = $('#jstree').jstree().get_node("#"+id).PremaryId;
                    var text = $('#jstree').jstree().get_node("#"+id).text;
                    var ids = $('#jstree').jstree().get_checked();
                   // console.log("ids",ids);
                    // var i;var items=[];
                    // for (i=0;i<ids.length;i++){
                    //     var item={
                    //         id:ids[i],
                    //         text:$('#jstree').jstree().get_node("#"+ids[i]).text
                    //     }
                    //     items.push(item);
                    // }
                    // $scope.checkedTable=items;
                    $scope.tableFilter(ids);
                    $scope.tableParams = new NgTableParams({ sorting: { 'ID': 'asc' } }, {
                        dataset:$scope.checkedTable
                    });
                    $scope.tableParams.reload();
                });

                $('#jstree').bind("loaded.jstree", function (e, data) {
                    $('#jstree').jstree('open_all');
                });

            }else {
                swal({
                    title: data.message,
                    text: '',
                    type: 'warning',
                    confirmButtonColor: '#EE5C42',
                    confirmButtonText: '确定',
                })
            }
        })

    }
    $scope.getTree();
    $scope.init=function () {
    }
    $scope.init();
    // var arr = fileName.split('.');//        提取函数
    // //console.log(arr.length);
    // var suffix = arr[arr.length-1];//取文件格式
    $scope.tableFilter=function (data) {
        //console.log("table data",data);
        var i;var items=[];selectedId=[];
        for(i=0;i<data.length;i++){
            if (data[i].length>7){
                var arr = data[i].split('?');
                //console.log(arr[0],arr[1]);
                var item={
                    datasetName:$('#jstree').jstree().get_node("#"+arr[1]).text,
                    csvName:$('#jstree').jstree().get_node("#"+data[i]).text
                }

                var part={
                    name:$('#jstree').jstree().get_node("#"+data[i]).text,
                    id:arr[0]
                }
                $scope.fileName.push($('#jstree').jstree().get_node("#"+data[i]).text);
                $scope.selectedId.push(arr[0]);
                selectedId.push(part);
                items.push(item);
            }
        }
        //console.log(selectedId);

        $scope.checkedTable=items;
    };
    $scope.linechartSelected=function () {
        // if( $scope.linechart==true){//$scope.floatchart==false&&$scope.cutchart==false&&$scope.threedchart==false
        //     $scope.linechart=true;
            //console.log("1");
            //$('#linetype').css("background-color","#0099CC");
            $('#linetype').css("border","5px solid #0099CC");
            $('#floattype').css("border","");
            $('#cuttype').css("border","");
            $('#threedtype').css("border","");
            $('#radartype').css("border","");
            $scope.selectedType=0;
            //$('linetype')
            // $('linetype').style.backgroundColor='#0099CC';
        // }else if($scope.linechart==false){
        //     $scope.linechart=true;
        //     $scope.floatchart=false;
        //     $scope.cutchart=false;
        //     $scope.threedchart=false;
        // }
        //console.log("checkbox",$scope.linechart);
    }
    $scope.floatchartSelected=function () {
        $('#floattype').css("border","5px solid #0099CC");
        $('#linetype').css("border","");
        $('#cuttype').css("border","");
        $('#threedtype').css("border","");
        $('#radartype').css("border","");
        $scope.selectedType=1;
    }
    $scope.cutchartSelected=function () {
        $('#cuttype').css("border","5px solid #0099CC");
        $('#floattype').css("border","");
        $('#linetype').css("border","");
        $('#threedtype').css("border","");
        $('#radartype').css("border","");
        $scope.selectedType=2;
    }
    $scope.threedchartSelected=function () {
        $('#threedtype').css("border","5px solid #0099CC");
        $('#floattype').css("border","");
        $('#cuttype').css("border","");
        $('#linetype').css("border","");
        $('#radartype').css("border","");
        $scope.selectedType=3;
    }
    $scope.radarchartSelected=function () {
        $('#radartype').css("border","5px solid #0099CC");
        $('#floattype').css("border","");
        $('#cuttype').css("border","");
        $('#linetype').css("border","");
        $('#threedtype').css("border","");
        $scope.selectedType=4;
    }
    $scope.toShow=function () {
        //要跳转到展示界面，要想后传界面选择，判断哪个checkbox是true，之后传选择的数据组

        sessionStorage.Ids = $scope.selectedId;//需要用到的参数放到session里面，因为是一个框架token不需要从新赋值，直接调用
        sessionStorage.selectedType=$scope.selectedType;
        sessionStorage.fileName=$scope.fileName;

        // sessionStorage.Ids = selectedId;//需要用到的参数放到session里面，因为是一个框架token不需要从新赋值，直接调用
        // sessionStorage.selectedType=$scope.selectedType;
        // var item ={
        //     counter:sessionStorage.counterNum,
        //     selectedType:$scope.selectedType,
        //     selected:selectedId
        // }
        // if (sessionStorage.selected==undefined){
        //     var temp=[];
        //     temp.push(item);
        //     var str = JSON.stringify(temp);
        //     sessionStorage.selected=str;
        // }else {
        //     var str=sessionStorage.selected;
        //     var temp = JSON.parse(str);
        //     temp.push(item);
        //     str = JSON.stringify(temp);
        //     sessionStorage.selected=str;
        // }
        // var i=parseInt(sessionStorage.counterNum);
        // i+=1;
        // sessionStorage.counterNum=i;
        // console.log('sessionStorage.selected',temp);
        // console.log('sessionStorage.counterNum',sessionStorage.counterNum);

        if(selectedId.length==0){
            swal('请选择至少一组数据！');
            return;
        }else if($scope.selectedType==null){
            swal('请选择一种需要展示的图型！');
            return;
        }else {
            if($scope.selectedType==0){
                var url = $state.href("map",{ Id:sessionStorage.counterNum });
                // $state.go('map',{Id:sessionStorage.counterNum});
            }
            else if($scope.selectedType==4){
                var url = $state.href("radarmap",{ Id:sessionStorage.counterNum });
                // $state.go('radarmap',{Id:sessionStorage.counterNum});
                console.log(sessionStorage.counterNum);
            }else if($scope.selectedType==1){
                var i;
                for(i=0;i<$scope.checkedTable.length;i++){
                    if ($scope.checkedTable[i].datasetName!=$scope.checkedTable[0].datasetName){
                        swal('只能选择来自同一数据组的CSV！');
                        return;
                    }
                }
                var url = $state.href("planeGraph",{ Id:sessionStorage.counterNum });
            }else if($scope.selectedType==2){
                var i;
                for(i=0;i<$scope.checkedTable.length;i++){
                    if ($scope.checkedTable[i].datasetName!=$scope.checkedTable[0].datasetName){
                        swal('只能选择来自同一数据组的CSV！');
                        return;
                    }
                }
                var url = $state.href("sectionPlane",{ Id:sessionStorage.counterNum });
            }else{
                swal('仅线性图、雷达图、平面图可用');
                return;
            }
            //路由配置后跳转到新的页面，新页面也是angula框架，按照原来的方式写就好了
            // console.log(url);
            var item ={
                counter:sessionStorage.counterNum,
                selectedType:$scope.selectedType,
                selected:selectedId
            }
            if (sessionStorage.selected==undefined){
                var temp=[];
                temp.push(item);
                var str = JSON.stringify(temp);
                sessionStorage.selected=str;
            }else {
                var str=sessionStorage.selected;
                var temp = JSON.parse(str);
                temp.push(item);
                str = JSON.stringify(temp);
                sessionStorage.selected=str;
            }
            var i=parseInt(sessionStorage.counterNum);
            i+=1;
            sessionStorage.counterNum=i;
            // console.log('sessionStorage.selected',temp);
            // console.log('sessionStorage.counterNum',sessionStorage.counterNum);
            window.open(url,'_blank');
        }

    }
});
