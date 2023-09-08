"use strict";
exports.__esModule = true;
var Route_1 = require("@ioc:Adonis/Core/Route");
Route_1["default"].get("/resetPasswordLink", 'ResetPasswordLinkController.ResetPassword');
Route_1["default"].get("/getAllowAttToUser", 'ResetPasswordLinkController.getAllowAttToUser');
Route_1["default"].get("/MoveEmpDataInExistingOrg", 'ResetPasswordLinkController.MoveEmpDataInExistingOrg');
