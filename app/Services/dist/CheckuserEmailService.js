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
var CheckUserEmailService = /** @class */ (function () {
    function CheckUserEmailService() {
    }
    CheckUserEmailService.CheckUserEmail = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var email, result, usermail, checkquery, num_rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = data.email;
                        result = {};
                        return [4 /*yield*/, Helper_1["default"].encode5t(data.email)];
                    case 1:
                        usermail = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .where("Username", usermail)
                                .limit(2)];
                    case 2:
                        checkquery = _a.sent();
                        num_rows = checkquery.length;
                        if (num_rows > 0) {
                            result["status"] = "1"; // already exist E-mail
                        }
                        else {
                            result["status"] = "2"; // Not exist E-mail
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CheckUserEmailService.CheckUserPhone = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var phone, result, userphone, selectOrganizationList, Organization_num_rows, selectUserMasterList, checkquery_num_row, _a, _b, organizationId, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        phone = data.phone;
                        result = {};
                        return [4 /*yield*/, Helper_1["default"].encode5t(phone)];
                    case 1:
                        userphone = _e.sent();
                        return [4 /*yield*/, Database_1["default"].from("Organization")
                                .where("PhoneNumber", phone)
                                .select("Id as OId", "Name as OName")];
                    case 2:
                        selectOrganizationList = _e.sent();
                        Organization_num_rows = selectOrganizationList;
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .innerJoin("EmployeeMaster as E", "E.Id", "U.EmployeeId")
                                .innerJoin("EmployeeMaster as E2", "E2.organizationId", "U.organizationId")
                                .select("U.username_mobile", Database_1["default"].raw("CONCAT(E.FirstName, ' ', E.lastname) as Name"), "Password", "E.OrganizationId")
                                .from("UserMaster as U")
                                .andWhere("U.username_mobile", userphone)];
                    case 3:
                        selectUserMasterList = _e.sent();
                        checkquery_num_row = selectUserMasterList;
                        if (!(checkquery_num_row.length > 0 || Organization_num_rows.length > 0)) return [3 /*break*/, 7];
                        if (!(checkquery_num_row.length > 0)) return [3 /*break*/, 6];
                        console.log("op");
                        result["name"] = checkquery_num_row[0].Name;
                        _a = result;
                        _b = "password";
                        return [4 /*yield*/, Helper_1["default"].decode5t(checkquery_num_row[0].Password)];
                    case 4:
                        _a[_b] = _e.sent();
                        organizationId = checkquery_num_row[0].OrganizationId;
                        _c = result;
                        _d = "orgName";
                        return [4 /*yield*/, Helper_1["default"].getOrgName(organizationId)];
                    case 5:
                        _c[_d] = _e.sent();
                        result["orgId"] = checkquery_num_row[0].OrganizationId;
                        _e.label = 6;
                    case 6:
                        if (Organization_num_rows.length > 0) {
                            console.log("o");
                            result["orgName"] = Organization_num_rows[0].Name;
                            result["orgId"] = Organization_num_rows[0].Id;
                        }
                        result["status"] = "1";
                        return [3 /*break*/, 8];
                    case 7:
                        result["status"] = "2";
                        _e.label = 8;
                    case 8: return [2 /*return*/, result];
                }
            });
        });
    };
    CheckUserEmailService.VerifyEmailOtpRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var EmailId, Otp, Orgid, newemailId, resultOTP, otpVerify, numRowsAffected, numRowsUpdated, count, data2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        EmailId = data.emailId;
                        Otp = data.otp;
                        Orgid = data.orgId;
                        return [4 /*yield*/, Helper_1["default"].encode5t(EmailId)];
                    case 1:
                        newemailId = _a.sent();
                        resultOTP = {};
                        return [4 /*yield*/, Database_1["default"].from("EmailOtp_Authentication")
                                .select("*")
                                .where("otp", Otp)
                                .andWhere("email_id", newemailId)];
                    case 2:
                        otpVerify = _a.sent();
                        numRowsAffected = otpVerify.length;
                        if (!(numRowsAffected > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Database_1["default"].from("Organization")
                                .where("Id", Orgid)
                                .update({ mail_varified: 1 })];
                    case 3:
                        numRowsUpdated = _a.sent();
                        count = numRowsUpdated;
                        if (count) {
                            resultOTP["resultOTP"] = "1";
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        resultOTP["resultOTP"] = "0";
                        _a.label = 5;
                    case 5:
                        data2 = [resultOTP];
                        return [2 /*return*/, data2];
                }
            });
        });
    };
    CheckUserEmailService.UpdateEmailOTPRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var EmailNew, OldEmail, Empid, Orgid, result, affectedRows1, EncodeEmail, fetchemqilEmp, fetchemqilUser, fetchemqilAuth, updateEmail, updateUserEmail, updateEmaiOTPEmail, updateOrgEmaiOTPEmail, updateAdminEmaiOTPEmail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        EmailNew = data.emailId;
                        OldEmail = data.oldEmail;
                        Empid = data.empId;
                        Orgid = data.orgId;
                        result = {};
                        return [4 /*yield*/, Helper_1["default"].encode5t(EmailNew)];
                    case 1:
                        EncodeEmail = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("CurrentEmailId")
                                .where("CurrentEmailId", EncodeEmail)];
                    case 2:
                        fetchemqilEmp = _a.sent();
                        affectedRows1 = fetchemqilEmp.length;
                        if (affectedRows1 > 0) {
                            result["status"] = "1";
                            return [2 /*return*/, result];
                        }
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .select("Username")
                                .where("Username", EncodeEmail)];
                    case 3:
                        fetchemqilUser = _a.sent();
                        affectedRows1 = fetchemqilUser.length;
                        if (affectedRows1 > 0) {
                            result["status"] = "2";
                            return [2 /*return*/, result];
                        }
                        return [4 /*yield*/, Database_1["default"].from("EmailOtp_Authentication")
                                .select("email_id")
                                .where("email_id", EncodeEmail)];
                    case 4:
                        fetchemqilAuth = _a.sent();
                        affectedRows1 = fetchemqilAuth.length;
                        if (affectedRows1 > 0) {
                            result["status"] = "3";
                            return [2 /*return*/, result];
                        }
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .where("OrganizationId", Orgid)
                                .andWhere("Id", Empid)
                                .update({ CurrentEmailId: EncodeEmail })];
                    case 5:
                        updateEmail = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .where("OrganizationId", Orgid)
                                .andWhere("EmployeeId", Empid)
                                .update("Username", EncodeEmail)];
                    case 6:
                        updateUserEmail = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("EmailOtp_Authentication")
                                .where("orgId", Orgid)
                                .andWhere("empId", Empid)
                                .update("email_id", EncodeEmail)];
                    case 7:
                        updateEmaiOTPEmail = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("Organization")
                                .where("Id", Orgid)
                                .update("Email", EmailNew)];
                    case 8:
                        updateOrgEmaiOTPEmail = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("admin_login")
                                .where("email", OldEmail)
                                .andWhere("OrganizationId", Orgid)
                                .update({
                                email: EmailNew,
                                username: EmailNew
                            })];
                    case 9:
                        updateAdminEmaiOTPEmail = _a.sent();
                        if (updateEmail || updateUserEmail || updateEmaiOTPEmail) {
                            result["status"] = 0;
                        }
                        else {
                            result["status"] = 4;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return CheckUserEmailService;
}());
exports["default"] = CheckUserEmailService;
