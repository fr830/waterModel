// app.factory('dataViewService', function ($parse, Restangular, appService, modelService, enumService) {
//     var res = Restangular.all('DataView');
//     return {
//         get: function (id) {
//             return res.one(id).get();
//         },
//         query: function (params, filter) {
//             return appService.query(res, params, filter);
//         },
//         add: function (model) {
//             return res.post(model);
//         },
//         update: function (model) {
//             return res.customPUT(model);
//         },
//         remove: function (id) {
//             return res.one(id).remove();
//         },
//         getQueryViewByCode: function (code) {
//             return res.get('GetByCode', { 'viewType': 10, 'code': code }).then(function (data) {
//                 var dataView = data.DataView;
//                 dataView.Sorting = JSON.parse(dataView.Sorting);
//                 dataView.columns = data.ViewColumns;

//                 // 显示
//                 dataView.show = function (column, model) {
//                     return appService.show($parse(column.DisplayCode)(model), column.DataType, column.DisplayFormat);
//                 }

//                 return dataView;
//             })
//         },
//         getFormViewByCode: function (code) {
//             return res.get('GetByCode', { 'viewType': 20, 'code': code }).then(function (data) {
//                 var dataView = data.DataView;
//                 dataView.columns = data.ViewColumns;

//                 if (dataView.Tab != null && dataView.Tab.trim() != '') {
//                     dataView.Tabs = JSON.parse(dataView.Tab);
//                 } else {
//                     dataView.Tabs = [null];
//                 }

//                 // 获取初始数据
//                 dataView.getDefault = function () {
//                     var model = {};

//                     dataView.columns.forEach(function (column) {
//                         if (column.DefaultValue != null) {
//                             model[column.Code] = column.DefaultValue;
//                         }
//                     })

//                     return model;
//                 }

//                 // 加载数据模型
//                 dataView.loadData = function (model) {
//                     // 加载数据
//                     dataView.columns.forEach(function (column) {
//                         column.Value = $parse(column.Code)(model);
//                         column.DisplayValue = $parse(column.DisplayCode)(model);
//                     })

//                     // 为下拉框加载数据源
//                     dataView.columns.forEach(function (column) {
//                         if (column.Source != null && column.Source.trim() != '') {
//                             if (column.DataType == 'Enum') {
//                                 // 枚举类型
//                                 enumService.query(column.Source).then(function (data) {
//                                     column.DataSource = data.map(function (item) {
//                                         return {
//                                             ID: item.ID,
//                                             Name: item.Name
//                                         }
//                                     });
//                                 })
//                             } else {
//                                 var isComplete = true; // 参数完整
//                                 var filter = null;

//                                 // 包含参数
//                                 if (column.Param != null && column.Param.trim() != '') {
//                                     var param = JSON.parse(column.Param);   // { "PlantID": “PlantID” }

//                                     // 用模型的值填充参数
//                                     for (var key in param) {
//                                         // 常量
//                                         var index = param[key].search(/^\[.*?\]$/);
//                                         if (index == 0) {
//                                             param[key] = param[key].substring(1, param[key].length - 1);
//                                             continue;
//                                         }

//                                         // 变量
//                                         var paramColumn = dataView.columns.find(function (item) {
//                                             return item.Code == param[key];
//                                         })

//                                         // 参数字段有值
//                                         if (paramColumn != null) {
//                                             if (paramColumn.Value != null) {
//                                                 param[key] = paramColumn.Value;
//                                                 continue;
//                                             }
//                                         }

//                                         // 参数不完整，不读取数据
//                                         isComplete = false;
//                                         break;
//                                     }

//                                     filter = param;
//                                 }

//                                 if (isComplete) {
//                                     modelService.query(column.Source, null, filter).then(function (data) {
//                                         column.DataSource = data.map(function (item) {
//                                             return {
//                                                 ID: item.ID,
//                                                 Name: $parse(column.SourceDisplayCode)(item)
//                                             }
//                                         });
//                                     })
//                                 } else {
//                                     column.DataSource = [];
//                                 }
//                             }
//                         }
//                     });
//                 }

//                 // 填充数据模型
//                 dataView.fillData = function (model) {
//                     dataView.columns.forEach(function (column) {
//                         model[column.Code] = column.Value;
//                     })
//                 }

//                 // 加载数据模型
//                 dataView.onDataChange = function (code) {
//                     // 下拉框数据源刷新
//                     dataView.columns.forEach(function (column) {
//                         // 非枚举类型，带参数的数据源可能需要刷新
//                         if (column.Source != null && column.DataType != 'Enum' && column.Param != null && column.Param.trim() != '') {
//                             var isReflash = false; // 需要刷新
//                             var isComplete = true; // 参数完整
//                             var param = JSON.parse(column.Param);

//                             // 判断更新字段是否包含在参数表中，如果包含则需要刷新数据源
//                             for (var key in param) {
//                                 if (param[key] == code) {
//                                     isReflash = true;
//                                 }
//                             }

//                             // 填充参数
//                             for (var key in param) {
//                                 // 常量
//                                 var index = param[key].search(/^\[.*?\]$/);
//                                 if (index == 0) {
//                                     param[key] = param[key].substring(1, param[key].length - 1);
//                                     continue;
//                                 }

//                                 // 变量
//                                 var paramColumn = dataView.columns.find(function (item) {
//                                     return item.Code == param[key];
//                                 })

//                                 // 参数字段有值
//                                 if (paramColumn != null) {
//                                     if (paramColumn.Value != null) {
//                                         param[key] = paramColumn.Value;
//                                         continue;
//                                     }
//                                 }

//                                 // 参数不完整，不读取数据
//                                 isComplete = false;
//                                 break;
//                             }

//                             var filter = param;

//                             if (isReflash) {
//                                 if (isComplete) {
//                                     modelService.query(column.Source, null, filter).then(function (data) {
//                                         column.DataSource = data.map(function (item) {
//                                             return {
//                                                 ID: item.ID,
//                                                 Name: $parse(column.SourceDisplayCode)(item)
//                                             }
//                                         });
//                                     })
//                                 } else {
//                                     column.DataSource = [];
//                                 }
//                             }
//                         }
//                     });
//                 }

//                 // 根据选项卡名称返回列
//                 dataView.tabColumns = function (tabName) {
//                     return dataView.columns.filter(function (item) {
//                         return item.TabName == tabName || tabName == null;
//                     });
//                 }

//                 // 显示
//                 dataView.show = function (column) {
//                     return appService.show(column.DisplayValue, column.DataType, column.DisplayFormat);
//                 }

//                 return dataView;
//             })
//         }
//     };
// });
