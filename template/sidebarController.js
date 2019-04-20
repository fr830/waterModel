app.controller('sidebarController', function ($scope, $rootScope, $state, $stateParams) {
    $scope.$emit('refreshMenu');
    // console.log($rootScope,$rootScope.identity.result);
    $scope.Name=$rootScope.identity.result.User.Name;
    $scope.Role=$rootScope.identity.result.Role.RoleName;
    $scope.initMenu = function () {
        var checkStatuForResize = function (firstTime) {
            var $body = $('body');
            var $openCloseBar = $('.=navbar .navbar-header .bars');
            var width = $body.width();

            if (firstTime) {
                $body.find('.content, .sidebar').addClass('no-animate').delay(1000).queue(function () {
                    $(this).removeClass('no-animate').dequeue();
                });
            }

            if (width < 1170) {
                $body.addClass('ls-closed');
                $openCloseBar.fadeIn();
            } else {
                $body.removeClass('ls-closed');
                $openCloseBar.fadeOut();
            }
        };

        var isOpen = function () {
            return $('body').hasClass('overlay-open');
        };

        var $body = $('body');
        var $overlay = $('.overlay');

        //Close sidebar
        $(window).on('click', function (e) {
            var $target = $(e.target);
            if (e.target.nodeName.toLowerCase() === 'i') {
                $target = $(e.target).parent();
            }

            if (!$target.hasClass('bars') && isOpen() && $target.parents('#leftsidebar').length === 0) {
                if (!$target.hasClass('js-right-sidebar')) $overlay.fadeOut();
                $body.removeClass('overlay-open');
            }
        });

        //$.each($('.menu-toggle.toggled'), function (i, val) {
        //    $(val).next().slideToggle(0);
        //});

        //When page load
        //$.each($('.menu .list li.active'), function (i, val) {
        //    var $activeAnchors = $(val).find('a:eq(0)');

        //    $activeAnchors.addClass('toggled');
        //    $activeAnchors.next().show();
        //});

        //Set menu height
        checkStatuForResize(true);
        $(window).resize(function () {
            checkStatuForResize(false);
        });

        //Set Waves
        Waves.attach('.menu .list a', ['waves-block']);
        Waves.init();

        // 滚动条
        $('.sidebar .menu .list').slimscroll({
            height: 'calc(100vh - 60px)',
            color: 'rgba(255,255,255, 0.5)',
            position: 'right',
            size: '6px',
            alwaysVisible: false,
            borderRadius: '3px',
            railBorderRadius: '0'
        });
    };

    $scope.menuToggle = function (e) {
        var $this = $(e.target).closest("a");
        var $content = $this.next();

        if ($($this.parents('ul')[0]).hasClass('list')) {
            var $not = $(e.target).hasClass('menu-toggle') ? e.target : $(e.target).parents('.menu-toggle');

            $.each($('.menu-toggle.toggled').not($not).next(), function (i, val) {
                if ($(val).is(':visible')) {
                    $(val).prev().toggleClass('toggled');
                    $(val).slideUp();
                }
            });
        }

        $this.toggleClass('toggled');
        $content.slideToggle(320);
    }
    
    $scope.judge=function () {
        if ($rootScope.identity.result.Role.RoleCode==0){
            $rootScope.homeUrl="app.system.adminHome";
            $rootScope.show=true;
        }else if ($rootScope.identity.result.Role.RoleCode==1){
            $rootScope.homeUrl="app.system.pmHome";
            $rootScope.show=false;
        }else{
            $rootScope.homeUrl="app.system.customHome";
            $rootScope.show=false;
        }
        $rootScope.companyUrl="app.system.userManage";
        $rootScope.userUrl="app.system.companyManager";
    }
    $scope.judge();


    $scope.fun = function () {
        $state.go('app.system.userManage')
    }
});
