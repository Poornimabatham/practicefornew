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
var DateTime = require("luxon").DateTime;
var dayjs = require("dayjs");
var moment = require('moment');
var GetplannerWiseSummary = /** @class */ (function () {
    function GetplannerWiseSummary() {
    }
    GetplannerWiseSummary.Getlannerwisesummary = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, Date2, overtime, overtime1, overtime3, loggedHours, shiftin, shiftout, weekoff_sts, bhour, fetchdatafromTimeOFFandAttendanceMaster, result, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentDate = a.attDen;
                        Date2 = currentDate.toFormat("yyyy-MM-dd");
                        overtime = "";
                        overtime1 = "";
                        overtime3 = "";
                        loggedHours = "00:00:00";
                        shiftin = "";
                        shiftout = "";
                        weekoff_sts = "-";
                        bhour = "00:00:00";
                        return [4 /*yield*/, Database_1["default"].from("Timeoff as Toff")
                                .innerJoin("AttendanceMaster as AM", "Toff.TimeofDate", "AM.AttendanceDate")
                                .select("AM.AttendanceDate", "Toff.Reason", "Toff.TimeofDate", "Toff.TimeTo", "AM.TimeIn", "AM.TimeOut", "AM.timeindate", "AM.timeoutdate", "AM.TimeOutApp", "Toff.EmployeeId as TEID", "AM.EmployeeId as AMEID", Database_1["default"].raw("(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(Timeoff_end, Timeoff_start)))) FROM Timeoff WHERE \n             Timeoff.EmployeeId = " + a.userid + " AND Timeoff.ApprovalSts = 2) AS timeoffhours"), "AM.ShiftId", "AM.TotalLoggedHours AS thours", Database_1["default"].raw("(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(TimeTo, TimeFrom)))) FROM Timeoff WHERE \n                Timeoff.EmployeeId = " + a.userid + " AND Timeoff.ApprovalSts = 2) AS bhour"), Database_1["default"].raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage"), Database_1["default"].raw("SUBSTRING_INDEX(ExitImage, '.com/', -1) AS ExitImage"), Database_1["default"].raw("CONCAT(LEFT(checkInLoc, 35), '...') AS checkInLoc"), Database_1["default"].raw("CONCAT(LEFT(CheckOutLoc, 35), '...') AS CheckOutLoc"), "latit_in", "longi_in", "latit_out", "longi_out", "multitime_sts").limit(2)
                                // .andWhere('AM.EmployeeId',a.userid)
                                // .andWhere('AM.AttendanceDate',Date2)
                                .whereIn("AM.AttendanceStatus", [1, 3, 5, 4, 8, 10])];
                    case 1:
                        fetchdatafromTimeOFFandAttendanceMaster = _a.sent();
                        return [4 /*yield*/, fetchdatafromTimeOFFandAttendanceMaster];
                    case 2:
                        result = _a.sent();
                        console.log(result);
                        res = [];
                        result.forEach(function (val) {
                            var data = {};
                            data["AttendanceDate"] = val.AttendanceDate;
                            data["loggedHours"] = val.thours;
                            var logged = data["loggedHours"];
                            data["timein"] = val.TimeIn;
                            data["timeout"] = val.TimeOut;
                            data["timeindate"] = val.timeindate;
                            data["AttendanceDate"] = moment(val.timeindate).utcOffset("Asia/Kolkata").format('YYYY-MM-DD');
                            data["timeoutdate"] = val.timeoutdate;
                            // if(data['loggedHours'] == '00:00:00' || data['loggedHours'] != '' || data['loggedHours'] ==null){
                            // const timeinn= 	data['timeindate']+data['timein'];
                            //  const timeoutt=data['timeoutdate']+data['timeout'];
                            //  console.log(timeinn)
                            //  console.log(timeoutt)
                            //  const parsedDate = DateTime.fromFormat(timeinn, "EEE MMM dd yyyy HH:mm:ss 'GMT'Z (z)ZZZZZ")
                            // console.log(parsedDate.toJSDate()); // 
                            //  var a ;
                            //   var difference ;
                            //   var differenceInHours;
                            // // if(timeinn>timeoutt){
                            //   // Calculate the difference between the two dates
                            //   difference = date2.diff(date1);
                            //   // Get the difference in hours
                            //    differenceInHours = difference.as('hours');
                            // }
                            // else{
                            //   difference = date2.diff(date1);
                            //   // Get the difference in hours
                            //    differenceInHours = difference.as('hours');
                            // }
                            // }
                            data['timeoffhours'] = val.timeoffhours;
                            if (data['timeoffhours'] == null || data['timeoffhours'] == '') {
                                data['timeoffhours'] = '12:00:00';
                                var time = data['timeoffhours'];
                            }
                            // if(data['timeoffhours'] != '00:00:00'){
                            //   var  queryResult =   Database.raw(
                            //     `SELECT SUBTIME( ${logged},${time}) AS latehours`
                            //   );
                            // res.push(queryResult)
                            // const row111 =queryResult;
                            // // if (row111.length > 0) {
                            // //   const loggedHoursResult = row111[0].Loggedhours;
                            // //   res.push(loggedHours)
                            // // }
                            var queryReslt2 = Database_1["default"].raw("SELECT SUBTIME  (\"" + logged + "\",\"" + time + "\" )   AS latehours");
                            //return queryReslt2;
                            //var result = await queryReslt2;
                            console.log(queryReslt2);
                            // data['timeoutplatform'] = val.TimeOutApp
                            // data['ShiftId'] = val.ShiftId
                            // const queryResult = Database.from('ShiftMaster').where('Id',8).select('TimeIn', 'TimeOut', 
                            // 'shifttype',
                            // 'HoursPerDay');
                            // res.push(queryResult)
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return GetplannerWiseSummary;
}());
exports["default"] = GetplannerWiseSummary;
