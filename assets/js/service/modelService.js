app.factory('modelService', function (Restangular, appService) {
    return {
        add: function (res, model) {
            return Restangular.all(res).post(model);
        },
        update: function (res, model) {
            return Restangular.all(res).customPUT(model);
        },
        remove: function (res, id) {
            return Restangular.all(res).one(id).remove();
        },
        query: function (res, params, filter, path) {
            return appService.query(Restangular.all(res), params, filter, path);
        },
        export: function (res, params, filter, name, path) {
            return appService.export(Restangular.all(res), params, filter, name, path);
        },
        print: function (model) {
            return appService.print(model);
        },
        printList: function (res, params, filter, landscape, path) {
            return appService.printList(Restangular.all(res), params, filter, landscape, path);
        }
    }
});
