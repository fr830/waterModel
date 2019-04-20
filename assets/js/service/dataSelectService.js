app.factory('dataSelectService', function (Restangular, appService) {
    var res= Restangular.all('Project');
    return {
        getTree: function(id){
            return res.one('GetProjectDataTree').get({'ProjectId': id});
        }
    }
});
