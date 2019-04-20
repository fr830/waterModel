app.factory('userProjectService', function ($parse, Restangular, appService, $rootScope, enumService) {
    var res = Restangular.all('UserProjectRel');
    return{

        query: function (params, filter,UserId) {
            return appService.queryProjectByUserId(res, params, filter,UserId);
        }
    }
});