app.controller('mapController', function ($scope, $rootScope, $state, $stateParams,$timeout,showDataService, NgTableParams, userProjectService, $filter, mapFocusService) {
	// $scope.tempFileName=sessionStorage.fileName.split(",");
	// $scope.ids=sessionStorage.Ids.split(",");
	// $scope.filenames = [];
	
	$scope.model={};
	$scope.model.allValue=[];//将所有Y轴数据汇总生成表格
	$scope.allValueList=[];//线条对应的颜色提示
	// $scope.ID="";//拖拽框的id
	// $scope.model.xAxis=[];
	// $scope.createFileNames=function(){
	// 	for(var i=0;$scope.tempFileName[i]&&$scope.ids[i];i++){
	// 		var filename={
	// 			'filename':$scope.tempFileName[i],
	// 			'fileid':$scope.ids[i]
	// 		}
	// 		$scope.filenames.push(filename);
	// 	}
	// }
	// $scope.createFileNames();
	
	
	var str=sessionStorage.selected;
    var temp = JSON.parse(str);
    // console.log('sessionStorage.selected',temp);
    $scope.goId=$stateParams.Id;
    // console.log("goId",$scope.goId);
	$scope.filename = temp[$scope.goId-1].selected;
	// console.log($scope.filename);
	var Drag = dnd.Drag;
	var Drop = dnd.Drop;
	$scope.num = [1];
	$scope.allIndex = 1;
	$scope.files=[[],[]];
	var Num=0;//用于生成y轴数据的id

	$scope.judgeShow=function(team){

		var react=document.getElementById("radio"+team).checked;
		console.log(react);
		if(react==true) return false;
		else return true;
	}

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

    $scope.DataTypes = ["pH", "饱和", "ECuS", "Sal", "浊度", "ORP", "水温", "Chla", "DOmg", "水深"]; //根据数据类型输出相应的表格
    //用于图表函数的参数

	$scope.showLine=function(id,status){
		// var selectid="select"+id;
		Num=0;console.log("$scope.files",$scope.files);
		if(status==0){
			for (var j = 0; j < $scope.files[id].length; j++) {
				// console.log("666",$scope.files[id].length-1,j,$scope.files[id][j]);
				$scope.createChart(j,'main'+id,$scope.files[id][j],id);
			}
		
			// console.log(document.getElementById(id));
			// console.log(document.getElementById('main'+id));
		}else{
			for (var j = 0; j < $scope.files[id].length; j++) {
				// console.log($scope.files[id][j]);
				$scope.update(j,'main'+id,$scope.files[id][j],id);
			}
		}
		
	}
	var valueList=[]
	
	$scope.createChart=function(num,chartId,pointId,id){//参数num暂时没用
		


		// Num=num;
		// console.log(Num,chartId,pointId);
		$scope.isSelected(id);
		// console.log("valueList",id,valueList);
    	//指定图标的配置和数据
    	$scope.model.dataTypeX=document.getElementById("select"+id).value.slice(7);
    	// console.log($scope.model.dataTypeX,document.getElementById("select"+id).value.slice(7));
        var pDatas = [];
        var valueInfo = [[], [], [], [], [], [], [], [], [], []]; //用于计算最值
        var dataInfo = [[], [], [], [], [], [], [], [], [], []]; //一般数据,用于生成表格
        var XAxis;
        var valueForEchart = [];
        var i, j;
	        mapFocusService.showPoint(pointId).then(function(data) {
	        	 if (data.code!=200) {
                    mess='增加失败：'+data.message;
                    swal(mess);
                    return;
                }
	        	// console.log("data",data,valueList.length);
	            pDatas = data.result.Data;
	            
	            if ($scope.model.dataTypeX == "水温") pDatas = pDatas.sort($scope.compare("Temperature"));
	            else if ($scope.model.dataTypeX == "饱和") pDatas = pDatas.sort($scope.compare("Saturation"));
	            else if ($scope.model.dataTypeX == "浊度") pDatas = pDatas.sort($scope.compare("Turbidity"));
	            else if ($scope.model.dataTypeX == "水深") pDatas = pDatas.sort($scope.compare("Depth"));
	            else if ($scope.model.dataTypeX == "Sal") pDatas = pDatas.sort($scope.compare("Sal"));
	            else if ($scope.model.dataTypeX == "ORP") pDatas = pDatas.sort($scope.compare("ORP"));
	            else if ($scope.model.dataTypeX == "Chla") pDatas = pDatas.sort($scope.compare("Chla"));
	            else if ($scope.model.dataTypeX == "DOmg") pDatas = pDatas.sort($scope.compare("DOmg"));
	            else if ($scope.model.dataTypeX == "ECuS") pDatas = pDatas.sort($scope.compare("ECuS"));
	            else pDatas = pDatas.sort($scope.compare("pH"));
	            //根据x轴的数据来排序
	            // console.log(pDatas);                
	            for (j = 0; pDatas[j]; j++) {
	                for (var k = 0; k < 10; k++) {
	                    var n = sift($scope.DataTypes[k], pDatas[j]);
	                    dataInfo[k].push(n);
	                    valueInfo[k].push(n);
	                }
	            };
	            // console.log(dataInfo);
	            //
	            XAxis = dataInfo[judgeX($scope.model.dataTypeX)]; //x轴数据
	            XAxis=XAxis.sort();
	                            // console.log(dataInfo,valueInfo,valueList.length,XAxis);
	                            //根据valueist的元素个数，一个按原来的数值处理，两个以上进行规划处理
	            if (valueList.length == 1) {
	                for (var a = 0; valueList[a]; a++) {

	                    var Line = {
	                           	name: Num.toString()+valueList[a],
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
	                Xmin = Xmin.toFixed(2);
	                Xmax = Xmax.toFixed(2);
	                                // console.log(Xmin,Xmax);
	                // var option = {
	                //                     // visualMap: {
	                //                     //     show: true,
	                //                     //     type: 'continuous',
	                //                     //     seriesIndex: 0,
	                //                     //     min: 0,
	                //                     //     max: 400
	                //                     // },
	                //     title: {
	                //                         // text:$scope.model.dataType
	                //                         // text:'数据统计'
	                //     },
	                //     tooltip: {
	                //         trigger: 'axis'
	                //     },
	                //     legend: {
	                //         data: valueList
	                //     },
	                //     xAxis: {
	                //         name: $scope.model.dataTypeX,
	                //         data: XAxis
	                //     },
	                //     yAxis: {
	                //         min: Min,
	                //         max: Max,
	                //         type: 'value',
	                //                         // name:$scope.model.dataType,
	                //         splitLine: {
	                //             show: true
	                //         },
	                //         splitNumber: 10
	                //     },
	                //     series: valueForEchart
	                // };
	                             
	                //                 //使用制定的配置项和数据显示图表
	                // myChart.setOption(option, true);

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
	                    	name: Num.toString()+valueList[a],
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
	                Xmin = Xmin.toFixed(2);
	                Xmax = Xmax.toFixed(2);
	                                // console.log(Xmin,Xmax);
	                // var option = {
	                //                     // visualMap: {
	                //                     //     show: true,
	                //                     //     type: 'continuous',
	                //                     //     seriesIndex: 0,
	                //                     //     min: 0,
	                //                     //     max: 400
	                //                     // },
	                //     title: {
	                //                         // text:$scope.model.dataType
	                //                         // text:'数据统计'
	                //    	},
	                //     tooltip: {
	                //         trigger: 'axis'
	                //    	},
	                //     legend: {
	                //         data: valueList
	                //     },
	                //     xAxis: {
	                //         name: $scope.model.dataTypeX,
	                //         data: XAxis
	                //    },
	                //     yAxis: {
	                //             min: -1,
	                //             max: 1,
	                //             type: 'value',
	                //                         // name:$scope.model.dataType,
	                //             plitLine: {
	                //                 show: true
	                //             },
	                //             splitNumber: 10
	                //     },
	                //     series: valueForEchart
	                // };

	                //                 //使用制定的配置项和数据显示图表
	                // myChart.setOption(option);
	                
	            }
	            // console.log("show",id,Num,XAxis,valueList,valueForEchart,chartId);
	           
	            $scope.show(id,XAxis,valueList,valueForEchart,chartId,Xmax,Xmin);
	            // console.log("valueForEchart",valueForEchart);
	            // if(num==$scope.files[id].length-1) myChart.clear();
	        });
			
	}

	$scope.update=function(num,chartId,pointId,id){
		// console.log(chartId,pointId);
		// Num=num;
		$scope.isSelected(id);
		console.log("valueList",valueList);
		$scope.model.dataTypeX=document.getElementById("select"+id).value.slice(7);
    	//指定图标的配置和数据
        var pDatas = [];
        var valueInfo = [[], [], [], [], [], [], [], [], [], []]; //用于计算最值
        var dataInfo = [[], [], [], [], [], [], [], [], [], []]; //一般数据,用于生成表格
        var XAxis;
        var valueForEchart =[];
        var i, j;
	        mapFocusService.showPoint(pointId).then(function(data) {
	        	 if (data.code!=200) {
                    mess='增加失败：'+data.message;
                    swal(mess);
                    return;
                }
	        	// console.log("data",data,valueList.length);
	            pDatas = data.result.Data;
	            // console.log(pDatas,$scope.model.dataTypeX);
	            if ($scope.model.dataTypeX == "水温") pDatas = pDatas.sort($scope.compare("Temperature"));
	            else if ($scope.model.dataTypeX == "饱和") pDatas = pDatas.sort($scope.compare("Saturation"));
	            else if ($scope.model.dataTypeX == "浊度") pDatas = pDatas.sort($scope.compare("Turbidity"));
	            else if ($scope.model.dataTypeX == "水深") pDatas = pDatas.sort($scope.compare("Depth"));
	            else if ($scope.model.dataTypeX == "Sal") pDatas = pDatas.sort($scope.compare("Sal"));
	            else if ($scope.model.dataTypeX == "ORP") pDatas = pDatas.sort($scope.compare("ORP"));
	            else if ($scope.model.dataTypeX == "Chla") pDatas = pDatas.sort($scope.compare("Chla"));
	            else if ($scope.model.dataTypeX == "DOmg") pDatas = pDatas.sort($scope.compare("DOmg"));
	            else if ($scope.model.dataTypeX == "ECuS") pDatas = pDatas.sort($scope.compare("ECuS"));
	            else pDatas = pDatas.sort($scope.compare("pH"));
	            //根据x轴的数据来排序
	            // console.log(pDatas);                
	            for (j = 0; pDatas[j]; j++) {
	                for (var k = 0; k < 10; k++) {
	                    var n = sift($scope.DataTypes[k], pDatas[j]);
	                    dataInfo[k].push(n);
	                    valueInfo[k].push(n);
	                }
	            };
	           // console.log(dataInfo);
	            XAxis = dataInfo[judgeX($scope.model.dataTypeX)]; //x轴数据
	            XAxis=XAxis.sort();
	                            // console.log(dataInfo,valueInfo,valueList.length,XAxis);
	                            //根据valueist的元素个数，一个按原来的数值处理，两个以上进行规划处理
	            if (valueList.length == 1) {
	                for (var a = 0; valueList[a]; a++) {

	                    var Line = {
	                           	name: Num.toString()+valueList[a],
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
	                Xmin = Xmin.toFixed(2);
	                Xmax = Xmax.toFixed(2);
	                                // console.log(Xmin,Xmax);
	                // var option = {
	                //                     // visualMap: {
	                //                     //     show: true,
	                //                     //     type: 'continuous',
	                //                     //     seriesIndex: 0,
	                //                     //     min: 0,
	                //                     //     max: 400
	                //                     // },
	                //     title: {
	                //                         // text:$scope.model.dataType
	                //                         // text:'数据统计'
	                //     },
	                //     tooltip: {
	                //         trigger: 'axis'
	                //     },
	                //     legend: {
	                //         data: valueList
	                //     },
	                //     xAxis: {
	                //         name: $scope.model.dataTypeX,
	                //         data: XAxis
	                //     },
	                //     yAxis: {
	                //         min: Min,
	                //         max: Max,
	                //         type: 'value',
	                //                         // name:$scope.model.dataType,
	                //         splitLine: {
	                //             show: true
	                //         },
	                //         splitNumber: 10
	                //     },
	                //     series: valueForEchart
	                // };
	                             
	                //                 //使用制定的配置项和数据显示图表
	                // myChart.setOption(option);

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
	                    	name: Num.toString()+valueList[a],
	                    	type: 'line',
	                    	data: valueInfo[num]
	                	};
	                                    // console.log(Line);
	                    valueForEchart.push(Line);
	                }
	                var Xmin = parseFloat(XAxis[0]);
	                var Xmax = parseFloat(XAxis[XAxis.length - 1]);
	                                // console.log(Xmin,Xmax);
	                Xmin = Xmin.toFixed(2);
	                Xmax = Xmax.toFixed(2);
	                                // console.log(Xmin,Xmax);
	                // var option = {
	                //                     // visualMap: {
	                //                     //     show: true,
	                //                     //     type: 'continuous',
	                //                     //     seriesIndex: 0,
	                //                     //     min: 0,
	                //                     //     max: 400
	                //                     // },
	                //     title: {
	                //                         // text:$scope.model.dataType
	                //                         // text:'数据统计'
	                //    	},
	                //     tooltip: {
	                //         trigger: 'axis'
	                //    	},
	                //     legend: {
	                //         data: valueList
	                //     },
	                //     xAxis: {
	                //         name: $scope.model.dataTypeX,
	                //         data: XAxis
	                //    },
	                //     yAxis: {
	                //             min: -1,
	                //             max: 1,
	                //             type: 'value',
	                //                         // name:$scope.model.dataType,
	                //             plitLine: {
	                //                 show: true
	                //             },
	                //             splitNumber: 10
	                //     },
	                //     series: valueForEchart
	                // };

	                //                 //使用制定的配置项和数据显示图表
	                // myChart.setOption(option);
	            }
	            
	            $scope.show(id,XAxis,valueList,valueForEchart,chartId,Xmax,Xmin);
	        });
	}

	var valueLength=0;
	var status=false;//y轴是否倒置
	$scope.show=function(id,XAxis,valueList,valueForEchart,chartId,Xmax,Xmin){
		Num++;
		var myChart = echarts.init(document.getElementById(chartId));//初始化echarts实例
		var pairList=[];
		var n=0;
		 console.log("lalalal",valueForEchart,Xmax,Xmin);
		for(var i=0;valueForEchart[i];i++){
			n++;
			for(var j=0;valueForEchart[i].data[j];j++){
				var dataPair=[XAxis[j],valueForEchart[i].data[j]];
				pairList.push(dataPair);
			}
				var value=valueForEchart[i];
				if(toString(value.name)=="水深") status=true;
			console.log("valueForEchart[i]",i,valueForEchart[i],pairList,value.name,status);
				$scope.model.allValue.push(pairList);
				$scope.allValueList.push(value.name);
				pairList=[];
		}
		console.log("allValue",n,valueForEchart,$scope.model.allValue);
		if(valueLength==$scope.files[id].length-1){
			valueLength=0;
			if(valueList.length==1){
				var option = {
	                    // tooltip: {
	                    //     trigger: 'axis'
	                    // },
	                    // legend: {
	                    //     data: $scope.allValueList
	                    // },
	                    // xAxis: {
	                    //     name: $scope.model.dataTypeX,
	                    //     data: XAxis
	                    // },
	                    // yAxis: {
	                    //     // min: Min,
	                    //     // max: Max,
	                    //     type: 'value',
	                    //                     // name:$scope.model.dataType,
	                    //     splitLine: {
	                    //         show: true
	                    //     },
	                    //     splitNumber: 10
	                    // },
    				tooltip : {
        				trigger: 'axis',
        				axisPointer:{
            				show: true,
            				type : 'cross',
            				lineStyle: {
                			type : 'dashed',
                			width : 1
            				}
        				},
    				},
    				legend: {
        				data:$scope.allValueList
    				},
    				toolbox: {
        				show : true,
        				feature : {
            				dataView : {show: true, readOnly: false},
            				saveAsImage : {show: true}
        				}
    				},
    				calculable :true,
    				xAxis : [
        				{
        					min: Xmin,
                            max: Xmax,
            				type: 'value'
        				}
    				],
    				yAxis : [
       				 	{
       				 		inverse:status,
           					type: 'value',
            				axisLine: {
                				lineStyle: {
                    				color: '#dc143c'
                				}
            				}
        				}
    				],
		    			series : (function (){
		        			var series = [];
		        			console.log("in function series");
		        			for (var i = 0; $scope.allValueList[i]; i++) {
		        				if(i==0){
		        					series.push({
		                			name:$scope.allValueList[i],
		               			 	type:'line',
		                			data:$scope.model.allValue[i],
		                // 			markPoint : {
                		// 				data : [
                  //   // 纵轴，默认
                  //   						{type : 'max', name: '最大值',symbol: 'emptyCircle', itemStyle:{normal:{color:'#dc143c',label:{position:'top'}}}},
                  //   						{type : 'min', name: '最小值',symbol: 'emptyCircle', itemStyle:{normal:{color:'#dc143c',label:{position:'bottom'}}}},
                  //   // 横轴
                  //   						{type : 'max', name: '最大值', valueIndex: 0, symbol: 'emptyCircle', itemStyle:{normal:{color:'#1e90ff',label:{position:'right'}}}},
                  //   						{type : 'min', name: '最小值', valueIndex: 0, symbol: 'emptyCircle', itemStyle:{normal:{color:'#1e90ff',label:{position:'left'}}}}
               		 // 					]
            						// },
            						markLine : {
                						data : [
                    // 纵轴，默认
                    						{type : 'max', name: '最大值', itemStyle:{normal:{color:'#dc143c'}}},
                   						 	{type : 'min', name: '最小值', itemStyle:{normal:{color:'#dc143c'}}},
                    						{type : 'average', name : '平均值', itemStyle:{normal:{color:'#dc143c'}}},
                    // 横轴
                    						{type : 'max', name: '最大值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}},
                    						{type : 'min', name: '最小值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}},
                    						{type : 'average', name : '平均值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}}
                						]
            						}
		            			})
		        				}else{
		        					series.push({
		                			name:$scope.allValueList[i],
		               			 	type:'line',
		                			data:$scope.model.allValue[i]
		            			})
		        				}

		        			}
		        			return series;
		    			})()
	                };
	                // console.log("option",option);
			}else{
				var option = {
	                    // tooltip: {
	                    //     trigger: 'axis'
	                    // },
	                    // legend: {
	                    //     data: $scope.allValueList
	                    // },
	                    // xAxis: {
	                    //     name: $scope.model.dataTypeX,
	                    //     data: XAxis
	                    // },
	                    // yAxis: {
	                    //     // min: Min,
	                    //     // max: Max,
	                    //     type: 'value',
	                    //                     // name:$scope.model.dataType,
	                    //     splitLine: {
	                    //         show: true
	                    //     },
	                    //     splitNumber: 10
	                    // },
    				tooltip : {
        				trigger: 'axis',
        				axisPointer:{
            				show: true,
            				type : 'cross',
            				lineStyle: {
                			type : 'dashed',
                			width : 1
            				}
        				},
    				},
    				legend: {
        				data:$scope.allValueList
    				},
    				toolbox: {
        				show : true,
        				feature : {
            				dataView : {show: true, readOnly: false},
            				saveAsImage : {show: true}
        				}
    				},
    				calculable : true,
    				xAxis : [
        				{
        					min: Xmin,
                            max: Xmax,
            				type: 'value'
        				}
    				],
    				yAxis : [
       				 	{
	                        min: -1,
	                        max: 1,
	                        splitLine: {
	                            show: true
	                        },
	                        splitNumber: 10,
           					type: 'value',
            				axisLine: {
                				lineStyle: {
                    				color: '#dc143c'
                				}
            				}
        				}
    				],
		    			series : (function (){
		        			var series = [];
		        			// console.log("in function series");
		        			for (var i = 0; $scope.allValueList[i]; i++) {
		        				if(i==0){
		        					series.push({
		                			name:$scope.allValueList[i],
		               			 	type:'line',
		               			 	// showSymbol: true,
		                			data:$scope.model.allValue[i],
		                // 			markPoint : {
                		// 				data : [
                  //   // 纵轴，默认
                  //   						{type : 'max', name: '最大值',symbol: 'emptyCircle', itemStyle:{normal:{color:'#dc143c',label:{position:'top'}}}},
                  //   						{type : 'min', name: '最小值',symbol: 'emptyCircle', itemStyle:{normal:{color:'#dc143c',label:{position:'bottom'}}}},
                  //   // 横轴
                  //   						{type : 'max', name: '最大值', valueIndex: 0, symbol: 'emptyCircle', itemStyle:{normal:{color:'#1e90ff',label:{position:'right'}}}},
                  //   						{type : 'min', name: '最小值', valueIndex: 0, symbol: 'emptyCircle', itemStyle:{normal:{color:'#1e90ff',label:{position:'left'}}}}
               		 // 					]
            						// },
            						markLine : {
                						data : [
                    // 纵轴，默认
                    						{type : 'max', name: '最大值', itemStyle:{normal:{color:'#dc143c'}}},
                   						 	{type : 'min', name: '最小值', itemStyle:{normal:{color:'#dc143c'}}},
                    						{type : 'average', name : '平均值', itemStyle:{normal:{color:'#dc143c'}}},
                    // 横轴
                    						{type : 'max', name: '最大值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}},
                    						{type : 'min', name: '最小值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}},
                    						{type : 'average', name : '平均值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}}
                						]
            						}
		            			})
		        				}else{
		        					series.push({
		                			name:$scope.allValueList[i],
		               			 	type:'line',
		               			 	// showSymbol: true,
		                			data:$scope.model.allValue[i]
		            			})
		        				}

		        			}
		        			return series;
		    			})()
	                };

			
	        };
	        // console.log($scope.allValueList,option);
	        myChart.clear();
	                                //使用制定的配置项和数据显示图表
	        myChart.setOption(option,true);
	        $scope.model.allValue=[];
	        $scope.allValueList=[];
	        // console.log("again",$scope.allValueList);
	        Num=0;
	        // $scope.model.xAxis=[];
		}else{valueLength++;}
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
    $scope.compare=function(prop){
    	return function(a,b){
    		var value1=a[prop];
    		var value2=b[prop];
    		return value1-value2;
    	}
    }


    $scope.isSelected = function(id) {
        // // console.log(item);
        // var action = event.target;
        // if (document.getElementById("check"+"item"+id).checked) {
        //     // if($scope.conf[$index]){
        //     var j;
        //     var repeat = 0;
        //     for (j = 0; valueList[j]; j++) {
        //         if (item == valueList[j]) {
        //             // console.log(id);
        //             // console.log($scope.MemberList[j].user.UserId);
        //             repeat = 1;
        //             break;
        //         }
        //     }

        //     if (repeat == 0) {
        //         valueList.push(item);
        //     }

        // } else {
        //     var j;
        //     for (j = 0; valueList[j]; j++) {
        //         if (item == valueList[j]) {
        //             // console.log(id);
        //             // console.log($scope.MemberList[j].user.UserId);
        //             valueList.splice(j, 1);
        //             break;
        //         }
        //     }
        // }
        // console.log("tempList",valueList);
        valueList=[];
        status=false;
        for(var i=0;$scope.DataTypes[i];i++){
        	if (document.getElementById("check"+$scope.DataTypes[i]+id).checked){
        		if($scope.DataTypes[i]=="水深") status=true;
        		valueList.push($scope.DataTypes[i]);
        	}
        }
    };

    $scope.defult = function(item) {
        if(item=="pH") return true;
        return false;
    };



	//执行repeat完成后回调操作
	$scope.$on('repeatFinishCallback',function(){
    //这里写repeat后需要进行的操作
		// console.log(document.getElementsByClassName('droppable-box'));
		var droppableBoxs = document.getElementsByClassName('droppable-box');
		// for (var i = 0; i < droppableBoxs.length; i++) {
		// 	console.log( droppableBoxs.length,$scope.allIndex);
			// console.log(droppableBoxs.length);
            console.log(droppableBoxs);
			
			// $scope.files[droppableBoxs.length]=[];  #l
			
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
					// console.log( params);
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


 //    //执行repeat完成后回调操作
	// $scope.$on('repeatFinishCallback',function(){
 //    //这里写repeat后需要进行的操作
	// 	// console.log(document.getElementsByClassName('droppable-box'));
	// 	var droppableBoxs = document.getElementsByClassName('droppable-box');
	// 	// for (var i = 0; i < droppableBoxs.length; i++) {
	// 	// 	console.log( droppableBoxs.length,$scope.allIndex);
	// 		console.log(droppableBoxs.length);
 //            console.log(droppableBoxs);
	// 		$scope.files[droppableBoxs.length]=[];
	// 		var indexOfBox = parseInt(droppableBoxs[droppableBoxs.length-1].id);//用最新模态框的id做数组的最新值
	// 		$scope.files[indexOfBox]=[];
	// 		new Drop(droppableBoxs[droppableBoxs.length-1], {
	// 			onDragStart: function(params) {
	// 				params.el.style.background = 'rgba(0, 0, 255, 0.1)';
	// 			},
	// 			onDragEnter: function(params) {
	// 				params.methods.showStateIcon('add');
	// 				params.el.style.background = 'rgba(0, 0, 255, 0.2)';
	// 			},
	// 			onDragLeave: function(params) {
	// 				params.methods.hideStateIcon();
	// 				params.el.style.background = 'rgba(0, 0, 255, 0.1)';
	// 			},
	// 			onDragEnd: function(params) {
	// 				params.el.style.background = '#fff';
	// 				for (var j = 0; j < params.el.children.length; j++) {
	// 					if(params.el.children[j].id==''){continue;}
	// 					else{
	// 						// console.log(i);
	// 						var index = $scope.files[droppableBoxs.length].indexOf(params.el.children[j].id);
	// 						if (index == -1) {
	// 							$scope.files[droppableBoxs.length].push(params.el.children[j].id);
	// 						}
	// 					}
	// 				}
	// 			},
	// 			onDrop: function(params) {
	// 				// console.log( params);
	// 				var flag = false;
	// 				//判断复制的根节点是否在框中
	// 				for (var i = 0; i < params.el.children.length; i++) {
	// 					if(params.el.children[i].id==params.sourceNode.id){
	// 						flag=true;
	// 						break;
	// 					}
	// 				}
	// 				console.log(flag);
	// 				if(flag==true){
	// 					params.methods.removeDragedNode('back');//如果在框中不允许拖入
	// 				}else{
	// 					params.methods.removeDragedNode('fade');
	// 					var newNode = params.sourceNode.cloneNode(true);
	// 					params.el.appendChild(newNode);
	// 					console.log( params);	
	// 					createNewDrop(newNode);
	// 				}
	// 			}
	// 		})
	// 	// }
	// });

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
		// console.log(document.getElementById('main1'),"1111",document.getElementById("select1"));
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
				// console.log(params.el);
				var parent = params.el.parentElement;
				parent.removeChild(params.el);
			}
		})
	}

	$(document).ready(function() { 
		$scope.onload();
	});


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
