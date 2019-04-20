app.factory('userService', function (Restangular, appService) {
    var res = Restangular.all('User');
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
            return res.one(id).remove();
        },
        login: function (loginRequest) {
            return res.one('Login').get(loginRequest);
        },
        updateUserInfo: function (user) {
            return res.all('UpdateUserInfo').post(user);
        },
        updatePassword: function (oldPassword, newPassword) {
            return res.all('UpdatePassword').post(
                {
                    'OldPassword': oldPassword,
                    'NewPassword': newPassword,
                });
        },
        resetPassword: function (userID) {
            return res.get('ResetPassword', { 'userID': userID });
        },
        changePassword: function (account) {
            return res.all("ChangePassword").post({ 'Account': account });
        }
    };
});
