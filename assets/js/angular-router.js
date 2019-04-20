var registerRouter = function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/views/login');
    $stateProvider
        .state('views', {
            url: '/views',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('views.login', {
            url: '/login',
            data: { pageTitle: '用户登录', subTitle: 'User Login' },
            templateUrl: 'modules/views/login.html'
        })
        .state('views.login2', {
            url: '/login2',
            data: { pageTitle: '用户登录', subTitle: 'User Login' },
            templateUrl: 'modules/views/login2.html'
        })
        .state('app', {
            url: '/app',
            templateUrl: 'template/app.html',
            abstract: true
        })
        .state('app.home', {
            url: '/home',
            data: { pageTitle: '首页', subTitle: 'Home' },
            templateUrl: 'modules/app/home.html'
        })
        .state('app.base', {
            url: '/base',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.base.Respond', {
            url: '/Respond',
            data: { pageTitle: '响应时间', subTitle: 'SupplierRespondTime Management' },
            templateUrl: 'modules/views/SupplierRespondTime.html'
        })
        .state('app.base.plant', {
            url: '/plant',
            data: { pageTitle: '工厂管理', subTitle: 'Plant Management' },
            templateUrl: 'modules/views/plant.html'
        })
        .state('app.base.plant2', {
            url: '/plant2',
            data: { pageTitle: '工厂管理2', subTitle: 'Plant Management' },
            templateUrl: 'modules/views/plant2.html'
        })
        .state('app.base.storeArea', {
            url: '/storeArea',
            data: { pageTitle: '存储区域管理', subTitle: 'Store Area Management' },
            templateUrl: 'modules/views/storeArea.html'
        })
        .state('app.base.dock', {
            url: '/dock',
            data: { pageTitle: '道口管理', subTitle: 'Dock Management' },
            templateUrl: 'modules/views/dock.html'
        })
         .state('app.base.route', {
             url: '/route',
             data: { pageTitle: '路径管理', subTitle: 'Route Management' },
             templateUrl: 'modules/views/route.html'
         })
         .state('app.base.location', {
             url: '/location',
             data: { pageTitle: '位置管理', subTitle: 'Location Management' },
             templateUrl: 'modules/views/location.html'
         })
         .state('app.base.materialBase', {
             url: '/materialBase',
             data: { pageTitle: '物料信息管理', subTitle: 'MaterialBase Management' },
             templateUrl: 'modules/views/materialBase.html'
         })
        
        .state('app.base.material', {
            url: '/material',
            data: { pageTitle: '拉动物料管理', subTitle: 'Material Management' },
            templateUrl: 'modules/views/material.html'
        })
        .state('app.base.workdayDetail', {
            url: '/workdayDetail',
            data: { pageTitle: '窗口时间', subTitle: 'WorkdayDetail Management' },
            templateUrl: 'modules/views/workdayDetail.html'
        })
        .state('app.base.stock', {
            url: '/stock',
            data: { pageTitle: '物料库区管理', subTitle: 'Stock Management' },
            templateUrl: 'modules/views/stock.html'
        })
        .state('app.base.supplier', {
            url: '/supplier',
            data: { pageTitle: '供应商信息管理', subTitle: 'Supplier Management' },
            templateUrl: 'modules/views/supplier.html'
        })
         .state('app.base.supplierStoreArea', {
             url: '/supplierStoreArea',
             data: { pageTitle: '供应商库区关系', subTitle: 'SupplierStoreArea Management' },
             templateUrl: 'modules/views/supplierStoreArea.html'
         })
        .state('app.system', {
            url: '/system',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.system.user', {
            url: '/system',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.system.project', {
            url: '/system',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.system.dataShow', {
            url: '/system',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.system.log', {
            url: '/log',
            data: { pageTitle: '日志查询', subTitle: 'Log Query' },
            templateUrl: 'modules/views/log.html'
        })
        .state('app.system.dataView', {
            url: '/dataView',
            data: { pageTitle: '菜单管理', subTitle: 'dataView' },
            templateUrl: 'modules/views/dataView.html'
        })
        .state('app.system.adminHome',{
            url:'/adminHome',
            data:{pageTitle:'管理员首页',subTitle:'adminHome'},
            templateUrl:'modules/views/adminHome.html'
        })
        .state('app.system.pmHome',{
            url:'/pmHome',
            data:{pageTitle:'项目管理员首页',subTitle:'pmHome'},
            templateUrl:'modules/views/pmHome.html'
        })
        .state('app.system.customHome',{
            url:'/customHome',
            data:{pageTitle:'用户首页',subTitle:'customHome'},
            templateUrl:'modules/views/customHome.html'
        })
        .state('app.system.userManage',{
            url:'/userManage',
            data:{pageTitle:'用户管理',subTitle:'userManage'},
            templateUrl:'modules/views/userManage.html'
        })
        .state('app.system.companyManager',{
            url:'/companyManager',
            data:{pageTitle:'公司管理',subTitle:'companyManager'},
            templateUrl:'modules/views/companyManager.html'
        })
        .state('app.system.myProject',{
            url:'/myProject',
            data:{pageTitle:'项目列表',subTitle:'projectList'},
            templateUrl:'modules/views/myProject.html'
        })
        .state('app.system.dataManage',{
            url:'/dataManage',
            data:{pageTitle:'数据管理',subTitle:'dataManange'},
            templateUrl:'modules/views/dataManage.html'
        })
        .state('app.system.showData',{
            url:'/showData',
            data:{pageTitle:'数据展示',subTitle:'showData'},
            templateUrl:'modules/views/showData.html',
            controller:'showDataController'
        })
        .state('app.system.watchProject',{
            url:'/watchProject',
            data:{pageTitle:'查看项目',subTitle:'my Project List'},
            templateUrl:'modules/views/watchProject.html'
        })
        .state('app.system.mapFocus',{
            url:'/mapFocus',
            data:{pageTitle:'地图标定',subTitle:'mapFocus'},
            templateUrl:'modules/views/mapFocus.html',
            controller:'mapFocusController'
        })
        .state('app.system.dataSelect',{
            url:'/dataSelect/:ProjectId',
            data:{pageTitle:'数据选择',subTitle:'dataSelect'},
            templateUrl:'modules/views/dataSelect.html',
            controller:'dataSelectController'
        })
         .state('app.system.resetMapPot',{
            url:'/resetMapPot/:DataSetId',
            data:{pageTitle:'地图从新标定',subTitle:'resetMapPot'},
            templateUrl:'modules/views/resetMapPot.html',
            controller:'resetMapPotController'
        })
        .state('app.twd', {
            url: '/twd',
            template: '<div ui-view></div>',
            abstract: true
        })
     .state('app.twd.runsheet', {
         url: '/TwdRunsheet',
         data: { pageTitle: 'TWD拉动', subTitle: 'TwdRunsheet Management' },
         templateUrl: 'modules/views/runsheet.html'
     })
    .state('app.system.modify',{
            url:'/modify',
            data:{pageTitle:'修改密码',subTitle:'modify'},
            controller:'modifyController',
            templateUrl:'modules/views/modify.html'
        })
    .state('map',{
            url:'/map/:Id',
            data:{pageTitle:'线性图'},
            templateUrl:'modules/views/map11.html',
            controller:'mapController'
        })
    .state('radarmap',{
            url:'/radarmap/:Id',
            data:{pageTitle:'雷达图'},
            templateUrl:'modules/views/radarmap.html',
        })
     .state('planeGraph',{
            url:'/planeGraph/:Id',
            data:{pageTitle:'平面图'},
            templateUrl:'modules/views/planeGraph.html',
        })
     .state('sectionPlane',{
            url:'/sectionPlane/:Id',
            data:{pageTitle:'平面图'},
            templateUrl:'modules/views/sectionPlane.html',
        })
}