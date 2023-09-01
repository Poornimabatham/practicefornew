"use strict";
exports.__esModule = true;
var Route_1 = require("@ioc:Adonis/Core/Route");
Route_1["default"].get("/checkemailsdetails", 'CheckUserEmailController.CheckUserEmaildata');
Route_1["default"].get("/getphonedetails", 'CheckUserEmailController.CheckUserPhonedata');
Route_1["default"].get("/verifyEmailOtpRequest", 'CheckUserEmailController.verifyEmailOtpRequestdata');
Route_1["default"].put("/updateEmailOTPRequest", 'CheckUserEmailController.updateEmailOTPRequestdata');
