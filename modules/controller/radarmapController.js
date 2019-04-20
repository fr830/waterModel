app.controller('radarmapController', function ($scope, $rootScope, $state,getPointDataDetailService, $stateParams,$timeout,showDataService, NgTableParams, userProjectService, $filter, mapFocusService) {
    var str=sessionStorage.selected;
    var temp = JSON.parse(str);
    console.log('sessionStorage.selected',temp);
    $scope.goId=$stateParams.Id;
    console.log("goId",$scope.goId);
	$scope.filename = temp[$scope.goId-1].selected;
	var Drag = dnd.Drag;
	var Drop = dnd.Drop;
	$scope.num = [1];
	$scope.files=[[],[]];
	$scope.allIndex = 1;
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
	$scope.csvDetail = '';
	
	//执行repeat完成后回调操作
	$scope.$on('repeatFinishCallback',function(){
    //这里写repeat后需要进行的操作
		// console.log(document.getElementsByClassName('droppable-box'));
		var droppableBoxs = document.getElementsByClassName('droppable-box');
		// for (var i = 0; i < droppableBoxs.length; i++) {
		// 	console.log( droppableBoxs.length,$scope.allIndex);
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
					// $scope.files[i]=[];
					// console.log(params,$scope.files[i]);
					params.methods.hideStateIcon();
					params.el.style.background = 'rgba(0, 0, 255, 0.1)';
					// console.log(params);
					// for (var j = 0; j < params.el.children.length; j++) {
					// 	console.log( params.el.children[j]);
					// 	if(params.el.children[j].id==''){continue;}
					// 	else{
					// 		console.log(i);
					// 		var index = $scope.files[i].indexOf(params.el.children[j].id);
					// 		if (index == -1) {
					// 			$scope.files[i].push(params.el.children[j].id);
					// 		}
							
					// 	}
					// }
					// console.log($scope.files[i]);
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
		console.log(document.getElementById('main1'));
		// $scope.createRadarmap('main1');
	});
	// console.log(document.getElementById('main'));
	$scope.createRadarmap = function(ids,csvdata){
		// console.log(document.getElementById('main'));
		document.getElementById(ids).style.height = 550+'px';
		var myChart = echarts.init(document.getElementById(ids));
		if(csvdata.length==0){
			myChart.clear();
			return;
		}
		var a={};
		for (var i = 1; i < csvdata.length; i++) {
		            a[parseFloat(csvdata[i].Depth)]=false;
		        }
		console.log(a);
		var option = {
		    // color : (function (){
		    //     var zrColor = require('zrender/tool/color');
		    //     return zrColor.getStepColors('yellow', 'red', 28);
		    // })(),
		    title : {
		        text: '不同深度各标量占比变化',
		        subtext: '',
		        x:'right',
		        y:'bottom',
		    },
		    grid :{
		    	y:0,
		    },
		    tooltip : {
		        trigger: 'item',
		        backgroundColor : 'rgba(0,0,250,0.6)'
		    },
		    legend: {
		    	selectedMode:'multiple',
		       	orient : 'vertical',
		        x : 'left',
		        y : 10,
		        selected:a,
		        data: function (){
		                var list = [];
		                for (var i = 0; i < csvdata.length; i++) {
		                	list.push(parseFloat(csvdata[i].Depth));
		                }
		                return list;
		            }()
		    },
		    toolbox: {
		        show : true,
		        orient : 'vertical',
		        y:'center',
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		   polar : [
		       {
		           indicator : [
		               { text: '温度', max: 100},
		               { text: 'ECuS', max: 500},
		               { text: 'DOmg', max: 40},
		               { text: 'Sal', max: 2},
		               { text: 'PH', max: 10},
		               { text: 'ORP', max: 500},
		               { text: 'Chla', max: 100},
		               { text: '浑浊度', max: 1000},
		               { text: '饱和度', max: 300},
		            ],
		            center : ['50%', 240],
		            radius : 150
		        }
		    ],
		    calculable : false,
		    series : (function (){
		        var series = [];
		        console.log(csvdata.length);
		        for (var i = 0; i < csvdata.length; i++) {
		            series.push({
		                name:'不同水深的标量变化',
		                type:'radar',
		                symbol:'none',
		                itemStyle: {
		                    normal: {
		                        lineStyle: {
		                          width:1
		                        }
		                    },
		                    emphasis : {
		                        areaStyle: {color:'rgba(0,250,0,0.3)'}
		                    }
		                },
		                data:[
		                  {
		                    value:[
			                   	parseFloat(csvdata[i].Temperature),
		                        parseFloat(csvdata[i].ECuS),
	                            parseFloat(csvdata[i].DOmg),
	                            parseFloat(csvdata[i].Sal),
	                            parseFloat(csvdata[i].pH),
	                            parseFloat(csvdata[i].ORP),
	                            parseFloat(csvdata[i].Chla),
	                            parseFloat(csvdata[i].Turbidity),
	                            parseFloat(csvdata[i].Saturation),
		                    ],
		                    name:parseFloat(csvdata[i].Depth)
		                  }
		                ]
		            })
		        }
		        return series;
		    })()
		};
		// alert('22222');
		myChart.setOption(option);
	}
	
 $scope.watchDataDetail=function(id,PointDataId){
 	console.log(PointDataId);
        getPointDataDetailService.querydetail(PointDataId).then(function (data) {
            $scope.csvDetail = data.result.Data;
            console.log($scope.csvDetail);
            $scope.createRadarmap('main'+id,$scope.csvDetail);
        }) 
        // console.log($scope.csvDetail);
    }

$scope.showRadar = function(id){
		console.log($scope.allIndex);
		console.log($scope.num);
		console.log("$scope.files",$scope.files);
		console.log(id);
		if($scope.files[id].length==0){
			$scope.createRadarmap('main'+id,[]);//如果数组为空，直接清空图的对象
		}else{
			for (var j = 0; j < $scope.files[id].length; j++) {
				console.log($scope.files[id][j]);
				$scope.watchDataDetail(id,$scope.files[id][j]);
			}
		}
		
	
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
