app.controller('headerController', function ($scope, $rootScope, $state, $cookies) {
    $scope.logout = function () {
        $rootScope.identity = null;
        $cookies.remove('identity');
        $state.go('views.login');
    };

    $scope.init = function () {
        // 隐藏、显示侧边栏
        $(".ls-toggle-btn").on("click",
            function () {
                $("body").toggleClass("ls-toggle-menu")
            });

        // 低分辨率模式，调出侧边栏
        $(".bars").on("click",
            function () {
                $("body").toggleClass("overlay-open");
                $("body").hasClass("overlay-open") ? $(".overlay").fadeIn() : $(".overlay").fadeOut();
            });

        // 全屏
        $('[data-provide~="fullscreen"]').on("click",
            function () {
                screenfull.toggle($("#container")[0])
            });
    };
    $scope.modifypassword= function () {
        //跳转到修改页面
        //alert(111);
        $state.go('app.system.modify');   //？应该是有问题
        // alert(123);
        //window.location.href="template/modify.html";
    };

    $scope.init();
});
