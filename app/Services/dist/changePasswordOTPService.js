"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Database_1 = require("@ioc:Adonis/Lucid/Database");
var Helper_1 = require("App/Helper/Helper");
var luxon_1 = require("luxon");
var changePasswordOTPService = /** @class */ (function () {
    function changePasswordOTPService() {
    }
    changePasswordOTPService.changePasswordOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var email, phone, result, phoneEncode, selectphoneQuery, emailEncode, selectemailQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = data.emailotp;
                        phone = data.phoneotp;
                        result = {};
                        if (!(phone != undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Helper_1["default"].encode5t(phone)];
                    case 1:
                        phoneEncode = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .select("*")
                                .where("username_mobile", phoneEncode)];
                    case 2:
                        selectphoneQuery = _a.sent();
                        if (selectphoneQuery.length > 0) {
                            result["status"] = "4";
                        }
                        else {
                            result["status"] = "5";
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(email != undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Helper_1["default"].encode5t(email)];
                    case 4:
                        emailEncode = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .select("*")
                                .where("Username", emailEncode)];
                    case 5:
                        selectemailQuery = _a.sent();
                        if (selectemailQuery.length > 0) {
                            result["status"] = "4";
                        }
                        else {
                            result["status"] = "5";
                        }
                        _a.label = 6;
                    case 6: return [2 /*return*/, result];
                }
            });
        });
    };
    changePasswordOTPService.newchangepass = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var phone, newpassword, result, encodephone, affectedRows, encodeNewPassword, selectQuery, Id, sts, email, updateQuery, updateAdminLoginQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phone = data.changepassphone;
                        newpassword = data.newpass;
                        result = {};
                        if (!(phone != undefined)) return [3 /*break*/, 10];
                        return [4 /*yield*/, Helper_1["default"].encode5t(phone)];
                    case 1:
                        encodephone = _a.sent();
                        if (!(newpassword != undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Helper_1["default"].encode5t(newpassword)];
                    case 2:
                        encodeNewPassword = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, Database_1["default"].from("UserMaster")
                            .select("Id", "appSuperviserSts", "Username", "Password")
                            .where("username_mobile", encodephone)];
                    case 4:
                        selectQuery = _a.sent();
                        if (selectQuery[0].Password == encodeNewPassword) {
                            return [2 /*return*/, "Password should not be same as previous Password"];
                        }
                        if (!(selectQuery.length > 0)) return [3 /*break*/, 9];
                        Id = selectQuery[0].Id;
                        sts = selectQuery[0].appSuperviserSts;
                        return [4 /*yield*/, Helper_1["default"].decode5t(selectQuery[0].Username)];
                    case 5:
                        email = _a.sent();
                        if (!(Id != undefined && Id != 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .where("Id", Id)
                                .update({ Password: encodeNewPassword })];
                    case 6:
                        updateQuery = _a.sent();
                        if (updateQuery) {
                            affectedRows = 1;
                        }
                        if (!(sts == 1)) return [3 /*break*/, 8];
                        return [4 /*yield*/, Database_1["default"].from("admin_login")
                                .where("email", email)
                                .update({
                                changepasswordStatus: 1,
                                password: encodeNewPassword
                            })];
                    case 7:
                        updateAdminLoginQuery = _a.sent();
                        if (updateAdminLoginQuery) {
                            affectedRows = 1;
                        }
                        _a.label = 8;
                    case 8:
                        if (affectedRows > 0) {
                            result["status"] = 1;
                        }
                        else {
                            result["status"] = 2;
                        }
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        result["status"] = 2;
                        _a.label = 11;
                    case 11: return [2 /*return*/, result];
                }
            });
        });
    };
    changePasswordOTPService.changepass = function (inp) {
        return __awaiter(this, void 0, void 0, function () {
            var uid, orgid, pwd, npwd, email, data2, res, querysts, sts, selectUserList, rows, updateusermaster, updateusermaster1, today, formattedDate, id, appModule, getEmpName, module, actionperformed, activityby, insertActivityHistoryMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uid = inp.empid;
                        orgid = inp.orgid;
                        pwd = inp.pwd;
                        npwd = inp.npwd;
                        email = inp.email;
                        data2 = [];
                        res = [];
                        querysts = 0;
                        sts = 0;
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .select("*")
                                .where("EmployeeId", uid)
                                .whereRaw("BINARY Password =?", pwd)
                                .andWhere("OrganizationId", orgid)];
                    case 1:
                        selectUserList = _a.sent();
                        rows = selectUserList.length;
                        if (rows) {
                            sts = selectUserList[0].appSuperviserSts;
                        }
                        if (rows < 1) {
                            data2["status"] = 2;
                        }
                        else {
                            if ((pwd = npwd)) {
                                data2["status"] = 3;
                            }
                        }
                        if (!(data2["status"] != 2 && data2["status"] != 3)) return [3 /*break*/, 7];
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .where("EmployeeId", uid)
                                .andWhere(" OrganizationId", orgid)
                                .update({
                                Password: npwd,
                                Password_sts: 1
                            })];
                    case 2:
                        updateusermaster = _a.sent();
                        querysts = querysts + updateusermaster;
                        if (!(sts == 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Database_1["default"].from("admin_login")
                                .where("email", email)
                                .andWhere("OrganizationId", orgid)
                                .update({
                                password: npwd,
                                changepasswordStatus: "1"
                            })];
                    case 3:
                        updateusermaster1 = _a.sent();
                        querysts = querysts + updateusermaster1;
                        _a.label = 4;
                    case 4:
                        if (!(querysts > 0)) return [3 /*break*/, 7];
                        data2["status"] = 1;
                        today = luxon_1.DateTime.now();
                        formattedDate = today.toFormat("yy-MM-dd HH:mm:ss");
                        id = uid;
                        appModule = "Password";
                        return [4 /*yield*/, Helper_1["default"].getEmpName(uid)];
                    case 5:
                        getEmpName = _a.sent();
                        module = "Attendance app";
                        actionperformed = "<b> Password </b>  has been updated for <b>\"" + getEmpName + ".\"</b>from <b> Attendance App </b>";
                        activityby = 1;
                        return [4 /*yield*/, Helper_1["default"].ActivityMasterInsert(formattedDate, orgid, id, activityby, appModule, actionperformed, module)];
                    case 6:
                        insertActivityHistoryMaster = _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, data2["status"]];
                }
            });
        });
    };
    return changePasswordOTPService;
}());
exports["default"] = changePasswordOTPService;
