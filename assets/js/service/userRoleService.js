app.factory('userRoleService', function (Restangular, appService) {
    var res = Restangular.all('UserRole');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        query: function (params, filter) {
            return appService.query(res, params, filter);
        },
        queryByUserID: function (userID) {
            return this.query(null, { 'userID': userID });
        },
        queryByRoleID: function (roleID) {
            return this.query(null, { 'roleID': roleID });
        },
        add: function (model) {
            return res.post(model);
        },
        remove: function (id) {
            return res.one(id).remove();
        }
    };
});
