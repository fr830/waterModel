/// <reference path="modelservice.js" />
app.factory('appService', function($rootScope, $filter, $cookies, API_URL, Upload) {
    return {
        query: function(res, params, filter, path) {
            if (!path) {
                path = 'Query';
            }

            var p = filter ? angular.copy(filter) : {};
            // p.returnType = null;
            //
            // if (params != null) {
            //     for (item in params._params.filter) {
            //         p[item] = params._params.filter[item];
            //     }
            //
            //     p.orderBy = params.orderBy().join(',');
            // }
            //
            // if (params != null && params.page != null) {
            //     p.page = params.page();
            //     p.per = params.count();
            //     p.orderBy = params.orderBy().join(',');
            // } else {
            //     p.page = 1;
            //     p.per = 10;
            // }
            // console.log(filter);
            //  p = {
            //     "page": 1,
            //     "per": 100
            // }

            if (params != null && params.page != null) {
                p.page = params.page();
                p.per = params.count();
                // p.orderBy = params.orderBy().join(',');
            } else {
                p.page = 1;
                p.per = 100;
            }
            return res.one(path).get(p).then(function(result) {
                if (params != null && params.page != null) {
                    params.total(result.result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    }
                }
               // console.log(result.result.Data);
                return result.result.Data;
            });
        },




        queryProjectByUserId: function(res, params, filter, UserId) {
            console.log(filter);

            var path = 'QueryProjectByUserId';
           // var p = filter ? angular.copy(filter) : {};
            // var p = filter ? angular.copy(filter) : {
            //     "UserId": UserId,
            //     "page": 1,
            //     "per": 100
            // };
            // 
            
            // if(UserId != null && filter != null){
            //      var p = angular.copy(filter); 

            // }
            // else{
            //     var p = {

            //         "UserId": UserId,
            //         "page": 1,
            //         "per": 100
            //     };
            // }
            
            var p = {
                //
                "ProjectName" :filter.ProjectName,
                "UserId": UserId,
                "page": 1,
                "per": 100
            }

            if (params != null && params.page != null) {
                p.page = params.page();
                p.per = params.count();
                p.orderBy = params.orderBy().join(',');
            } else {
                p.page = 1;
                p.per = 100;
            }
            return res.one(path).get(p).then(function(result) {
                if (params != null && params.page != null) {
                    params.total(result.result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    }
                }
               // console.log(result.result.Data);
                return result.result.Data;
            });
        },
        queryDataByProjectId: function(res, params, filter, ProjectId) {

            var path = 'GetDataSet';

            var p = {
                "ProjectId": ProjectId,
                "page": 1,
                "per": 100
            }

            if (params != null && params.page != null) {
                p.page = params.page();
                p.per = params.count();
                p.orderBy = params.orderBy().join(',');
            } else {
                p.page = 1;
                p.per = 100;
            }
            return res.one(path).get(p).then(function(result) {
                //console.log(result);
                if (params != null && params.page != null) {
                    params.total(result.result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    }
                }
                //console.log(result.result.Data);
                return result.result.Data;
            });
        },
        queryMemberByProjectId: function(res, params, filter, ProjectId) {

            var path = 'Query';

            var p = {
                "ProjectId": ProjectId,
                "page": 1,
                "per": 100
            }

            if (params != null && params.page != null) {
                p.page = params.page();
                p.per = params.count();
                p.orderBy = params.orderBy().join(',');
            } else {
                p.page = 1;
                p.per = 100;
            }
            return res.one(path).get(p).then(function(result) {
                //console.log(result);
                if (params != null && params.page != null) {
                    params.total(result.result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    }
                }
                //console.log(result.result.Data);
                return result.result.Data;
            });
        },

        queryMemberByProjectId1: function(res, params, filter, ProjectId) {
           
            var path = 'Query';

            var p = {
                "ProjectId": ProjectId,
                "page": 1,
                "per": 100
            }

            if (params != null && params.page != null) {
                p.page = params.page();
                p.per = params.count();
                p.orderBy = params.orderBy().join(',');
            } else {
                p.page = 1;
                p.per = 100;
            }
            return res.one(path).get(p).then(function(result) {
                //console.log(result);
                if (params != null && params.page != null) {
                    params.total(result.result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    }
                }
                console.log(result.result.Data);
                return result.result.Data;
            });
        },

        getPointData: function(res, params, filter, PointDataId) {

            var path = 'GetPointData'; //?
            //alert(PointDataId.DataSetId)
            var p = {
                "DataSetId": PointDataId.DataSetId,
                "page": 1,
                "per": 100
            }

            if (params != null && params.page != null) {
                p.page = params.page();
                p.per = params.count();
            } else {
                p.page = 1;
                p.per = 100;
            }
            return res.one(path).get(p).then(function(result) {
                //console.log(result);
                if (params != null && params.page != null) {
                    params.total(result.result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    }
                }
                //console.log(result.result.Data);
                return result.result.Data;
            });
        },

        getPointDataDetail: function(res, params, filter, PointDataId) {

            var path = 'GetCsvInfoList'; //?
            //alert(PointDataId.DataSetId)
            var p = {
                "PointDataId": PointDataId.PointDataId,
                "page": 1,
                "per": 100
            }

            if (params != null && params.page != null) {
                p.page = params.page();
                p.per = params.count();
            } else {
                p.page = 1;
                p.per = 100;
            }
            return res.one(path).get(p).then(function(result) {
                //console.log(result);
                if (params != null && params.page != null) {
                    params.total(result.result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    }
                }
                //console.log(result.result.Data);
                return result.result.Data;
            });
        },

        queryProjectByProjectName: function(res, params, filter, ProjectName) {
            var path = 'Query';

            var p = {
                "ProjectName": ProjectName,
                "page": 1,
                "per": 100
            }

            if (params != null && params.page != null) {
                p.page = params.page();
                p.per = params.count();
                p.orderBy = params.orderBy().join(',');
            } else {
                p.page = 1;
                p.per = 100;
            }
            return res.one(path).get(p).then(function(result) {
                //console.log(result);
                if (params != null && params.page != null) {
                    params.total(result.result.TotalCount);
                    if (params.total() > 0 && params.total() <= params.count() * (params.page() - 1)) {
                        params.page(Math.ceil(params.total() / params.count()));
                    }
                }
                //console.log(result.result.Data);
                return result.result.Data;
            });
        },
        export: function(res, params, filter, name, path) {
            if (!path) {
                path = 'Query';
            }

            var p = filter ? angular.copy(filter) : {};
            p.page = null;
            p.per = 100000;
            p.returnType = 1;

            if (params != null) {
                for (item in params._params.filter) {
                    p[item] = params._params.filter[item];
                }

                p.orderBy = params.orderBy().join(',');
            }

            res.withHttpConfig({
                responseType: 'blob'
            }).all(path).post(p).then(function(result) {
                var blob = new Blob([result], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                saveAs(blob, name + "-" + $filter('date')(new Date(), 'yyyyMMddHHmmss') + ".xlsx");
            });
        },
        print: function(model) {
            try {
                var LODOP = getLodop();
                //var printerIndex = $cookies.get('currentPrinter');
                //if (!printerIndex || printerIndex < 0) {
                //    printerIndex = LODOP.SELECT_PRINTER();
                //    $cookies.put('currentPrinter', printerIndex);
                //}
                //LODOP.SET_PRINTER_INDEX(printerIndex);

                LODOP.PRINT_INIT(model.Code);
                LODOP.ADD_PRINT_TABLE(model.Top, model.Left, model.Width, model.Height, model.Content);
                if (!!model.PageWidth && !!model.PageHeight) {
                    LODOP.SET_PRINT_PAGESIZE(model.Orient, model.PageWidth, model.PageHeight, model.PageName);
                }
                if (model.IsPreview) {
                    LODOP.PREVIEW();
                } else {
                    LODOP.PRINT();
                }
            } catch (e) {
                alert('请检查打印驱动，并使用ie10以上浏览器打印！' + e.message);
                return;
            }
        },
        printList: function(res, params, filter, landscape, path) {
            try {
                var LODOP = getLodop();
                //var printerIndex = $cookies.get('currentPrinter');
                //if (!printerIndex || printerIndex < 0) {
                //    printerIndex = LODOP.SELECT_PRINTER();
                //    $cookies.put('currentPrinter', printerIndex);
                //}
                //LODOP.SET_PRINTER_INDEX(printerIndex);
            } catch (e) {
                alert('请检查打印驱动，并使用ie10以上浏览器打印！' + e.message);
                return;
            }

            if (!path) {
                path = 'Query';
            }

            var p = filter ? angular.copy(filter) : {};
            p.page = null;
            p.per = 1000;
            p.returnType = 2;

            if (params != null) {
                for (item in params._params.filter) {
                    p[item] = params._params.filter[item];
                }

                p.orderBy = params.orderBy().join(',');
            }

            return res.all(p).get(path, p).then(function(result) {
                LODOP.PRINT_INIT("Print");

                if (landscape) {
                    LODOP.ADD_PRINT_TABLE("4%", "3%", "94%", "90%", result);
                    LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
                } else {
                    LODOP.ADD_PRINT_TABLE("4%", "3%", "94%", "90%", result);
                    LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
                }
                LODOP.PRINT();
            });
        },
        upload: function(files, errFiles, confirmMessage, successFunc, path, data) {
            if (!path) {
                path = 'Attachment';
            }

            if (errFiles.length > 0) {
                alert('有文件不符合要求，无法上传！');
                return;
            } else if (files == null || files.length == 0) {
                return;
            }

            if (!confirmMessage || confirm(confirmMessage)) {
                if (!$rootScope.proc) {
                    $rootScope.proc = 1;
                } else {
                    $rootScope.proc++;
                }
                $rootScope.loading = true;

                Upload.upload({
                    'url': API_URL + "/" + path,
                    'method': 'POST',
                    'headers': {
                        'Authorization': 'Bearer ' + $rootScope.identity.Token
                    },
                    'file': files,
                    'data': data
                }).then(function(resp, status, headers, config) {
                    $rootScope.proc--;
                    if ($rootScope.proc <= 0) {
                        $rootScope.proc = 0;
                        $rootScope.loading = false;
                    }

                    successFunc(resp.data);
                }, function(resp, status, headers, config) {
                    $rootScope.proc--;
                    if ($rootScope.proc <= 0) {
                        $rootScope.proc = 0;
                        $rootScope.loading = false;
                    }
                    if (resp.status == 401) {
                        $state.go('member.login');
                    } else {
                        if (resp.data && resp.data.Message) {
                            alert(resp.data.Message + (resp.status == 500 ? '' : resp.status));
                        } else {
                            alert("未知错误! " + resp.status);
                        }

                        return false;
                    }
                }, function(event) {
                    //进度条
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progess:' + progressPercentage + '%' + evt.config.file.name);
                });
            }
        },
        show: function(value, dataType, format) {
            if (value == null) return null;

            if (dataType == 'DateTime') {
                // 日期
                if (format == null || format == '') {
                    return $filter('date')(value, 'yyyy-MM-dd');
                } else {
                    return $filter('date')(value, format);
                }
            } else if (dataType == 'Decimal') {
                // 小数
                return $filter('number')(value, format);
            } else if (dataType == 'Boolean') {
                return value ? '是' : '否';
            } else {
                return value;
            }
        }
    }
});