app.factory('watchDataCsvService', function ($parse, Restangular, appService, $rootScope, enumService) {
    var res = Restangular.all('PointData');
    return{

        query: function ( params, filter,PointDataId) {
            //return res.one('GetPointData').get({'DataSetId': id});
          return appService.getPointData(res, params, filter,{'DataSetId': PointDataId});
        }
        
        // query: function (params, filter,ProjectId) {
        //     return appService.queryDataByProjectId(res, params, filter,ProjectId);
        // },

    }   

});