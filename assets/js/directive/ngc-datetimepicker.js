app.directive('ngcDatetimepicker', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attr, ngModel) {
            var picker = $(element).bootstrapMaterialDatePicker({
                lang: 'zh-cn',
                format: 'YYYY-MM-DD HH:mm:00',
                clearButton: true,
                weekStart: 1,
                time: true,
                cancelText: '<i class="fa fa-remove"></i> 取消',
                clearText: '<i class="fa fa-eraser"></i> 清除',
                okText: '<i class="fa fa-check"></i> 确定'
            });

            //model->view
            ngModel.$render = function (value) {
                $(element).val(null);

                if (ngModel.$viewValue != null) {
                    $(element).bootstrapMaterialDatePicker('setDate', ngModel.$viewValue);
                } else {
                    $(element).bootstrapMaterialDatePicker('setDate', null);
                }
            };

            //view->model
            picker.on('change', function (e, date) {
                if (date) {
                    ngModel.$setViewValue(new moment(date).format('YYYY-MM-DDTHH:mm:00Z'));
                } else {
                    ngModel.$setViewValue(null);
                }
            });
        }
    };
});
