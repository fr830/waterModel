app.factory('companyManagerService', function ($parse, Restangular, appService, modelService, enumService) {
    var res = Restangular.all('Company');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        query: function (params, filter) {
            return appService.query(res, params, filter);
        },
        add: function (model) {
            return res.all('AddCompany').post(model);//post请求穿多个参数需要用all来配置路由
        },
        update: function (model) {
            return res.all('UpdateCompany').customPUT(model);
        },
        reset:function(id){
            return res.one('ResetPassword').get({ 'UserId': id });
        },
        remove: function (id) {
            return res.one('RemoveRole').remove({ 'UserId': id });
        },
        freeze:function(id){
            return res.one('UpdateCompanyStatus').get({ 'CompanyId': id });
        }
    };
});
