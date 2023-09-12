"use strict";
exports.__esModule = true;
var Route_1 = require("@ioc:Adonis/Core/Route");
Route_1["default"].group(function () {
    Route_1["default"].get("/fetchsummary", "GetplannerController.getplannerwisesummary");
    Route_1["default"].get("/getRegSummary", "GetplannerController.getRegSummary");
}).namespace("App/Controllers/Http/ReportController");
