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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var moment_1 = require("moment");
var Database_1 = require("@ioc:Adonis/Lucid/Database");
var Helper_1 = require("App/Helper/Helper");
var DateTime = require("luxon").DateTime;
var GetDataToRegService = /** @class */ (function () {
    function GetDataToRegService() {
    }
    GetDataToRegService.FetchingdatatoReg = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var count, status, currentMonth, month1, Regularizecount, selectRegularizationSettings, results, count1, regularizationsettingsts, MaxDays, MinTimes, regularizeCount, affected_rows, selectAttendancemasterList, attendanceData, attendancearr, result, parsedDate, formattedDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        count = 0;
                        status = false;
                        currentMonth = data.month;
                        if (data.month != undefined) {
                            month1 = new Date(data.month);
                            currentMonth = moment_1["default"](month1).format("yyyy-MM-DD");
                        }
                        else {
                            currentMonth = moment_1["default"]().format("yyyy-MM-DD");
                        }
                        Regularizecount = 0;
                        return [4 /*yield*/, Database_1["default"].from("RegularizationSettings")
                                .select("MaxDays", "MinTimes")
                                .where("OrganizationId", data.orgid)
                                .where("RegularizationSts", 1)];
                    case 1:
                        selectRegularizationSettings = _a.sent();
                        return [4 /*yield*/, selectRegularizationSettings];
                    case 2:
                        results = _a.sent();
                        count1 = results.length;
                        regularizationsettingsts = 0;
                        MaxDays = 0;
                        MinTimes = 0;
                        if (count1 >= 1) {
                            regularizationsettingsts = 1;
                            MaxDays = results[0].MaxDays;
                            MinTimes = results[0].MinTimes;
                        }
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .where("OrganizationId", data.orgid)
                                .andWhereNot("Is_Delete", 1)
                                .andWhere("EmployeeId", data.uid)
                                .whereRaw("MONTH(AttendanceDate) = MONTH('{currentMonth}')")
                                .andWhere("AttendanceDate", Database_1["default"].raw("CURDATE()"))
                                .andWhere(Database_1["default"].raw(" (\"RegularizeSts\" = 0 OR \"RegularizeSts\" = 1)\n      "))
                                .orderBy(" AttendanceDate", "desc")
                                .count("RegularizeSts as Regularizecount")];
                    case 3:
                        regularizeCount = _a.sent();
                        affected_rows = regularizeCount.length;
                        if (affected_rows) {
                            Regularizecount = regularizeCount[0].Regularizecount;
                        }
                        selectAttendancemasterList = Database_1["default"].from("AttendanceMaster")
                            .select("Id", "AttendanceStatus", "AttendanceDate", "device", "TimeIn", "TimeOut")
                            .where("OrganizationId", data.orgid)
                            .andWhereNot("Is_Delete", 1)
                            .andWhere(Database_1["default"].raw("((device ='Auto Time Out'  and (TimeIn=TimeOut or TimeOut='00:00:00')) or \n      (device ='Absentee Cron' and  TimeIn='00:00:00' and TimeOut='00:00:00') or \n      (device ='Cron' and  TimeIn='00:00:00' and TimeOut='00:00:00' and AttendanceStatus=8) or \n      (device ='Cron' and  (TimeIn=TimeOut or TimeOut='00:00:00') and AttendanceStatus in (4,10))) "))
                            .andWhere("EmployeeId", data.uid)
                            .whereRaw("MONTH(AttendanceDate) = MONTH('{currentMonth}')")
                            .andWhereRaw("YEAR(AttendanceDate) = YEAR('{currentMonth}')")
                            .andWhereNot("AttendanceDate", Database_1["default"].raw("CURDATE()"))
                            .andWhere(Database_1["default"].raw(" (\"RegularizeSts\" = 0 OR \"RegularizeSts\" = 1)\n      "))
                            .orderBy("AttendanceDate", "desc");
                        return [4 /*yield*/, selectAttendancemasterList];
                    case 4:
                        attendanceData = _a.sent();
                        attendancearr = [];
                        attendanceData.forEach(function (row) {
                            var res1 = {};
                            res1["id"] = row.Id;
                            res1["sts"] = row.AttendanceStatus;
                            var date = new Date(row.AttendanceDate);
                            res1["AttendanceDate"] = moment_1["default"](date).format("YYYY/MM/DD");
                            res1["device"] = row.device;
                            var timeIn = row.TimeIn == "00:00:00"
                                ? "00:00"
                                : DateTime.fromSQL(row.TimeIn).toFormat("HH:mm");
                            res1["timeIn"] = timeIn;
                            var timeOut = row.TimeOut == "00:00:00"
                                ? "00:00"
                                : DateTime.fromSQL(row.TimeOut).toFormat("HH:mm");
                            res1["timeOut"] = timeOut;
                            var date1 = new Date(row.AttendanceDate);
                            // res1["date1"] = moment(date1).format("YYYY/MM/DD");
                            var date2 = new Date();
                            // res1["date2"] = moment(date2).format("YYYY/MM/DD")
                            var diffInMilliseconds = date2 - date1;
                            // Calculate the difference in days
                            var diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
                            // res1["diffInDays"] = diffInDays;
                            if (MaxDays != 0) {
                                if (diffInDays > MaxDays) {
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
                                if (Regularizecount < MinTimes) {
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
                        parsedDate = DateTime.fromISO(currentMonth);
                        formattedDate = parsedDate.toFormat("MMMM yyyy");
                        result["month"] = formattedDate;
                        result["data"] = attendancearr;
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
                                .select(Database_1["default"].raw("(SELECT MinTimes FROM RegularizationSettings WHERE OrganizationId = " + orgId + " and RegularizationSts = 1)\n           as MinTimes"), Database_1["default"].raw("count(RegularizeSts) as Regularizecount"))
                                .where("OrganizationId", orgId)
                                .andWhereNot("Is_Delete", 1)
                                .andWhere("EmployeeId", id)
                                .whereRaw("Month(AttendanceDate) = Month(?)", [month])
                                .whereRaw("Year(AttendanceDate) = Year(?)", [month])
                                .whereRaw("AttendanceDate != CURDATE()")
                                .andWhere(Database_1["default"].raw(" (\"RegularizeSts\" != 0 AND \"RegularizeSts\" != 1)\n      "))
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
    GetDataToRegService.OnSendRegularizeRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var date, platform, uid, orgid, remark, Attendance_id, timeIn, timeOut, attendancedate, email, empname, designation, senior, Empemail, status, seniorname, Hrname, Hremail, msg, regularizetimein, timeincondition, orginaltimein, errorMsg, data2, RegularizationAppliedFrom, currentDate, currentMonth, mdate, date2, selectEmployeeList, divhrsts, module, ActivityBy, sql, sql1, result, hrid, sqlemp, updSts, count, sql4, query4, senior2, temp, filteredTemp, finalTemp, i, sqlapproveremp, seniornameArray, HrnameArray, HremailArray, _i, sqlapproveremp_1, rapproveremp, title, remarkcondition, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        date = data.attdate;
                        platform = data.platform;
                        uid = data.uid;
                        orgid = data.orgid;
                        remark = data.remark;
                        Attendance_id = data.id;
                        timeIn = data.timein;
                        timeOut = data.timeout;
                        attendancedate = data.attdate;
                        email = 0;
                        data2 = {};
                        RegularizationAppliedFrom = data.RegularizationAppliedFrom;
                        currentDate = DateTime.now();
                        currentMonth = currentDate.toFormat("yyyy-MM-dd");
                        mdate = currentDate.toFormat("yyyy-MM-dd HH:mm:ss");
                        date2 = currentDate.toFormat("yyyy-MM-dd");
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("*")
                                .select(Database_1["default"].raw("(SELECT div_hrsts FROM DivisionMaster WHERE Id = Division) AS divhr"))
                                .where("Id", uid)
                                .where("OrganizationId", orgid)];
                    case 1:
                        selectEmployeeList = _b.sent();
                        return [4 /*yield*/, selectEmployeeList];
                    case 2:
                        result = _b.sent();
                        result.forEach(function (row) { return __awaiter(_this, void 0, void 0, function () {
                            var divid, Empemail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        designation = row.Designation;
                                        divid = row.Division;
                                        divhrsts = row.divhr;
                                        empname = row.FirstName + row.LastName;
                                        return [4 /*yield*/, Helper_1["default"].decode5t(row.CompanyEmail)];
                                    case 1:
                                        Empemail = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        if (!(RegularizationAppliedFrom != 2)) return [3 /*break*/, 6];
                        module = "ubiHRM APP";
                        ActivityBy = 0;
                        if (!(divhrsts != 0)) return [3 /*break*/, 3];
                        hrid = divhrsts;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, Database_1["default"].from("UserMaster")
                            .select("EmployeeId")
                            .where(" OrganizationId", orgid)
                            .andWhere("HRSts", 1)];
                    case 4:
                        sql = _b.sent();
                        sql.forEach(function (val) {
                            hrid = val.EmployeeId;
                        });
                        _b.label = 5;
                    case 5: return [3 /*break*/, 10];
                    case 6:
                        module = "ubiattendance APP";
                        ActivityBy = 1;
                        return [4 /*yield*/, Database_1["default"].from("Organization")
                                .select("Email")
                                .where("Id", orgid)];
                    case 7:
                        sql = _b.sent();
                        return [4 /*yield*/, Promise.all(sql.map(function (val) { return __awaiter(_this, void 0, void 0, function () {
                                var email1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Helper_1["default"].encode5t(val.Email)];
                                        case 1:
                                            email1 = _a.sent();
                                            email = email1;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .select("EmployeeId ")
                                .where("OrganizationId", orgid)
                                .andWhere("Username", email)];
                    case 9:
                        sqlemp = _b.sent();
                        sqlemp.forEach(function (val) {
                            hrid = val.EmployeeId;
                        });
                        senior = hrid;
                        _b.label = 10;
                    case 10:
                        if (!(Attendance_id != undefined && (hrid != 0 || hrid != ""))) return [3 /*break*/, 32];
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .where("Id", Attendance_id)
                                .update({
                                RegularizationRemarks: remark,
                                RegularizeApproverRemarks: "",
                                RegularizeTimeOut: timeOut,
                                RegularizeTimeIn: timeIn,
                                RegularizeSts: 3,
                                RegularizeRequestDate: date2,
                                RegularizationAppliedFrom: RegularizationAppliedFrom,
                                LastModifiedDate: mdate
                            })];
                    case 11:
                        sql1 = _b.sent();
                        _b.label = 12;
                    case 12:
                        _b.trys.push([12, 30, , 31]);
                        updSts = sql1;
                        if (!(updSts == 1)) return [3 /*break*/, 28];
                        msg = "<b>" + empname + "</b> requested for regularization for the attendance date of <b>" + attendancedate + "</b>";
                        return [4 /*yield*/, Helper_1["default"].ActivityMasterInsert(date2, orgid, uid, ActivityBy, module, msg, module)];
                    case 13:
                        sql = _b.sent();
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster ")
                                .select("RegularizeTimeIn", "TimeIn")
                                .where("Id", Attendance_id)];
                    case 14:
                        sql1 = _b.sent();
                        count = sql1.length;
                        sql1.forEach(function (val) {
                            regularizetimein = val.RegularizeTimeIn;
                            orginaltimein = val.TimeIn;
                        });
                        if (!(RegularizationAppliedFrom != 2)) return [3 /*break*/, 18];
                        return [4 /*yield*/, Database_1["default"].from("ApprovalProcess")
                                .where("OrganizationId", orgid)
                                .where(Database_1["default"].raw("(Designation = " + designation + " OR Designation = 0)"))
                                .andWhere(Database_1["default"].raw("(ProcessType = 13 OR ProcessType = 0)"))
                                .orderBy("Designation", "desc")
                                .orderBy("ProcessType", "desc")];
                    case 15:
                        sql4 = _b.sent();
                        query4 = sql4.length;
                        if (!(query4 > 0)) return [3 /*break*/, 17];
                        return [4 /*yield*/, Helper_1["default"].getApprovalLevelEmp(uid, orgid, 13)];
                    case 16:
                        senior = _b.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        senior = hrid;
                        _b.label = 18;
                    case 18:
                        if (!(senior != 0)) return [3 /*break*/, 27];
                        senior2 = "" + senior;
                        temp = Array.from(senior2);
                        filteredTemp = temp.filter(function (item) { return item; });
                        finalTemp = __spreadArrays(filteredTemp);
                        i = 0;
                        _b.label = 19;
                    case 19:
                        if (!(i < temp.length)) return [3 /*break*/, 27];
                        if (!(temp[i] != "0")) return [3 /*break*/, 26];
                        return [4 /*yield*/, Database_1["default"].insertQuery()
                                .table("RegularizationApproval")
                                .insert({
                                attendanceId: Attendance_id,
                                ApproverId: temp[i],
                                ApproverSts: 3,
                                CreatedDate: mdate,
                                OrganizationId: orgid,
                                RegularizationAppliedFrom: RegularizationAppliedFrom
                            })];
                    case 20:
                        sql = _b.sent();
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("Id", "FirstName", "LastName", "CompanyEmail")
                                .where("OrganizationId", orgid)
                                .andWhere("Id", 4120)];
                    case 21:
                        sqlapproveremp = _b.sent();
                        seniornameArray = [];
                        HrnameArray = [];
                        HremailArray = [];
                        _i = 0, sqlapproveremp_1 = sqlapproveremp;
                        _b.label = 22;
                    case 22:
                        if (!(_i < sqlapproveremp_1.length)) return [3 /*break*/, 25];
                        rapproveremp = sqlapproveremp_1[_i];
                        seniorname = rapproveremp.FirstName + " " + rapproveremp.LastName;
                        Hrname = seniorname;
                        return [4 /*yield*/, Helper_1["default"].decode5t(rapproveremp.CompanyEmail)];
                    case 23:
                        Hremail = _b.sent();
                        seniornameArray.push(seniorname);
                        HrnameArray.push(Hrname);
                        HremailArray.push(Hremail);
                        _b.label = 24;
                    case 24:
                        _i++;
                        return [3 /*break*/, 22];
                    case 25:
                        if (i == 0) {
                            title = "Request for Regularization Approval";
                            if (regularizetimein == orginaltimein) {
                                timeincondition = "";
                            }
                            else {
                                timeincondition = "\"The requested timein is: " + timeIn + "<br>\";";
                            }
                            remarkcondition = "<br><br>";
                            // if (remark != "") {
                            //   remarkcondition = `Remarks: ${remark}<br><br><br>`;
                            //   var buttoncondition;
                            // if (RegularizationAppliedFrom != 2) {
                            //   buttoncondition =
                            //     "<a href='$approvelink' style='text-decoration:none;padding: 10px 15px; background: #ffffff; color:green; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; border: solid 1px green; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4); -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)' >Approve</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='$rejectlink' style='text-decoration:none;padding: 10px 15px; background: #ffffff; color: brown;-webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; border: solid 1px brown; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4); -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)' >Reject</a>";
                            // }
                            // msg = `Dear $Hrname,<br><br>This is to inform you that, $empname has requested regularization for the $attendancedate. Kindly approve the request.<br>${timeincondition} The requested timeout is: $timeout<br><br><br>
                            //  ${remarkcondition}${buttoncondition}`;
                            // //  if(Hremail!=undefined){
                            //  }
                            // const title1 =
                            //   "Acknowledgement of Regularization request sent";
                            // const msg1 = `Dear $empname,<br><br>This is to inform you that your regularization request has been sent for approval.<br><br><br>Thanks & Regards<br>`;
                            // if (Empemail != "") {
                            //   /* $sts1=sendEmail_new($Empemail, $title1, $msg1, "");
                            //   Trace($msg1."<br>mailsts ".$sts1." empemail ".$Empemail ); */
                            // }
                            // }
                        }
                        _b.label = 26;
                    case 26:
                        i++;
                        return [3 /*break*/, 19];
                    case 27:
                        status = "true";
                        errorMsg = "Regularization request submitted successfully";
                        data2["status"] = status;
                        data2["msg"] = errorMsg;
                        return [3 /*break*/, 29];
                    case 28:
                        status = "false";
                        errorMsg = "There is some problem while requesting regularization";
                        data2["status"] = status;
                        data2["msg"] = errorMsg;
                        _b.label = 29;
                    case 29: return [3 /*break*/, 31];
                    case 30:
                        _a = _b.sent();
                        return [3 /*break*/, 31];
                    case 31: return [3 /*break*/, 33];
                    case 32:
                        status = "false";
                        errorMsg = "No approver found";
                        data2["status"] = status;
                        data2["msg"] = errorMsg;
                        _b.label = 33;
                    case 33:
                        if (platform == undefined) {
                            return [2 /*return*/, status];
                        }
                        else {
                            return [2 /*return*/, data2];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return GetDataToRegService;
}());
exports["default"] = GetDataToRegService;
