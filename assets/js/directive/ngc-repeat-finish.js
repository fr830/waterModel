// ng-repeat完成事件
app.directive('ngcRepeatFinish', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                scope.$eval(attr.ngcRepeatFinish)
            }
        }
    }
})
