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
var AttendanceMaster_1 = require("App/Models/AttendanceMaster");
var EmployeeMaster_1 = require("App/Models/EmployeeMaster");
var luxon_1 = require("luxon");
var moment_1 = require("moment");
var DailyAttendanceService = /** @class */ (function () {
    function DailyAttendanceService() {
    }
    DailyAttendanceService.getpresentList = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var begin, limit, offset, designationCondition, departmentCondition, AttendanceDate, adminStatus, departmentId, AttDate, currDate, countRecordsQuery, totalCount, DailyAttPresentReportDataQueryResult, DailyAttPresentReportDataQuery, departmentId, result, departmentId, AttDate, absCountQuery, absCount, orgId, absentCountQuery, absentCountQueryResult, absentListResult, departmentId, AbsCountQuery, AbsCountQueryResult, AbsentCountQuery, AbsentCountQueryResult, otherDayAbsentData, DepartmentCondition, DepartmentId, AttDate, currDate, LateComingsQuery, LateComingsQueryResult, LateComingsData, DepartmentId, AttDate, currDate, earlyLeavingsQuery, earlyLeavingsQueryResult, earlyleavings;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        begin = (data.currentPage - 1) * data.perPage;
                        if (data.currentPage != undefined && data.csv == undefined) {
                            limit = data.perPage;
                            offset = begin;
                        }
                        else {
                            limit = "";
                            offset = "";
                        }
                        return [4 /*yield*/, Helper_1["default"].getAdminStatus(data.EmployeeId)];
                    case 1:
                        adminStatus = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getDepartmentIdByEmpID(data.EmployeeId)];
                    case 2:
                        departmentId = _a.sent();
                        if (!(data.dataFor == "present")) return [3 /*break*/, 7];
                        if (data.date != undefined && data.date != " ") {
                            AttDate = data.date;
                            AttendanceDate = AttDate.toFormat("yyyy-MM-dd");
                        }
                        else {
                            currDate = moment_1["default"]().format("YYYY-MM-DD");
                            AttendanceDate = currDate;
                        }
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .select("Id")
                                .where("AttendanceDate", AttendanceDate)
                                .andWhere("OrganizationId", data.OrganizationId)
                                .whereIn("AttendanceStatus", [1, 3, 5])
                                .whereIn("EmployeeId", Database_1["default"].rawQuery("(SELECT Id from EmployeeMaster where OrganizationId =" + data.OrganizationId + " AND Is_Delete = 0 )"))
                                .count("Id as Id")];
                    case 3:
                        countRecordsQuery = _a.sent();
                        if (countRecordsQuery.length > 0) {
                            totalCount = countRecordsQuery[0].Id;
                        }
                        DailyAttPresentReportDataQuery = Database_1["default"].from("AttendanceMaster as A")
                            .select(Database_1["default"].raw("CONCAT(E.FirstName, ' ', E.LastName) as name"), Database_1["default"].raw("SUBSTR(A.TimeIn, 1, 5) as `TimeIn`"), Database_1["default"].raw("(SELECT shifttype FROM ShiftMaster WHERE Id = ShiftId) as shiftType"), Database_1["default"].raw("SUBSTR(A.TimeOut, 1, 5) as `TimeOut`"), Database_1["default"].raw("'Present' as status"), Database_1["default"].raw("SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage"), Database_1["default"].raw("SUBSTRING_INDEX(A.ExitImage, '.com/', -1) as ExitImage"), Database_1["default"].raw("SUBSTR(A.checkInLoc, 1, 40) as checkInLoc"), Database_1["default"].raw("SUBSTR(A.CheckOutLoc, 1, 40) as CheckOutLoc"), "A.latit_in", "A.longi_in", "A.latit_out", "A.longi_out", "A.Id", "A.TotalLoggedHours", "A.AttendanceStatus", "A.ShiftId", "A.multitime_sts")
                            .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
                            .innerJoin("DesignationMaster as DM", "A.Desg_id", "DM.Id")
                            .where("E.OrganizationId", data.OrganizationId)
                            .whereIn("A.AttendanceStatus", [1, 3, 4, 5, 8])
                            .where("A.AttendanceDate", AttendanceDate)
                            .where("E.Is_Delete", 0)
                            .orderBy("name", "asc")
                            .limit(limit)
                            .offset(offset);
                        if (!(adminStatus == 2)) return [3 /*break*/, 5];
                        return [4 /*yield*/, Helper_1["default"].getDepartmentIdByEmpID(data.EmployeeId)];
                    case 4:
                        departmentId = _a.sent();
                        departmentCondition = "E.Department = " + departmentId;
                        DailyAttPresentReportDataQuery.whereRaw(departmentCondition);
                        _a.label = 5;
                    case 5:
                        if (data.DesignationId != 0 && data.DesignationId != undefined) {
                            designationCondition = " Desg_id= " + data.DesignationId;
                            DailyAttPresentReportDataQuery.whereRaw(designationCondition);
                        }
                        return [4 /*yield*/, DailyAttPresentReportDataQuery];
                    case 6:
                        DailyAttPresentReportDataQueryResult =
                            _a.sent();
                        result = [];
                        if (DailyAttPresentReportDataQueryResult) {
                            DailyAttPresentReportDataQueryResult.forEach(function (row) {
                                var data = {
                                    name: row.name,
                                    shiftType: row.shiftType,
                                    AttendanceStatus: row.AttendanceStatus,
                                    TimeIn: row.TimeIn,
                                    TimeOut: row.TimeOut,
                                    Status: row.status,
                                    MultiTimeStatus: row.multitime_sts,
                                    checkInLoc: row.checkInLoc,
                                    CheckOutLoc: row.CheckOutLoc,
                                    latit_in: row.latit_in,
                                    longi_in: row.longi_in,
                                    latit_out: row.latit_out,
                                    longi_out: row.longi_out,
                                    Id: row.Id,
                                    TotalLoggedHours: row.TotalLoggedHours,
                                    totalCount: totalCount,
                                    EntryImage: row.EntryImage,
                                    ExitImage: row.ExitImage
                                };
                                result.push(data);
                            });
                        }
                        else {
                            result.push();
                        }
                        data["present"] = result;
                        return [2 /*return*/, data["present"]];
                    case 7:
                        if (!(data.dataFor == "absent")) return [3 /*break*/, 18];
                        if (!(adminStatus == 2)) return [3 /*break*/, 9];
                        return [4 /*yield*/, Helper_1["default"].getDepartmentIdByEmpID(data.EmployeeId)];
                    case 8:
                        departmentId = _a.sent();
                        departmentCondition = "Dept_id = " + departmentId;
                        _a.label = 9;
                    case 9:
                        if (!(data.date != undefined)) return [3 /*break*/, 12];
                        AttDate = data.date;
                        AttendanceDate = AttDate.toFormat("yyyy-MM-dd"); //for other day's absentees
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .where("AttendanceDate", AttendanceDate)
                                .where("OrganizationId", data.OrganizationId)
                                .whereIn("AttendanceStatus", [2, 7])
                                .whereIn("EmployeeId", Database_1["default"].rawQuery("(SELECT Id from EmployeeMaster where OrganizationId =" + data.OrganizationId + " AND Is_Delete = 0 )"))
                                .count("Id as abscount")];
                    case 10:
                        absCountQuery = _a.sent();
                        if (absCountQuery.length > 0) {
                            absCount = absCountQuery[0].abscount;
                        }
                        orgId = data.OrganizationId;
                        absentCountQuery = Database_1["default"].from("AttendanceMaster as A")
                            .select(Database_1["default"].raw("DATE_FORMAT(A.AttendanceDate,'%Y-%m-%d') as AttendanceDate"), "A.Dept_id", "A.Desg_id", "A.AttendanceStatus", Database_1["default"].raw("(select CONCAT(FirstName,' ',LastName) FROM EmployeeMaster where Id = EmployeeId) as name"), Database_1["default"].raw(" '-' as TimeOut"), Database_1["default"].raw(" '-' as TimeIn"), Database_1["default"].raw("(select ApprovalStatus from AppliedLeave where EmployeeId = A.EmployeeId and ApprovalStatus = 2 and Date = " + AttendanceDate + ") as LeaveStatus"))
                            .innerJoin("EmployeeMaster as E", "E.Id", "A.EmployeeId")
                            .where("AttendanceDate", AttendanceDate)
                            .whereIn("AttendanceStatus", [2, 7])
                            .where("A.OrganizationId", orgId)
                            .whereIn("EmployeeId", Database_1["default"].raw("SELECT Id FROM EmployeeMaster WHERE OrganizationId= " + orgId + " AND Is_Delete = 0"))
                            .orderBy("name", "asc");
                        if (departmentCondition != undefined) {
                            absentCountQuery = absentCountQuery.whereRaw(departmentCondition);
                        }
                        if (data.DesignationId != 0 && data.DesignationId != undefined) {
                            designationCondition = " Desg_id= " + data.DesignationId; // From AttendanceMaster
                            absentCountQuery = absentCountQuery.whereRaw(designationCondition);
                        }
                        return [4 /*yield*/, absentCountQuery];
                    case 11:
                        absentCountQueryResult = _a.sent();
                        absentListResult = [];
                        if (absentCountQueryResult.length > 0) {
                            absentCountQueryResult.forEach(function (row) {
                                var Name;
                                var name = row.name;
                                if (name.split(" ").length > 3) {
                                    var words = name.split(" ", 4);
                                    var firstthree = words.slice(0, 3);
                                    Name = firstthree.join(" ") + "...";
                                }
                                else {
                                    Name = name;
                                }
                                var absentData = {
                                    name: Name,
                                    TimeIn: row.TimeIn,
                                    TimeOut: row.TimeOut,
                                    LeaveStatus: row.LeaveStatus,
                                    absCount: absCount
                                };
                                absentListResult.push(absentData);
                            });
                        }
                        else {
                            absentListResult.push();
                        }
                        data["absent"] = absentListResult;
                        return [2 /*return*/, data["absent"]];
                    case 12:
                        AttendanceDate = moment_1["default"]().format("yyyy-MM-DD");
                        if (!(adminStatus == 2)) return [3 /*break*/, 14];
                        return [4 /*yield*/, Helper_1["default"].getDepartmentIdByEmpID(data.EmployeeId)];
                    case 13:
                        departmentId = _a.sent();
                        departmentCondition = "Dept_id = " + departmentId;
                        _a.label = 14;
                    case 14:
                        AbsCountQuery = Database_1["default"].from("AttendanceMaster as A")
                            .select(Database_1["default"].raw("CONCAT (E.FirstName, ' ' ,E.LastName)  as name"), Database_1["default"].raw(" '-' as Timeout "), Database_1["default"].raw(" '-' as TimeOut "))
                            .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
                            .where("AttendanceDate", AttendanceDate)
                            .where("A.OrganizationId", data.OrganizationId)
                            .whereIn("AttendanceStatus", [2, 7])
                            .orderBy("name", "asc");
                        if (data.DesignationId != 0 && data.DesignationId != undefined) {
                            designationCondition = " Desg_id= " + data.DesignationId; // From AttendanceMaster
                            AbsCountQuery = AbsCountQuery.whereRaw(designationCondition);
                        }
                        if (departmentCondition != undefined) {
                            AbsCountQuery = AbsCountQuery.whereRaw(departmentCondition);
                        }
                        return [4 /*yield*/, AbsCountQuery];
                    case 15:
                        AbsCountQueryResult = _a.sent();
                        AbsentCountQuery = Database_1["default"].from("EmployeeMaster as E")
                            .select(Database_1["default"].raw("DATE_FORMAT(A.AttendanceDate,'%Y-%m-%d') as AttendanceDate"), Database_1["default"].raw("CONCAT(E.FirstName, ' ', E.LastName) as name"), Database_1["default"].raw(" '-' as TimeIn "), Database_1["default"].raw(" '-' as TimeOut "), Database_1["default"].raw("(select ApprovalStatus FROM AppliedLeave WHERE EmployeeId=E.Id AND ApprovalStatus=2 AND Date=" + AttendanceDate + ") as LeaveStatus"), "A.AttendanceStatus")
                            .innerJoin("AttendanceMaster as A", "A.EmployeeId", "E.Id")
                            .innerJoin("ShiftMaster as S", "A.ShiftId", "S.Id")
                            .where("AttendanceDate", AttendanceDate)
                            .whereNotIn("E.Id", Database_1["default"].from("AttendanceMaster as A")
                            .select("A.EmployeeId")
                            .where("A.AttendanceDate", AttendanceDate)
                            .where("A.OrganizationId", data.OrganizationId)
                            .whereIn("A.AttendanceStatus", [1, 8, 4, 7])
                            .whereNotIn("A.Wo_H_Hd", [11, 12]))
                            .andWhere("E.OrganizationId", data.OrganizationId)
                            .andWhere(function (builder) {
                            builder
                                .where("E.Id", Database_1["default"].raw("(select empid from ShiftPlanner WHERE ShiftPlanner.orgid=" + data.OrganizationId + " and ShiftPlanner.empid=E.Id)"))
                                .orWhere("E.Id", Database_1["default"].raw("E.Shift"));
                        })
                            .groupBy("E.Id")
                            .orderBy("name", "asc")
                            .limit(25);
                        if (data.DesignationId != 0 && data.DesignationId != undefined) {
                            designationCondition = "Designation= " + data.DesignationId; // From AttendanceMaster
                            AbsentCountQuery = AbsentCountQuery.whereRaw(designationCondition);
                        }
                        if (departmentCondition != undefined) {
                            AbsentCountQuery = AbsentCountQuery.whereRaw(departmentCondition);
                        }
                        return [4 /*yield*/, AbsentCountQuery];
                    case 16:
                        AbsentCountQueryResult = _a.sent();
                        otherDayAbsentData = [];
                        if (AbsentCountQueryResult.length > 0) {
                            AbsentCountQueryResult.forEach(function (row) {
                                var Name;
                                var name = AbsentCountQueryResult[0].name;
                                if (name.split(" ").length > 3) {
                                    var words = name.split(" ", 4);
                                    var firstthree = words.slice(0, 3);
                                    Name = firstthree.join(" ") + "...";
                                }
                                else {
                                    Name = name;
                                }
                                var otherDayAbsentList = {
                                    name: Name,
                                    TimeIn: row.TimeIn,
                                    TimeOut: row.TimeOut,
                                    LeaveStatus: row.LeaveStatus
                                };
                                otherDayAbsentData.push(otherDayAbsentList);
                            });
                        }
                        else {
                            otherDayAbsentData.push();
                        }
                        data["absent"] = AbsCountQueryResult.concat(AbsentCountQueryResult);
                        return [2 /*return*/, data["absent"]];
                    case 17: return [3 /*break*/, 28];
                    case 18:
                        if (!(data.dataFor == "latecomings")) return [3 /*break*/, 22];
                        if (!(adminStatus == 2)) return [3 /*break*/, 20];
                        return [4 /*yield*/, Helper_1["default"].getDepartmentIdByEmpID(data.EmployeeId)];
                    case 19:
                        DepartmentId = _a.sent();
                        DepartmentCondition = "Dept_id=" + DepartmentId;
                        _a.label = 20;
                    case 20:
                        if (data.date != undefined && data.date != " ") {
                            AttDate = data.date;
                            AttendanceDate = AttDate.toFormat("yyyy-MM-dd");
                        }
                        else {
                            currDate = moment_1["default"]().format("YYYY-MM-DD");
                            AttendanceDate = currDate;
                        }
                        LateComingsQuery = Database_1["default"].from("EmployeeMaster as E")
                            .select(Database_1["default"].raw("CONCAT(FirstName,' ',LastName) as name"), Database_1["default"].raw("SUBSTR(TimeIn,1,5) as 'TimeIn'"), Database_1["default"].raw("SUBSTR(TimeOut, 1, 5) as 'TimeOut'"), Database_1["default"].raw("'Present' as status"), Database_1["default"].raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) as EntryImage"), Database_1["default"].raw("SUBSTRING_INDEX(ExitImage, '.com/', -1) as ExitImage"), Database_1["default"].raw("SUBSTR(checkInLoc, 1, 40) as checkInLoc"), Database_1["default"].raw("SUBSTR(CheckOutLoc, 1, 40) as CheckOutLoc"), "latit_in", "longi_in", "latit_out", "longi_out", "A.Id", "multitime_sts", "ShiftId", "TotalLoggedHours")
                            .where("E.Id", data.EmployeeId)
                            .innerJoin("AttendanceMaster as A", "A.EmployeeId", "E.Id")
                            .whereRaw("SUBSTRING(time(TimeIn), 1, 5) > SUBSTRING((SELECT (CASE WHEN time(TimeInGrace) != '00:00:00' THEN time(TimeInGrace) ELSE time(TimeIn) END) FROM ShiftMaster WHERE ShiftMaster.Id = \"A.ShiftId\"), 1, 5)AND AttendanceDate=" + AttendanceDate + " AND A.OrganizationId=" + data.OrganizationId + " AND AttendanceStatus IN (1,4,8) ");
                        if (data.DesignationId != 0 && data.DesignationId != undefined) {
                            designationCondition = " Desg_id= " + data.DesignationId; // From AttendanceMaster
                            LateComingsQuery = LateComingsQuery.whereRaw(designationCondition);
                        }
                        if (DepartmentCondition != undefined) {
                            LateComingsQuery = LateComingsQuery.whereRaw(DepartmentCondition);
                        }
                        return [4 /*yield*/, LateComingsQuery];
                    case 21:
                        LateComingsQueryResult = _a.sent();
                        LateComingsData = [];
                        if (LateComingsQueryResult.length > 0) {
                            LateComingsQueryResult.forEach(function (row) { return __awaiter(_this, void 0, void 0, function () {
                                var lateComingsList, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = {
                                                name: row.name,
                                                TimeIn: row.TimeIn,
                                                TimeOut: row.TimeOut,
                                                status: row.status,
                                                EntryImage: row.EntryImage,
                                                ExitImage: row.ExitImage,
                                                checkInLoc: row.checkInLoc,
                                                checkOutLoc: row.CheckOutLoc,
                                                latit_in: row.latit_in,
                                                latit_out: row.latit_out,
                                                Id: row.Id,
                                                multitime_sts: row.multitime_sts
                                            };
                                            return [4 /*yield*/, Helper_1["default"].getShiftType(row.ShiftId)];
                                        case 1:
                                            _a.shiftType = _b.sent();
                                            return [4 /*yield*/, Helper_1["default"].getInterimAttAvailableSt(row.Id)];
                                        case 2:
                                            lateComingsList = (_a.getInterimAttAvailableSts = _b.sent(),
                                                _a.TotalLoggedHours = row.TotalLoggedHours,
                                                _a);
                                            LateComingsData.push(lateComingsList);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        else {
                            LateComingsData.push();
                        }
                        data["latecomings"] = LateComingsData;
                        return [2 /*return*/, data["latecomings"]];
                    case 22:
                        if (!(data.dataFor == "earlyleavings")) return [3 /*break*/, 28];
                        if (!(adminStatus == 2)) return [3 /*break*/, 24];
                        return [4 /*yield*/, Helper_1["default"].getDepartmentIdByEmpID(data.EmployeeId)];
                    case 23:
                        DepartmentId = _a.sent();
                        departmentCondition = "Dept_id=" + DepartmentId;
                        _a.label = 24;
                    case 24:
                        if (data.date != undefined && data.date != " ") {
                            AttDate = data.date;
                            AttendanceDate = AttDate.toFormat("yyyy-MM-dd");
                        }
                        else {
                            currDate = moment_1["default"]().format("YYYY-MM-DD");
                            AttendanceDate = currDate;
                        }
                        earlyLeavingsQuery = Database_1["default"].from("AttendanceMaster as A")
                            .select(Database_1["default"].raw("CONCAT(E.FirstName,' ',E.LastName) as name"), Database_1["default"].raw("SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage"), Database_1["default"].raw("SUBSTRING_INDEX(A.ExitImage, '.com/', -1) as ExitImage"), Database_1["default"].raw("SUBSTR(A.checkInLoc, 1, 40) as checkInLoc"), Database_1["default"].raw(" SUBSTR(A.CheckOutLoc, 1, 40) as CheckOutLoc"), "A.TimeIn as TimeIn", "A.TimeOut as TimeOut", "A.Desg_id", "A.ShiftId", "A.latit_in", "A.longi_in", "A.latit_out", "A.longi_out", "A.Id", "A.multitime_sts", "A.TotalLoggedHours", "S.TimeIn as ShiftTimeIn", "S.TimeOut as ShiftTimeOut")
                            .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
                            .innerJoin("ShiftMaster as S ", "A.ShiftId", "S.Id")
                            .where("A.OrganizationId", data.OrganizationId)
                            .where("A.Is_Delete", 0)
                            .whereRaw("CASE WHEN (S.shifttype=2 AND A.timeindate= A.timeoutdate) \n            THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut) \n            WHEN(S.shifttype=2 AND A.timeindate!=A.timeoutdate) \n            THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut)\n            ELSE CONCAT(A.AttendanceDate,' ',S.TimeOut)END >  CASE \n            WHEN (A.timeoutdate!='0000-00-00') \n            THEN CONCAT(A.timeoutdate,' ',A.TimeOut)  \n            WHEN(S.shifttype=2 AND A.timeindate!=A.timeoutdate)\n            THEN  CONCAT(A.timeoutdate,' ',A.TimeOut) \n            ELSE CONCAT(A.AttendanceDate,' ',A.TimeOut) END  And A.TimeIn!='00:00:00' And A.TimeOut!='00:00:00' and A.AttendanceStatus NOT IN(2,3,5) And \n            (CASE WHEN (A.timeoutdate!='0000-00-00')  \n            THEN (\n            CASE WHEN (S.shifttype=2 AND A.timeindate=A.timeoutdate) \n            THEN TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeOut))       \n            ELSE TIMEDIFF((  \n            CASE WHEN (S.shifttype=2 AND A.timeindate!=A.timeoutdate) \n            THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut) \n            ELSE  CONCAT(A.AttendanceDate,' ',S.TimeOut) END ) ,CONCAT(A.timeoutdate,' ',A.TimeOut)) END)\n            ELSE SUBTIME(S.TimeOut, A.TimeIn) END) > '00:00:59'\n            And A.TimeIn!='00:00:00' \n            And A.TimeOut!='00:00:00' \n            OR A.AttendanceDate=" + AttendanceDate + " \n            And S.shifttype!=3 ORDER BY E.FirstName ASC")
                            .limit(limit)
                            .offset(offset);
                        if (data.DesignationId != 0 && data.DesignationId != undefined) {
                            designationCondition = "Desg_id= " + data.DesignationId; // From AttendanceMaster
                            earlyLeavingsQuery.whereRaw(designationCondition);
                        }
                        if (departmentCondition != undefined) {
                            earlyLeavingsQuery.whereRaw(departmentCondition);
                        }
                        return [4 /*yield*/, earlyLeavingsQuery];
                    case 25:
                        earlyLeavingsQueryResult = _a.sent();
                        earlyleavings = [];
                        if (!(earlyLeavingsQueryResult.length > 0)) return [3 /*break*/, 27];
                        return [4 /*yield*/, Promise.all(earlyLeavingsQueryResult.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
                                var shiftTimeIn, shiftTimeOut, shift, TimeIn, TimeOut, shiftType, getInterimAttAvailableSts, earlyleavingsList;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            shiftTimeIn = row.ShiftTimeIn.slice(0, 5);
                                            shiftTimeOut = row.ShiftTimeOut.slice(0, 5);
                                            shift = shiftTimeIn + "-" + shiftTimeOut;
                                            TimeIn = row.TimeIn.slice(0, 5);
                                            TimeOut = row.TimeOut.slice(0, 5);
                                            return [4 /*yield*/, Helper_1["default"].getShiftType(row.ShiftId)];
                                        case 1:
                                            shiftType = _a.sent();
                                            return [4 /*yield*/, Helper_1["default"].getInterimAttAvailableSt(row.Id)];
                                        case 2:
                                            getInterimAttAvailableSts = _a.sent();
                                            earlyleavingsList = {
                                                shift: shift,
                                                name: row.name,
                                                TimeIn: TimeIn,
                                                TimeOut: TimeOut,
                                                EntryImage: row.EntryImage,
                                                ExitImage: row.ExitImage,
                                                CheckOutLoc: row.CheckOutLoc,
                                                checkInLoc: row.checkInLoc,
                                                latit_in: row.latit_in,
                                                longi_in: row.longi_in,
                                                latit_out: row.latit_out,
                                                longi_out: row.longi_out,
                                                status: row.status,
                                                Id: row.status,
                                                multitime_sts: row.multitime_sts,
                                                shiftType: shiftType,
                                                getInterimAttAvailableSts: getInterimAttAvailableSts,
                                                TotalLoggedHours: row.TotalLoggedHours
                                            };
                                            earlyleavings.push(earlyleavingsList);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 26:
                        _a.sent();
                        _a.label = 27;
                    case 27:
                        data["earlyleavings"] = earlyleavings;
                        return [2 /*return*/, data["earlyleavings"]];
                    case 28: return [2 /*return*/];
                }
            });
        });
    };
    DailyAttendanceService.saveTimeInOut = function (allDataOfTimeInOut) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonData, interimAttendanceId, statusArray, k, OwnerId, areaId, HourlyRateId, Desg_id, Dept_id, i, date, j, _a, _b, Id, _c, UserId, _d, ShiftId, _e, AttendanceMasterId, _f, Action, _g, AttendanceDate, _h, OrganizationId, _j, LatitudeIn, _k, LongitudeIn, _l, LatitudeOut, _m, LongitudeOut, _o, TimeInTime, _p, TimeOutTime, _q, IsTimeInSynced, _r, IsTimeOutSynced, _s, FakeTimeInStatus, _t, FakeTimeOutStatus, _u, FakeLocationInStatus, _v, FakeLocationOutStatus, _w, GeofenceIn, _x, GeofenceOut, _y, TimeInDevice, _z, TimeOutDevice, _0, TimeInCity, _1, TimeOutCity, _2, TimeInAppVersion, _3, TimeOutAppVersion, _4, TimeOutPictureBase64, _5, TimeInPictureBase64, _6, TimeInApp, _7, TimeOutApp, _8, TimeInAddress, _9, TimeOutAddress, _10, TimeInDeviceName, _11, TimeOutDeviceName, _12, Platform, _13, SyncTimeIn, _14, SyncTimeOut, _15, TimeInDeviceId, _16, TimeOutDeviceId, _17, TimeInDate, _18, TimeOutDate, _19, TimeInStampApp, _20, TimeOutStampApp, _21, TimeInRemark, _22, TimeOutRemark, _23, orgTopic, _24, ThumnailTimeOutPictureBase64, _25, ThumnailTimeInPictureBase64, _26, GeofenceInAreaId, _27, GeofenceOutAreaId, zone, defaultZone, shiftType, attDatePastOneDay, currentDate, getSettingOfPunchAttendace, allowOverTime, allowOverTime_1, Addon_AutoTimeOut, getlastAttendanceData, geofencePerm, SuspiciousSelfiePerm, SuspiciousDevicePerm, time, stamp, today, currDate, name, TimeInStampServer, TimeOutStampServer, updateQuery, result, attendance_sts, query, MultipletimeStatus, attendanceData, attTimeIn, attTimeOut, EmployeeRecord, EntryImage, pageName, message, headers, subject, query_1, deviceverificationpermQuery, InsertAttendanceTimeiN, queryResult, InsertAttendanceInInterimTimeiN, error_1, errorMsg, status, ExitImage, areaIdOut, calculatedOvertime, totalLoggedHours, hoursPerDay, timeOutAlreadySyncedId, getAttnadaceRecord, maxIdOfInterimAttendance, alreadyMarkedTimeOutId, updateQuery_1, calculateLoggedHours, totalLoggedHours_1, hoursPerDay_1, _28, hours, minutes, seconds, calculatedOvertime_1, disappstatus, disattreason, cond1, updateResult, result_1;
            return __generator(this, function (_29) {
                switch (_29.label) {
                    case 0:
                        jsonData = JSON.parse(allDataOfTimeInOut.data);
                        interimAttendanceId = 0;
                        statusArray = [];
                        k = 0;
                        OwnerId = 0;
                        areaId = 0;
                        HourlyRateId = 0;
                        Desg_id = 0;
                        Dept_id = 0;
                        i = 0;
                        _29.label = 1;
                    case 1:
                        if (!(i < jsonData.length)) return [3 /*break*/, 48];
                        date = Object.keys(jsonData[i]);
                        if (!Array.isArray(jsonData[i][date[0]].interim)) return [3 /*break*/, 46];
                        j = 0;
                        _29.label = 2;
                    case 2:
                        if (!(j < jsonData[i][date[0]].interim.length)) return [3 /*break*/, 45];
                        _a = jsonData[i][date[0]].interim[j], _b = _a.Id, Id = _b === void 0 ? 0 : _b, _c = _a.UserId, UserId = _c === void 0 ? 0 : _c, _d = _a.ShiftId, ShiftId = _d === void 0 ? "" : _d, _e = _a.AttendanceMasterId, AttendanceMasterId = _e === void 0 ? 0 : _e, _f = _a.Action, Action = _f === void 0 ? "" : _f, _g = _a.AttendanceDate, AttendanceDate = _g === void 0 ? "" : _g, _h = _a.OrganizationId, OrganizationId = _h === void 0 ? 0 : _h, _j = _a.LatitudeIn, LatitudeIn = _j === void 0 ? 0 : _j, _k = _a.LongitudeIn, LongitudeIn = _k === void 0 ? 0 : _k, _l = _a.LatitudeOut, LatitudeOut = _l === void 0 ? 0 : _l, _m = _a.LongitudeOut, LongitudeOut = _m === void 0 ? 0 : _m, _o = _a.TimeInTime, TimeInTime = _o === void 0 ? "" : _o, _p = _a.TimeOutTime, TimeOutTime = _p === void 0 ? "" : _p, _q = _a.IsTimeInSynced, IsTimeInSynced = _q === void 0 ? 0 : _q, _r = _a.IsTimeOutSynced, IsTimeOutSynced = _r === void 0 ? 0 : _r, _s = _a.FakeTimeInStatus, FakeTimeInStatus = _s === void 0 ? 0 : _s, _t = _a.FakeTimeOutStatus, FakeTimeOutStatus = _t === void 0 ? 0 : _t, _u = _a.FakeLocationInStatus, FakeLocationInStatus = _u === void 0 ? 0 : _u, _v = _a.FakeLocationOutStatus, FakeLocationOutStatus = _v === void 0 ? 0 : _v, _w = _a.GeofenceIn, GeofenceIn = _w === void 0 ? "" : _w, _x = _a.GeofenceOut, GeofenceOut = _x === void 0 ? "" : _x, _y = _a.TimeInDevice, TimeInDevice = _y === void 0 ? "" : _y, _z = _a.TimeOutDevice, TimeOutDevice = _z === void 0 ? "" : _z, _0 = _a.TimeInCity, TimeInCity = _0 === void 0 ? "" : _0, _1 = _a.TimeOutCity, TimeOutCity = _1 === void 0 ? "" : _1, _2 = _a.TimeInAppVersion, TimeInAppVersion = _2 === void 0 ? "" : _2, _3 = _a.TimeOutAppVersion, TimeOutAppVersion = _3 === void 0 ? "" : _3, _4 = _a.TimeOutPictureBase64, TimeOutPictureBase64 = _4 === void 0 ? "" : _4, _5 = _a.TimeInPictureBase64, TimeInPictureBase64 = _5 === void 0 ? "" : _5, _6 = _a.TimeInApp, TimeInApp = _6 === void 0 ? "" : _6, _7 = _a.TimeOutApp, TimeOutApp = _7 === void 0 ? "" : _7, _8 = _a.TimeInAddress, TimeInAddress = _8 === void 0 ? "" : _8, _9 = _a.TimeOutAddress, TimeOutAddress = _9 === void 0 ? "" : _9, _10 = _a.TimeInDeviceName, TimeInDeviceName = _10 === void 0 ? "" : _10, _11 = _a.TimeOutDeviceName, TimeOutDeviceName = _11 === void 0 ? "" : _11, _12 = _a.Platform, Platform = _12 === void 0 ? "" : _12, _13 = _a.SyncTimeIn, SyncTimeIn = _13 === void 0 ? "1" : _13, _14 = _a.SyncTimeOut, SyncTimeOut = _14 === void 0 ? "0" : _14, _15 = _a.TimeInDeviceId, TimeInDeviceId = _15 === void 0 ? "" : _15, _16 = _a.TimeOutDeviceId, TimeOutDeviceId = _16 === void 0 ? "" : _16, _17 = _a.TimeInDate, TimeInDate = _17 === void 0 ? "" : _17, _18 = _a.TimeOutDate, TimeOutDate = _18 === void 0 ? "" : _18, _19 = _a.TimeInStampApp, TimeInStampApp = _19 === void 0 ? "" : _19, _20 = _a.TimeOutStampApp, TimeOutStampApp = _20 === void 0 ? "" : _20, _21 = _a.TimeInRemark, TimeInRemark = _21 === void 0 ? "" : _21, _22 = _a.TimeOutRemark, TimeOutRemark = _22 === void 0 ? "" : _22, _23 = _a.orgTopic, orgTopic = _23 === void 0 ? "" : _23, _24 = _a.ThumnailTimeOutPictureBase64, ThumnailTimeOutPictureBase64 = _24 === void 0 ? "" : _24, _25 = _a.ThumnailTimeInPictureBase64, ThumnailTimeInPictureBase64 = _25 === void 0 ? "" : _25, _26 = _a.GeofenceInAreaId, GeofenceInAreaId = _26 === void 0 ? "" : _26, _27 = _a.GeofenceOutAreaId, GeofenceOutAreaId = _27 === void 0 ? "" : _27;
                        console.log(jsonData[i][date[0]].interim[j]);
                        console.log("all data of");
                        return [4 /*yield*/, Helper_1["default"].getEmpTimeZone(UserId, OrganizationId)];
                    case 3:
                        zone = _29.sent();
                        defaultZone = luxon_1.DateTime.now().setZone(zone);
                        return [4 /*yield*/, Helper_1["default"].getShiftType(ShiftId)];
                    case 4:
                        shiftType = _29.sent();
                        attDatePastOneDay = defaultZone
                            .minus({ days: 1 })
                            .toFormat("yyyy-MM-dd");
                        currentDate = defaultZone.toFormat("yyyy-MM-dd");
                        // console.log(defaultZone.minus({ days: 1 }).toFormat('yyyy-MM-dd, HH:mm:ss'));
                        // console.log(defaultZone.toFormat('yyyy-MM-dd, HH:mm:ss'));
                        console.log(shiftType);
                        console.log("shifttype");
                        if (!(shiftType == "1")) return [3 /*break*/, 6];
                        if (!(ShiftId == "0" || ShiftId == "" || ShiftId == "")) return [3 /*break*/, 6];
                        return [4 /*yield*/, Helper_1["default"].getassignedShiftTimes(UserId, AttendanceDate)];
                    case 5:
                        ShiftId = _29.sent();
                        _29.label = 6;
                    case 6: return [4 /*yield*/, Database_1["default"].from("licence_ubiattendance")
                            .select("allowOverTime", "Addon_AutoTimeOut")
                            .where("OrganizationId", OrganizationId)];
                    case 7:
                        getSettingOfPunchAttendace = _29.sent();
                        allowOverTime = void 0;
                        if (getSettingOfPunchAttendace.length > 0) {
                            allowOverTime_1 = getSettingOfPunchAttendace[0].allowOverTime;
                            Addon_AutoTimeOut = void 0;
                            getSettingOfPunchAttendace[0].Addon_AutoTimeOut;
                            if (allowOverTime_1 == 1) {
                                allowOverTime_1 = true;
                            }
                            else {
                                allowOverTime_1 = false;
                            }
                        }
                        if (!(allowOverTime == true && shiftType != 2)) return [3 /*break*/, 9];
                        return [4 /*yield*/, Database_1["default"].from("licence_ubiattendance")
                                .select("*")
                                .where("EmployeeId", UserId)
                                .andWhere("OrganizationId", OrganizationId)
                                .andWhere("TimeOut", "00:00:00")
                                .andWhereIn("AttendanceStatus", [1, 3, 5, 8])
                                .andWhereBetween("AttendanceDate", [
                                attDatePastOneDay,
                                currentDate,
                            ])
                                .orderBy("AttendanceDate", "desc")
                                .limit(1)];
                    case 8:
                        getlastAttendanceData = _29.sent();
                        if (getSettingOfPunchAttendace.length > 0) {
                            AttendanceDate = getlastAttendanceData[0].AttendanceDate;
                        }
                        _29.label = 9;
                    case 9: return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, "OutsideGeofence")];
                    case 10:
                        geofencePerm = _29.sent();
                        return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, "SuspiciousSelfie")];
                    case 11:
                        SuspiciousSelfiePerm = _29.sent();
                        return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, "SuspiciousDevice")];
                    case 12:
                        SuspiciousDevicePerm = _29.sent();
                        time = defaultZone.toFormat("HH:mm:ss") == "00:00:00"
                            ? "23:59:00"
                            : defaultZone.toFormat("HH:mm:ss");
                        stamp = defaultZone.toFormat("yyyy-MM-dd, HH:mm:ss");
                        today = currentDate;
                        currDate = currentDate;
                        return [4 /*yield*/, Helper_1["default"].getEmpName(UserId)];
                    case 13:
                        name = _29.sent();
                        console.log(name);
                        TimeInStampServer = defaultZone.toFormat("yyyy-MM-dd, HH:mm:ss");
                        TimeOutStampServer = defaultZone.toFormat("yyyy-MM-dd, HH:mm:ss");
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("AppliedLeave")
                                .where("EmployeeId", UserId)
                                .where("HalfDayStatus", "!=", 1)
                                .where("OrganizationId", OrganizationId)
                                .whereIn("ApprovalStatus", [1, 2])
                                .update({
                                ApprovalStatus: 4,
                                Remarks: "Employee was present"
                            })];
                    case 14:
                        updateQuery = _29.sent();
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("AppliedLeave")
                                .where("EmployeeId", UserId)
                                .where("ApprovalStatus", 2)
                                .where("HalfDayStatus", 1)
                                .where("Date", AttendanceDate)
                                .select("*")];
                    case 15:
                        result = _29.sent();
                        attendance_sts = result.length > 0 ? 4 : 1;
                        console.log(attendance_sts);
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .where("EmployeeId", UserId)
                                .where("AttendanceDate", AttendanceDate)
                                .where("disapprove_sts", 1)
                                .count("Id as count")
                                .first()];
                    case 16:
                        query = _29.sent();
                        if (query.count > 0) {
                            attendance_sts = 2;
                        }
                        return [4 /*yield*/, Helper_1["default"].getShiftMultipleTimeStatus(UserId, AttendanceDate, ShiftId)];
                    case 17:
                        MultipletimeStatus = _29.sent();
                        console.log(UserId + "=>" + AttendanceDate + "=>" + ShiftId);
                        console.log(MultipletimeStatus);
                        console.log("MultipletimeStatus");
                        return [4 /*yield*/, AttendanceMaster_1["default"].query()
                                .where("EmployeeId", UserId)
                                .where("AttendanceDate", AttendanceDate)
                                .select("Id", "TimeIn", "TimeOut")
                                .first()];
                    case 18:
                        attendanceData = _29.sent();
                        attTimeIn = "00:00:00";
                        attTimeOut = "00:00:00";
                        if (attendanceData) {
                            AttendanceMasterId = attendanceData.Id;
                            //AttendanceMasterId = 0;
                            attTimeIn = attendanceData.TimeIn;
                            attTimeOut = attendanceData.TimeOut;
                            console.log(AttendanceMasterId + "=>" + attTimeIn + "=>" + attTimeOut);
                        }
                        return [4 /*yield*/, EmployeeMaster_1["default"].query()
                                .where("Id", UserId)
                                .select("Shift", "Department", "Designation", "area_assigned", "hourly_rate", "OwnerId")
                                .first()];
                    case 19:
                        EmployeeRecord = _29.sent();
                        if (EmployeeRecord) {
                            Dept_id = EmployeeRecord.Department;
                            Desg_id = EmployeeRecord.Designation;
                            areaId = EmployeeRecord.area_assigned;
                            HourlyRateId = EmployeeRecord.hourly_rate;
                            OwnerId = EmployeeRecord.OwnerId;
                        }
                        console.log("shakir" + AttendanceMasterId);
                        if (!(SyncTimeIn == "1" && SyncTimeOut != "1")) return [3 /*break*/, 32];
                        console.log("case one for sync Attendance Only Time In");
                        EntryImage = ThumnailTimeInPictureBase64;
                        if (TimeInPictureBase64 == "") {
                            EntryImage = "https://ubitech.ubihrm.com/public/avatars/male.png";
                        }
                        _29.label = 20;
                    case 20:
                        _29.trys.push([20, 30, , 31]);
                        areaId = GeofenceInAreaId;
                        if (!(GeofenceIn === "Outside Geofence")) return [3 /*break*/, 22];
                        if ([9, 13, 11, 15].includes(geofencePerm)) {
                            pageName = "Outside Geofence";
                        }
                        if (!(geofencePerm === 13)) return [3 /*break*/, 22];
                        message = "<html>\n                                    <head>   \n                                    <meta http-equiv=Content-Type content=\"text/html; charset=windows-1252\">\n                                    <meta name=Generator content=\"Microsoft Word 12 (filtered)\">\n                                    <style>\n                                    </style>   \n                                    </head>   \n                                    <body lang=EN-US link=blue vlink=purple>    \n                                    <hr>\n                                    <br>" + name + " has punched TimeIn outside Geofence</br>\n                                    </hr>   \n                                    </body>  \n                                    </html>";
                        headers = {};
                        subject = "Outside Geofence(" + today + ")";
                        return [4 /*yield*/, Database_1["default"].raw("SELECT email FROM admin_login WHERE OrganizationId = ? AND status = 1", [OrganizationId])];
                    case 21:
                        query_1 = _29.sent();
                        _29.label = 22;
                    case 22: return [4 /*yield*/, Database_1["default"].raw("SELECT Addon_DeviceVerification FROM licence_ubiattendance WHERE OrganizationId = ?", [OrganizationId])];
                    case 23:
                        deviceverificationpermQuery = _29.sent();
                        //const deviceverificationperm = deviceverificationpermQuery.rows[0].Addon_DeviceVerification;
                        // if (deviceverificationperm === 1) {
                        //   const deviceQuery = await Database.raw(
                        //     "SELECT DeviceId FROM EmployeeMaster WHERE Id = ?",
                        //     [UserId]
                        //   );
                        //const verifieddevice = deviceQuery.rows[0].DeviceId;
                        // if (verifieddevice !== TimeInDeviceId) {
                        //   const suspiciousdevice = 1;
                        //   if ([9, 13, 11, 15].includes(SuspiciousDevicePerm)) {
                        //     const pageName = "Suspicious Device";
                        //     sendManualPushNotification(
                        //       `('${orgTopic}' in topics) && ('admin' in topics)`,
                        //       "Suspicious Device",
                        //       `${name}'s Attendance Device does not match`,
                        //       UserId,
                        //       OrganizationId,
                        //       pageName
                        //     );
                        //   }
                        //   if ([5, 13, 7, 15].includes(SuspiciousDevicePerm)) {
                        //     const query = await Database.raw(
                        //       "SELECT email FROM admin_login WHERE OrganizationId = ? AND status = 1",
                        //       [OrganizationId]
                        //     );
                        //     const emails = query.rows.map((row) => row.email);
                        //     const message = `<html>
                        //       <head>
                        //       <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
                        //       <meta name=Generator content="Microsoft Word 12 (filtered)">
                        //       <style>
                        //       </style>
                        //       </head>
                        //       <body lang=EN-US link=blue vlink=purple>
                        //       <hr>
                        //       <br>${name}'s Attendance Device is different from their registered Device ID</br>
                        //       </hr>
                        //       </body>
                        //       </html>`;
                        //     const headers = {};
                        //     const subject = `Suspicious Device(${today})`;
                        //     // Send emails
                        //     for (const email of emails) {
                        //       await sendEmail_new(email, subject, message, headers);
                        //     }
                        //   }
                        // }
                        //}
                        console.log("attendanceMasterId=>" + AttendanceMasterId);
                        if (!(AttendanceMasterId == 0)) return [3 /*break*/, 25];
                        return [4 /*yield*/, Database_1["default"].table("AttendanceMaster")
                                .returning("id")
                                .insert({
                                TimeInApp: TimeInApp,
                                FakeLocationStatusTimeIn: FakeLocationInStatus,
                                EmployeeId: UserId,
                                AttendanceDate: AttendanceDate,
                                AttendanceStatus: attendance_sts,
                                TimeIn: TimeInTime,
                                ShiftId: ShiftId,
                                Dept_id: Dept_id,
                                Desg_id: Desg_id,
                                areaId: areaId,
                                HourlyRateId: HourlyRateId,
                                OrganizationId: OrganizationId,
                                CreatedDate: today,
                                CreatedById: 0,
                                LastModifiedDate: today,
                                LastModifiedById: 0,
                                OwnerId: OwnerId,
                                Overtime: "00:00:00",
                                EntryImage: EntryImage,
                                checkInLoc: TimeInAddress,
                                device: "mobile",
                                latit_in: LatitudeIn,
                                longi_in: LongitudeIn,
                                timeindate: TimeInDate,
                                Platform: Platform,
                                TimeInDeviceId: TimeInDeviceId,
                                TimeInDeviceName: TimeInDeviceName,
                                timeincity: TimeInCity,
                                TimeInAppVersion: TimeInAppVersion,
                                TimeInGeoFence: GeofenceIn,
                                TimeInDevice: TimeInDevice,
                                multitime_sts: MultipletimeStatus,
                                remark: TimeInRemark,
                                TimeInStampApp: TimeInStampApp,
                                TimeInStampServer: TimeInStampServer,
                                ZoneId: GeofenceInAreaId
                            })];
                    case 24:
                        InsertAttendanceTimeiN = _29.sent();
                        console.log("AttendanceMasterId=>" + InsertAttendanceTimeiN[0]);
                        AttendanceMasterId = InsertAttendanceTimeiN[0];
                        if (OrganizationId === "105999" ||
                            OrganizationId === "10" ||
                            OrganizationId === "168264") {
                            // Send mail logic for specific organizations
                            // const mailQuery = await Database.raw("SELECT Subject, Body FROM All_mailers WHERE id = 30");
                            // const subject = mailQuery.rows[0].Subject;
                            // const mailbody = mailQuery.rows[0].Body;
                            // const empQuery = await Database.raw(
                            //   "SELECT E.CurrentEmailId, CONCAT(E.FirstName, ' ', E.LastName) as Name, o.Name as Orgname FROM EmployeeMaster E, Organization o WHERE E.Id = ? AND E.OrganizationId = o.Id AND o.Id = ?",
                            //   [UserId, OrganizationId]
                            // );
                            // const username = empQuery.rows[0].Name;
                            // const orgname = empQuery.rows[0].Orgname;
                            // const emailIn = decode5t(empQuery.rows[0].CurrentEmailId);
                            // const TimeInTme = moment(TimeInTime, 'HH:mm:ss').format('h:mm:ss A');
                            // // Remaining mail logic...
                            // const headers = {};
                            // const message = mailbody; // Construct your message here
                            // // Send email
                            // await sendEmail_new(emailIn, subject, message, headers);
                        }
                        return [3 /*break*/, 26];
                    case 25:
                        if (AttendanceMasterId != 0 && attTimeIn == "00:00:00") {
                            // Update existing record in AttendanceMaster
                            // await Database.raw(
                            //   "UPDATE AttendanceMaster SET TimeInApp = ?, FakeLocationStatusTimeIn = ?, EmployeeId = ?, ... WHERE Id = ?",
                            //   [TimeInApp, FakeLocationInStatus, UserId, ..., attendanceMasterId]
                            // );
                        }
                        _29.label = 26;
                    case 26:
                        if (!(MultipletimeStatus == 1 || shiftType === "3")) return [3 /*break*/, 29];
                        if (!(AttendanceMasterId != 0)) return [3 /*break*/, 29];
                        return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                .select("Id")
                                .where("AttendanceMasterId", AttendanceMasterId)
                                .andWhere("TimeIn", TimeInTime)];
                    case 27:
                        queryResult = _29.sent();
                        if (queryResult.length > 0) {
                            interimAttendanceId = queryResult[0].Id;
                            console.log("Interim Attendance ID:", interimAttendanceId);
                        }
                        console.log("Interim Attendance IDs:", interimAttendanceId);
                        if (!(interimAttendanceId == 0)) return [3 /*break*/, 29];
                        return [4 /*yield*/, Database_1["default"].table("InterimAttendances")
                                .returning("id")
                                .insert({
                                TimeIn: TimeInTime,
                                TimeInImage: EntryImage,
                                TimeInLocation: TimeInAddress,
                                LatitudeIn: LatitudeIn,
                                LongitudeIn: LongitudeIn,
                                TimeOut: TimeInTime,
                                Device: "mobile",
                                FakeLocationStatusTimeIn: FakeLocationInStatus,
                                Platform: Platform,
                                TimeInCity: TimeInCity,
                                TimeInAppVersion: TimeInAppVersion,
                                TimeInGeofence: GeofenceIn,
                                AttendanceMasterId: AttendanceMasterId,
                                TimeInDeviceId: TimeInDeviceId,
                                TimeInDeviceName: TimeInDeviceName,
                                TimeInRemark: TimeInRemark,
                                TimeInDate: TimeInDate,
                                TimeInStampApp: TimeInStampApp,
                                TimeInStampServer: TimeInStampServer,
                                EmployeeId: UserId,
                                OrganizationId: OrganizationId
                            })];
                    case 28:
                        InsertAttendanceInInterimTimeiN = _29.sent();
                        _29.label = 29;
                    case 29:
                        // Send data on alfanar server
                        if (["90303", "225436"].includes(OrganizationId)) {
                        }
                        // Send data on sanjeevani server
                        if (OrganizationId === "148156") {
                        }
                        statusArray[k] = {
                            Time: TimeInTime,
                            Date: AttendanceDate,
                            Action: "TimeIn",
                            EmpId: UserId,
                            InterimId: Id,
                            InterimAttendanceId: interimAttendanceId,
                            AttendanceMasterId: AttendanceMasterId
                        };
                        k++;
                        return [3 /*break*/, 31];
                    case 30:
                        error_1 = _29.sent();
                        errorMsg = "Message: " + error_1.message;
                        status = 0;
                        return [3 /*break*/, 31];
                    case 31: return [3 /*break*/, 44];
                    case 32:
                        if (!(SyncTimeIn == "1" && SyncTimeOut == "1")) return [3 /*break*/, 33];
                        return [3 /*break*/, 44];
                    case 33:
                        if (!(SyncTimeIn != "1" && SyncTimeOut == "1")) return [3 /*break*/, 44];
                        console.log("case three for sync Attendance Only Time out");
                        ExitImage = ThumnailTimeOutPictureBase64;
                        areaIdOut = GeofenceOutAreaId;
                        if (TimeOutPictureBase64 == "") {
                            ExitImage = "https://ubitech.ubihrm.com/public/avatars/male.png";
                        }
                        calculatedOvertime = "00:00:00";
                        totalLoggedHours = "00:00:00";
                        hoursPerDay = "00:00:00";
                        if (!(MultipletimeStatus == 1 || shiftType == "3")) return [3 /*break*/, 41];
                        timeOutAlreadySyncedId = 0;
                        console.log(AttendanceMasterId);
                        console.log("attendanceMasterId->timeout");
                        if (!(AttendanceMasterId == 0)) return [3 /*break*/, 35];
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .select("Id")
                                .where("EmployeeId", UserId)
                                .whereBetween("AttendanceDate", [
                                Database_1["default"].raw("date_sub('" + AttendanceDate + "', interval 1 day)"),
                                AttendanceDate,
                            ])
                                .orderBy("AttendanceDate", "desc")
                                .limit(1)];
                    case 34:
                        getAttnadaceRecord = _29.sent();
                        console.log("getAttnadaceRecord");
                        if (getAttnadaceRecord.length > 0) {
                            AttendanceMasterId = getAttnadaceRecord[0].Id;
                            console.log("attendanceMasterId Attendance ID:", AttendanceMasterId);
                        }
                        _29.label = 35;
                    case 35: return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                            .select("Id")
                            .where("AttendanceMasterId", AttendanceMasterId)
                            .orderBy("Id", "desc")
                            .first()];
                    case 36:
                        maxIdOfInterimAttendance = _29.sent();
                        console.log(maxIdOfInterimAttendance);
                        if (maxIdOfInterimAttendance) {
                            interimAttendanceId = maxIdOfInterimAttendance.Id;
                            console.log("MAx Id Attendance ID:", interimAttendanceId);
                        }
                        if (!(interimAttendanceId != 0)) return [3 /*break*/, 39];
                        return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                .select("Id")
                                .where("AttendanceMasterId", AttendanceMasterId)
                                .andWhere("TimeOut", TimeOutTime)
                                .orderBy("Id", "desc")
                                .first()];
                    case 37:
                        alreadyMarkedTimeOutId = _29.sent();
                        if (alreadyMarkedTimeOutId) {
                            timeOutAlreadySyncedId = alreadyMarkedTimeOutId.Id;
                        }
                        console.log(TimeOutDate + " " + TimeOutTime);
                        console.log("TimeOutDate+");
                        return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                .where("Id", interimAttendanceId)
                                .update({
                                FakeLocationStatusTimeOut: FakeLocationOutStatus,
                                TimeOutImage: ExitImage,
                                TimeOutLocation: TimeOutAddress,
                                LatitudeOut: LatitudeOut,
                                LongitudeOut: LongitudeOut,
                                TimeOut: TimeOutTime,
                                TimeOutDeviceId: TimeOutDeviceId,
                                TimeOutDeviceName: TimeOutDeviceName,
                                TimeOutCity: TimeOutCity,
                                TimeOutAppVersion: TimeOutAppVersion,
                                TimeOutGeofence: GeofenceOut,
                                LoggedHours: "TIMEDIFF(CONCAT('" + TimeOutDate + "', ' ', '" + TimeOutTime + "'), CONCAT(TimeInDate, ' ', TimeIn))",
                                TimeOutDate: TimeOutDate,
                                TimeOutRemark: TimeOutRemark,
                                TimeOutStampApp: TimeOutStampApp,
                                TimeOutStampServer: TimeOutStampServer
                            })];
                    case 38:
                        updateQuery_1 = _29.sent();
                        _29.label = 39;
                    case 39: return [4 /*yield*/, Database_1["default"].from("InterimAttendances as I")
                            .select("A.Id", "A.ShiftId", Database_1["default"].raw("SEC_TO_TIME(SUM(TIME_TO_SEC(I.LoggedHours))) as totalLoggedHours"), Database_1["default"].raw("\n                                                        (SELECT (CASE \n                                                          WHEN (shifttype=1) THEN TIMEDIFF(TimeOut,TimeIn) \n                                                          WHEN (shifttype=2) THEN TIMEDIFF(CONCAT('2021-10-11', ' ', TimeOut), CONCAT('2021-10-10', ' ', TimeIn)) \n                                                          WHEN (shifttype=3) THEN HoursPerDay \n                                                        END) FROM ShiftMaster WHERE Id=A.ShiftId) as hoursPerDay\n                                                      "))
                            .innerJoin("AttendanceMaster as A", "A.Id", "I.AttendanceMasterId")
                            .where("I.AttendanceMasterId", AttendanceMasterId)
                            .groupBy("A.Id", "A.ShiftId")];
                    case 40:
                        calculateLoggedHours = _29.sent();
                        if (calculateLoggedHours) {
                            totalLoggedHours_1 = calculateLoggedHours[0].totalLoggedHours;
                            hoursPerDay_1 = calculateLoggedHours[0].hoursPerDay;
                            console.log(totalLoggedHours_1);
                            console.log(hoursPerDay_1);
                            _28 = Helper_1["default"].calculateOvertime(hoursPerDay_1, totalLoggedHours_1), hours = _28.hours, minutes = _28.minutes, seconds = _28.seconds;
                            console.log(hours + ":" + minutes + ":" + seconds);
                            calculatedOvertime_1 = hours + ":" + minutes + ":" + seconds;
                            console.log("calculatedOvertime" + calculatedOvertime_1);
                        }
                        _29.label = 41;
                    case 41:
                        statusArray[k] = {
                            Time: TimeOutTime,
                            Date: AttendanceDate,
                            Action: "TimeOut",
                            EmpId: UserId,
                            InterimId: Id,
                            InterimAttendanceId: interimAttendanceId,
                            AttendanceMasterId: AttendanceMasterId
                        };
                        k++;
                        disappstatus = 2;
                        disattreason = "Outside Geofence";
                        console.log(calculatedOvertime);
                        console.log(totalLoggedHours);
                        cond1 = "overtime='" + calculatedOvertime + "', TotalLoggedHours='09:09:09'";
                        return [4 /*yield*/, AttendanceMaster_1["default"].query()
                                .where("id", AttendanceMasterId)
                                .update({
                                FakeLocationStatusTimeOut: FakeLocationOutStatus,
                                ExitImage: ExitImage,
                                CheckOutLoc: TimeOutAddress,
                                latit_out: LatitudeOut,
                                longi_out: LongitudeOut,
                                TimeOut: TimeOutTime,
                                TimeOutDeviceId: TimeOutDeviceId,
                                TimeOutDeviceName: TimeOutDeviceName,
                                timeoutcity: TimeOutCity,
                                LastModifiedDate: stamp,
                                TimeOutApp: TimeOutApp,
                                timeoutdate: TimeOutDate,
                                TimeOutAppVersion: TimeOutAppVersion,
                                TimeOutGeoFence: GeofenceOut,
                                TimeOutDevice: TimeOutDevice,
                                AttendanceStatus: attendance_sts,
                                remarks: TimeOutRemark,
                                TimeOutStampApp: TimeOutStampApp,
                                TimeOutStampServer: TimeOutStampServer,
                                areaIdTimeOut: areaIdOut,
                                disapprove_sts: disappstatus,
                                disapprovereason: disattreason,
                                overtime: calculatedOvertime,
                                TotalLoggedHours: totalLoggedHours
                            })];
                    case 42:
                        updateResult = _29.sent();
                        if (!((shiftType == "1" || shiftType == "2") &&
                            MultipletimeStatus != 1)) return [3 /*break*/, 44];
                        calculatedOvertime = "00:00:00";
                        totalLoggedHours = "00:00:00";
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster as A")
                                .select("A.TimeIn as attTimeIn", "A.TimeOut as attTimeOut", "C.TimeIn as shiftTimeIn", "C.TimeOut as shiftTimeOut", Database_1["default"].raw("TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn)) as TotalLoggedHours"), Database_1["default"].raw("CASE WHEN (C.shifttype = 2) THEN SUBTIME(TIMEDIFF(CONCAT('2021-08-21', ' ', C.TimeOut), CONCAT('2021-08-20', ' ', C.TimeIn)), TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn))) ELSE SUBTIME(TIMEDIFF(A.TimeOut, A.TimeIn), TIMEDIFF(C.TimeOut, C.TimeIn)) END as overtime"))
                                .innerJoin("ShiftMaster as C", "C.Id", "=", "A.ShiftId")
                                .where("A.Id", AttendanceMasterId)
                                .first()];
                    case 43:
                        result_1 = _29.sent();
                        console.log("result->");
                        console.log(result_1);
                        console.log(result_1[0].TotalLoggedHours);
                        if (result_1.length > 0) {
                            totalLoggedHours = result_1[0].TotalLoggedHours;
                            calculatedOvertime = result_1[0].overtime;
                        }
                        _29.label = 44;
                    case 44:
                        j++;
                        return [3 /*break*/, 2];
                    case 45: return [3 /*break*/, 47];
                    case 46:
                        console.log("array not working");
                        _29.label = 47;
                    case 47:
                        i++;
                        return [3 /*break*/, 1];
                    case 48: return [2 /*return*/];
                }
            });
        });
    };
    return DailyAttendanceService;
}());
exports["default"] = DailyAttendanceService;
