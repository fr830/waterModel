app.factory('dataSourceService', function (Restangular, appService, $filter) {
    var res = Restangular.all('DataSource');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        getByCode: function (code) {
            return res.get('GetDataSourceByCode', { 'code': code });
        },
        queryAll: function () {
            return res.get('', {}).then(function (result) {
                return result.Data;
            });
        },
        query: function (params, filter) {
            return appService.query(res, params, filter);
        },
        add: function (model, arguments) {
            return res.post({ DataSource: model, DataSourceArguments: arguments });
        },
        update: function (model, arguments) {
            return res.customPUT({ DataSource: model, DataSourceArguments: arguments });
        },
        remove: function (id) {
            return res.one(id).remove();
        },
        execute: function (code, filter, params) {
            var p = angular.copy(filter);

            if (params) {
                p.Page = params.page();
                p.Per = params.count();
                p.OrderBy = params.orderBy().join(',')
            }

            return res.all("Execute").post({
                'Code': code,
                'Filter': JSON.stringify(p),
                'ReturnType': null
            }).then(function (result) {
                if (params) {
                    params.total(result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    };
                }

                return result.Table;
            });
        },
        export: function (code, filter, params, title, column) {
            filter.Page = 1;
            filter.Per = 1000000;
            if (params != null) {
                filter.OrderBy = params.orderBy().join(',')
            }

            if (!title) {
                title = "Data";
            }

            return res.all("Execute").withHttpConfig({ responseType: 'blob' }).post({
                'Code': code,
                'Filter': JSON.stringify(filter),
                'Title': title,
                'Column': JSON.stringify(column),
                'ReturnType': 1
            }).then(function (result) {
                var blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, title + "-" + $filter('date')(new Date(), 'yyyyMMddHHmmss') + ".xlsx");
            });
        },
        print: function (code, filter, params, title, column) {
            filter.Page = 1;
            filter.Per = 1000;
            if (params != null) {
                filter.OrderBy = params.orderBy().join(',')
            }

            try {
                var LODOP = getLodop();
            }
            catch (e) {
                alert('请检查打印驱动，并使用ie10以上浏览器打印！' + e.message);
                return;
            }

            return res.all("Execute").post({
                'Code': code,
                'Filter': JSON.stringify(filter),
                'Title': title,
                'Column': JSON.stringify(column),
                'ReturnType': 2
            }).then(function (result) {
                LODOP.PRINT_INIT("Print");

                LODOP.ADD_PRINT_TABLE("4%", "3%", "94%", "90%", result);

                LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");

                LODOP.PRINT();
            });
        }
    };
});
