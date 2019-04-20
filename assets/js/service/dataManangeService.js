app.factory('dataManageService', function ($parse, Restangular, appService, modelService, enumService) {
    var res = Restangular.all('DataSet');
    return{
        get: function (Id) {
            return res.one(Id).get();
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
        }
    }
});