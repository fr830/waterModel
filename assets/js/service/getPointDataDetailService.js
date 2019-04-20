app.factory('getPointDataDetailService', function ($parse, Restangular, appService, $rootScope, enumService) {
    var res = Restangular.all('PointDataDetail');
    return{

        query: function ( params, filter,PointDataId) {
            //return res.one('GetPointData').get({'DataSetId': id});
          return appService.getPointDataDetail(res, params, filter,{'PointDataId': PointDataId});
        },
        querydetail: function (PointDataId) {
            return res.one('GetCsvInfoList').get({'PointDataId':PointDataId});
        },
        remove: function (ids) {
            return res.one('RemoveRows').get({'ids':ids});
        },
        update: function(PointDataId){
            return res.one('ResetCsvList').get({'PointDataId': PointDataId});
        },
        queryNodeDetail: function (model) {
            return Restangular.all('PointData').all('GetPointDataByIdList').post(model);
        },
        showCutGraph: function (model) {
            return Restangular.all('Map').one('Snap').get(model);
        },
        showSectionGraph: function (model) {
            return Restangular.all('Map').one('section').get(model);
        },
        searchCsv: function (model) {
            return Restangular.all('ParamDictionary').one('queryAll').get(model);
        },

    }   

});