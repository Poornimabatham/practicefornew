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
var _a = require("luxon"), Duration = _a.Duration, DateTime = _a.DateTime;
var Helper_1 = require("App/Helper/Helper");
var moment = require("moment");
var GetplannerWiseSummary = /** @class */ (function () {
    function GetplannerWiseSummary() {
    }
    GetplannerWiseSummary.Getlannerwisesummary = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, loggedHours, hoursPerDay, shiftin, shiftout, overtime, overtime1, shiftType, weekoff_sts, ShiftId, AttendanceDate, fetchdatafromTimeOFFandAttendanceMaster, result, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentDate = a.attDen;
                        loggedHours = "00:00:00";
                        hoursPerDay = "00:00:00";
                        shiftin = "00:00:00";
                        shiftout = "00:00:00";
                        AttendanceDate = currentDate.toFormat("yyyy-MM-dd");
                        return [4 /*yield*/, Database_1["default"].from("Timeoff as Toff")
                                .innerJoin("AttendanceMaster as AM", "Toff.TimeofDate", "AM.AttendanceDate")
                                .select("Toff.Id", "AM.AttendanceStatus", "AM.AttendanceDate", "Toff.Reason", "Toff.TimeofDate", "Toff.TimeTo", "AM.TimeIn", "AM.TimeOut", "AM.timeindate", "AM.timeoutdate", "AM.TimeOutApp", "Toff.EmployeeId as TEID", "AM.EmployeeId as AMEID", Database_1["default"].raw("(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(Timeoff_end, Timeoff_start)))) FROM Timeoff WHERE \n          Toff.TimeofDate = AM.AttendanceDate AND Toff.EmployeeId = " + a.userid + " AND Toff.ApprovalSts = 2) AS timeoffhours"), "AM.ShiftId", "AM.TotalLoggedHours AS thours", Database_1["default"].raw("(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(TimeTo, TimeFrom)))) FROM Timeoff WHERE \n                Toff.EmployeeId = " + a.userid + " AND  Toff.TimeofDate = AM.AttendanceDate AND Toff.ApprovalSts = 2) AS bhour"), Database_1["default"].raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage"), Database_1["default"].raw("SUBSTRING_INDEX(ExitImage, '.com/', -1) AS ExitImage"), Database_1["default"].raw("CONCAT(LEFT(checkInLoc, 35), '...') AS checkInLoc"), Database_1["default"].raw("CONCAT(LEFT(CheckOutLoc, 35), '...') AS CheckOutLoc"), "latit_in", "longi_in", "latit_out", "longi_out", "multitime_sts").where('AM.EmployeeId', a.userid)
                                .andWhereIn("AM.AttendanceStatus", [1, 3, 5, 4, 8, 10])
                                .andWhere("AM.AttendanceDate", AttendanceDate)];
                    case 1:
                        fetchdatafromTimeOFFandAttendanceMaster = _a.sent();
                        result = fetchdatafromTimeOFFandAttendanceMaster;
                        res = [];
                        return [4 /*yield*/, Promise.all(result.map(function (val) { return __awaiter(_this, void 0, void 0, function () {
                                var data, datetimeString, datetimeString2, dateTime1, Time1, dateTime, Time2, Interval, startDateTime, endDateTime, time, subtimeLoggedhours, selcthiftMasterId, shiftin1, shiftout1, startDateTime, endDateTime, Interval1, halfInSeconds, halfvalue, hours, minutes, secs, timeString, userid, orgidid, bhour, date, _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            data = {};
                                            data["AttendanceStatus"] = val.AttendanceStatus;
                                            data["TimeIn"] = val.TimeIn;
                                            data["TimeOut"] = val.TimeOut;
                                            data["timeoutdate"] = moment(val.timeoutdate).format("YYYY-MM-DD");
                                            data["timeindate"] = moment(val.timeindate).format("YYYY-MM-DD");
                                            data["AttendanceDate"] = val.AttendanceDate;
                                            data["loggedHours"] = val.thours;
                                            data["ShiftId"] = val.ShiftId;
                                            ShiftId = data["ShiftId"];
                                            if (loggedHours == "00:00:00" ||
                                                loggedHours != "" ||
                                                loggedHours == null) {
                                                datetimeString = data["timeindate"] + " " + data["TimeIn"];
                                                datetimeString2 = data["timeoutdate"] + " " + data["TimeOut"];
                                                dateTime1 = DateTime.fromFormat(datetimeString, "yyyy-MM-dd HH:mm:ss");
                                                Time1 = dateTime1.toFormat("HH:mm:ss");
                                                dateTime = DateTime.fromFormat(datetimeString2, "yyyy-MM-dd HH:mm:ss");
                                                Time2 = dateTime.toFormat("HH:mm:ss");
                                                startDateTime = void 0;
                                                endDateTime = void 0;
                                                if (Time1 > Time2) {
                                                    startDateTime = DateTime.fromFormat(Time1, "HH:mm:ss");
                                                    endDateTime = DateTime.fromFormat(Time2, "HH:mm:ss");
                                                    Interval = Duration.fromMillis(endDateTime.diff(startDateTime).as("milliseconds"));
                                                }
                                                else {
                                                    startDateTime = DateTime.fromFormat(Time1, "HH:mm:ss");
                                                    endDateTime = DateTime.fromFormat(Time2, "HH:mm:ss");
                                                    Interval = Duration.fromMillis(endDateTime.diff(startDateTime).as("milliseconds"));
                                                }
                                                loggedHours = Interval.toFormat("hh:mm:ss");
                                                data["loggedHours"] = loggedHours;
                                            }
                                            data["timeoffhours"] = val.timeoffhours;
                                            if (data["timeoffhours"] == null || data["timeoffhours"] == "") {
                                                data["timeoffhours"] = "00:00:00";
                                                time = data["timeoffhours"];
                                            }
                                            if (!(data["timeoffhours"] != "00:00:00")) return [3 /*break*/, 2];
                                            return [4 /*yield*/, Database_1["default"].rawQuery("SELECT SUBTIME( \"" + loggedHours + "\",\"" + time + "\") AS Loggedhours")];
                                        case 1:
                                            subtimeLoggedhours = _c.sent();
                                            if (subtimeLoggedhours.length > 0) {
                                                loggedHours = subtimeLoggedhours[0][0].Loggedhours;
                                                data["loggedHours"] = loggedHours;
                                            }
                                            _c.label = 2;
                                        case 2:
                                            data["timeoutplatform"] = val.TimeOutApp;
                                            return [4 /*yield*/, Database_1["default"].from("ShiftMaster")
                                                    .where("Id", ShiftId)
                                                    .select("TimeIn", "TimeOut", "shifttype", "HoursPerDay")];
                                        case 3:
                                            selcthiftMasterId = _c.sent();
                                            if (selcthiftMasterId.length > 0) {
                                                shiftin = selcthiftMasterId[0].TimeIn;
                                                shiftout = selcthiftMasterId[0].TimeOut;
                                                shiftType = selcthiftMasterId[0].shifttype;
                                                hoursPerDay = selcthiftMasterId[0].HoursPerDay;
                                                if (hoursPerDay == "00:00:00" ||
                                                    hoursPerDay == "" ||
                                                    hoursPerDay == null) {
                                                    shiftin1 = shiftin;
                                                    shiftout1 = shiftout;
                                                    startDateTime = DateTime.fromFormat(shiftin1, "HH:mm:ss");
                                                    endDateTime = DateTime.fromFormat(shiftout1, "HH:mm:ss");
                                                    Interval1 = Duration.fromMillis(endDateTime.diff(startDateTime).as("milliseconds"));
                                                    hoursPerDay = Interval1.toFormat("hh:mm:ss");
                                                    data["HoursPerDay"] = hoursPerDay;
                                                }
                                            }
                                            if (data["AttendanceStatus"] == 4 ||
                                                data["AttendanceStatus"] == 10 ||
                                                data["AttendanceStatus"] == 1) {
                                                halfInSeconds = Duration.fromISOTime(hoursPerDay).as("seconds");
                                                halfvalue = halfInSeconds / 2;
                                                hours = Math.floor(halfvalue / 3600);
                                                minutes = Math.floor((halfvalue % 3600) / 60);
                                                secs = halfvalue % 60;
                                                timeString = hours.toString().padStart(2, "0") + ":" + minutes
                                                    .toString()
                                                    .padStart(2, "0") + ":" + secs.toString().padStart(2, "0");
                                                hoursPerDay = DateTime.fromFormat(timeString, "H:m:s").toFormat("hh:mm:ss");
                                            }
                                            userid = a.userid;
                                            orgidid = a.refno;
                                            return [4 /*yield*/, Helper_1["default"].getWeeklyOff(AttendanceDate, ShiftId, userid, orgidid)];
                                        case 4:
                                            weekoff_sts = _c.sent();
                                            if (!(val.TimeOut != "00:00:00")) return [3 /*break*/, 18];
                                            if (!(shiftType == 3)) return [3 /*break*/, 8];
                                            data["thours"] = loggedHours;
                                            if (!(weekoff_sts == "WO" || weekoff_sts == "H")) return [3 /*break*/, 5];
                                            overtime1 = loggedHours;
                                            return [3 /*break*/, 7];
                                        case 5: return [4 /*yield*/, Database_1["default"].rawQuery("SELECT SUBTIME( \"" + loggedHours + "\",\"" + hoursPerDay + "\") AS Overtime")];
                                        case 6:
                                            overtime = _c.sent();
                                            if (overtime.length > 0) {
                                                overtime1 = overtime[0][0];
                                            }
                                            _c.label = 7;
                                        case 7: return [3 /*break*/, 17];
                                        case 8:
                                            if (!(shiftType == 1)) return [3 /*break*/, 12];
                                            data["thours"] = loggedHours;
                                            if (!(weekoff_sts == "WO" || weekoff_sts == "H")) return [3 /*break*/, 9];
                                            overtime1 = loggedHours;
                                            return [3 /*break*/, 11];
                                        case 9: return [4 /*yield*/, Database_1["default"].rawQuery("SELECT SUBTIME( \"" + loggedHours + "\",\"" + hoursPerDay + "\") AS Overtime")];
                                        case 10:
                                            overtime = _c.sent();
                                            if (overtime.length > 0) {
                                                overtime1 = overtime[0][0];
                                            }
                                            _c.label = 11;
                                        case 11: return [3 /*break*/, 17];
                                        case 12:
                                            if (!(shiftType == 1)) return [3 /*break*/, 16];
                                            data["thours"] = loggedHours;
                                            if (!(weekoff_sts == "WO" || weekoff_sts == "H")) return [3 /*break*/, 13];
                                            overtime1 = loggedHours;
                                            return [3 /*break*/, 15];
                                        case 13: return [4 /*yield*/, Database_1["default"].rawQuery("SELECT SUBTIME( \"" + loggedHours + "\",\"" + hoursPerDay + "\") AS Overtime")];
                                        case 14:
                                            overtime = _c.sent();
                                            if (overtime.length > 0) {
                                                overtime1 = overtime[0][0];
                                            }
                                            _c.label = 15;
                                        case 15: return [3 /*break*/, 17];
                                        case 16:
                                            overtime1 = "00:00:00";
                                            _c.label = 17;
                                        case 17: return [3 /*break*/, 19];
                                        case 18:
                                            data["thours"] = "00:00:00";
                                            if (weekoff_sts == "WO" || weekoff_sts == "H") {
                                                overtime1 = "04:00:00";
                                            }
                                            else {
                                                overtime1 = "00:00:00";
                                            }
                                            _c.label = 19;
                                        case 19:
                                            data["hoursPerDay"] = hoursPerDay;
                                            data["shiftin"] = shiftin;
                                            data["shiftout"] = shiftout;
                                            data["EntryImage"] = "-";
                                            if (val.EntryImage != "") {
                                                data["EntryImage"] = val.EntryImage;
                                            }
                                            data["ExitImage"] = "-";
                                            if (val.ExitImage != "") {
                                                data["ExitImage"] = val.ExitImage;
                                            }
                                            if (val.bhour != null || val.bhour != "") {
                                                bhour = val.bhour;
                                            }
                                            data["checkInLoc"] = "-";
                                            if (val.checkInLoc != "") {
                                                data["checkInLoc"] = val.checkInLoc;
                                            }
                                            data["CheckOutLoc"] = "-";
                                            if (val.CheckOutLoc != "") {
                                                data["CheckOutLoc"] = val.CheckOutLoc;
                                            }
                                            data["latit_in"] = 0;
                                            if (val.latit_in != "") {
                                                data["latit_in"] = val.latit_in;
                                            }
                                            data["latit_out"] = 0;
                                            if (val.atit_out != "") {
                                                data["latit_out"] = val.latit_out;
                                            }
                                            data["longi_in"] = 0;
                                            if (val.latit_out != "") {
                                                data["longi_in"] = val.longi_in;
                                            }
                                            data["longi_out"] = "-";
                                            if (val.longi_out != "") {
                                                data["longi_out"] = val.longi_out;
                                            }
                                            data["overtime"] = overtime1;
                                            data["bhour"] = bhour;
                                            data["plateform"] = "-";
                                            if (data["timeoutplatform"] == "") {
                                                data["plateform"] = data["timeoutplatform"];
                                            }
                                            date = new Date(val.AttendanceDate);
                                            data["AttendanceDate"] = moment(date).format("YYYY/MM/DD");
                                            data["AttendanceMasterId"] = val.Id;
                                            data["AttendanceStatus"] = val.AttendanceStatus;
                                            data["MultipletimeStatus"] = val.multitime_sts;
                                            if (val.multitime_sts == 1 && shiftType != 3) {
                                                data["shifttype"] = 1;
                                            }
                                            _a = data;
                                            _b = "getInterimAttAvailableSts";
                                            return [4 /*yield*/, Helper_1["default"].getInterimAttAvailableSt(val.Id)];
                                        case 20:
                                            _a[_b] =
                                                _c.sent();
                                            res.push(data);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return GetplannerWiseSummary;
}());
exports["default"] = GetplannerWiseSummary;
