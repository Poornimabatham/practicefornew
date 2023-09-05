"use strict";
exports.__esModule = true;
var Route_1 = require("@ioc:Adonis/Core/Route");
Route_1["default"].put("/storedeviceinfo", 'UsershiftplannerController.storedeviceinfo');
Route_1["default"].get("/usershiftplanner", 'UsershiftplannerController.FetchUsershiftPlanner');
Route_1["default"].get("/getShiftDetailsShiftPlanner", 'UsershiftplannerController.getShiftDetailsShiftPlanner');
