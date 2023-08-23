"use strict";
exports.__esModule = true;
var Route_1 = require("@ioc:Adonis/Core/Route");
Route_1["default"].group(function () {
    Route_1["default"].get("/getDataToApply", "GetDataToApplyRegController.FetchDataToApplyReg");
    Route_1["default"].get("/getDataToCount", "GetDataToApplyRegController.getRegularizationCount");
});
