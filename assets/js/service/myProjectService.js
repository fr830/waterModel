app.factory('myProjectService', function ($parse, Restangular, appService, modelService, enumService) {
	var res = Restangular.all('Project');
	return{
		get: function (id) {
            return res.one(id).get();
        },
        query: function (params, filter) {
            return appService.query(res, params, filter);
        },
       
        queryProject: function(params, filter,name){
            return appService.queryProjectByProjectName(res, params, filter, name);
        },
        add: function (model) {
            return res.all('AddProject').post(model);
        },
        remove: function (id) {
            return res.one('RemoveProjectByProjectId').get({'ProjectId': id});
        },
        update: function(model){
            return res.all('UpdateProject').customPUT(model);
        }
	}
});