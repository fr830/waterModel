app.factory('showDataService', function ($parse, Restangular, appService, modelService, enumService) {
    var res = Restangular.all('DataSet');
    return{
        getData: function (Id) {
            return res.one('GetAllInfoByDataSetId').get({'DataSetId': Id});
        },
        query: function (params, filter,ProjectId) {
            return appService.queryDataByProjectId(res, params, filter,ProjectId);
        },
        add: function (model) {
            return res.all('AddDataSet').post(model);
        },
        remove: function (id) {
            return res.one('DeleteDataSet').get({'DataSetId': id});
        },
        update: function(model){
            return res.all('UpdateDataSet').customPUT(model);
        },
        updateLocation: function(model){
            return Restangular.all('PointData').all('UpdateBaiduLocation').customPUT(model);
        }

    }
});