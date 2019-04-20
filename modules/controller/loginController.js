app.controller('loginController', function ($scope, $rootScope, $state, $cookies, Restangular, userService) {//, permissionService
    $rootScope.identity=null;
    $scope.loginRequest = {
        UserName: null,
        Password: null//,
        //Flag:1
    }
    $scope.login = function (e) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;

            if (!keycode) {
                return;
            }

            if (keycode != 0 && keycode != 1 && keycode != 13) {
                return;
            }
        }

        if ($scope.loginRequest.UserName != null && $scope.loginRequest.Password != null) {
            userService.login($scope.loginRequest).then(function (data) {
                console.log(data);
                //console.log(data.result.Token);
                 //console.log(data);
                // console.log(data.result.Token);
                $rootScope.identity = data;
                //console.log($rootScope.identity.result.Menu);
                function replacer(key, value) {
                     if (key === "UserProjectRelList") {
                         return value[0];
                      }
                      return value;
                 }
               
                //console.log(Restangular);
                // 权限
                if (data.code==200)
                { 
                    $cookies.put('identity', JSON.stringify($rootScope.identity, replacer));//data中包括的东西过多，此处删减
                    Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.result.Token });
                    $rootScope.permissions = data;
                    //console.log( $rootScope.identity);
                    if (data.result.Role.RoleCode==0){
                        $state.go('app.system.adminHome');
                        $rootScope.flag_admin = 0;
                    }else if (data.result.Role.RoleCode==1){
                        $state.go('app.system.pmHome');
                    }else{
                        $state.go('app.system.customHome');
                    }
                   // $state.go('app.home');
                }
                else{

                    Swal(data.message);
                }
                // permissionService.queryPermission().then(function (data) {
                //
                //
                // });
            });
        }
        else {
            Swal({
                title: '请输入用户名和密码！',
                text: 'Enter your account and password please!',
                type: 'error',
                confirmButtonText: '确定'
            })
        }
    };
    $scope.close = function () {
        window.location.href = "about:blank";
        window.close();
    };
});
