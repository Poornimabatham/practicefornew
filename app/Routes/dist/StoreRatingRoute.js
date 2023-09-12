"use strict";
exports.__esModule = true;
var Route_1 = require("@ioc:Adonis/Core/Route");
Route_1["default"].get('/StoreRating', 'StoreRatingController.StoreRatings');
Route_1["default"].get('/getSelectedEmployeeShift', 'StoreRatingController.getSelectedEmployeeShift');
