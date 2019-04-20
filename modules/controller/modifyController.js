app.controller('modifyController',function($scope,$rootScope,$state,$cookies,$timeout,Restangular, modifyPasswordService){
	console.log($rootScope.identity.result.User.UserName);
    $scope.Updatapassword = {
		UserName:$rootScope.identity.result.User.UserName,
        OldPassword: null,
        NewPassword: null,
        rNewPassword:null
    }
	$scope.modifyPassword =function (){
		
		if(!($scope.Updatapassword.OldPassword&&$scope.Updatapassword.NewPassword&&$scope.Updatapassword.rNewPassword)){
			// alert("不能为空！");
			swal( '不能为空！');
		}		
		else if($scope.Updatapassword.NewPassword!=$scope.Updatapassword.rNewPassword){
			// alert("两次密码不一致！");
			swal('两次密码不一致！');
		}
		else if ($scope.Updatapassword.NewPassword==$scope.Updatapassword.rNewPassword){   
			
			modifyPasswordService.modify($scope.Updatapassword).then(function (data){
            	// console.log(data);
            	// 
            	var code = data.code;

            	if(code == 400){
            		swal('当前密码不正确!');
            	}else if(code == 200){

            		 swal(
            		 	{
            		 		title: '修改成功!',
            		 		//showCancelButton:"true",
        	                showConfirmButton:"true",
        	                confirmButtonText:"OK",
        	               
            		 	}).then(function(isConfirm){   
                            $rootScope.identity = null; 
                            Restangular.setDefaultHeaders({});
                            window.sessionStorage.clear();     
    		 	            $state.go('views.login');
    		 	                //$timeout($scope.back,1000);
            		 
            		    });
            		 // $timeout($scope.back,1000);
            		  // setInterval(back,3000);s
            		  //setTimeout("$scope.back()",500);
            		  //$scope.back(); 
            	}         
            });
		}
	}
   // $scope.back = function () {

   //       $rootScope.identity = null;
   //       $cookies.remove('identity');
   //       $state.go('views.login');   
   //  };
})

