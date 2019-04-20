app.factory('viewColumnService', function (Restangular, appService, $filter) {
    var res = Restangular.all('ViewColumn');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        query: function (params, filter) {
            return appService.query(res, params, filter);
        },
        change: function (model) {
            return res.post(model);
        },
    }   
});
