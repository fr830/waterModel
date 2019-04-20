app.factory('parameterService', function ($rootScope,Restangular, appService) {
    var res = Restangular.all('ParamDictionary');
    //console.log(Restangular);
    return {
        Parameterquery: function () {
            return res.one('queryAll').get({ 'Version': 1 }).then(function (result) {
                 //console.log(result);
                return result;

            });
        }

    }
});
