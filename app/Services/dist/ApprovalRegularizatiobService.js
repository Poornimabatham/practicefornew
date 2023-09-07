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
var DateTime = require("luxon").DateTime;
var GetapprovalRegularService = /** @class */ (function () {
    function GetapprovalRegularService() {
    }
    GetapprovalRegularService.GetregularizationApproverRejectedAPI = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var ActivityBy, module, count, count1, successMsg, Msg1, Msg, status, count11, con, regularizetimein, totalovertime, newtimeout, selectAttendanceMasterList, err_1, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ActivityBy = 0;
                        module = "";
                        count = 0;
                        count1 = 0;
                        successMsg = "";
                        Msg1 = "Regularization could not be rejected.";
                        Msg = "Regularization could not be approved.";
                        status = false;
                        count11 = 0;
                        con = 0;
                        regularizetimein = "00:00:00";
                        newtimeout = "00:00:00";
                        if (data.RegularizationAppliedFrom != 2) {
                            ActivityBy = 0;
                            module = "ubiHRM APP";
                        }
                        if (data.RegularizationAppliedFrom == 2) {
                            ActivityBy = 1;
                            module = "ubiattendance APP";
                        }
                        if (!(data.attendance_id != undefined && data.attendance_id != 0)) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .select("Id", "RegularizeTimeOut", "RegularizeTimeIn", "TimeIn", "TimeOut", "AttendanceDate", "EmployeeId")
                                .where("Id", data.attendance_id)];
                    case 2:
                        selectAttendanceMasterList = _a.sent();
                        count1 = selectAttendanceMasterList.length;
                        if (!(count1 == 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.all(selectAttendanceMasterList.map(function (val) { return __awaiter(_this, void 0, void 0, function () {
                                var timein, timeout, attendancedate, orginaltimein, empid, selectEmployeeMasterList, empname, selectAttendanceMasterList_1, hrid, shiftId, mdate, updateAttendanceMaster, affected_rows, selectAttendaneMasterList2_1, attsts, updateAttendanceMaster, msg, insertActivityHistoryMaster, title, emailmsg, updateRegularizationApproval, insertActivityHistoryMaster, selectRegulariationList, approverId, timeincondition, updateAttendanceMaster, selectAttendaneMasterList2, updateAttendanceMaster, insertActivityHistoryMaster_1, selectAttendanceMasterList_2, updateAttendanceMaster, insertActivityHistoryMaster, updateRegularizationApproval, updateAttendanceMaster, insertActivityHistoryMaster;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            newtimeout = val.RegularizeTimeOut;
                                            timein = val.TimeIn;
                                            timeout = val.TimeOut;
                                            regularizetimein = val.RegularizeTimeIn;
                                            attendancedate = val.AttendanceDate;
                                            orginaltimein = val.TimeIn;
                                            empid = val.EmployeeId;
                                            return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                                    .select(Database_1["default"].raw("\n    IF(LastName != '', CONCAT(FirstName, ' ', LastName), FirstName) as name\n  "), "Shift", "Department", "Designation", "area_assigned", "CompanyEmail")
                                                    .where("Id", empid)
                                                    .orWhere("organizationId", data.orgid)
                                                    .limit(2)];
                                        case 1:
                                            selectEmployeeMasterList = _a.sent();
                                            if (selectEmployeeMasterList.length > 0) {
                                                empname = selectEmployeeMasterList[0].name;
                                            }
                                            if (!(data.approverresult == 2)) return [3 /*break*/, 23];
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .select("*")
                                                    .where("ApproverId", "!=", 0)
                                                    .andWhere("Id", data.attendance_id)];
                                        case 2:
                                            selectAttendanceMasterList_1 = _a.sent();
                                            hrid = data.uid;
                                            if (!(selectAttendanceMasterList_1.length > 0)) return [3 /*break*/, 12];
                                            shiftId = selectAttendanceMasterList_1[0].ShiftId;
                                            if (!(regularizetimein == timein)) return [3 /*break*/, 5];
                                            return [4 /*yield*/, Helper_1["default"].getOvertimeForRegularization(timein, newtimeout, shiftId)];
                                        case 3:
                                            totalovertime = _a.sent();
                                            mdate = DateTime.local().toFormat("yyyy-MM-dd HH:mm:ss");
                                            return [4 /*yield*/, Database_1["default"].query()
                                                    .from("AttendanceMaster")
                                                    .where("Id", data.attendance_id)
                                                    .andWhere("RegularizeSts", 3)
                                                    .update({
                                                    TimeOut: newtimeout,
                                                    Overtime: totalovertime,
                                                    RegularizeSts: data.approverresult,
                                                    RegularizeApprovalDate: mdate,
                                                    RegularizeApproverRemarks: data.comment,
                                                    LastModifiedById: hrid
                                                })];
                                        case 4:
                                            updateAttendanceMaster = _a.sent();
                                            count = updateAttendanceMaster;
                                            return [3 /*break*/, 9];
                                        case 5:
                                            affected_rows = 0;
                                            return [4 /*yield*/, Helper_1["default"].getOvertimeForRegularization(timein, newtimeout, shiftId)];
                                        case 6:
                                            totalovertime = _a.sent();
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .select("*")
                                                    .where("Id", data.attendance_id)
                                                    .andWhere("RegularizeSts", 3)];
                                        case 7:
                                            selectAttendaneMasterList2_1 = _a.sent();
                                            affected_rows = selectAttendaneMasterList2_1.length;
                                            if (!(affected_rows == 1)) return [3 /*break*/, 9];
                                            attsts = selectAttendaneMasterList2_1[0].AttendanceStatus;
                                            if (attsts == 2) {
                                                attsts = 1;
                                            }
                                            return [4 /*yield*/, Database_1["default"].query()
                                                    .from("AttendanceMaster")
                                                    .where("Id", data.attendance_id)
                                                    .andWhere("RegularizeSts", 3)
                                                    .update({
                                                    AttendanceStatus: attsts,
                                                    TimeIn: regularizetimein,
                                                    TimeOut: newtimeout,
                                                    LastModifiedDate: mdate,
                                                    LastModifiedById: data.uid,
                                                    Overtime: totalovertime,
                                                    RegularizeSts: data.approverresult,
                                                    RegularizeApproverRemarks: data.comment,
                                                    RegularizeApprovalDate: mdate
                                                })];
                                        case 8:
                                            updateAttendanceMaster = _a.sent();
                                            count = updateAttendanceMaster;
                                            _a.label = 9;
                                        case 9:
                                            if (!(count >= 1)) return [3 /*break*/, 11];
                                            msg = "Regularization request of <b>" + empname + "</b> has been approved </br> Attendance Date: <b>" + attendancedate + "</b>";
                                            return [4 /*yield*/, Database_1["default"].insertQuery()
                                                    .table("ActivityHistoryMaster")
                                                    .insert({
                                                    LastModifiedById: data.uid,
                                                    ActionPerformed: msg,
                                                    Module: module,
                                                    OrganizationId: data.orgid,
                                                    ActivityBy: ActivityBy
                                                })];
                                        case 10:
                                            insertActivityHistoryMaster = _a.sent();
                                            title = "Alert:Your Regularization Request is approved";
                                            emailmsg = "Dear " + empname + "<br><br> This is to inform you that your regularization\n                   request has been approved.<br>Remarks :  ." + data.comment;
                                            _a.label = 11;
                                        case 11: return [3 /*break*/, 23];
                                        case 12: return [4 /*yield*/, Database_1["default"].from("RegularizationApproval")
                                                .where("attendance_id  ", data.attendance_id)
                                                .andWhere("ApproverId", data.uid)
                                                .andWhere("OrganizationId", data.orgid)
                                                .andWhere("ApproverSts", 3)
                                                .andWhere("approverregularsts", 0)
                                                .update({
                                                ApproverSts: data.approverresult,
                                                ApprovalDate: mdate,
                                                ApproverComment: data.comment
                                            })];
                                        case 13:
                                            updateRegularizationApproval = _a.sent();
                                            count = updateRegularizationApproval;
                                            hrid = data.uid;
                                            if (!(count >= 1)) return [3 /*break*/, 23];
                                            msg = "Regularization request of <b>" + empname + "</b> has been approved </br> Attendance Date: <b>" + attendancedate + "</b>";
                                            return [4 /*yield*/, Database_1["default"].insertQuery()
                                                    .table("ActivityHistoryMaster")
                                                    .insert({
                                                    LastModifiedById: data.uid,
                                                    ActionPerformed: msg,
                                                    Module: module,
                                                    OrganizationId: data.orgid,
                                                    ActivityBy: ActivityBy
                                                })];
                                        case 14:
                                            insertActivityHistoryMaster = _a.sent();
                                            return [4 /*yield*/, Database_1["default"].from("RegularizationApproval")
                                                    .select("ApproverId")
                                                    .where("attendance_id  ", data.attendance_id)
                                                    .andWhere("ApproverId", data.uid)
                                                    .andWhere("OrganizationId", data.orgid)
                                                    .andWhere("ApproverSts", 3)
                                                    .andWhere("approverregularsts", 0)];
                                        case 15:
                                            selectRegulariationList = _a.sent();
                                            con = selectRegulariationList.length;
                                            if (!(con > 0)) return [3 /*break*/, 16];
                                            approverId = con[0].ApproverId;
                                            hrid = con[0].ApproverId;
                                            if (regularizetimein == orginaltimein) {
                                                timeincondition = "";
                                            }
                                            else {
                                                timeincondition = "The requested timein is: " + regularizetimein + "<br><br><br>";
                                            }
                                            msg = "Dear $Hrname,<br><br>\n\t\t\t\t\t\t\t\t\t\tThis is to inform you that, " + empname + " has requested regularization for \n                    the " + attendancedate + ". Kindly approve the request.<br>\n\t\t\t\t\t\t\t\t\t\t" + timeincondition + "\n\t\t\t\t\t\t\t\t\t\tThe requested timeout is: " + newtimeout + "<br><br><br>";
                                            return [3 /*break*/, 21];
                                        case 16:
                                            if (!(regularizetimein == timein)) return [3 /*break*/, 18];
                                            return [4 /*yield*/, Database_1["default"].query()
                                                    .from("AttendanceMaster")
                                                    .where("Id", data.attendance_id)
                                                    .andWhere("RegularizeSts", 3)
                                                    .update({
                                                    TimeOut: newtimeout,
                                                    Overtime: totalovertime,
                                                    RegularizeSts: data.approverresult,
                                                    LastModifiedDate: mdate,
                                                    RegularizeApproverRemarks: data.comment,
                                                    LastModifiedById: hrid
                                                })];
                                        case 17:
                                            updateAttendanceMaster = _a.sent();
                                            count = updateAttendanceMaster.length;
                                            return [3 /*break*/, 21];
                                        case 18:
                                            affected_rows = 0;
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .select("*")
                                                    .where("Id", data.attendance_id)
                                                    .andWhere("RegularizeSts", 3)];
                                        case 19:
                                            selectAttendaneMasterList2 = _a.sent();
                                            if (affected_rows == 1) {
                                                attsts =
                                                    selectAttendaneMasterList2[0].AttendanceStatus;
                                            }
                                            if (attsts == 2) {
                                                attsts = 1;
                                            }
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .where("Id", data.attendance_id)
                                                    .where("RegularizeSts", 3)
                                                    .update({
                                                    TimeOut: newtimeout,
                                                    Overtime: totalovertime,
                                                    RegularizeSts: data.approverResult,
                                                    RegularizeApprovalDate: mdate,
                                                    RegularizeApproverRemarks: data.comment,
                                                    LastModifiedById: hrid
                                                })];
                                        case 20:
                                            updateAttendanceMaster = _a.sent();
                                            _a.label = 21;
                                        case 21:
                                            if (!(count >= 1)) return [3 /*break*/, 23];
                                            msg = "Regularization request of <b>" + empname + "</b> has been approved </br> Attendance Date: <b>" + attendancedate + "</b>";
                                            return [4 /*yield*/, Database_1["default"].insertQuery()
                                                    .table("ActivityHistoryMaster")
                                                    .insert({
                                                    LastModifiedById: data.uid,
                                                    ActionPerformed: msg,
                                                    Module: module,
                                                    OrganizationId: data.orgid,
                                                    ActivityBy: ActivityBy
                                                })];
                                        case 22:
                                            insertActivityHistoryMaster_1 = _a.sent();
                                            title = "Alert:Your Regularization Request is approved";
                                            emailmsg = "Dear " + empname + ",<br><br> This is to inform you that your regularization request has been approved.<br>Remarks : \n                       \"." + data.comment;
                                            _a.label = 23;
                                        case 23:
                                            if (!(data.approverresult == 1)) return [3 /*break*/, 31];
                                            selectAttendanceMasterList_2 = Database_1["default"].from("AttendanceMaster")
                                                .where("ApproverId", "!=", 0)
                                                .andWhere("Id", data.attendance_id)
                                                .select("Id");
                                            if (!(selectAttendanceMasterList_2.length > 0)) return [3 /*break*/, 27];
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .where("Id", data.attendanceId)
                                                    .where("RegularizeSts", 2)
                                                    .update({
                                                    RegularizeSts: data.approverResult,
                                                    RegularizeApprovalDate: mdate,
                                                    RegularizeApproverRemarks: data.comment
                                                })];
                                        case 24:
                                            updateAttendanceMaster = _a.sent();
                                            if (!(count >= 1)) return [3 /*break*/, 26];
                                            msg = "Regularization request of <b>" + empname + "</b> has been rejected</br> Attendance Date: <b>" + attendancedate + "</b>";
                                            return [4 /*yield*/, Database_1["default"].insertQuery()
                                                    .table("ActivityHistoryMaster")
                                                    .insert({
                                                    LastModifiedById: data.uid,
                                                    ActionPerformed: msg,
                                                    Module: module,
                                                    OrganizationId: data.orgid,
                                                    ActivityBy: ActivityBy
                                                })];
                                        case 25:
                                            insertActivityHistoryMaster = _a.sent();
                                            title = "Alert:Your Regularization Request is  rejected";
                                            emailmsg = "Dear " + empname + ",<br><br> This is to inform you that your regularization request has been rejected.<br>Remarks : \n         \"." + data.comment;
                                            _a.label = 26;
                                        case 26: return [3 /*break*/, 31];
                                        case 27:
                                            console.log("es", data.attendance_id, data.uid, data.orgid);
                                            return [4 /*yield*/, Database_1["default"].from("RegularizationApproval")
                                                    .where("attendanceId", data.attendance_id)
                                                    .where("ApproverId", data.uid)
                                                    .where("OrganizationId", data.orgid)
                                                    .where("ApproverSts", 3)
                                                    .where("ApprovalDate", "0000-00-00 00:00:00")
                                                    .update({
                                                    ApproverSts: data.approverResult,
                                                    ApprovalDate: mdate,
                                                    ApproverComment: data.comment,
                                                    approverregularsts: 1
                                                })];
                                        case 28:
                                            updateRegularizationApproval = _a.sent();
                                            count11 = updateRegularizationApproval.length;
                                            if (!(count11 >= 1)) return [3 /*break*/, 31];
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .where("Id", data.attendanceId)
                                                    .where("RegularizeSts", 3)
                                                    .update({
                                                    RegularizeSts: data.approverResult,
                                                    RegularizeApprovalDate: mdate,
                                                    RegularizeApproverRemarks: data.comment
                                                })];
                                        case 29:
                                            updateAttendanceMaster = _a.sent();
                                            count = updateAttendanceMaster.length;
                                            if (!(count >= 1)) return [3 /*break*/, 31];
                                            msg = "Regularization request of <b>" + empname + "</b> has been rejected | \n    AttendanceDate: <b>" + attendancedate + "</b>";
                                            return [4 /*yield*/, Database_1["default"].insertQuery()
                                                    .table("ActivityHistoryMaster")
                                                    .insert({
                                                    LastModifiedById: data.uid,
                                                    ActionPerformed: msg,
                                                    Module: module,
                                                    OrganizationId: data.orgid,
                                                    ActivityBy: ActivityBy
                                                })];
                                        case 30:
                                            insertActivityHistoryMaster = _a.sent();
                                            title = "Alert:Your Regularization Request is rejected";
                                            emailmsg = "Dear " + empname + ",<br><br> This\n                     is to inform you that your regularization request has \n                      rejected.<br>HR Remarks :  \"." + data.comment;
                                            _a.label = 31;
                                        case 31: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 6];
                    case 6:
                        if (count >= 1) {
                            status = true;
                            if (data.approverresult == 2) {
                                successMsg = "Regularization has been Approved";
                                Msg = "Regularization has been Approved";
                            }
                            else if (data.approverresult == 1) {
                                successMsg = "Regularization has been Rejected";
                                Msg1 = "Regularization has been Rejected";
                            }
                        }
                        if (data.platform == undefined) {
                            return [2 /*return*/, status];
                        }
                        else {
                            response = {
                                status: status,
                                Msg: Msg,
                                Msg1: Msg1
                            };
                            return [2 /*return*/, response];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return GetapprovalRegularService;
}());
exports["default"] = GetapprovalRegularService;
