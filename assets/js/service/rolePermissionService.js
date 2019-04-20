app.factory('rolePermissionService', function (Restangular, appService) {
    var res = Restangular.all('RolePermission');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        update: function (roleID, permissionIDs) {
            return res.all('UpdateRolePermissions').post({ roleID: roleID, permissionIDs: permissionIDs });
        }
    };
});
