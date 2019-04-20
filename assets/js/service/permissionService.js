app.factory('permissionService', function (Restangular, appService) {
    var res = Restangular.all('Permission');
    return {
        queryMenu: function () {
            return res.get('QueryMenu');
        },
        queryPermission: function () {
            return res.get('QueryPermission');
        },
        queryByRoleID: function (roleID) {
            return res.get('QueryByRoleID', { 'roleID': roleID })
        },
        isAuth: function (url) {
            return res.get('IsAuth', { "url": url }).then(function (result) {
                return result;
            });
        },
        queryAll: function () {
            return res.get('', { 'orderBy': '+OrderNo' }).then(function (result) {
                return result.Data;
            });
        }
    }
});
