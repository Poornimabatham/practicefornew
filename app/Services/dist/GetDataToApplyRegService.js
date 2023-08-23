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
var moment_1 = require("moment");
var Database_1 = require("@ioc:Adonis/Lucid/Database");
var DateTime = require("luxon").DateTime;
var format = require("date-fns/format");
var parseISO = require("date-fns/parseISO");
var GetDataToRegService = /** @class */ (function () {
    function GetDataToRegService() {
    }
    GetDataToRegService.FetchingdatatoReg = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var count, status, currentMonth, currentMonth_1, MinTimes, MaxDays, Regularizecount, regularizationsettingsts, selectRegularizationSettings, row, regularizeCount, affected_rows, query, attendanceData, attendancearr, result, monthDate, formattedMonth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        count = 0;
                        status = false;
                        currentMonth = moment_1["default"]().endOf("month").format("YYYY-MM-DD");
                        if (data.month != "null" || data.month != undefined) {
                            currentMonth_1 = moment_1["default"](data.month).format("YYYY-MM-DD");
                        }
                        MinTimes = "";
                        MaxDays = 0;
                        Regularizecount = 0;
                        regularizationsettingsts = 0;
                        return [4 /*yield*/, Database_1["default"].from("RegularizationSettings")
                                .select("MaxDays", "MinTimes")
                                .where("OrganizationId", data.orgid)
                                .where("RegularizationSts", 1)
                                .first()];
                    case 1:
                        selectRegularizationSettings = _a.sent();
                        row = selectRegularizationSettings;
                        count = row ? 1 : 0;
                        if (count >= 1) {
                            regularizationsettingsts = 1;
                            if (row) {
                                MaxDays = row.MaxDays;
                                MinTimes = row.MinTimes;
                            }
                        }
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .where("OrganizationId", 1074)
                                .whereNot("Is_Delete", 1)
                                .where("EmployeeId", 7294)
                                .whereRaw("MONTH(AttendanceDate) = MONTH('" + currentMonth + "')")
                                .whereNot("AttendanceDate", Database_1["default"].raw("CURDATE()"))
                                .whereNotIn("RegularizeSts", [0, 1])
                                .count("RegularizeSts as Regularizecount")];
                    case 2:
                        regularizeCount = _a.sent();
                        affected_rows = regularizeCount.length;
                        if (affected_rows) {
                            Regularizecount = regularizeCount[0].Regularizecount;
                        }
                        query = Database_1["default"].from("AttendanceMaster")
                            .select("Id", "AttendanceStatus", "AttendanceDate", "device", "TimeIn", "TimeOut")
                            .where("OrganizationId", 10)
                            .whereNot("Is_Delete", 1)
                            .whereIn("device", ["Auto Time Out", "Absentee Cron"])
                            .orWhere(function (query) {
                            query
                                .where("device", "Cron")
                                .where("AttendanceStatus", 8)
                                .where("TimeIn", "00:00:00")
                                .where("TimeOut", "00:00:00");
                        })
                            .orWhere(function (query) {
                            query.where("device", "Cron").whereIn("AttendanceStatus", [4, 10]);
                        })
                            .andWhere(function (query) {
                            query
                                .where("TimeIn", Database_1["default"].raw("TimeOut"))
                                .orWhere("TimeOut", "00:00:00");
                        })
                            .andWhere("EmployeeId", data.uid)
                            .whereRaw("MONTH(AttendanceDate) = MONTH('" + currentMonth + "')")
                            .whereRaw("YEAR(AttendanceDate) = YEAR('" + currentMonth + "')")
                            .whereNot("AttendanceDate", Database_1["default"].raw("CURDATE()"))
                            .whereIn("RegularizeSts", [0, 1])
                            .orderBy("AttendanceDate", "desc")
                            .limit(2);
                        return [4 /*yield*/, query];
                    case 3:
                        attendanceData = _a.sent();
                        console.log(attendanceData);
                        attendancearr = [];
                        attendanceData.forEach(function (row) {
                            var res1 = {};
                            res1["id"] = row.Id;
                            res1["sts"] = row.AttendanceStatus;
                            res1["device"] = row.device;
                            var timeIn = row.TimeIn === "00:00:00"
                                ? "00:00"
                                : new Date("1970-01-01T" + row.TimeIn + "Z").toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false
                                });
                            res1["timeIn"] = timeIn;
                            var timeOut = row.TimeOut === "00:00:00"
                                ? "00:00"
                                : new Date("1970-01-01T" + row.TimeOut + "Z").toISOString().substr(11, 5);
                            res1["timeOut"] = timeOut;
                            var date1 = new Date(row.AttendanceDate);
                            res1["date1"] = date1;
                            var date2 = new Date();
                            res1["date2"] = date2;
                            var diffInMilliseconds = date2 - date1;
                            // Calculate the difference in days
                            var diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
                            res1["diffInDays"] = diffInDays;
                            if (MaxDays != 0) {
                                if (MaxDays != 0) {
                                    res1["resultsts"] = 0;
                                }
                                else {
                                    res1["resultsts"] = 1;
                                }
                            }
                            else {
                                res1["resultsts"] = 1;
                            }
                            if (MinTimes != undefined) {
                                if (Regularizecount < parseInt(MinTimes)) {
                                    res1["Regularizessts"] = 1;
                                }
                                else {
                                    res1["Regularizessts"] = 0;
                                }
                            }
                            else {
                                res1["Regularizessts"] = 1;
                            }
                            attendancearr.push(res1);
                        });
                        result = {};
                        status = true;
                        monthDate = parseISO(currentMonth);
                        formattedMonth = format(monthDate, "MMMM yyyy");
                        result["month"] = formattedMonth;
                        result["Regularizecountdone"] = Regularizecount;
                        result["TotalRegularizecount"] = MinTimes;
                        result["regularizationsettingsts"] = regularizationsettingsts;
                        result["status"] = status;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    GetDataToRegService.FetchRegularizationCount = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orgId, id, month, month1, AttendanceMaster, row1, data2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgId = data.orgid;
                        id = data.uid;
                        month = data.month;
                        if (month != undefined) {
                            month1 = new Date(data.month);
                            month = moment_1["default"](month1).format("yyyy-MM-DD");
                        }
                        else {
                            month = moment_1["default"]().format("yyyy-MM-DD");
                        }
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .select(Database_1["default"].raw("(SELECT MinTimes FROM RegularizationSettings WHERE OrganizationId = " + orgId + " and RegularizationSts = 1) as MinTimes"), Database_1["default"].raw("count(RegularizeSts) as Regularizecount"))
                                .where("OrganizationId", orgId)
                                .whereNot("Is_Delete", 1)
                                .where("EmployeeId", id)
                                .whereRaw("Month(AttendanceDate) = Month(?)", [month])
                                .whereRaw("Year(AttendanceDate) = Year(?)", [month])
                                .whereRaw("AttendanceDate != CURDATE()")
                                .whereNotIn("RegularizeSts", [0, 1])
                                .orderBy("AttendanceDate", "desc")];
                    case 1:
                        AttendanceMaster = _a.sent();
                        row1 = AttendanceMaster[0];
                        data2 = {
                            MinTimes: row1 ? parseInt(row1.MinTimes) : 0,
                            Regularizecount: row1 ? parseInt(row1.Regularizecount) : 0
                        };
                        return [2 /*return*/, data2];
                }
            });
        });
    };
    return GetDataToRegService;
}());
exports["default"] = GetDataToRegService;
