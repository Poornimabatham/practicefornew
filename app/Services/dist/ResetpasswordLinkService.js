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
var ResetPasswordLinkService = /** @class */ (function () {
    function ResetPasswordLinkService() {
    }
    ResetPasswordLinkService.ResetPassword = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var una, result, selectEmployeeList, rows, orgid, email, _a, Name, querytest, body, subject, body1, headers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Helper_1["default"].encode5t(data.una)];
                    case 1:
                        una = _b.sent();
                        result = {};
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("Id", "OrganizationId", "FirstName", "LastName", Database_1["default"].raw("(SELECT resetPassCounter FROM  UserMaster  WHERE Username = ? OR username_mobile = ?) as  ctr", [una, una]), Database_1["default"].raw("(SELECT Username FROM  UserMaster  WHERE Username = ? OR username_mobile = ?) as  email", [una, una]))
                                .where("Id", Database_1["default"].raw("(SELECT  EmployeeId FROM UserMaster WHERE Username =? OR username_mobile=?)", [una, una]))];
                    case 2:
                        selectEmployeeList = _b.sent();
                        rows = selectEmployeeList.length;
                        if (!(rows > 0)) return [3 /*break*/, 9];
                        if (!(rows[0] != "")) return [3 /*break*/, 7];
                        orgid = selectEmployeeList[0].OrganizationId;
                        if (!selectEmployeeList[0].email) return [3 /*break*/, 4];
                        return [4 /*yield*/, Helper_1["default"].decode5t(selectEmployeeList[0].email)];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = "";
                        _b.label = 5;
                    case 5:
                        email = _a;
                        Name = selectEmployeeList[0].FirstName + " " + selectEmployeeList[0].LastName;
                        return [4 /*yield*/, Database_1["default"].from("All_mailers")
                                .select("Body", "Subject")
                                .where("Id", "23")];
                    case 6:
                        querytest = _b.sent();
                        if (querytest.length) {
                            body = querytest[0].Body;
                            subject = querytest[0].Subject;
                        }
                        body1 = body.replace("{Admin_Name}", Name);
                        headers = "From: <noreply@ubiattendance.com>\r\n";
                        result["status"] = "1";
                        return [2 /*return*/, result];
                    case 7:
                        result["status"] = "0";
                        return [2 /*return*/, result];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        result["status"] = "2";
                        return [2 /*return*/, result];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ResetPasswordLinkService.getAllowAttToUserData = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var AllowToPunchAtt, Id, Orgid, Empid, status, data, S1, updateUserMaster, affectedRows, zone, defaultZone, currenttime, appModule, module, getEmpName, getEmpName2, actionperformed, activityby, insertActivityHistoryMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        AllowToPunchAtt = input.allowToPunchAtt;
                        Id = input.Id;
                        Orgid = input.orgid;
                        Empid = input.empid;
                        status = {};
                        data = {};
                        if (AllowToPunchAtt == "true") {
                            S1 = 1;
                        }
                        else {
                            S1 = 0;
                        }
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .where("EmployeeId", Id)
                                .update({
                                Att_restrict: S1
                            })];
                    case 1:
                        updateUserMaster = _a.sent();
                        affectedRows = updateUserMaster;
                        if (affectedRows) {
                            status["status"] = "true";
                        }
                        else {
                            status["status"] = "false";
                        }
                        if (!(affectedRows == 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Helper_1["default"].getTimeZone(Orgid)];
                    case 2:
                        zone = _a.sent();
                        defaultZone = luxon_1.DateTime.now().setZone(zone);
                        currenttime = defaultZone.toFormat("yy-MM-dd HH:mm:ss'");
                        appModule = "Attendance  Restrication";
                        module = "Attendance App";
                        return [4 /*yield*/, Helper_1["default"].getEmpName(Id)];
                    case 3:
                        getEmpName = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getEmpName(Empid)];
                    case 4:
                        getEmpName2 = _a.sent();
                        actionperformed = "<b>\"." + getEmpName + ".\"</b>\n            Attendance Restrected By permission has been updated by <b>\"\n            ." + getEmpName2 + ".\"</b> from<b> Attendance App  </b>";
                        activityby = 1;
                        return [4 /*yield*/, Helper_1["default"].ActivityMasterInsert(currenttime, Orgid, Id, activityby, appModule, actionperformed, module)];
                    case 5:
                        insertActivityHistoryMaster = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, status];
                }
            });
        });
    };
    ResetPasswordLinkService.MoveEmpDataInExistingOrg = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var Empid, NewOrg, OldOrg, Status, Contact, Admin_Name, AdminEmail, FirstName, EmployeeName, eid, EmpSts, COUNT, dept, desg, shift, CountFlag, deleteQuery, UpdateQuery, body, body1, subject, message_body, result, selectUsermasterlist, updateQuery, updateQuery2, updateQuery3, updateQuery4, selectMail, rows, headers, updatePreventSignup, selectMail, rows, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Empid = data.uid;
                        NewOrg = data.orgid;
                        OldOrg = data.OldOrgId;
                        Status = data.status;
                        Contact = data.usercontact;
                        return [4 /*yield*/, Helper_1["default"].getAdminNamebyOrgId(OldOrg)];
                    case 1:
                        Admin_Name = _a.sent();
                        AdminEmail = data.Email;
                        return [4 /*yield*/, Helper_1["default"].getEmpName(Empid)];
                    case 2:
                        FirstName = _a.sent();
                        EmployeeName = FirstName + Contact;
                        CountFlag = 0;
                        result = {};
                        if (!(Status == 1)) return [3 /*break*/, 27];
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .select("*")
                                .where("OrganizationId", NewOrg)];
                    case 3:
                        selectUsermasterlist = _a.sent();
                        COUNT = selectUsermasterlist.length;
                        if (!selectUsermasterlist) return [3 /*break*/, 23];
                        eid = selectUsermasterlist[0].Id;
                        EmpSts = selectUsermasterlist[0].appSuperviserSts;
                        return [4 /*yield*/, Helper_1["default"].getTrialDept(OldOrg)];
                    case 4:
                        dept = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getTrialDesg(OldOrg)];
                    case 5:
                        desg = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getTrialShift(OldOrg)];
                    case 6:
                        shift = _a.sent();
                        if (!(COUNT == 1 && EmpSts == 1)) return [3 /*break*/, 18];
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster ")
                                .where("OrganizationId", NewOrg)
                                .andWhere("Id", Empid)
                                .update({
                                Department: dept,
                                Designation: desg,
                                Shift: shift
                            })];
                    case 7:
                        updateQuery = _a.sent();
                        CountFlag = CountFlag + updateQuery;
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .where("OrganizationId", NewOrg)
                                .andWhere("EmployeeId", Empid)
                                .update({
                                OrganizationId: OldOrg
                            })];
                    case 8:
                        updateQuery2 = _a.sent();
                        CountFlag = CountFlag + updateQuery2;
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .where("OrganizationId", NewOrg)
                                .andWhere("EmployeeId", Empid)
                                .update({
                                OrganizationId: OldOrg,
                                ShiftId: shift,
                                Dept_id: dept,
                                Desg_id: desg
                            })];
                    case 9:
                        updateQuery3 = _a.sent();
                        CountFlag = CountFlag + updateQuery3;
                        return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                .where("OrganizationId", NewOrg)
                                .andWhere("EmployeeId", Empid)
                                .update({
                                OrganizationId: OldOrg
                            })];
                    case 10:
                        updateQuery4 = _a.sent();
                        CountFlag = CountFlag + updateQuery4;
                        if (!(CountFlag > 0)) return [3 /*break*/, 17];
                        return [4 /*yield*/, Database_1["default"].from("ShiftMaster")
                                .where("OrganizationId", NewOrg)["delete"]()];
                    case 11:
                        deleteQuery = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("ShiftMasterChild")
                                .where("OrganizationId", NewOrg)["delete"]()];
                    case 12:
                        deleteQuery = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("DepartmentMaster")
                                .where(" OrganizationId", NewOrg)["delete"]()];
                    case 13:
                        deleteQuery = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("DesignationMaster")
                                .where("OrganizationId", NewOrg)["delete"]()];
                    case 14:
                        deleteQuery = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("licence_ubiattendance")
                                .where("OrganizationIdd", NewOrg)["delete"]()];
                    case 15:
                        deleteQuery = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("Organization")
                                .where("Id", NewOrg)["delete"]()];
                    case 16:
                        deleteQuery = _a.sent();
                        _a.label = 17;
                    case 17: return [3 /*break*/, 21];
                    case 18: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                            .where("OrganizationId", NewOrg)
                            .andWhere("Id", Empid)
                            .update({
                            Department: dept,
                            Designation: desg,
                            Shift: shift,
                            OrganizationId: OldOrg
                        })];
                    case 19:
                        UpdateQuery = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .where("OrganizationId", NewOrg)
                                .andWhere("Id", Empid)
                                .update({
                                OrganizationId: OldOrg
                            })];
                    case 20:
                        UpdateQuery = _a.sent();
                        _a.label = 21;
                    case 21: return [4 /*yield*/, Database_1["default"].from("PreventSignup")
                            .where("Status", 0)
                            .andWhere("EmployeeId ", Empid)
                            .andWhere("OrganizationId", NewOrg)
                            .update({
                            Status: 1
                        })];
                    case 22:
                        UpdateQuery = _a.sent();
                        _a.label = 23;
                    case 23:
                        result["status"] = 1;
                        if (!(result["status"] == 1)) return [3 /*break*/, 26];
                        return [4 /*yield*/, Database_1["default"].from("All_mailers")
                                .select(" Body", "Subject")
                                .where("Id", 39)];
                    case 24:
                        selectMail = _a.sent();
                        rows = selectMail;
                        if (rows) {
                            body = rows[0].Body;
                            subject = rows[0].Subject;
                        }
                        body1 = body.replace("{Admin Name}", Admin_Name);
                        message_body = body1.replace("{Employee Name}", EmployeeName);
                        headers = "MIME-Version: 1.0" + "\r\n";
                        headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
                        headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";
                        // console.log(AdminEmail)
                        // AdminEmail = "pbatham21@gmail.com";       ////for testing
                        // console.log(AdminEmail);
                        return [4 /*yield*/, Helper_1["default"].sendEmail(AdminEmail, subject, message_body, headers)];
                    case 25:
                        // console.log(AdminEmail)
                        // AdminEmail = "pbatham21@gmail.com";       ////for testing
                        // console.log(AdminEmail);
                        _a.sent();
                        _a.label = 26;
                    case 26: return [3 /*break*/, 31];
                    case 27: return [4 /*yield*/, Database_1["default"].from("PreventSignup")
                            .where("Status", 0)
                            .andWhere("EmployeeId", Empid)
                            .andWhere("OrganizationId", NewOrg)
                            .update({
                            Status: 2
                        })];
                    case 28:
                        updatePreventSignup = _a.sent();
                        result["status"] = 0;
                        if (!(result["status"] == 0)) return [3 /*break*/, 31];
                        return [4 /*yield*/, Database_1["default"].from("All_mailers")
                                .select(" Body", "Subject")
                                .where("Id", 39)];
                    case 29:
                        selectMail = _a.sent();
                        rows = selectMail;
                        if (rows) {
                            body = rows[0].Body;
                            subject = rows[0].Subject;
                        }
                        body1 = body.replace("{Admin Name}", Admin_Name);
                        message_body = body1.replace("{Employee Name}", EmployeeName);
                        headers = "MIME-Version: 1.0" + "\r\n";
                        headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
                        headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";
                        // AdminEmail = "pbatham21@gmail.com";       ////for testing
                        // console.log(AdminEmail);
                        return [4 /*yield*/, Helper_1["default"].sendEmail(AdminEmail, subject, message_body, headers)];
                    case 30:
                        // AdminEmail = "pbatham21@gmail.com";       ////for testing
                        // console.log(AdminEmail);
                        _a.sent();
                        _a.label = 31;
                    case 31: return [2 /*return*/, result];
                }
            });
        });
    };
    return ResetPasswordLinkService;
}());
exports["default"] = ResetPasswordLinkService;
