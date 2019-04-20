var app = angular.module('waterModel', [
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'ngFileUpload',
    'ngSanitize',
    'ngTable',
    'oc.lazyLoad',
    'restangular'
]);

 



app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider','$qProvider', function ($stateProvider, $urlRouterProvider, $httpProvider,$qProvider) {
    // 禁用缓存
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    // 路由配置
    registerRouter($stateProvider, $urlRouterProvider, $httpProvider);
}]);

// 顶部进度条
app.run(function ($transitions, $state, $rootScope, $templateCache, $trace) {
    $transitions.onSuccess({}, function (transition) {
        Pace.restart();
    });
});

// 数据访问
app.run(function ($rootScope, $state, $cookies, API_URL, Restangular, permissionService) {
    Restangular.setBaseUrl(API_URL);
    $rootScope.identity != null
    // $rootScope.identity = $cookieStore.get('identity');
    if ($cookies.get('identity')!= null) {
        $rootScope.identity = JSON.parse($cookies.get('identity'));
    }

    // var token = '';

    // if ($rootScope.identity != null) {
    //     token = $rootScope.identity.Token;
    //     Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + token });
    // }


    // $rootScope.identity = $cookies.get('identity');
    // console.log(window.location.pathnam);
    if(typeof($rootScope.identity)==="undefined"){
        swal('登陆过期，请重新登陆！');
        window.location.href = "#!/views/login";
        // $state.go('views.login');
        // http://localhost:1112/#!/views/login
        return;
    }
    var token = '';
    if ($rootScope.identity) {
        token = $rootScope.identity.result.Token;
        console.log(token);
        Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + token });
    }
    // if (!$rootScope.identity || !$rootScope.identity.Token) {
    //     console.log($location.path())
    //     if ($location.path() != '/views/login') {
    //         swal("登录已过期，请重新登录！");
    //         $cookieStore.put('identity', null);
    //         $rootScope.identity = null; 
    //         Restangular.setDefaultHeaders({});
    //         window.sessionStorage.clear();
    //         window.location.href = "index.html#/views/login";
    //     }
    // }
    // if (!$rootScope.identity || !$rootScope.identity.Token) {
    //     console.log($location.path())
    //     if ($location.path() != '/views/login') {
    //         swal("登录已过期，请重新登录！");
    //         $cookieStore.put('identity', null);
    //         $rootScope.identity = null; 
    //         Restangular.setDefaultHeaders({});
    //         window.sessionStorage.clear();
    //         window.location.href = "index.html#!/views/login";
    //     }
    // }
    Restangular.setRequestInterceptor(function (elem, operation, what) {
        if (!$rootScope.proc) {
            $rootScope.proc = 1;

            $('.page-loader-wrapper').show();
        }
        else {
            $rootScope.proc++;
        }

        return elem;
    });

    Restangular.setResponseInterceptor(function (data, operation, what) {
        $rootScope.proc--;
        if ($rootScope.proc <= 0) {
            $rootScope.proc = 0;

            $('.page-loader-wrapper').fadeOut();
        }

        return data;
    });
    Restangular.setResponseInterceptor(function (data, operation, what, url, response, deferred) {
        if(data.code == 400 || data.code == 401 || data.code == 402 || data.code == 403 || data.code == 500) {
            deferred.reject(data);
            swal(data.message);
        }
        else {
            return data;
        }
    });
    Restangular.setErrorInterceptor(function (resp) {
        $rootScope.proc--;

        if ($rootScope.proc <= 0) {
            $rootScope.proc = 0;

            $('.page-loader-wrapper').fadeOut();
        }
        if (resp.status == 401) {
            $('.page-loader-wrapper').fadeOut();
            swal("登陆过期，请重新登陆！");
            $state.go('views.login');
        }
        else {
            if (resp.status == -1) {
                Swal({
                    title: "内部错误！",
                    text: "无法连接到服务器，请联系系统管理员！",
                    type: 'error',
                    confirmButtonText: '确定'
                })
            } else if (resp.data && resp.data.Message) {
                Swal({
                    title: "内部错误！",
                    text: resp.data.Message,
                    type: 'error',
                    confirmButtonText: '确定'
                })
            }
            else {
                Swal({
                    title: '内部错误! ',
                    text: "请联系系统管理员！",
                    type: 'error',
                    confirmButtonText: '确定'
                })
            }

            return false;
        }
    });

    // if ($rootScope.identity != null) {
    //     // 权限
    //     permissionService.queryPermission().then(function (data) {
    //         $rootScope.permissions = data;
    //     });
    // }
});

// 浏览器自适应class
app.run(function ($rootScope, $state) {
    var getBrowser = function () {
        var userAgent = navigator.userAgent.toLowerCase();

        if (/edge/i.test(userAgent)) {
            return 'edge';
        } else if (/rv:11/i.test(userAgent)) {
            return 'ie11';
        } else if (/msie 10/i.test(userAgent)) {
            return 'ie10';
        } else if (/opr/i.test(userAgent)) {
            return 'opera';
        } else if (/chrome/i.test(userAgent)) {
            return 'chrome';
        } else if (/firefox/i.test(userAgent)) {
            return 'firefox';
        } else if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
            return 'safari';
        }

        return undefined;
    };

    var className = getBrowser();

    if (className !== '') {
        $('html').addClass(className);
    }
});

// 其他配置
app.run(function ($rootScope, $state, setting) {
    $rootScope.$state = $state;
    $rootScope.setting = setting;
});