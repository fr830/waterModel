app.controller('myProjectController', function ($scope, $rootScope, $state, userManageService, NgTableParams, viewColumnService, parameterService,$filter, myProjectService, companyManagerService) {
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

    userManageService.query().then(function (data) {
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
     $scope.reflash = function () {
         console.log($scope.filter);
        $scope.tableParams.reload();
    };

    $scope.edit= function (data) {
    	//console.log(data);
    	if (!data){
            var day = new Date();
            day.setTime(day.getTime());
            var s = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
    		$scope.model = emptyEntity;
            $scope.model.StartTime=$scope.model.EndTime=new Date(s);
    		isModify=0;
            $scope.model.project=null;
            $scope.model.UpdateTime=null;
            $scope.model.ProjectId=null;
            $scope.model.ProjectCode=null;
            $scope.model.leader=null;
            $scope.model.CompanyId=null;
            $scope.model.description=null;
            $('#modal-edit1').val("");
    		$('#modal-edit1').modal('show');

    	}else{
            $scope.model = angular.copy(data);
            $scope.model.project=data.ProjectName;
            $scope.model.UpdateTime=data.UpdateTime;
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
       if(!$scope.model.project||!$scope.model.leader||!$scope.model.EndTime||!$scope.model.StartTime){
            Swal('必填项没有全部输入，请正确填写');
            return;
        }
        if($scope.model.EndTime<$scope.model.StartTime){
            Swal('开始时间应小于结束时间');
            return
        }
        if(!$scope.model.CompanyId){
            swal('公司为必选项，请正确填写');
            return;
        }
    	if(!isModify){
            var now = new Date();
            var year = now.getFullYear().toString();       //年
            var month = (now.getMonth() + 1).toString();     //月
            var day = now.getDate().toString();            //日
            var hh = now.getHours().toString();            //时
            var mm = now.getMinutes().toString();          //分
            var ss = now.getSeconds().toString();           //秒
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

            if ($scope.model.project!=null && $scope.model.CompanyId!=null && $scope.model.leader!=null){
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
                    console.log(data);
                    if (data.code==200) {
                        swal('新建项目成功').then( function() {
                            $scope.tableParams.reload();
                            angular.copy(emptyEntity, newEntity);
                            $scope.editForm.$setPristine();
                            $('#modal-edit1').modal('hide');
                            $('#modal-edit1').val("");
                        });
                    }
                    else
                    {
                        mess='新建项目失败，错误信息：'+data.message;
                        swal(mess);
                    }
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
