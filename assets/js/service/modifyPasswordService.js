app.factory('modifyPasswordService', function (Restangular, appService) {
    var res = Restangular.all('User');   
    return {
        get: function (id) {
            return res.all(id).get();
        },
        query: function (params, filter) {
            return appService.query(res, params, filter);
        },
        modify: function (params) { //modify()
            return res.all('UpdatePassword').customPUT(
            {
                'UserName' : params.UserName,
                'OldPassword': params.OldPassword,
                'NewPassword': params.NewPassword,
            });  
        },
        update: function (model) {
            return res.customPUT(model);
        },
    };
});
