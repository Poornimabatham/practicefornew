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
                    case 17: return [3 /*break*/, 31];
                    case 18:
                        if (!(data.dataFor == "latecomings")) return [3 /*break*/, 25];
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
                            .whereRaw("SUBSTRING((TimeIn), 1, 5) > SUBSTRING((SELECT (CASE WHEN (TimeInGrace) != '00:00:00' THEN (TimeInGrace) ELSE (TimeIn) END) FROM ShiftMaster WHERE ShiftMaster.Id = A.ShiftId), 1, 5) AND AttendanceDate=\"" + AttendanceDate + "\" AND A.OrganizationId=" + data.OrganizationId + " AND AttendanceStatus IN (1,4,8) AND '3' NOT IN (Select shifttype from ShiftMaster where Id=ShiftId) order by name ");
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
                        if (!(LateComingsQueryResult.length > 0)) return [3 /*break*/, 23];
                        return [4 /*yield*/, Promise.all(LateComingsQueryResult.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
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
                            }); }))];
                    case 22:
                        _a.sent();
                        return [3 /*break*/, 24];
                    case 23:
                        LateComingsData.push();
                        _a.label = 24;
                    case 24:
                        data["latecomings"] = LateComingsData;
                        return [2 /*return*/, data["latecomings"]];
                    case 25:
                        if (!(data.dataFor == "earlyleavings")) return [3 /*break*/, 31];
                        if (!(adminStatus == 2)) return [3 /*break*/, 27];
                        return [4 /*yield*/, Helper_1["default"].getDepartmentIdByEmpID(data.EmployeeId)];
                    case 26:
                        DepartmentId = _a.sent();
                        departmentCondition = "Dept_id=" + DepartmentId;
                        _a.label = 27;
                    case 27:
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
                            .whereRaw("(CASE WHEN (S.shifttype=2 AND A.timeindate= A.timeoutdate)\n        THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut)\n        WHEN(S.shifttype=2 AND A.timeindate!=A.timeoutdate)\n        THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut)\n        ELSE CONCAT(A.AttendanceDate,' ',S.TimeOut)END)\n         >\n         (CASE\n         WHEN (A.timeoutdate!='0000-00-00')\n         THEN CONCAT(A.timeoutdate,' ',A.TimeOut)  \n         WHEN(S.shifttype=2 AND A.timeindate!=A.timeoutdate)\n         THEN  CONCAT(A.timeoutdate,' ',A.TimeOut)\n         ELSE CONCAT(A.AttendanceDate,' ',A.TimeOut) END) ")
                            .whereRaw(" A.TimeIn!='00:00:00' And A.TimeOut!='00:00:00' and A.AttendanceStatus NOT IN (2,3,5)")
                            .whereRaw(" (CASE WHEN (A.timeoutdate!='0000-00-00')  \n         THEN (\n         CASE WHEN (S.shifttype=2 AND A.timeindate=A.timeoutdate)\n         THEN TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeOut))      \n         ELSE TIMEDIFF((  \n         CASE WHEN (S.shifttype=2 AND A.timeindate!=A.timeoutdate)\n         THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut)\n         ELSE  CONCAT(A.AttendanceDate,' ',S.TimeOut) END ) ,\n         CONCAT(A.timeoutdate,' ',A.TimeOut)) END)\n         ELSE SUBTIME(S.TimeOut, A.TimeIn) END) > '00:00:59'")
                            .whereRaw("A.TimeIn!='00:00:00'")
                            .whereRaw("A.TimeOut!='00:00:00'")
                            .andWhere("A.AttendanceDate", AttendanceDate)
                            .whereRaw("S.shifttype!=3")
                            .orderBy("E.FirstName", "asc")
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
                    case 28:
                        earlyLeavingsQueryResult = _a.sent();
                        earlyleavings = [];
                        if (!(earlyLeavingsQueryResult.length > 0)) return [3 /*break*/, 30];
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
                    case 29:
                        _a.sent();
                        _a.label = 30;
                    case 30:
                        data["earlyleavings"] = earlyleavings;
                        return [2 /*return*/, data["earlyleavings"]];
                    case 31: return [2 /*return*/];
                }
            });
        });
    };
    DailyAttendanceService.saveTimeInOut = function (allDataOfTimeInOut) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonData, interimAttendanceId, statusArray, k, OwnerId, areaId, HourlyRateId, Desg_id, Dept_id, avtarImg, disappstatus, areaId12, outside_geofence_setting, Geofencests, disattreason;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
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
                        avtarImg = "https://ubitech.ubihrm.com/public/avatars/male.png";
                        disappstatus = 0;
                        outside_geofence_setting = "";
                        disattreason = "";
                        // console.log(jsonData.length)
                        // console.log(jsonData[0]['2023-08-26'].interim.length)
                        // console.log('jsonlength')
                        return [4 /*yield*/, Promise.all(jsonData.map(function (row, i) { return __awaiter(_this, void 0, void 0, function () {
                                var date, j, _a, _b, Id, _c, UserId, _d, ShiftId, _e, AttendanceMasterId, _f, Action, _g, AttendanceDate, _h, OrganizationId, _j, LatitudeIn, _k, LongitudeIn, _l, LatitudeOut, _m, LongitudeOut, _o, TimeInTime, _p, TimeOutTime, _q, IsTimeInSynced, _r, IsTimeOutSynced, _s, FakeTimeInStatus, _t, FakeTimeOutStatus, _u, FakeLocationInStatus, _v, FakeLocationOutStatus, _w, GeofenceIn, _x, GeofenceOut, _y, TimeInDevice, _z, TimeOutDevice, _0, TimeInCity, _1, TimeOutCity, _2, TimeInAppVersion, _3, TimeOutAppVersion, _4, TimeOutPictureBase64, _5, TimeInPictureBase64, _6, TimeInApp, _7, TimeOutApp, _8, TimeInAddress, _9, TimeOutAddress, _10, TimeInDeviceName, _11, TimeOutDeviceName, _12, Platform, _13, SyncTimeIn, _14, SyncTimeOut, _15, TimeInDeviceId, _16, TimeOutDeviceId, _17, TimeInDate, _18, TimeOutDate, _19, TimeInStampApp, _20, TimeOutStampApp, _21, TimeInRemark, _22, TimeOutRemark, _23, orgTopic, _24, ThumnailTimeOutPictureBase64, _25, ThumnailTimeInPictureBase64, _26, GeofenceInAreaId, _27, GeofenceOutAreaId, zone, defaultZone, shiftType, attDatePastOneDay, currentDate, getSettingOfPunchAttendace, allowOverTime, allowOverTime_1, getlastAttendanceData, geofencePerm, SuspiciousSelfiePerm, SuspiciousDevicePerm, deviceverificationperm, addonGeoFenceStst, checkRestriction, time, stamp, today, name, TimeInStampServer, TimeOutStampServer, updateQuery, result, attendance_sts, query, MultipletimeStatus, attendanceData, attTimeIn, attTimeOut, EmployeeRecord, interimAttendanceIdss, employeeDeviceId, verifieddevice, suspiciousdevice, EntryImage, areaId1, lat, long, radius, dis, InsertAttendanceTimeiN, empcode, empname, disapprove_datetime, TimeOut, remarkfordisapprove, disappstatus_1, insertDataOnDisapprove_approve, getInterimAttIds, queryResult, InsertAttendanceInInterimTimeiN, error_1, errorMsg, status, interimAttendanceIds, EntryImage, ExitImage, areaId_1, areaIdOut, Zone_id, areaId1, lat, long, radius, dis, InsertAttendanceTimeiN, empId, ShiftId1, deptid1, Desg_id1, timein1, timeout1, TimeInDate1, TimeOutDate1, attdate, remarkfordisapprove, getAttendanceData, empcode, empname, insertDataOnDisapprovAtt, interimAttIds, query_1, haveInterimId, query_2, InsertAttendanceTimeInOut, calculatedOvertime, totalLoggedHours, hoursPerDay, query_3, _28, hours, minutes, seconds, updateLoggedHours, calculatedOvertime, totalLoggedHours, getOvertTime, query_4, results, halfshiftTimestamp, totalLoggedHoursTimestamp, halfDayStatus, updateHalfdayStatus, error_2, ExitImage, areaIdOut, calculatedOvertime, totalLoggedHours, hoursPerDay, employeeDeviceId, verifieddevice, suspiciousdevice, timeOutAlreadySyncedId, getAttnadaceRecord, maxIdOfInterimAttendance, alreadyMarkedTimeOutId, loggedHoursResult, loggedHours, updateQuery_1, calculateLoggedHours, hoursPerDay_1, _29, hours, minutes, seconds, areaId1, lat, long, radius, dis, updateResult, empId, ShiftId1, deptid1, Desg_id1, timein1, timeout1, TimeInDate1, TimeOutDate1, attdate, remarkfordisapprove, getAttendanceData, empcode, empname, insertDataOnDisapprovAtt, result_1, updateLoggedHour;
                                return __generator(this, function (_30) {
                                    switch (_30.label) {
                                        case 0:
                                            date = Object.keys(jsonData[i]);
                                            if (!Array.isArray(jsonData[i][date[0]].interim)) return [3 /*break*/, 92];
                                            j = 0;
                                            _30.label = 1;
                                        case 1:
                                            if (!(j < jsonData[i][date[0]].interim.length)) return [3 /*break*/, 92];
                                            _a = jsonData[i][date[0]].interim[j], _b = _a.Id, Id = _b === void 0 ? 0 : _b, _c = _a.UserId, UserId = _c === void 0 ? 0 : _c, _d = _a.ShiftId, ShiftId = _d === void 0 ? "" : _d, _e = _a.AttendanceMasterId, AttendanceMasterId = _e === void 0 ? 0 : _e, _f = _a.Action, Action = _f === void 0 ? "" : _f, _g = _a.AttendanceDate, AttendanceDate = _g === void 0 ? "" : _g, _h = _a.OrganizationId, OrganizationId = _h === void 0 ? 0 : _h, _j = _a.LatitudeIn, LatitudeIn = _j === void 0 ? 0 : _j, _k = _a.LongitudeIn, LongitudeIn = _k === void 0 ? 0 : _k, _l = _a.LatitudeOut, LatitudeOut = _l === void 0 ? 0 : _l, _m = _a.LongitudeOut, LongitudeOut = _m === void 0 ? 0 : _m, _o = _a.TimeInTime, TimeInTime = _o === void 0 ? "" : _o, _p = _a.TimeOutTime, TimeOutTime = _p === void 0 ? "" : _p, _q = _a.IsTimeInSynced, IsTimeInSynced = _q === void 0 ? 0 : _q, _r = _a.IsTimeOutSynced, IsTimeOutSynced = _r === void 0 ? 0 : _r, _s = _a.FakeTimeInStatus, FakeTimeInStatus = _s === void 0 ? 0 : _s, _t = _a.FakeTimeOutStatus, FakeTimeOutStatus = _t === void 0 ? 0 : _t, _u = _a.FakeLocationInStatus, FakeLocationInStatus = _u === void 0 ? 0 : _u, _v = _a.FakeLocationOutStatus, FakeLocationOutStatus = _v === void 0 ? 0 : _v, _w = _a.GeofenceIn, GeofenceIn = _w === void 0 ? "" : _w, _x = _a.GeofenceOut, GeofenceOut = _x === void 0 ? "" : _x, _y = _a.TimeInDevice, TimeInDevice = _y === void 0 ? "" : _y, _z = _a.TimeOutDevice, TimeOutDevice = _z === void 0 ? "" : _z, _0 = _a.TimeInCity, TimeInCity = _0 === void 0 ? "" : _0, _1 = _a.TimeOutCity, TimeOutCity = _1 === void 0 ? "" : _1, _2 = _a.TimeInAppVersion, TimeInAppVersion = _2 === void 0 ? "" : _2, _3 = _a.TimeOutAppVersion, TimeOutAppVersion = _3 === void 0 ? "" : _3, _4 = _a.TimeOutPictureBase64, TimeOutPictureBase64 = _4 === void 0 ? "" : _4, _5 = _a.TimeInPictureBase64, TimeInPictureBase64 = _5 === void 0 ? "" : _5, _6 = _a.TimeInApp, TimeInApp = _6 === void 0 ? "" : _6, _7 = _a.TimeOutApp, TimeOutApp = _7 === void 0 ? "" : _7, _8 = _a.TimeInAddress, TimeInAddress = _8 === void 0 ? "" : _8, _9 = _a.TimeOutAddress, TimeOutAddress = _9 === void 0 ? "" : _9, _10 = _a.TimeInDeviceName, TimeInDeviceName = _10 === void 0 ? "" : _10, _11 = _a.TimeOutDeviceName, TimeOutDeviceName = _11 === void 0 ? "" : _11, _12 = _a.Platform, Platform = _12 === void 0 ? "" : _12, _13 = _a.SyncTimeIn, SyncTimeIn = _13 === void 0 ? "0" : _13, _14 = _a.SyncTimeOut, SyncTimeOut = _14 === void 0 ? "0" : _14, _15 = _a.TimeInDeviceId, TimeInDeviceId = _15 === void 0 ? "" : _15, _16 = _a.TimeOutDeviceId, TimeOutDeviceId = _16 === void 0 ? "" : _16, _17 = _a.TimeInDate, TimeInDate = _17 === void 0 ? "" : _17, _18 = _a.TimeOutDate, TimeOutDate = _18 === void 0 ? "" : _18, _19 = _a.TimeInStampApp, TimeInStampApp = _19 === void 0 ? "" : _19, _20 = _a.TimeOutStampApp, TimeOutStampApp = _20 === void 0 ? "" : _20, _21 = _a.TimeInRemark, TimeInRemark = _21 === void 0 ? "" : _21, _22 = _a.TimeOutRemark, TimeOutRemark = _22 === void 0 ? "" : _22, _23 = _a.orgTopic, orgTopic = _23 === void 0 ? "" : _23, _24 = _a.ThumnailTimeOutPictureBase64, ThumnailTimeOutPictureBase64 = _24 === void 0 ? "" : _24, _25 = _a.ThumnailTimeInPictureBase64, ThumnailTimeInPictureBase64 = _25 === void 0 ? "" : _25, _26 = _a.GeofenceInAreaId, GeofenceInAreaId = _26 === void 0 ? "" : _26, _27 = _a.GeofenceOutAreaId, GeofenceOutAreaId = _27 === void 0 ? "" : _27;
                                            console.log(jsonData[i][date[0]].interim[j]);
                                            console.log("all data of");
                                            return [4 /*yield*/, Helper_1["default"].getEmpTimeZone(UserId, OrganizationId)];
                                        case 2:
                                            zone = _30.sent();
                                            defaultZone = luxon_1.DateTime.now().setZone(zone);
                                            return [4 /*yield*/, Helper_1["default"].getShiftType(ShiftId)];
                                        case 3:
                                            shiftType = _30.sent();
                                            attDatePastOneDay = defaultZone
                                                .minus({ days: 1 })
                                                .toFormat("yyyy-MM-dd");
                                            currentDate = defaultZone.toFormat("yyyy-MM-dd");
                                            if (!(shiftType == "1")) return [3 /*break*/, 5];
                                            if (!(ShiftId == "0" || ShiftId == "" || ShiftId == "")) return [3 /*break*/, 5];
                                            return [4 /*yield*/, Helper_1["default"].getassignedShiftTimes(UserId, AttendanceDate)];
                                        case 4:
                                            ShiftId = _30.sent();
                                            _30.label = 5;
                                        case 5: return [4 /*yield*/, Database_1["default"].from("licence_ubiattendance")
                                                .select("allowOverTime", "Addon_AutoTimeOut")
                                                .where("OrganizationId", OrganizationId)];
                                        case 6:
                                            getSettingOfPunchAttendace = _30.sent();
                                            allowOverTime = void 0;
                                            if (getSettingOfPunchAttendace.length > 0) {
                                                allowOverTime_1 = getSettingOfPunchAttendace[0].allowOverTime;
                                                //let Addon_AutoTimeOut = getSettingOfPunchAttendace[0].Addon_AutoTimeOut;
                                                if (allowOverTime_1 == 1) {
                                                    allowOverTime_1 = true;
                                                }
                                                else {
                                                    allowOverTime_1 = false;
                                                }
                                            }
                                            if (!(allowOverTime == true && shiftType != 2)) return [3 /*break*/, 8];
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
                                        case 7:
                                            getlastAttendanceData = _30.sent();
                                            if (getSettingOfPunchAttendace.length > 0) {
                                                AttendanceDate = getlastAttendanceData[0].AttendanceDate;
                                            }
                                            _30.label = 8;
                                        case 8: return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, "OutsideGeofence")];
                                        case 9:
                                            geofencePerm = _30.sent();
                                            return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, "SuspiciousSelfie")];
                                        case 10:
                                            SuspiciousSelfiePerm = _30.sent();
                                            return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, "SuspiciousDevice")];
                                        case 11:
                                            SuspiciousDevicePerm = _30.sent();
                                            return [4 /*yield*/, Helper_1["default"].getAddonPermission(OrganizationId, "Addon_DeviceVerification")];
                                        case 12:
                                            deviceverificationperm = _30.sent();
                                            return [4 /*yield*/, Helper_1["default"].getAddonPermission(OrganizationId, "Addon_GeoFence")];
                                        case 13:
                                            addonGeoFenceStst = _30.sent();
                                            return [4 /*yield*/, Helper_1["default"].getAddon_geoFenceRestrictionByUserId(UserId, "fencearea", OrganizationId)];
                                        case 14:
                                            checkRestriction = _30.sent();
                                            if (addonGeoFenceStst == 1 && checkRestriction == 1) {
                                                GeofenceIn = "Within Geofence";
                                                GeofenceOut = "Within Geofence";
                                            }
                                            time = defaultZone.toFormat("HH:mm:ss") == "00:00:00"
                                                ? "23:59:00"
                                                : defaultZone.toFormat("HH:mm:ss");
                                            stamp = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
                                            today = currentDate;
                                            return [4 /*yield*/, Helper_1["default"].getEmpName(UserId)];
                                        case 15:
                                            name = _30.sent();
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
                                        case 16:
                                            updateQuery = _30.sent();
                                            return [4 /*yield*/, Database_1["default"].query()
                                                    .from("AppliedLeave")
                                                    .where("EmployeeId", UserId)
                                                    .where("ApprovalStatus", 2)
                                                    .where("HalfDayStatus", 1)
                                                    .where("Date", AttendanceDate)
                                                    .select("*")];
                                        case 17:
                                            result = _30.sent();
                                            attendance_sts = result.length > 0 ? 4 : 1;
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .where("EmployeeId", UserId)
                                                    .where("AttendanceDate", AttendanceDate)
                                                    .where("disapprove_sts", 1)
                                                    .count("Id as count")
                                                    .first()];
                                        case 18:
                                            query = _30.sent();
                                            if (query.count > 0) {
                                                attendance_sts = 2;
                                            }
                                            return [4 /*yield*/, Helper_1["default"].getShiftMultipleTimeStatus(UserId, AttendanceDate, ShiftId)];
                                        case 19:
                                            MultipletimeStatus = _30.sent();
                                            return [4 /*yield*/, AttendanceMaster_1["default"].query()
                                                    .where("EmployeeId", UserId)
                                                    .where("AttendanceDate", AttendanceDate)
                                                    .select("Id", "TimeIn", "TimeOut")
                                                    .first()];
                                        case 20:
                                            attendanceData = _30.sent();
                                            attTimeIn = "00:00:00";
                                            attTimeOut = "00:00:00";
                                            console.log('attendanceData==============>');
                                            console.log(attendanceData);
                                            console.log('attendanceData==============>');
                                            if (attendanceData) {
                                                AttendanceMasterId = attendanceData.Id;
                                                attTimeIn = attendanceData.TimeIn;
                                                attTimeOut = attendanceData.TimeOut;
                                            }
                                            return [4 /*yield*/, EmployeeMaster_1["default"].query()
                                                    .where("Id", UserId)
                                                    .select("Shift", "Department", "Designation", "area_assigned", "hourly_rate", "OwnerId")
                                                    .first()];
                                        case 21:
                                            EmployeeRecord = _30.sent();
                                            if (EmployeeRecord) {
                                                Dept_id = EmployeeRecord.Department;
                                                Desg_id = EmployeeRecord.Designation;
                                                areaId = EmployeeRecord.area_assigned;
                                                HourlyRateId = EmployeeRecord.hourly_rate;
                                                OwnerId = EmployeeRecord.OwnerId;
                                            }
                                            console.log(SyncTimeIn == "1" && SyncTimeOut == "1");
                                            console.log("start Case");
                                            if (!(SyncTimeIn == "1" && SyncTimeOut != "1")) return [3 /*break*/, 39];
                                            interimAttendanceIdss = 0;
                                            if (GeofenceIn == "Outside Geofence") {
                                                // if(geofencePerm==9|| geofencePerm==13||geofencePerm==11|| geofencePerm==15)
                                                // {
                                                //     $pageName="Outside Geofence";//to navigate notification Do not change it.
                                                //     $NotificationId= sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Outside Geofence", "$name has punched Attendance outside Geofence", "$UserId","$OrganizationId","$pageName");
                                                //     $query=$this->db->query("UPDATE NotificationsList SET PageName = 'Outsidegeofance' WHERE Id = '$NotificationId' ");
                                                // }
                                                if (geofencePerm == 13) {
                                                    /////////////Start Mail code Outside Geofence(".$today.")"/////////////
                                                }
                                            }
                                            if (!(deviceverificationperm == 1)) return [3 /*break*/, 23];
                                            return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                                    .select("DeviceId")
                                                    .where("Id", "" + UserId)
                                                    .first()];
                                        case 22:
                                            employeeDeviceId = _30.sent();
                                            if (employeeDeviceId) {
                                                verifieddevice = employeeDeviceId.DeviceId;
                                                suspiciousdevice = 0;
                                                if (verifieddevice == TimeInDeviceId) {
                                                    suspiciousdevice = 0;
                                                }
                                                else {
                                                    suspiciousdevice = 1;
                                                    // if(SuspiciousDevicePerm==9|| SuspiciousDevicePerm==13||SuspiciousDevicePerm==11|| SuspiciousDevicePerm==15)
                                                    // {
                                                    //   $pageName="Suspicious Device";//to navigate notification Do not change it.
                                                    //   sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Suspicious Device", "$name's Attendance Device does not match", "$UserId","$OrganizationId","$pageName");
                                                    // }
                                                    if (SuspiciousDevicePerm == 5 ||
                                                        SuspiciousDevicePerm == 13 ||
                                                        SuspiciousDevicePerm == 7 ||
                                                        SuspiciousDevicePerm == 15) {
                                                        /////////////Enter code of Suspicious Device///////////
                                                    }
                                                }
                                            }
                                            _30.label = 23;
                                        case 23:
                                            /////////////////// DeviceVerification code ////////////////////
                                            console.log("case one for sync Attendance Only Time In");
                                            EntryImage = ThumnailTimeInPictureBase64 == ""
                                                ? avtarImg
                                                : ThumnailTimeInPictureBase64;
                                            _30.label = 24;
                                        case 24:
                                            _30.trys.push([24, 37, , 38]);
                                            areaId = GeofenceInAreaId;
                                            if (!(AttendanceMasterId == 0)) return [3 /*break*/, 33];
                                            if (!(OrganizationId == 201958 ||
                                                OrganizationId == 126338 ||
                                                OrganizationId == 209694 ||
                                                OrganizationId == 206065 ||
                                                OrganizationId == 10)) return [3 /*break*/, 27];
                                            return [4 /*yield*/, Helper_1["default"].getAreaIdByUser(UserId)];
                                        case 25:
                                            areaId12 = _30.sent();
                                            return [4 /*yield*/, Helper_1["default"].getSettingByOrgId(OrganizationId)];
                                        case 26:
                                            outside_geofence_setting = _30.sent(); //disapprove_setting on h
                                            _30.label = 27;
                                        case 27:
                                            console.log("shakir-----922");
                                            console.log(OrganizationId);
                                            console.log(areaId12);
                                            console.log(addonGeoFenceStst);
                                            console.log(outside_geofence_setting);
                                            console.log("shakir-----922");
                                            Geofencests = addonGeoFenceStst;
                                            if (!(areaId12 != 0 &&
                                                Geofencests == 1 &&
                                                outside_geofence_setting == "1")) return [3 /*break*/, 31];
                                            if (!(GeofenceIn == "")) return [3 /*break*/, 30];
                                            areaId1 = areaId12;
                                            return [4 /*yield*/, Helper_1["default"].getAreaInfo(areaId1)];
                                        case 28:
                                            areaId12 = _30.sent();
                                            lat = areaId12.lat;
                                            long = areaId12.long;
                                            radius = areaId12.radius;
                                            return [4 /*yield*/, Helper_1["default"].calculateDistance(lat, long, LatitudeIn, LongitudeIn, "'K'")];
                                        case 29:
                                            dis = _30.sent();
                                            if (dis <= radius) {
                                                GeofenceIn = "Within Geofence";
                                            }
                                            else {
                                                GeofenceIn = "Outside Geofence";
                                            }
                                            _30.label = 30;
                                        case 30:
                                            if (GeofenceIn == "Outside Geofence") {
                                                attendance_sts = 2;
                                                disappstatus = 2; //pending disaaprove
                                            }
                                            _30.label = 31;
                                        case 31: return [4 /*yield*/, Database_1["default"].table("AttendanceMaster")
                                                .returning("Id")
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
                                                ZoneId: GeofenceInAreaId,
                                                disapprove_sts: disappstatus
                                            })];
                                        case 32:
                                            InsertAttendanceTimeiN = _30.sent();
                                            AttendanceMasterId = InsertAttendanceTimeiN[0];
                                            if (areaId12 != 0 &&
                                                Geofencests == 1 &&
                                                outside_geofence_setting == "1" &&
                                                AttendanceMasterId != 0 &&
                                                GeofenceIn == "Outside Geofence") {
                                                empcode = "";
                                                empname = "";
                                                disapprove_datetime = TimeInDate + " " + TimeInTime;
                                                disattreason = "Outside Geofence";
                                                TimeOutDate = "0000:00:00";
                                                TimeOut = "00:00:00";
                                                remarkfordisapprove = "";
                                                disappstatus_1 = 0;
                                                insertDataOnDisapprove_approve = Database_1["default"].table("Disapprove_approve").insert({
                                                    AttendanceId: AttendanceMasterId,
                                                    EmployeeId: UserId,
                                                    EmployeeCode: empcode,
                                                    EmployeeName: empname,
                                                    ShiftId: ShiftId,
                                                    deptid: Dept_id,
                                                    desgid: Desg_id,
                                                    AttendanceDate: AttendanceDate,
                                                    OrganizationId: OrganizationId,
                                                    TimeIn: TimeInTime,
                                                    TimeOut: TimeOutTime,
                                                    TimeInDate: TimeInDate,
                                                    TimeOutDate: TimeOutDate,
                                                    disapprove_datetime: disapprove_datetime,
                                                    //disapp_sts: disappstatus,
                                                    disapprovereason: disattreason,
                                                    disapp_reason: GeofenceIn,
                                                    disapp_remark: remarkfordisapprove
                                                });
                                            }
                                            ////////////////////Outside Geofence Restriction end/////////////
                                            if (OrganizationId == "105999" ||
                                                OrganizationId == "10" ||
                                                OrganizationId == "168264") {
                                                // $mail = $this->db->query("Select Subject,Body from All_mailers where id=30");
                                                //                 $subject='';
                                                //                 $mailbody='';
                                                //                  $username='';
                                                //                  $orgname='';
                                                //                  $TimeInTme=date("h:i:s A",strtotime($time));
                                                //               if ($email = $mail->result())
                                                //                {
                                                //                   $subject = $email[0]->Subject;
                                                //                   $mailbody = $email[0]->Body;
                                                //               }
                                                //               $emp=$this->db->query("SELECT E.CurrentEmailId,CONCAT(E.FirstName,' ',E.LastName) as Name ,o.Name as Orgname from EmployeeMaster E,Organization o where E.Id='$UserId' and E.OrganizationId =o.Id and o.Id='$OrganizationId'");
                                                //   $emailIn="";
                                                //               if($emp1= $emp->result())
                                                //               {
                                                //                 $username=$emp1[0]->Name;
                                                //                  $orgname=$emp1[0]->Orgname;
                                                //    $emailIn = decode5t($emp1[0]->CurrentEmailId);
                                                //               }
                                                //               //$orgname="UbitechSolutions";
                                                //              // $username="Ashish";
                                                //              // $val= '<p style="width:15%!important;">'.$TimeInAddress.'</p>';
                                                //               $Tminval = $TimeInTme;
                                                //               $Tmoutval = ' -';
                                                //               $TmIN ='Time In';
                                                //               $TimeInAddrss = $TimeInAddress;
                                                //               $TimeOutAddrss = ' -';
                                                //               $latitin = $LatitudeIn.",".$LongitudeIn;
                                                //               $mailbody1 = $mailbody;
                                                //               $mailbody2 = str_replace('{Akanksha Dubey}', $username, $mailbody1);
                                                //               $mailbody3 = str_replace('{Organization Name/School Name}',$orgname,$mailbody2);
                                                //               $mailbody4 = str_replace('11:01 AM.',$Tminval,$mailbody3);
                                                //               $mailbody5= str_replace('{Name}', $username,$mailbody4);
                                                //               $mailbody6= str_replace('{Time-In}',$Tminval,$mailbody5);
                                                //               $mailbody7=str_replace('{Time_out}', $Tmoutval,$mailbody6);
                                                //               $mailbody8=str_replace('{Time-InLocation}', $TimeInAddrss,$mailbody7);
                                                //               //$mailbody9=str_replace('{Time-InLocation}', $TimeInAddrss,$mailbody8);
                                                //               $mailbody9 = str_replace('{Time_outLocation}',$TimeOutAddrss,
                                                //                $mailbody8);
                                                //    $mailbody10 = str_replace('{latit-In}', $latitin,
                                                //                $mailbody9);
                                                //    $mlbody11= str_replace('{latit-out}','-', $mailbody10);
                                                //    $message = $mlbody11;
                                                //               $headers = "MIME-Version: 1.0" . "\r\n";
                                                //               $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                                                //               $headers .= 'From: <noreply@ubiattendance.com>' . "\r\n";
                                                /* sendEmail_new1("ashish@ubitechsolutions.com", $subject, $message, $headers);*/
                                                //sendEmail_new("shumyla@ubitechsolutions.com", $subject, $message,$headers);
                                                //sendEmail_new($emailIn, $subject, $message, $headers);
                                            }
                                            _30.label = 33;
                                        case 33:
                                            if (!(MultipletimeStatus == 1 || shiftType == "3")) return [3 /*break*/, 36];
                                            getInterimAttIds = 0;
                                            if (!(AttendanceMasterId != 0)) return [3 /*break*/, 36];
                                            return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                                    .select("Id")
                                                    .where("AttendanceMasterId", AttendanceMasterId)
                                                    .andWhere("TimeIn", TimeInTime)];
                                        case 34:
                                            queryResult = _30.sent();
                                            if (queryResult.length > 0) {
                                                getInterimAttIds = queryResult[0].Id;
                                            }
                                            if (!(getInterimAttIds == 0)) return [3 /*break*/, 36];
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
                                        case 35:
                                            InsertAttendanceInInterimTimeiN = _30.sent();
                                            interimAttendanceId = InsertAttendanceInInterimTimeiN[0];
                                            _30.label = 36;
                                        case 36:
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
                                            return [3 /*break*/, 38];
                                        case 37:
                                            error_1 = _30.sent();
                                            errorMsg = "Message: " + error_1.message;
                                            status = 0;
                                            return [3 /*break*/, 38];
                                        case 38: return [3 /*break*/, 91];
                                        case 39:
                                            if (!(SyncTimeIn == "1" && SyncTimeOut == "1")) return [3 /*break*/, 66];
                                            console.log("inside both case");
                                            //let interimAttendanceIds=0
                                            console.log("*************case mark attendance both****************");
                                            interimAttendanceIds = 0;
                                            EntryImage = ThumnailTimeInPictureBase64 == ""
                                                ? avtarImg
                                                : ThumnailTimeInPictureBase64;
                                            ExitImage = ThumnailTimeOutPictureBase64 == ""
                                                ? avtarImg
                                                : ThumnailTimeOutPictureBase64;
                                            _30.label = 40;
                                        case 40:
                                            _30.trys.push([40, 64, , 65]);
                                            areaId_1 = GeofenceInAreaId;
                                            areaIdOut = GeofenceOutAreaId;
                                            console.log("shakir+AttendanceMasterId" + AttendanceMasterId);
                                            if (!(AttendanceMasterId == 0)) return [3 /*break*/, 51];
                                            if (GeofenceIn == "Outside Geofence") {
                                                if (geofencePerm == 13) {
                                                    ///////////Out side Geofence code start Here///
                                                }
                                            }
                                            if (GeofenceOut == "Outside Geofence") {
                                                if (geofencePerm == 13) {
                                                    ///////////Out side Geofence code start Here///
                                                }
                                            }
                                            console.log("shakir+deviceverificationperm" + deviceverificationperm);
                                            Zone_id = 0;
                                            if (!(OrganizationId == 201958 ||
                                                OrganizationId == 126338 ||
                                                OrganizationId == 209694 ||
                                                OrganizationId == 206065 ||
                                                OrganizationId == 10)) return [3 /*break*/, 43];
                                            return [4 /*yield*/, Helper_1["default"].getAreaIdByUser(UserId)];
                                        case 41:
                                            areaId12 = _30.sent();
                                            return [4 /*yield*/, Helper_1["default"].getSettingByOrgId(OrganizationId)];
                                        case 42:
                                            outside_geofence_setting = _30.sent(); //disapprove_setting on h
                                            console.log("shakir+areaId12" + areaId12);
                                            console.log("shakir+outside_geofence_setting" + outside_geofence_setting);
                                            _30.label = 43;
                                        case 43:
                                            Geofencests = addonGeoFenceStst;
                                            if (!(areaId12 != 0 &&
                                                Geofencests == 1 &&
                                                outside_geofence_setting == "1")) return [3 /*break*/, 47];
                                            if (!((GeofenceIn == "" && GeofenceOut == "") ||
                                                GeofenceIn == "" ||
                                                GeofenceOut == "")) return [3 /*break*/, 46];
                                            areaId1 = areaId12;
                                            return [4 /*yield*/, Helper_1["default"].getAreaInfo(areaId1)];
                                        case 44:
                                            areaId12 = _30.sent();
                                            lat = areaId12.lat;
                                            long = areaId12.long;
                                            radius = areaId12.radius;
                                            return [4 /*yield*/, Helper_1["default"].calculateDistance(lat, long, LatitudeIn, LongitudeIn, "'K'")];
                                        case 45:
                                            dis = _30.sent();
                                            if (dis <= radius) {
                                                if (GeofenceIn == "") {
                                                    GeofenceIn = "Within Geofence";
                                                }
                                                if (GeofenceOut == "") {
                                                    GeofenceOut = "Within Geofence";
                                                }
                                            }
                                            else {
                                                if (GeofenceIn == "") {
                                                    GeofenceIn = "Outside Geofence";
                                                }
                                                if (GeofenceOut == "") {
                                                    GeofenceOut = "Outside Geofence";
                                                }
                                            }
                                            _30.label = 46;
                                        case 46:
                                            if ((GeofenceIn == "Outside Geofence" &&
                                                GeofenceOut != "Outside Geofence") ||
                                                (GeofenceIn == "Outside Geofence" &&
                                                    GeofenceOut == "Outside Geofence") ||
                                                (GeofenceIn != "Outside Geofence" &&
                                                    GeofenceOut == "Outside Geofence")) {
                                                attendance_sts = 2;
                                                disappstatus = 2; //pending disaaprove
                                                disattreason = "Outside Geofence";
                                            }
                                            _30.label = 47;
                                        case 47: return [4 /*yield*/, Database_1["default"].table("AttendanceMaster")
                                                .returning("id")
                                                .insert({
                                                TimeInApp: TimeInApp,
                                                TimeOutApp: TimeOutApp,
                                                FakeLocationStatusTimeIn: FakeLocationInStatus,
                                                FakeLocationStatusTimeOut: FakeLocationOutStatus,
                                                EmployeeId: UserId,
                                                AttendanceDate: AttendanceDate,
                                                AttendanceStatus: attendance_sts,
                                                TimeIn: TimeInTime,
                                                TimeOut: TimeOutTime,
                                                ShiftId: ShiftId,
                                                Dept_id: Dept_id,
                                                Desg_id: Desg_id,
                                                areaId: areaId_1,
                                                HourlyRateId: HourlyRateId,
                                                OrganizationId: OrganizationId,
                                                CreatedDate: today,
                                                CreatedById: UserId,
                                                LastModifiedDate: stamp,
                                                LastModifiedById: UserId,
                                                OwnerId: UserId,
                                                EntryImage: EntryImage,
                                                ExitImage: ExitImage,
                                                checkInLoc: TimeInAddress,
                                                checkOutLoc: TimeOutAddress,
                                                device: "mobile",
                                                latit_in: LatitudeIn,
                                                longi_in: LongitudeIn,
                                                latit_out: LatitudeOut,
                                                longi_out: LongitudeOut,
                                                timeindate: TimeInDate,
                                                timeoutdate: TimeOutDate,
                                                Platform: Platform,
                                                TimeInDeviceId: TimeInDeviceId,
                                                TimeOutDeviceId: TimeOutDeviceId,
                                                TimeInDeviceName: TimeInDeviceName,
                                                TimeOutDeviceName: TimeOutDeviceName,
                                                timeincity: TimeInCity,
                                                timeoutcity: TimeOutCity,
                                                TimeInAppVersion: TimeInAppVersion,
                                                TimeOutAppVersion: TimeOutAppVersion,
                                                TimeInGeoFence: GeofenceIn,
                                                TimeOutGeoFence: GeofenceOut,
                                                TimeInDevice: TimeInDevice,
                                                TimeOutDevice: TimeOutDevice,
                                                multitime_sts: MultipletimeStatus,
                                                remark: TimeInRemark,
                                                remarks: TimeOutRemark,
                                                TimeInStampApp: TimeInStampApp,
                                                TimeOutStampApp: TimeOutStampApp,
                                                TimeInStampServer: TimeInStampServer,
                                                TimeOutStampServer: TimeOutStampServer,
                                                areaIdTimeOut: areaIdOut,
                                                //disapp_sts: disappstatus,
                                                disapprovereason: disattreason,
                                                ZoneId: Zone_id
                                            })];
                                        case 48:
                                            InsertAttendanceTimeiN = _30.sent();
                                            AttendanceMasterId = InsertAttendanceTimeiN[0];
                                            console.log("shakir+AFETR INSERT AttendanceMasterId" + AttendanceMasterId);
                                            if (!((areaId12 != 0) && (Geofencests == 1) && (outside_geofence_setting == "1") && ((GeofenceIn == "Outside Geofence" && GeofenceOut != "Outside Geofence") || (GeofenceIn == "Outside Geofence" && GeofenceOut == "Outside Geofence") || (GeofenceIn != "Outside Geofence" && GeofenceOut == "Outside Geofence")))) return [3 /*break*/, 51];
                                            empId = void 0;
                                            ShiftId1 = void 0;
                                            deptid1 = void 0;
                                            Desg_id1 = void 0;
                                            timein1 = void 0;
                                            timeout1 = void 0;
                                            TimeInDate1 = void 0;
                                            TimeOutDate1 = void 0;
                                            attdate = void 0;
                                            remarkfordisapprove = void 0;
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster").select("EmployeeId", "ShiftId", "Dept_id", "Desg_id", "TimeIn", "TimeOut", "timeindate", "timeoutdate", "AttendanceDate").where("Id", AttendanceMasterId).first()];
                                        case 49:
                                            getAttendanceData = _30.sent();
                                            if (getAttendanceData) {
                                                empId = getAttendanceData.EmployeeId;
                                                ShiftId1 = getAttendanceData.ShiftId;
                                                deptid1 = getAttendanceData.Dept_id;
                                                Desg_id1 = getAttendanceData.Desg_id;
                                                timein1 = getAttendanceData.TimeIn;
                                                timeout1 = getAttendanceData.TimeOut;
                                                TimeInDate1 = getAttendanceData.timeindate;
                                                TimeOutDate1 = getAttendanceData.timeoutdate;
                                                attdate = getAttendanceData.AttendanceDate;
                                            }
                                            empcode = "";
                                            empname = "";
                                            TimeInDate = attdate;
                                            disattreason = "Outside Geofence";
                                            disappstatus = 0;
                                            return [4 /*yield*/, Database_1["default"].table("Disapprove_approve").insert({
                                                    AttendanceId: AttendanceMasterId,
                                                    EmployeeId: UserId,
                                                    EmployeeCode: empcode,
                                                    EmployeeName: empname,
                                                    ShiftId: ShiftId1,
                                                    deptid: deptid1,
                                                    desgid: Desg_id1,
                                                    AttendanceDate: attdate,
                                                    OrganizationId: OrganizationId,
                                                    TimeIn: timein1,
                                                    TimeOut: timeout1,
                                                    TimeInDate: TimeInDate1,
                                                    TimeOutDate: TimeOutDate1,
                                                    disapprove_datetime: currentDate,
                                                    disapp_sts: disappstatus,
                                                    disapp_reason: disattreason,
                                                    disapp_remark: remarkfordisapprove
                                                })];
                                        case 50:
                                            insertDataOnDisapprovAtt = _30.sent();
                                            _30.label = 51;
                                        case 51:
                                            console.log("MultipletimeStatus===>" + MultipletimeStatus);
                                            if (!(MultipletimeStatus == 1 || shiftType == "3")) return [3 /*break*/, 55];
                                            interimAttIds = 0;
                                            if (!(AttendanceMasterId != 0)) return [3 /*break*/, 53];
                                            query_1 = Database_1["default"].from("InterimAttendances")
                                                .where("AttendanceMasterId", AttendanceMasterId)
                                                .where("TimeIn", TimeInTime)
                                                .select("id");
                                            return [4 /*yield*/, query_1];
                                        case 52:
                                            haveInterimId = _30.sent();
                                            console.log("check interim Ids");
                                            console.log(haveInterimId);
                                            console.log(haveInterimId.length > 0);
                                            console.log("check interim Ids");
                                            if (haveInterimId.length > 0) {
                                                interimAttIds = haveInterimId[0].id;
                                            }
                                            _30.label = 53;
                                        case 53:
                                            console.log("deepak" + TimeInTime);
                                            console.log("deepak" + interimAttendanceIds);
                                            if (!(interimAttIds == 0)) return [3 /*break*/, 55];
                                            console.log("new Insert Query for interim");
                                            query_2 = Database_1["default"].table("InterimAttendances")
                                                .returning("id")
                                                .insert({
                                                TimeIn: TimeInTime,
                                                TimeOut: TimeOutTime,
                                                TimeInImage: EntryImage,
                                                TimeOutImage: ExitImage,
                                                TimeInLocation: TimeInAddress,
                                                TimeOutLocation: TimeOutAddress,
                                                LatitudeIn: LatitudeIn,
                                                LatitudeOut: LatitudeOut,
                                                LongitudeIn: LongitudeIn,
                                                LongitudeOut: LongitudeOut,
                                                Device: "mobile",
                                                FakeLocationStatusTimeIn: FakeLocationInStatus,
                                                FakeLocationStatusTimeOut: FakeLocationOutStatus,
                                                Platform: Platform,
                                                TimeInCity: TimeInCity,
                                                TimeOutCity: TimeOutCity,
                                                TimeInAppVersion: TimeInAppVersion,
                                                TimeOutAppVersion: TimeOutAppVersion,
                                                TimeInGeofence: GeofenceIn,
                                                TimeOutGeofence: GeofenceOut,
                                                AttendanceMasterId: AttendanceMasterId,
                                                TimeInDeviceId: TimeInDeviceId,
                                                TimeOutDeviceId: TimeOutDeviceId,
                                                TimeInDeviceName: TimeInDeviceName,
                                                TimeOutDeviceName: TimeOutDeviceName,
                                                LoggedHours: Database_1["default"].raw("TIMEDIFF(?, ?)", [
                                                    AttendanceDate + " " + TimeOutTime,
                                                    AttendanceDate + " " + TimeInTime,
                                                ]),
                                                TimeInRemark: TimeInRemark,
                                                TimeOutRemark: TimeOutRemark,
                                                TimeInDate: TimeInDate,
                                                TimeOutDate: TimeOutDate,
                                                TimeInStampApp: TimeInStampApp,
                                                TimeOutStampApp: TimeOutStampApp,
                                                TimeInStampServer: TimeInStampServer,
                                                TimeOutStampServer: TimeOutStampServer,
                                                EmployeeId: UserId,
                                                OrganizationId: OrganizationId
                                            });
                                            return [4 /*yield*/, query_2];
                                        case 54:
                                            InsertAttendanceTimeInOut = _30.sent();
                                            console.log("////////////////" + InsertAttendanceTimeInOut);
                                            interimAttendanceIds = InsertAttendanceTimeInOut[0];
                                            _30.label = 55;
                                        case 55:
                                            if (!(MultipletimeStatus == 1 || shiftType == "3")) return [3 /*break*/, 58];
                                            calculatedOvertime = "00:00:00";
                                            totalLoggedHours = "00:00:00";
                                            hoursPerDay = "00:00:00";
                                            return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                                    .select("Id")
                                                    .select(Database_1["default"].raw("SEC_TO_TIME(SUM(TIME_TO_SEC(LoggedHours))) as totalLoggedHours"))
                                                    .select(Database_1["default"].raw("(select HoursPerDay from ShiftMaster where Id = '" + ShiftId + "') as hoursPerDay"))
                                                    .where("AttendanceMasterId", AttendanceMasterId)];
                                        case 56:
                                            query_3 = _30.sent();
                                            if (query_3.length > 0) {
                                                hoursPerDay = query_3[0].hoursPerDay;
                                                totalLoggedHours = query_3[0].totalLoggedHours;
                                            }
                                            _28 = Helper_1["default"].calculateOvertime(hoursPerDay, totalLoggedHours), hours = _28.hours, minutes = _28.minutes, seconds = _28.seconds;
                                            console.log(hours + ":" + minutes + ":" + seconds);
                                            calculatedOvertime = hours + ":" + minutes + ":" + seconds;
                                            console.log("calculatedOvertime Case Three" + calculatedOvertime);
                                            updateLoggedHours = Database_1["default"].from("AttendanceMaster")
                                                .where("id", AttendanceMasterId)
                                                .update({
                                                overtime: calculatedOvertime,
                                                TotalLoggedHours: totalLoggedHours
                                            });
                                            return [4 /*yield*/, updateLoggedHours];
                                        case 57:
                                            _30.sent();
                                            _30.label = 58;
                                        case 58:
                                            if (!((shiftType == "1" || shiftType == "2") &&
                                                MultipletimeStatus != 1)) return [3 /*break*/, 61];
                                            calculatedOvertime = "00:00:00";
                                            totalLoggedHours = "00:00:00";
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster as A")
                                                    .select("A.TimeIn as attTimeIn", "A.TimeOut as attTimeOut", "C.TimeIn as shiftTimeIn", "C.TimeOut as shiftTimeOut", Database_1["default"].raw("TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn)) as TotalLoggedHours"), Database_1["default"].raw("(CASE WHEN (C.shifttype=2) THEN SUBTIME(TIMEDIFF(CONCAT('2021-08-21', ' ', C.TimeOut), CONCAT('2021-08-20', ' ', C.TimeIn)), TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn))) ELSE SUBTIME(TIMEDIFF(A.TimeOut, A.TimeIn), TIMEDIFF(C.TimeOut, C.TimeIn)) END) as overtime"))
                                                    .innerJoin("ShiftMaster as C", "A.ShiftId", "C.Id")
                                                    .where("A.Id", AttendanceMasterId)
                                                    .first()];
                                        case 59:
                                            getOvertTime = _30.sent();
                                            if (getOvertTime) {
                                                totalLoggedHours = getOvertTime.TotalLoggedHours;
                                                calculatedOvertime = getOvertTime.overtime;
                                            }
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .where("id", AttendanceMasterId)
                                                    .update({
                                                    overtime: calculatedOvertime,
                                                    TotalLoggedHours: totalLoggedHours
                                                })];
                                        case 60:
                                            query_4 = _30.sent();
                                            _30.label = 61;
                                        case 61: return [4 /*yield*/, Database_1["default"].from("AttendanceMaster as A")
                                                .innerJoin("ShiftMaster as S", "A.ShiftId", "S.Id")
                                                .select("S.TimeIn as ShiftTimeIn", "S.TimeOut as ShiftTimeOut", "S.shifttype", "S.HoursPerDay")
                                                .select(Database_1["default"].raw("(CASE\n                    WHEN (S.shifttype = 1) THEN SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(S.TimeOut, S.TimeIn)) / 2)\n                    WHEN (S.shifttype = 2) THEN SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(CONCAT('2021-08-07', ' ', S.TimeOut), CONCAT('2021-08-06', ' ', S.TimeIn))) / 2)\n                    WHEN (S.shifttype = 3) THEN SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(S.HoursPerDay, A.TotalLoggedHours)) / 2)\n                    ELSE 0 END) as halfshift"))
                                                .select("A.TotalLoggedHours as TotalLoggedHours")
                                                .where("A.Id", AttendanceMasterId)];
                                        case 62:
                                            results = _30.sent();
                                            halfshiftTimestamp = new Date("1970-01-01T" + results[0].halfshift + "Z").getTime();
                                            totalLoggedHoursTimestamp = new Date("1970-01-01T" + results[0].TotalLoggedHours + "Z").getTime();
                                            halfDayStatus = void 0;
                                            if (halfshiftTimestamp > totalLoggedHoursTimestamp) {
                                                halfDayStatus = 13;
                                            }
                                            else {
                                                halfDayStatus = 0;
                                            }
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .where("Id", AttendanceMasterId)
                                                    .update({
                                                    Wo_H_Hd: halfDayStatus
                                                })];
                                        case 63:
                                            updateHalfdayStatus = _30.sent();
                                            statusArray[k] = {
                                                Time: TimeInTime,
                                                Date: AttendanceDate,
                                                Action: "TimeIn",
                                                EmpId: UserId,
                                                InterimId: Id,
                                                InterimAttendanceId: interimAttendanceIds,
                                                AttendanceMasterId: AttendanceMasterId
                                            };
                                            k++;
                                            statusArray[k] = {
                                                Time: TimeOutTime,
                                                Date: AttendanceDate,
                                                Action: "TimeOut",
                                                EmpId: UserId,
                                                InterimId: Id,
                                                InterimAttendanceId: interimAttendanceIds,
                                                AttendanceMasterId: AttendanceMasterId
                                            };
                                            k++;
                                            return [3 /*break*/, 65];
                                        case 64:
                                            error_2 = _30.sent();
                                            return [3 /*break*/, 65];
                                        case 65: return [3 /*break*/, 91];
                                        case 66:
                                            if (!(SyncTimeIn != "1" && SyncTimeOut == "1")) return [3 /*break*/, 91];
                                            ExitImage = ThumnailTimeOutPictureBase64 == ""
                                                ? avtarImg
                                                : ThumnailTimeOutPictureBase64;
                                            areaIdOut = GeofenceOutAreaId;
                                            calculatedOvertime = "00:00:00";
                                            totalLoggedHours = "00:00:00";
                                            hoursPerDay = "00:00:00";
                                            if ((GeofenceOut == "Outside Geofence")) {
                                                if (geofencePerm == 9 || geofencePerm == 13 || geofencePerm == 11 || geofencePerm == 15) {
                                                    // $pageName="Outside Geofence";//to navigate notification Do not change it.
                                                    // $NotificationId= sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Outside Geofence", "$name has punched Attendance outside Geofence", "$UserId","$OrganizationId","$pageName");
                                                    // $query=$this->db->query("UPDATE NotificationsList SET PageName = 'Outsidegeofance' WHERE Id = '$NotificationId' ");
                                                }
                                                if (geofencePerm == 13) {
                                                    ///////////send outside geofence mail code here////////////
                                                }
                                            }
                                            if (!(deviceverificationperm == 1)) return [3 /*break*/, 68];
                                            return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                                    .select("DeviceId")
                                                    .where("Id", "" + UserId)
                                                    .first()];
                                        case 67:
                                            employeeDeviceId = _30.sent();
                                            if (employeeDeviceId) {
                                                verifieddevice = employeeDeviceId.DeviceId;
                                                suspiciousdevice = 0;
                                                if (verifieddevice == TimeOutDeviceId) {
                                                    suspiciousdevice = 0;
                                                }
                                                else {
                                                    suspiciousdevice = 1;
                                                    // if(SuspiciousDevicePerm==9|| SuspiciousDevicePerm==13||SuspiciousDevicePerm==11|| SuspiciousDevicePerm==15)
                                                    // {
                                                    //   $pageName="Suspicious Device";//to navigate notification Do not change it.
                                                    //   sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Suspicious Device", "$name's Attendance Device does not match", "$UserId","$OrganizationId","$pageName");
                                                    // }
                                                    if (SuspiciousDevicePerm == 5 ||
                                                        SuspiciousDevicePerm == 13 ||
                                                        SuspiciousDevicePerm == 7 ||
                                                        SuspiciousDevicePerm == 15) {
                                                        /////////////Enter code of Suspicious Device///////////
                                                    }
                                                }
                                            }
                                            _30.label = 68;
                                        case 68:
                                            if (!(MultipletimeStatus == 1 || shiftType == "3")) return [3 /*break*/, 77];
                                            timeOutAlreadySyncedId = 0;
                                            if (!(AttendanceMasterId == 0)) return [3 /*break*/, 70];
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                                    .select("Id")
                                                    .where("EmployeeId", UserId)
                                                    .whereBetween("AttendanceDate", [
                                                    Database_1["default"].raw("date_sub('" + AttendanceDate + "', interval 1 day)"),
                                                    AttendanceDate,
                                                ])
                                                    .orderBy("AttendanceDate", "desc")
                                                    .limit(1)];
                                        case 69:
                                            getAttnadaceRecord = _30.sent();
                                            if (getAttnadaceRecord.length > 0) {
                                                AttendanceMasterId = getAttnadaceRecord[0].Id;
                                            }
                                            _30.label = 70;
                                        case 70: return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                                .select("Id")
                                                .where("AttendanceMasterId", AttendanceMasterId)
                                                .orderBy("Id", "desc")
                                                .first()];
                                        case 71:
                                            maxIdOfInterimAttendance = _30.sent();
                                            if (maxIdOfInterimAttendance) {
                                                interimAttendanceId = maxIdOfInterimAttendance.Id;
                                            }
                                            if (!(interimAttendanceId != 0)) return [3 /*break*/, 75];
                                            return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                                    .select("Id")
                                                    .where("AttendanceMasterId", AttendanceMasterId)
                                                    .andWhere("TimeOut", TimeOutTime)
                                                    .orderBy("Id", "desc")
                                                    .first()];
                                        case 72:
                                            alreadyMarkedTimeOutId = _30.sent();
                                            if (alreadyMarkedTimeOutId) {
                                                timeOutAlreadySyncedId = alreadyMarkedTimeOutId.Id;
                                            }
                                            return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                                    .select(Database_1["default"].raw("TIMEDIFF(CONCAT(?, ' ', ?), CONCAT(TimeInDate, ' ', TimeIn)) as loggedHours", [TimeOutDate, TimeOutTime]))
                                                    .where("Id", interimAttendanceId)
                                                    .first()];
                                        case 73:
                                            loggedHoursResult = _30.sent();
                                            loggedHours = loggedHoursResult.loggedHours;
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
                                                    LoggedHours: loggedHours,
                                                    TimeOutDate: TimeOutDate,
                                                    TimeOutRemark: TimeOutRemark,
                                                    TimeOutStampApp: TimeOutStampApp,
                                                    TimeOutStampServer: TimeOutStampServer
                                                })];
                                        case 74:
                                            updateQuery_1 = _30.sent();
                                            _30.label = 75;
                                        case 75: return [4 /*yield*/, Database_1["default"].from("InterimAttendances as I")
                                                .select("A.Id", "A.ShiftId", Database_1["default"].raw("SEC_TO_TIME(SUM(TIME_TO_SEC(I.LoggedHours))) as totalLoggedHours"), Database_1["default"].raw("(SELECT (CASE WHEN (shifttype=1) THEN TIMEDIFF(TimeOut,TimeIn) WHEN (shifttype=2) THEN TIMEDIFF(CONCAT('2021-10-11', ' ', TimeOut), CONCAT('2021-10-10', ' ', TimeIn)) WHEN (shifttype=3) THEN HoursPerDay END) FROM ShiftMaster WHERE Id=A.ShiftId) as hoursPerDay"))
                                                .innerJoin("AttendanceMaster as A", "A.Id", "I.AttendanceMasterId")
                                                .where("I.AttendanceMasterId", AttendanceMasterId)
                                                .groupBy("A.Id", "A.ShiftId")];
                                        case 76:
                                            calculateLoggedHours = _30.sent();
                                            if (calculateLoggedHours.length > 0) {
                                                totalLoggedHours = calculateLoggedHours[0].totalLoggedHours;
                                                hoursPerDay_1 = calculateLoggedHours[0].hoursPerDay;
                                                _29 = Helper_1["default"].calculateOvertime(hoursPerDay_1, totalLoggedHours), hours = _29.hours, minutes = _29.minutes, seconds = _29.seconds;
                                                console.log(hours + ":" + minutes + ":" + seconds);
                                                calculatedOvertime = hours + ":" + minutes + ":" + seconds;
                                                console.log("calculatedOvertime" + calculatedOvertime);
                                            }
                                            _30.label = 77;
                                        case 77:
                                            if (!(OrganizationId == 201958 ||
                                                OrganizationId == 126338 ||
                                                OrganizationId == 209694 ||
                                                OrganizationId == 206065 ||
                                                OrganizationId == 10)) return [3 /*break*/, 80];
                                            return [4 /*yield*/, Helper_1["default"].getAreaIdByUser(UserId)];
                                        case 78:
                                            areaId12 = _30.sent();
                                            return [4 /*yield*/, Helper_1["default"].getSettingByOrgId(OrganizationId)];
                                        case 79:
                                            outside_geofence_setting = _30.sent(); //disapprove_setting on h
                                            _30.label = 80;
                                        case 80:
                                            Geofencests = addonGeoFenceStst;
                                            if (!(areaId12 != 0 &&
                                                Geofencests == 1 &&
                                                outside_geofence_setting == "1")) return [3 /*break*/, 84];
                                            if (!(GeofenceOut == "")) return [3 /*break*/, 83];
                                            areaId1 = areaId12;
                                            return [4 /*yield*/, Helper_1["default"].getAreaInfo(areaId1)];
                                        case 81:
                                            areaId12 = _30.sent();
                                            lat = areaId12.lat;
                                            long = areaId12.long;
                                            radius = areaId12.radius;
                                            return [4 /*yield*/, Helper_1["default"].calculateDistance(lat, long, LatitudeIn, LongitudeIn, "'K'")];
                                        case 82:
                                            dis = _30.sent();
                                            if (dis <= radius) {
                                                if (GeofenceOut == "") {
                                                    GeofenceOut = "Within Geofence";
                                                }
                                            }
                                            else {
                                                if (GeofenceOut == "") {
                                                    GeofenceOut = "Outside Geofence";
                                                }
                                            }
                                            _30.label = 83;
                                        case 83:
                                            if (GeofenceOut == "Outside Geofence") {
                                                attendance_sts = 2;
                                                disappstatus = 2; //pending disaaprove
                                                disattreason = "Outside Geofence";
                                            }
                                            _30.label = 84;
                                        case 84: return [4 /*yield*/, AttendanceMaster_1["default"].query()
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
                                        case 85:
                                            updateResult = _30.sent();
                                            if (!((areaId12 != 0) && (Geofencests == 1) && (outside_geofence_setting == "1") && (GeofenceOut == "Outside Geofence"))) return [3 /*break*/, 88];
                                            empId = void 0;
                                            ShiftId1 = void 0;
                                            deptid1 = void 0;
                                            Desg_id1 = void 0;
                                            timein1 = void 0;
                                            timeout1 = void 0;
                                            TimeInDate1 = void 0;
                                            TimeOutDate1 = void 0;
                                            attdate = void 0;
                                            remarkfordisapprove = void 0;
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster").select("EmployeeId", "ShiftId", "Dept_id", "Desg_id", "TimeIn", "TimeOut", "timeindate", "timeoutdate", "AttendanceDate").where("Id", AttendanceMasterId).first()];
                                        case 86:
                                            getAttendanceData = _30.sent();
                                            if (getAttendanceData) {
                                                empId = getAttendanceData.EmployeeId;
                                                ShiftId1 = getAttendanceData.ShiftId;
                                                deptid1 = getAttendanceData.Dept_id;
                                                Desg_id1 = getAttendanceData.Desg_id;
                                                timein1 = getAttendanceData.TimeIn;
                                                timeout1 = getAttendanceData.TimeOut;
                                                TimeInDate1 = getAttendanceData.timeindate;
                                                TimeOutDate1 = getAttendanceData.timeoutdate;
                                                attdate = getAttendanceData.AttendanceDate;
                                            }
                                            empcode = "";
                                            empname = "";
                                            TimeInDate = attdate;
                                            disattreason = "Outside Geofence";
                                            disappstatus = 0;
                                            return [4 /*yield*/, Database_1["default"].table("Disapprove_approve").insert({
                                                    AttendanceId: AttendanceMasterId,
                                                    EmployeeId: UserId,
                                                    EmployeeCode: empcode,
                                                    EmployeeName: empname,
                                                    ShiftId: ShiftId1,
                                                    deptid: deptid1,
                                                    desgid: Desg_id1,
                                                    AttendanceDate: attdate,
                                                    OrganizationId: OrganizationId,
                                                    TimeIn: timein1,
                                                    TimeOut: timeout1,
                                                    TimeInDate: TimeInDate1,
                                                    TimeOutDate: TimeOutDate1,
                                                    disapprove_datetime: currentDate,
                                                    disapp_sts: disappstatus,
                                                    disapp_reason: disattreason,
                                                    disapp_remark: remarkfordisapprove
                                                })];
                                        case 87:
                                            insertDataOnDisapprovAtt = _30.sent();
                                            _30.label = 88;
                                        case 88:
                                            if (!((shiftType == "1" || shiftType == "2") &&
                                                MultipletimeStatus != 1)) return [3 /*break*/, 90];
                                            calculatedOvertime = "00:00:00";
                                            totalLoggedHours = "00:00:00";
                                            return [4 /*yield*/, Database_1["default"].from("AttendanceMaster as A")
                                                    .select("A.TimeIn as attTimeIn", "A.TimeOut as attTimeOut", "C.TimeIn as shiftTimeIn", "C.TimeOut as shiftTimeOut", Database_1["default"].raw("TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn)) as TotalLoggedHours"), Database_1["default"].raw("CASE WHEN (C.shifttype = 2) THEN SUBTIME(TIMEDIFF(CONCAT('2021-08-21', ' ', C.TimeOut), CONCAT('2021-08-20', ' ', C.TimeIn)), TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn))) ELSE SUBTIME(TIMEDIFF(A.TimeOut, A.TimeIn), TIMEDIFF(C.TimeOut, C.TimeIn)) END as overtime"))
                                                    .innerJoin("ShiftMaster as C", "C.Id", "=", "A.ShiftId")
                                                    .where("A.Id", AttendanceMasterId)
                                                    .first()];
                                        case 89:
                                            result_1 = _30.sent();
                                            if (result_1.length > 0) {
                                                totalLoggedHours = result_1.TotalLoggedHours;
                                                calculatedOvertime = result_1.overtime;
                                            }
                                            updateLoggedHour = Database_1["default"].from("AttendanceMaster")
                                                .where("Id", AttendanceMasterId)
                                                .update({
                                                TotalLoggedHours: totalLoggedHours,
                                                overtime: calculatedOvertime
                                            });
                                            _30.label = 90;
                                        case 90:
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
                                            _30.label = 91;
                                        case 91:
                                            j++;
                                            return [3 /*break*/, 1];
                                        case 92: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        // console.log(jsonData.length)
                        // console.log(jsonData[0]['2023-08-26'].interim.length)
                        // console.log('jsonlength')
                        _a.sent();
                        return [2 /*return*/, statusArray];
                }
            });
        });
    };
    return DailyAttendanceService;
}());
exports["default"] = DailyAttendanceService;
