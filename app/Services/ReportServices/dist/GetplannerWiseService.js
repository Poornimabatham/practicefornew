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
var _a = require("luxon"), Duration = _a.Duration, DateTime = _a.DateTime;
var moment = require("moment");
var GetplannerWiseSummary = /** @class */ (function () {
    function GetplannerWiseSummary() {
    }
    GetplannerWiseSummary.Getlannerwisesummary = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, Date2, b, fetchdatafromTimeOFFandAttendanceMaster, result, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentDate = a.attDen;
                        Date2 = currentDate.toFormat("yyyy-MM-dd");
                        return [4 /*yield*/, Helper_1["default"].getWeeklyOff(Date2, 1, a.userid, a.refno)];
                    case 1:
                        b = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("Timeoff as Toff")
                                .innerJoin("AttendanceMaster as AM", "Toff.TimeofDate", "AM.AttendanceDate")
                                .select("AM.AttendanceStatus", "AM.AttendanceDate", "Toff.Reason", "Toff.TimeofDate", "Toff.TimeTo", "AM.TimeIn", "AM.TimeOut", "AM.timeindate", "AM.timeoutdate", "AM.TimeOutApp", "Toff.EmployeeId as TEID", "AM.EmployeeId as AMEID", Database_1["default"].raw("(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(Timeoff_end, Timeoff_start)))) FROM Timeoff WHERE \n                Toff.EmployeeId = " + a.userid + " AND Toff.ApprovalSts != 2) AS timeoffhours"), "AM.ShiftId", "AM.TotalLoggedHours AS thours", Database_1["default"].raw("(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(TimeTo, TimeFrom)))) FROM Timeoff WHERE \n                Toff.EmployeeId = " + a.userid + " AND Toff.ApprovalSts != 2) AS bhour"), Database_1["default"].raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage"), Database_1["default"].raw("SUBSTRING_INDEX(ExitImage, '.com/', -1) AS ExitImage"), Database_1["default"].raw("CONCAT(LEFT(checkInLoc, 35), '...') AS checkInLoc"), Database_1["default"].raw("CONCAT(LEFT(CheckOutLoc, 35), '...') AS CheckOutLoc"), "latit_in", "longi_in", "latit_out", "longi_out", "multitime_sts")
                                .limit(2)
                                .where("AM.AttendanceDate", Date2)
                                .where("AM.AttendanceStatus", 1)];
                    case 2:
                        fetchdatafromTimeOFFandAttendanceMaster = _a.sent();
                        return [4 /*yield*/, fetchdatafromTimeOFFandAttendanceMaster];
                    case 3:
                        result = _a.sent();
                        res = [];
                        result.forEach(function (val) { return __awaiter(_this, void 0, void 0, function () {
                            var data, status, logged, time, subtimeLoggedhours, affectedRows, loggedHoursResult, selcthiftMasterId, affectedRows2, shiftin, shiftout, shiftType, hoursPerDay, shiftin1, shiftout1, startDateTime, endDateTime, Interval, HoursPerDay, halfInSeconds, halfvalue, hours, minutes, secs, timeString, formattedTime2, weekoff_sts, overtime, Selectovertime, affectedRows3, overtime1, selectOvertime, affectedRows4, overtime1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        data = {};
                                        data["AttendanceStatus"] = val.AttendanceStatus;
                                        status = data["AttendanceStatus"];
                                        data["AttendanceDate"] = val.AttendanceDate;
                                        data["loggedHours"] = val.thours;
                                        data["Reason"] = val.Reason;
                                        data["TimeTo"] = val.TimeTo;
                                        logged = data["loggedHours"];
                                        data["TimeIn"] = val.TimeIn;
                                        data["timeout"] = val.TimeOut;
                                        data["timeoutdate"] = moment(val.timeoutdate).format("YYYY-MM-DD");
                                        data["timeindate"] = moment(val.timeindate).format("YYYY-MM-DD");
                                        data["ShiftId"] = val.ShiftId;
                                        data["timeoffhours"] = val.timeoffhours;
                                        data["TimeOutApp"] = val.TimeOutApp;
                                        data["timeoffhours"] = val.timeoffhours;
                                        data["timeoutplatform"] = val.TimeOutApp;
                                        data["ShiftId"] = val.ShiftId;
                                        res.push(data);
                                        if (data["timeoffhours"] == null || data["timeoffhours"] == "") {
                                            data["timeoffhours"] = "00:00:00";
                                            time = data["timeoffhours"];
                                        }
                                        if (!(data["timeoffhours"] == "00:00:00")) return [3 /*break*/, 2];
                                        return [4 /*yield*/, Database_1["default"].rawQuery("SELECT SUBTIME( \"" + logged + "\",\"" + time + "\") AS Loggedhours")];
                                    case 1:
                                        subtimeLoggedhours = _a.sent();
                                        affectedRows = subtimeLoggedhours[0];
                                        if (affectedRows.length > 0) {
                                            loggedHoursResult = affectedRows[0].Loggedhours;
                                        }
                                        _a.label = 2;
                                    case 2:
                                        selcthiftMasterId = Database_1["default"].from("ShiftMaster")
                                            .where("Id", 36)
                                            .select("TimeIn", "TimeOut", "shifttype", "HoursPerDay");
                                        return [4 /*yield*/, selcthiftMasterId.first()];
                                    case 3:
                                        affectedRows2 = _a.sent();
                                        if (affectedRows2) {
                                            shiftin = affectedRows2.TimeIn;
                                            shiftout = affectedRows2.TimeOut;
                                            shiftType = affectedRows2.shifttype;
                                            hoursPerDay = affectedRows2.HoursPerDay;
                                            if (hoursPerDay === "00:00:00" ||
                                                hoursPerDay !== "" ||
                                                hoursPerDay === null) {
                                                shiftin1 = shiftin;
                                                shiftout1 = shiftout;
                                                startDateTime = DateTime.fromFormat(shiftin1, "HH:mm:ss");
                                                endDateTime = DateTime.fromFormat(shiftout1, "HH:mm:ss");
                                                Interval = Duration.fromMillis(endDateTime.diff(startDateTime).as("milliseconds"));
                                                HoursPerDay = Interval.toFormat("hh:mm:ss");
                                            }
                                        }
                                        if (status == 4 || status == 1) {
                                            halfInSeconds = Duration.fromISOTime(HoursPerDay).as("seconds");
                                            halfvalue = halfInSeconds / 2;
                                            hours = Math.floor(halfvalue / 3600);
                                            minutes = Math.floor((halfvalue % 3600) / 60);
                                            secs = halfvalue % 60;
                                            timeString = hours.toString().padStart(2, "0") + ":" + minutes
                                                .toString()
                                                .padStart(2, "0") + ":" + secs.toString().padStart(2, "0");
                                            formattedTime2 = DateTime.fromFormat(timeString, "H:m:s").toFormat("hh:mm:ss");
                                        }
                                        weekoff_sts = "WO";
                                        if (!(val.TimeOut !== "00:00:00")) return [3 /*break*/, 13];
                                        if (!(shiftType == 1)) return [3 /*break*/, 7];
                                        data["thours"] = logged;
                                        if (!(weekoff_sts == "WaO" || weekoff_sts == "H")) return [3 /*break*/, 4];
                                        overtime = logged;
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, Database_1["default"].rawQuery("SELECT SUBTIME( \"" + logged + "\",\"" + HoursPerDay + "\") AS Overtime")];
                                    case 5:
                                        Selectovertime = _a.sent();
                                        affectedRows3 = Selectovertime;
                                        if (affectedRows3.length > 0) {
                                            overtime1 = affectedRows3[0].Overtime;
                                        }
                                        _a.label = 6;
                                    case 6: return [3 /*break*/, 12];
                                    case 7:
                                        if (!(shiftType == 1)) return [3 /*break*/, 11];
                                        data["thours"] = logged;
                                        if (!(weekoff_sts == "WO" || weekoff_sts == "H")) return [3 /*break*/, 8];
                                        overtime1 = logged;
                                        return [3 /*break*/, 10];
                                    case 8: return [4 /*yield*/, Database_1["default"].rawQuery("SELECT SUBTIME( \"" + logged + "\",\"" + HoursPerDay + "\") AS Overtime")];
                                    case 9:
                                        selectOvertime = _a.sent();
                                        affectedRows4 = selectOvertime;
                                        if (affectedRows4.length > 0) {
                                            overtime1 = affectedRows4[0].Overtime;
                                        }
                                        _a.label = 10;
                                    case 10: return [3 /*break*/, 12];
                                    case 11:
                                        overtime1 = "00:00:00";
                                        _a.label = 12;
                                    case 12: return [3 /*break*/, 14];
                                    case 13:
                                        data["thours"] = "00:00:00";
                                        if (weekoff_sts == "WO" || weekoff_sts == "H") {
                                            overtime1 = logged;
                                        }
                                        else {
                                            overtime1 = "00:00:00";
                                        }
                                        _a.label = 14;
                                    case 14:
                                        data["shiftin"] = shiftin1;
                                        data["shiftout"] = shiftout1;
                                        data["EntryImage"] = "-";
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return GetplannerWiseSummary;
}());
exports["default"] = GetplannerWiseSummary;
