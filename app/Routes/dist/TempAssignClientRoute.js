"use strict";
exports.__esModule = true;
var Route_1 = require("@ioc:Adonis/Core/Route");
Route_1["default"].get('/gettempAssignClient', 'TempAssignClientController.TempAssignClientdata');
Route_1["default"].get('/credentialsMaster', 'TempAssignClientController.credentialsMaster');
