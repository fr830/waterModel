app.factory('enumService', function ($rootScope,Restangular, appService) {
    var res = Restangular.all('Role');
    //console.log(Restangular);
    // var Signature={
    //     'Authorization': 'Bearer ' + $rootScope.identity.result.Token
    // }
    return {
        Rolequery: function () {
            return res.one('QueryRoles').get().then(function (result) {
               // console.log(result);
                return result;

            });
        }

    }
});
