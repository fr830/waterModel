app.factory('watchProjectService', function (Restangular,appService) {
	var res = Restangular.all('UserProjectRel');
	return{
        query: function(params, filter,id){
            //console.log(filter);
            return appService.queryProjectByUserId(res, params, filter, id);
        },
        queryMembers: function(params, filter,id){
            return appService.queryMemberByProjectId(res, params, filter, id);
        },
        queryMembers1: function(params, filter,id){
            //console.log(id);
            return appService.queryMemberByProjectId1(res, params, filter, id);
        },
        queryProject:function(id){
            return res.one('QueryProjectByUserId').get({'UserId':id});
        },
        getMembers: function(id){
            return res.one('Query').get({ 'ProjectId': id});
        },
        update: function(model){
        	return res.all('UpdateUserProjectRel').customPUT(model);
        },
        queryOneProject: function(ProjectId){
                return Restangular.all('Project').one('Query').get({'ProjectId':ProjectId});
        },
    }
});
