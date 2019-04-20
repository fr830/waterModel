app.controller('appController', function ($rootScope, $scope, $state, API_URL, appService, permissionService) {
    if (!$rootScope.identity) {
        //$state.go('member.login');
    }

    $scope.$on('refreshMenu', function (event) {
        var data;
        // data=[
        //     {
        //         Checked:false,
        //         ID:"00",
        //         Icon:"zmdi-tag",
        //         Name:"项目管理",
        //         OrderNo:"1",
        //         SubPermissions:[
        //             {
        //                 Checked:false,
        //                 ID:"01",
        //                 Icon:null,
        //                 Name:"我的项目",
        //                 OrderNo:"1",
        //                 SubPermissions:null,
        //                 Url:"app.system.myProject"
        //             },
        //             {
        //                 Checked:false,
        //                 ID:"02",
        //                 Icon:null,
        //                 Name:"数据管理",
        //                 OrderNo:"2",
        //                 SubPermissions:null,
        //                 Url:"app.system.dataManage"
        //             }
        //         ],
        //         Url:"app.system.project"
        //     },
        //     {
        //         Checked:false,
        //         ID:"03",
        //         Icon:"zmdi-collection-text",
        //         Name:"数据展示",
        //         OrderNo:"1",
        //         SubPermissions:[
        //             {
        //                 Checked:false,
        //                 ID:"04",
        //                 Icon:null,
        //                 Name:"展示数据",
        //                 OrderNo:"1",
        //                 SubPermissions:null,
        //                 Url:"app.system.showData"
        //             }
        //         ],
        //         Url:"app.system.dataShow"
        //     },
        //     {
        //         Checked:false,
        //         ID:"05",
        //         Icon:"zmdi-settings",
        //         Name:"系统管理",
        //         OrderNo:"1",
        //         SubPermissions:[
        //             {
        //                 Checked:false,
        //                 ID:"06",
        //                 Icon:null,
        //                 Name:"账户管理",
        //                 OrderNo:"1",
        //                 SubPermissions:null,
        //                 Url:"app.system.mumberManager"
        //             }
        //         ],
        //         Url:"app.system.user"
        //     }
        // ]
        console.log($rootScope.identity)
        if(typeof($rootScope.identity)==="undefined"||$rootScope.identity==null){
            swal('登陆过期，请重新登陆！');
            window.location.href = "#!/views/login";
            return;
        }
        data=$rootScope.identity.result.Menu;
        console.log($rootScope.identity.result)
        $rootScope.admin_d = $rootScope.identity.result.Role
        $rootScope.menus = data;

        $rootScope.menus = data;
        //console.log($rootScope.menus);
        // permissionService.queryMenu().then(function (data) {
        //     $rootScope.menus = data;
        // });
    });

    $scope.allow = function (url) {
        if ($rootScope.identity && $rootScope.permissions) {
            return $rootScope.permissions.some(function (element) {
                return element.Url == url;
            })
        } else {
            return false;
        }
    };

    $scope.upload = function (files, errFiles, successFunc) {
        appService.upload(files, errFiles, '确定要上传吗？', function (response) {
            successFunc(response);
        });
    };

    $scope.attachmentUrl = function (id) {
        if (id != null) {
            return API_URL + "/Attachment/" + id;
        }
    };

    $scope.alert = function (message, onConfirm) {
        var swal = Swal({
            title: message,
            type: 'warning',
            confirmButtonText: '确定'
        })

        swal.then(function (result) {
            if (onConfirm) {
                onConfirm();
            }
        });

        return swal;
    };

    $scope.confirm = function (message, onConfirm) {
        var swal = Swal({
            title: message,
            type: 'question',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        });

        swal.then(function (result) {
            if (result.value) {
                if (onConfirm) {
                    onConfirm();
                }
            }
        })

        return swal;
    };
});
