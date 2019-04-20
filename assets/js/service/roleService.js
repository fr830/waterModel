app.factory('roleService', function (Restangular, appService) {
    var res = Restangular.all('Role');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        query: function (params, filter) {
            return appService.query(res, params, filter);
        },
        add: function (model) {
            return res.post(model);
        },
        update: function (model) {
            return res.customPUT(model);
        },
        remove: function (id) {
            return res.one('RemoveRole').remove();
        }
    };
});
