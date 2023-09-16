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
var jwt = require("jsonwebtoken");
var Mail_1 = require("@ioc:Adonis/Addons/Mail");
var Database_1 = require("@ioc:Adonis/Lucid/Database");
var AttendanceMaster_1 = require("App/Models/AttendanceMaster");
var EmployeeMaster_1 = require("App/Models/EmployeeMaster");
var Organization_1 = require("App/Models/Organization");
var ShiftMaster_1 = require("App/Models/ShiftMaster");
var ZoneMaster_1 = require("App/Models/ZoneMaster");
var _a = require('date-fns'), format = _a.format, parse = _a.parse, parseISO = _a.parseISO;
var luxon_1 = require("luxon");
var moment_1 = require("moment");
var https = require('https'); // Import the 'https' module
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.encode5t = function (str) {
        for (var i = 0; i < 5; i++) {
            str = Buffer.from(str).toString("base64");
            str = str.split("").reverse().join("");
        }
        return str;
    };
    Helper.decode5t = function (str) {
        for (var i = 0; i < 5; i++) {
            str = str.split("").reverse().join("");
            str = Buffer.from(str, "base64").toString("utf-8");
        }
        return str;
    };
    Helper.getTimeZone = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var TimeZone, Name, query1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        TimeZone = "Asia/kolkata";
                        Name = "";
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("ZoneMaster")
                                .select("Name")
                                .where("Id", Database_1["default"].raw("(select TimeZone from Organization where id =" + orgid + "  LIMIT 1)"))];
                    case 1:
                        query1 = _a.sent();
                        if (query1.length > 0) {
                            return [2 /*return*/, query1[0].Name];
                        }
                        else {
                            return [2 /*return*/, TimeZone];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getAdminStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var status, queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = 0;
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("UserMaster")
                                .select("appSuperviserSts")
                                .where("EmployeeId", id)
                                .first()];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult) {
                            status = queryResult.appSuperviserSts;
                        }
                        return [2 /*return*/, status];
                }
            });
        });
    };
    Helper.getempnameById = function (empid) {
        return __awaiter(this, void 0, void 0, function () {
            var FirstName, query2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        FirstName = "";
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("EmployeeMaster as E")
                                .select(Database_1["default"].raw("IF(E.lastname != '', CONCAT(E.FirstName, ' ', E.lastname), E.FirstName) as Name"))
                                .where("Id", empid)];
                    case 1:
                        query2 = _a.sent();
                        if (query2.length > 0) {
                            return [2 /*return*/, query2[0].Name];
                        }
                        else {
                            return [2 /*return*/, FirstName];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.generateToken = function (secretKey, data) {
        if (data === void 0) { data = {}; }
        try {
            var payload = {
                audience: data.username,
                Id: data.empid
            };
            var options = {
                expiresIn: "1h",
                issuer: "Ubiattendace App"
            };
            var token = jwt.sign(payload, secretKey, options, {
                alg: "RS512",
                typ: "JWT"
            });
            return token;
        }
        catch (err) {
            console.log(err);
            return 0;
        }
    };
    Helper.getDepartmentIdByEmpID = function (empid) {
        return __awaiter(this, void 0, void 0, function () {
            var EmpQuery, departmentId, DepQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                            .select("Department")
                            .where("id", empid)];
                    case 1:
                        EmpQuery = _a.sent();
                        if (!(EmpQuery.length > 0)) return [3 /*break*/, 3];
                        departmentId = EmpQuery[0].Department;
                        return [4 /*yield*/, Database_1["default"].from("DepartmentMaster")
                                .select("Id")
                                .where("Id", departmentId)];
                    case 2:
                        DepQuery = _a.sent();
                        if (DepQuery.length > 0) {
                            return [2 /*return*/, DepQuery[0].Id];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, 0];
                }
            });
        });
    };
    Helper.FirstLettercapital = function (sentence) {
        var words = sentence.split(" ");
        var capitalizedWords = words.map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return capitalizedWords.join(" ");
    };
    Helper.getCountryIdByOrg1 = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var getCountryId, CountryId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("Organization")
                            .select("Country")
                            .where("Id", orgid)];
                    case 1:
                        getCountryId = _a.sent();
                        if (getCountryId.length > 0) {
                            CountryId = getCountryId[0].Country;
                            return [2 /*return*/, CountryId];
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    Helper.getOrgId = function (Id) {
        return __awaiter(this, void 0, void 0, function () {
            var OrgId, getOrgIdQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                            .select("OrganizationId")
                            .where("Id", Id)];
                    case 1:
                        getOrgIdQuery = _a.sent();
                        if (getOrgIdQuery.length > 0) {
                            OrgId = getOrgIdQuery[0].OrganizationId;
                        }
                        return [2 /*return*/, OrgId];
                }
            });
        });
    };
    Helper.getWeeklyOff = function (date, shiftId, emplid, orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var dt, dayOfWeek, weekOfMonth, week, selectShiftId, shiftid, shiftRow, flage, holidayRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dt = date;
                        dayOfWeek = 1 + new Date(dt).getDay();
                        weekOfMonth = Math.ceil(new Date(dt).getDate() / 7);
                        week = [];
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster")
                                .select("ShiftId")
                                .where("AttendanceDate", "<", dt)
                                .where("EmployeeId", emplid)
                                .orderBy("AttendanceDate", "desc")
                                .limit(1)];
                    case 1:
                        selectShiftId = _a.sent();
                        if (selectShiftId.length > 0) {
                            shiftid = void 0;
                            shiftid = selectShiftId[0].ShiftId;
                        }
                        else {
                            return [2 /*return*/, "N/A"];
                        }
                        return [4 /*yield*/, Database_1["default"].from("ShiftMasterChild")
                                .where("OrganizationId", orgid)
                                .where("Day", dayOfWeek)
                                .where("ShiftId", shiftId)
                                .first()];
                    case 2:
                        shiftRow = _a.sent();
                        flage = false;
                        if (shiftRow) {
                            week = shiftRow.WeekOff.split(",");
                            flage = true;
                        }
                        if (!(flage && week[weekOfMonth - 1] != "1")) return [3 /*break*/, 3];
                        return [2 /*return*/, "WO"];
                    case 3: return [4 /*yield*/, Database_1["default"].from("HolidayMaster")
                            .where("OrganizationId", orgid)
                            .where("DateFrom", "<=", dt)
                            .where("DateTo", ">=", dt)
                            .first()];
                    case 4:
                        holidayRow = _a.sent();
                        if (holidayRow) {
                            return [2 /*return*/, "H"];
                        }
                        else {
                            return [2 /*return*/, "N/A"];
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Helper.getEmpTimeZone = function (userid, orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultZone, _a, country, id, zoneData, organization, zoneData, zoneData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        defaultZone = "Asia/Kolkata";
                        return [4 /*yield*/, EmployeeMaster_1["default"].findByOrFail("Id", userid)];
                    case 1:
                        _a = _b.sent(), country = _a.CurrentCountry, id = _a.timezone;
                        if (!id) return [3 /*break*/, 3];
                        return [4 /*yield*/, ZoneMaster_1["default"].find(id)];
                    case 2:
                        zoneData = _b.sent();
                        return [2 /*return*/, zoneData ? zoneData.Name : defaultZone];
                    case 3:
                        if (!!country) return [3 /*break*/, 7];
                        return [4 /*yield*/, Organization_1["default"].findByOrFail("Id", orgid)];
                    case 4:
                        organization = _b.sent();
                        if (!organization) return [3 /*break*/, 6];
                        return [4 /*yield*/, ZoneMaster_1["default"].find(organization.TimeZone)];
                    case 5:
                        zoneData = _b.sent();
                        return [2 /*return*/, zoneData ? zoneData.Name : defaultZone];
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, ZoneMaster_1["default"].query()
                            .where("CountryId", country)
                            .first()];
                    case 8:
                        zoneData = _b.sent();
                        return [2 /*return*/, zoneData ? zoneData.Name : defaultZone];
                    case 9: return [2 /*return*/, defaultZone];
                }
            });
        });
    };
    Helper.getInterimAttAvailableSt = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var GetIntermAttendanceId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                            .where("AttendanceMasterId", value)
                            .select("id")];
                    case 1:
                        GetIntermAttendanceId = _a.sent();
                        if (GetIntermAttendanceId.length > 0) {
                            return [2 /*return*/, GetIntermAttendanceId[0].id];
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    Helper.getCurrentDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var date, year, month, day, formattedDate;
            return __generator(this, function (_a) {
                date = new Date();
                year = date.getFullYear();
                month = String(date.getMonth() + 1).padStart(2, "0");
                day = String(date.getDate()).padStart(2, "0");
                formattedDate = year + "-" + month + "-" + day;
                return [2 /*return*/, formattedDate];
            });
        });
    };
    Helper.getShiftName = function (Id, orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var ShiftName, getshiftname;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("ShiftMaster")
                            .select("Name")
                            .where("Id", Id)
                            .andWhere("OrganizationId", orgid)];
                    case 1:
                        getshiftname = _a.sent();
                        if (getshiftname.length > 0) {
                            ShiftName = getshiftname[0].Name;
                        }
                        return [2 /*return*/, ShiftName];
                }
            });
        });
    };
    Helper.getEmpName = function (Id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                            .select("FirstName", "LastName")
                            .where("Id", Id)
                            .where("Is_Delete", 0)];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            return [2 /*return*/, query[0].FirstName];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getName = function (tablename, getcol, wherecol, id) {
        return __awaiter(this, void 0, void 0, function () {
            var name, query, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = "";
                        return [4 /*yield*/, Database_1["default"].query()
                                .from(tablename)
                                .select(getcol)
                                .where(wherecol, id)];
                    case 1:
                        query = _a.sent();
                        count = query.length;
                        if (count > 0) {
                            query.forEach(function (row) {
                                name = row[getcol];
                            });
                        }
                        return [2 /*return*/, name];
                }
            });
        });
    };
    Helper.getShiftType = function (shiftId) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultshifttype, allDataOfShiftMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultshifttype = 0;
                        return [4 /*yield*/, ShiftMaster_1["default"].find(shiftId)];
                    case 1:
                        allDataOfShiftMaster = _a.sent();
                        if (allDataOfShiftMaster) {
                            return [2 /*return*/, allDataOfShiftMaster
                                    ? allDataOfShiftMaster.shifttype
                                    : defaultshifttype];
                        }
                        else {
                            return [2 /*return*/, defaultshifttype];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getassignedShiftTimes = function (empid, ShiftDate) {
        return __awaiter(this, void 0, void 0, function () {
            var getshiftid, getshiftid_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("ShiftPlanner")
                            .select("shiftid")
                            .where("empid", empid)
                            .andWhere("ShiftDate", ShiftDate)];
                    case 1:
                        getshiftid = _a.sent();
                        if (!(getshiftid.length > 0)) return [3 /*break*/, 2];
                        return [2 /*return*/, getshiftid[0].shiftid];
                    case 2: return [4 /*yield*/, Database_1["default"].from("ShiftMaster")
                            .select("Id")
                            .where("id", Database_1["default"].rawQuery("(SELECT Shift FROM EmployeeMaster where id=" + empid + ")"))];
                    case 3:
                        getshiftid_1 = _a.sent();
                        if (getshiftid_1.length > 0 && getshiftid_1[0].Id != undefined) {
                            return [2 /*return*/, getshiftid_1[0].Id];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, 0];
                }
            });
        });
    };
    Helper.getAddonPermission = function (orgid, addon) {
        return __awaiter(this, void 0, void 0, function () {
            var getaddonpermission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("licence_ubiattendance")
                            .select(Database_1["default"].raw(addon + " as addon"))
                            .where("OrganizationId", orgid)];
                    case 1:
                        getaddonpermission = _a.sent();
                        if (getaddonpermission.length > 0) {
                            return [2 /*return*/, getaddonpermission[0].addon];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getAddon_geoFenceRestrictionByUserId = function (userId, addon, orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                            .where("OrganizationId", orgid)
                            .where("Id", userId)
                            .select(addon)
                            .first()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result ? result.addon : null];
                }
            });
        });
    };
    Helper.getNotificationPermission = function (orgid, notification) {
        return __awaiter(this, void 0, void 0, function () {
            var getNotificationPermission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("NotificationStatus")
                            .select(Database_1["default"].raw(notification + " as notification"))
                            .where("OrganizationId", orgid)];
                    case 1:
                        getNotificationPermission = _a.sent();
                        if (getNotificationPermission.length > 0) {
                            return [2 /*return*/, getNotificationPermission[0].notification];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getShiftmultists = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var getshiftMultiplests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("ShiftMaster")
                            .select("MultipletimeStatus")
                            .where("Id", id)];
                    case 1:
                        getshiftMultiplests = _a.sent();
                        if (getshiftMultiplests.length > 0) {
                            return [2 /*return*/, getshiftMultiplests[0].MultipletimeStatus];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getCountryIdByOrg = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].query()
                            .from("Organization")
                            .select("Country")
                            .where("Id", orgid)];
                    case 1:
                        query = _a.sent();
                        return [2 /*return*/, query];
                }
            });
        });
    };
    Helper.getShiftMultipleTimeStatus = function (userId, today, shiftId) {
        return __awaiter(this, void 0, void 0, function () {
            var attendanceRecord, shiftRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AttendanceMaster_1["default"].query()
                            .where("EmployeeId", userId)
                            .where("AttendanceDate", today)
                            .whereNot("TimeIn", "00:00:00")
                            .select("multitime_sts")
                        // .first()
                    ];
                    case 1:
                        attendanceRecord = _a.sent();
                        if (!(attendanceRecord.length > 0)) return [3 /*break*/, 2];
                        return [2 /*return*/, attendanceRecord[0].multitime_sts];
                    case 2: return [4 /*yield*/, ShiftMaster_1["default"].query()
                            .where("Id", shiftId)
                            .select("MultipletimeStatus")];
                    case 3:
                        shiftRecord = _a.sent();
                        // .first();
                        if (shiftRecord.length > 0) {
                            return [2 /*return*/, shiftRecord[0].MultipletimeStatus];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, 0];
                }
            });
        });
    };
    Helper.ActivityMasterInsert = function (date, orgid, uid, activityBy, appModule, actionperformed, module) {
        var InsertActivityHistoryMaster = Database_1["default"].table("ActivityHistoryMaster").insert({
            LastModifiedDate: date,
            LastModifiedById: uid,
            module: module,
            ActionPerformed: actionperformed,
            OrganizationId: orgid,
            activityBy: activityBy,
            adminid: uid,
            appmodule: appModule
        });
        return InsertActivityHistoryMaster;
    };
    Helper.getOvertimeForRegularization = function (timein, timeout, id) {
        return __awaiter(this, void 0, void 0, function () {
            var name, selectShiftMasterData, _i, selectShiftMasterData_1, row, stime1, stime2, time1, time2, totaltime, stotaltime, overtime, overtimeInMinutes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = " ";
                        return [4 /*yield*/, Database_1["default"].from("ShiftMaster")
                                .select("TimeIn", "TimeOut")
                                .where("Id", id)];
                    case 1:
                        selectShiftMasterData = _a.sent();
                        try {
                            for (_i = 0, selectShiftMasterData_1 = selectShiftMasterData; _i < selectShiftMasterData_1.length; _i++) {
                                row = selectShiftMasterData_1[_i];
                                stime1 = moment_1["default"]("1980-01-01 " + row.TimeIn).unix();
                                stime2 = moment_1["default"]("1980-01-01 " + row.TimeOut).unix();
                                time1 = moment_1["default"]("1980-01-01 " + timein).unix();
                                time2 = moment_1["default"]("1980-01-01 " + timeout).unix();
                                totaltime = time2 - time1;
                                stotaltime = stime2 - stime1;
                                overtime = Math.abs(totaltime - stotaltime);
                                overtimeInMinutes = overtime / 60;
                                if (overtime > 0) {
                                    name = moment_1["default"]()
                                        .startOf("day")
                                        .minutes(overtimeInMinutes)
                                        .format("HH:mm:00");
                                }
                                if (totaltime - stotaltime < 0) {
                                    name = "-" + ("" + name);
                                }
                                if (timein == "00:00:00") {
                                    name = "00:00:00";
                                }
                            }
                        }
                        catch (error) {
                            console.error(error.message);
                        }
                        return [2 /*return*/, name];
                }
            });
        });
    };
    // public static async getShiftIdByEmpID(empid) {
    //   let shift;
    //   let getshiftid = await Database.from("ShiftMaster")
    //     .select("Id")
    //     .where(
    //       "id",
    //       Database.rawQuery(
    //         `(SELECT Shift FROM EmployeeMaster where id=${empid})`
    //       )
    //     );
    //   if (getshiftid.length > 0) {
    //     shift = getshiftid[0].Id;
    //     return shift;
    //   } else {
    //     return shift;
    //   }
    // }
    Helper.getShiftByEmpID = function (Id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].query()
                            .from("ShiftMaster")
                            .select("Name")
                            .where("id", Id)];
                    case 1:
                        query = _a.sent();
                        query.forEach(function (row) {
                            var Name = row.Name;
                            return Name;
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.myUrlEncode = function (country_code) {
        return __awaiter(this, void 0, void 0, function () {
            var entities, replacements, encodedString, i, entity, replacement;
            return __generator(this, function (_a) {
                entities = [
                    "%20",
                    "%2B",
                    "%24",
                    "%2C",
                    "%2F",
                    "%3F",
                    "%25",
                    "%23",
                    "%5B",
                    "%5D",
                ];
                replacements = [
                    "+",
                    "!",
                    "*",
                    "'",
                    "(",
                    ")",
                    ";",
                    ":",
                    "@",
                    "&",
                    "=",
                    "$",
                    ",",
                    "/",
                    "?",
                    "%",
                    "#",
                    "[",
                    "]",
                ];
                encodedString = encodeURIComponent(country_code);
                for (i = 0; i < entities.length; i++) {
                    entity = entities[i];
                    replacement = replacements[i];
                    encodedString = encodedString.split(entity).join(replacement);
                    return [2 /*return*/, encodedString];
                }
                return [2 /*return*/];
            });
        });
    };
    Helper.getDesignationId = function (name, orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var desi, designationdata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].query()
                            .from("DesignationMaster")
                            .select("*")
                            .where("Name", name)
                            .andWhere("OrganizationId", orgid)];
                    case 1:
                        designationdata = _a.sent();
                        if (designationdata.length > 0) {
                            desi = designationdata[0].Id;
                            return [2 /*return*/, desi];
                        }
                        else {
                            return [2 /*return*/, desi];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getFlexiShift = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, HoursPerDay;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].query()
                            .from("ShiftMaster")
                            .select("HoursPerDay")
                            .where("Id", id)];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            HoursPerDay = query[0].HoursPerDay;
                            return [2 /*return*/, HoursPerDay];
                        }
                        else {
                            return [2 /*return*/, HoursPerDay];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getShiftTimes = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].query()
                            .from("ShiftMaster")
                            .select("TimeIn", "TimeOut", "HoursPerDay")
                            .where("Id", id)];
                    case 1:
                        query = _a.sent();
                        if (query) {
                            if (query[0].TimeIn == "00:00:00" || query[0].TimeIn == "") {
                                return [2 /*return*/, query[0].HoursPerDay];
                            }
                            else {
                                return [2 /*return*/, query[0].TimeIn.substr(0, 5) + " - " + query[0].TimeOut.substr(0, 5)];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getOrgName = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var Name, queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Name = "";
                        return [4 /*yield*/, Database_1["default"].from("Organization")
                                .where("Id", id)
                                .select("Name")];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.length > 0) {
                            Name = queryResult[0].Name;
                            return [2 /*return*/, Name];
                        }
                        else {
                            return [2 /*return*/, Name];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getAdminEmail = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var Email, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("Organization")
                            .where("Id", id)
                            .select("Email")];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            Email = query[0].Email;
                            return [2 /*return*/, Email];
                        }
                        else {
                            return [2 /*return*/, (Email = "")];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getAdminNamebyOrgId = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var Name, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("admin_login")
                            .where("OrganizationId", orgid)
                            .select("name")];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            Name = query[0].name;
                            return [2 /*return*/, Name];
                        }
                        else {
                            return [2 /*return*/, Name];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getEmpEmail = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, Email;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                            .where("Id", id)
                            .andWhere("Is_Delete", 0)
                            .select("CurrentEmailId")];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            Email = query[0].CurrentEmailId;
                            return [2 /*return*/, Email];
                        }
                        else {
                            return [2 /*return*/, Email];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getCountryNameById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, Name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("CountryMaster")
                            .select("Name")
                            .where("Id", id)];
                    case 1:
                        query = _a.sent();
                        Name = "";
                        if (query.length) {
                            Name = query[0].Name;
                            return [2 /*return*/, Name];
                        }
                        else {
                            return [2 /*return*/, Name];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getDeptName = function (deptId, orgId) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("DepartmentMaster")
                            .select("name")
                            .where("id", deptId)
                            .where("OrganizationId", orgId)
                            .first()];
                    case 1:
                        query = _a.sent();
                        if (query) {
                            return [2 /*return*/, query.name];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getCurrentOrgStatus = function (orgId) {
        return __awaiter(this, void 0, void 0, function () {
            var todayDate, customizeOrg, status, endDate, deleteSts, extended, queryResult, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todayDate = new Date().toISOString().split('T')[0];
                        customizeOrg = 0;
                        status = 0;
                        endDate = "0000-00-00";
                        deleteSts = 0;
                        extended = 0;
                        return [4 /*yield*/, Database_1["default"]
                                .from('Organization')
                                .join('licence_ubiattendance', 'Organization.Id', '=', 'licence_ubiattendance.OrganizationId')
                                .select('Organization.customize_org AS customize_org', 'Organization.delete_sts AS delete_sts')
                                .select('licence_ubiattendance.status AS status', 'licence_ubiattendance.end_date AS end_date', 'licence_ubiattendance.extended AS extended')
                                .where('Organization.Id', orgId)];
                    case 1:
                        queryResult = _a.sent();
                        row = queryResult[0];
                        if (row) {
                            customizeOrg = row.customize_org;
                            status = row.status;
                            endDate = luxon_1.DateTime.fromJSDate(new Date(row.end_date)).toFormat("yyyy-MM-dd");
                            deleteSts = row.delete_sts;
                            extended = row.extended;
                        }
                        if (status === 0 && extended === 1 && todayDate <= endDate && customizeOrg === 0 && deleteSts === 0) {
                            return [2 /*return*/, 'TrialOrg'];
                        }
                        else if (status === 1 && todayDate <= endDate && deleteSts === 0 && customizeOrg === 0) {
                            return [2 /*return*/, 'PremiumStandardOrg'];
                        }
                        else if (customizeOrg === 1 && deleteSts === 0) {
                            return [2 /*return*/, 'PremiumCustomizedOrg'];
                        }
                        else if (status === 0 && todayDate > endDate && deleteSts === 0 && customizeOrg === 0) {
                            return [2 /*return*/, 'ExpiredTrialOrg'];
                        }
                        else if (status === 0 && extended > 1 && endDate >= todayDate && deleteSts === 0 && customizeOrg === 0) {
                            return [2 /*return*/, 'ExtendedTrialOrg'];
                        }
                        else if (status === 0 && todayDate > endDate && deleteSts === 0 && customizeOrg === 0) {
                            return [2 /*return*/, 'PremiumExpiredOrg'];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getShiftIdByEmpID = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var shiftId, shiftIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                            .select("Shift")
                            .where("Id", uid)];
                    case 1:
                        shiftId = _a.sent();
                        shiftIds = shiftId.map(function (row) { return row.Shift; });
                        return [2 /*return*/, shiftIds[0]];
                }
            });
        });
    };
    Helper.getAddon_Regularization = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var Addon_Regularization, Addon_Regularizations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("Organization")
                            .select("Addon_Regularization")
                            .where("Id", orgid)];
                    case 1:
                        Addon_Regularization = _a.sent();
                        Addon_Regularizations = Addon_Regularization.map(function (row) { return row.Addon_Regularization; });
                        return [2 /*return*/, Addon_Regularizations[0]];
                }
            });
        });
    };
    Helper.getLeaveCountApp = function (orgid, empid, leavedate) {
        return __awaiter(this, void 0, void 0, function () {
            var fiscaldate, fiscal, fiscalstart, fiscalend, query, noofleave;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrgFiscal(orgid, leavedate)];
                    case 1:
                        fiscaldate = _a.sent();
                        fiscal = fiscaldate.split(" ");
                        fiscalstart = fiscal[0];
                        fiscalend = fiscal[2];
                        return [4 /*yield*/, Database_1["default"].from('AppliedLeave')
                                .where('EmployeeId', empid)
                                .whereIn('ApprovalStatus', [1, 2])
                                .whereBetween('Date', [fiscalstart, fiscalend])
                                .count('Id as noofleave')];
                    case 2:
                        query = _a.sent();
                        noofleave = query[0].noofleave;
                        return [2 /*return*/, noofleave];
                }
            });
        });
    };
    Helper.getOrgFiscal = function (orgid, leavedate) {
        return __awaiter(this, void 0, void 0, function () {
            var query, row, f_start, f_end, leavedateFormatted, dateofjoin, fiscalstart, fiscalend, startDate, endDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = Database_1["default"].from('Organization')
                            .where('Id', orgid)
                            .select('fiscal_start', 'fiscal_end')
                            .first();
                        return [4 /*yield*/, query];
                    case 1:
                        row = _a.sent();
                        if (!row) {
                            throw new Error('Organization not found');
                        }
                        f_start = row.fiscal_start;
                        f_end = row.fiscal_end;
                        leavedateFormatted = leavedate || new Date().toISOString().slice(0, 10);
                        dateofjoin = new Date(leavedateFormatted);
                        fiscalstart = new Date(f_start);
                        fiscalend = new Date(f_end);
                        if (dateofjoin < fiscalstart) {
                            fiscalstart.setFullYear(fiscalstart.getFullYear() - 1);
                        }
                        if (dateofjoin > fiscalend) {
                            fiscalend.setFullYear(fiscalend.getFullYear() + 1);
                        }
                        startDate = fiscalstart.toISOString().slice(0, 10);
                        endDate = fiscalend.toISOString().slice(0, 10);
                        return [2 /*return*/, startDate + " And " + endDate];
                }
            });
        });
    };
    Helper.getBalanceLeave = function (orgid, uid, date) {
        if (date === void 0) { date = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var data, entitledleave, doj, todaydate, new_fiscal_start_year, new_fiscal_end_year, startDate_year, endDate_year, endDate_fnew, startDate_fnew, currentDate, dateofjoin, fiscalstart, fiscalstartmon, dateofjoinmon, fiscalstartdate, joindate, fiscalend, fiscalendmon, fiscalenddate, startDate, endDate, diff, differenceInDays, bal1, bal2, balanceleave1, str, after, balanceleave, balanceleave, balanceleave;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster as E")
                            .join("Organization as O", "E.OrganizationId", "=", "O.Id")
                            .select("E.FirstName", "E.entitledleave", "E.DOJ")
                            .select("O.fiscal_start", "O.fiscal_end", "O.entitled_leave")
                            .where("O.Id", orgid)
                            .where("E.Id", uid)
                            .first()];
                    case 1:
                        data = _a.sent();
                        if (!data.entitledleave || data.entitledleave.trim() === 'undefined') {
                            entitledleave = data.entitled_leave;
                        }
                        else {
                            entitledleave = data.entitledleave;
                        }
                        todaydate = new Date();
                        new_fiscal_start_year = todaydate.getFullYear();
                        new_fiscal_end_year = new_fiscal_start_year + 1;
                        startDate_year = format(parse(data.fiscal_start, 'd MMMM', new Date()), 'MM-dd');
                        endDate_year = format(parse(data.fiscal_end, 'd MMMM', new Date()), 'MM-dd');
                        endDate_fnew = new_fiscal_end_year + "-" + endDate_year;
                        startDate_fnew = new_fiscal_start_year + "-" + startDate_year;
                        currentDate = data.DOJ.toISOString().split('T')[0];
                        dateofjoin = format(parse(currentDate, 'yyyy-MM-dd', new Date()), 'MM/dd/Y');
                        fiscalstart = format(parse(startDate_fnew, 'yyyy-MM-dd', new Date()), 'MM/dd');
                        fiscalstartmon = fiscalstart.substring(0, 2);
                        dateofjoinmon = dateofjoin.substring(0, 2);
                        fiscalstartdate = fiscalstart.substring(3, 2);
                        joindate = dateofjoin.substring(3, 2);
                        if (dateofjoinmon < fiscalstartmon) {
                            doj = parseInt(dateofjoin.split('/')[2]) - 1;
                            fiscalstartdate = fiscalstart + "/" + doj;
                        }
                        else if (dateofjoinmon === fiscalstartmon && joindate < fiscalstart.substring(3, 5)) {
                            doj = parseInt(dateofjoin.split('/')[2]) - 1;
                            fiscalstartdate = fiscalstart + "/" + doj;
                        }
                        else if (dateofjoinmon === fiscalstartmon && joindate === fiscalstart.substring(3, 5)) {
                            doj = parseInt(dateofjoin.split('/')[2]);
                            fiscalstartdate = fiscalstart + "/" + doj;
                        }
                        else {
                            doj = parseInt(dateofjoin.split('/')[2]);
                            fiscalstartdate = fiscalstart + "/" + doj;
                        }
                        fiscalend = format(parse(endDate_fnew, 'yyyy-MM-dd', new Date()), 'MM/dd');
                        fiscalendmon = fiscalend.substring(0, 2);
                        fiscalenddate = fiscalend.substring(3, 2);
                        if (dateofjoinmon > fiscalendmon) {
                            doj = parseInt(dateofjoin.split('/')[2]) - 1;
                            fiscalenddate = fiscalend + "/" + doj;
                        }
                        else if (dateofjoinmon === fiscalendmon && joindate > fiscalend.substring(3, 5)) {
                            doj = parseInt(dateofjoin.split('/')[2]) - 1;
                            fiscalenddate = fiscalend + "/" + doj;
                        }
                        else if (dateofjoinmon === fiscalendmon && joindate === fiscalend.substring(3, 5)) {
                            doj = parseInt(dateofjoin.split('/')[2]);
                            fiscalenddate = fiscalend + "/" + doj;
                        }
                        else {
                            doj = parseInt(dateofjoin.split('/')[2]);
                            fiscalenddate = fiscalend + "/" + doj;
                        }
                        startDate = new Date(fiscalstartdate);
                        endDate = new Date(fiscalenddate);
                        if (currentDate >= startDate && currentDate <= endDate) {
                            diff = endDate - dateofjoin;
                            differenceInDays = Math.abs(Math.round(diff / (1000 * 60 * 60 * 24)));
                            bal1 = entitledleave / 12;
                            bal2 = differenceInDays / 30.4167;
                            balanceleave1 = bal1 * bal2;
                            str = Math.round(balanceleave1 * 100) / 100;
                            after = Math.round((str % 1) * 100);
                            if (after <= 50) {
                                if (entitledleave <= 0) {
                                    after = 0;
                                }
                                else {
                                    after = 5;
                                }
                                balanceleave = parseFloat(Math.floor(str) + "." + after);
                                return [2 /*return*/, balanceleave];
                            }
                            else {
                                balanceleave = Math.round(str);
                                return [2 /*return*/, balanceleave];
                            }
                        }
                        else {
                            balanceleave = entitledleave;
                            return [2 /*return*/, balanceleave];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getDepartmentName = function (deptid) {
        return __awaiter(this, void 0, void 0, function () {
            var DeptName, deptName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("DepartmentMaster")
                            .select("Name")
                            .where("Id", deptid)];
                    case 1:
                        DeptName = _a.sent();
                        deptName = DeptName.map(function (row) { return row.Name; });
                        return [2 /*return*/, deptName[0]];
                }
            });
        });
    };
    Helper.getDesignationName = function (desgid) {
        return __awaiter(this, void 0, void 0, function () {
            var DesgName, desgName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("DesignationMaster")
                            .select("Name")
                            .where("Id", desgid)];
                    case 1:
                        DesgName = _a.sent();
                        desgName = DesgName.map(function (row) { return row.Name; });
                        return [2 /*return*/, desgName[0]];
                }
            });
        });
    };
    Helper.getShiftTimeByEmpID = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var shiftInfo, arr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"]
                            .from('ShiftMaster')
                            .select('Name', 'TimeIn', 'TimeOut', 'shifttype', 'HoursPerDay', Database_1["default"].raw('TIMEDIFF(TimeIn, TimeOut) AS diffShiftTime'))
                            .whereIn('id', function (subquery) {
                            subquery.select('Shift').from('EmployeeMaster').where('id', uid);
                        }).first()];
                    case 1:
                        shiftInfo = _a.sent();
                        if (shiftInfo) {
                            arr = {};
                            arr.shiftName = shiftInfo.Name;
                            arr.shiftTimeIn = shiftInfo.TimeIn;
                            arr.ShiftTimeOut = shiftInfo.TimeOut;
                            arr.shifttype = shiftInfo.shifttype;
                            arr.minworkhrs = shiftInfo.HoursPerDay;
                            arr.diffShiftTime = shiftInfo.diffShiftTime;
                            return [2 /*return*/, arr];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getDesigName = function (desigId, orgId) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("DesignationMaster")
                            .select("Name")
                            .where("Id", desigId)
                            .where("OrganizationId", orgId)
                            .first()];
                    case 1:
                        query = _a.sent();
                        if (query) {
                            return [2 /*return*/, query.Name];
                        }
                        return [2 /*return*/, null]; // Return null or handle the case when no result is found
                }
            });
        });
    };
    Helper.getShiftplannershiftIdByEmpID = function (EmpId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var selectQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("ShiftPlanner")
                            .select("shiftid")
                            .where("empid", EmpId)
                            .where("ShiftDate", date)];
                    case 1:
                        selectQuery = _a.sent();
                        if (selectQuery.length > 0) {
                            return [2 /*return*/, selectQuery[0].shiftid];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getweeklyoffnew = function (date, shiftid, empid, orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var dateTime, dayOfWeek, weekOfMonth, week, selectQuery, flag, weekOffString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dateTime = luxon_1.DateTime.fromISO(date);
                        dayOfWeek = dateTime.weekday;
                        switch (dayOfWeek) {
                            case 1:
                                dayOfWeek = 2;
                                break;
                            case 2:
                                dayOfWeek = 3;
                                break;
                            case 3:
                                dayOfWeek = 4;
                                break;
                            case 4:
                                dayOfWeek = 5;
                                break;
                            case 5:
                                dayOfWeek = 6;
                                break;
                            case 6:
                                dayOfWeek = 7;
                                break;
                            case 7:
                                dayOfWeek = 1;
                        }
                        weekOfMonth = Math.ceil(dateTime.day / 7);
                        return [4 /*yield*/, Database_1["default"].from("ShiftMasterChild")
                                .select("WeekOff")
                                .where("OrganizationId", orgid)
                                .where("Day", dayOfWeek)
                                .where("ShiftId", shiftid)];
                    case 1:
                        selectQuery = _a.sent();
                        flag = false;
                        if (selectQuery.length > 0) {
                            weekOffString = selectQuery[0].WeekOff;
                            week = weekOffString.split(","); // Split the comma-separated string into an array
                            flag = true;
                        }
                        if (flag && week[weekOfMonth - 1] == 1) {
                            return [2 /*return*/, "WeekOff"];
                        }
                        else {
                            return [2 /*return*/, "noWeekOff"];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getAreaInfo = function (Id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, arr, arr1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("Geo_Settings")
                            .select("Lat_Long", "Radius")
                            .where("Id", Id)
                            .where("Lat_Long", "!=", "")
                            .limit(1)
                            .first()];
                    case 1:
                        query = _a.sent();
                        if (query) {
                            arr = {};
                            arr1 = query.Lat_Long.split(",");
                            arr.lat = arr1[0] ? parseFloat(arr1[0]) : 0.0;
                            arr.long = arr1[1] ? parseFloat(arr1[1]) : 0.0;
                            arr.radius = query.Radius;
                            return [2 /*return*/, arr];
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    Helper.getSettingByOrgId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, sts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("Att_OrgSetting")
                            .select("outside_geofence_setting")
                            .where("OrganizationId", id)];
                    case 1:
                        query = _a.sent();
                        sts = "";
                        if (query.length) {
                            sts = query[0].outside_geofence_setting;
                            return [2 /*return*/, sts];
                        }
                        else {
                            return [2 /*return*/, sts];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.calculateDistance = function (lat1, lon1, lat2, lon2, unit) {
        if (unit === void 0) { unit = "K"; }
        var theta = lon1 - lon2;
        var dist = Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.cos(this.deg2rad(theta));
        dist = Math.acos(dist);
        dist = this.rad2deg(dist);
        var miles = dist * 60 * 1.1515;
        unit = unit.toUpperCase();
        if (unit === "K") {
            return miles * 1.609344;
        }
        else if (unit === "N") {
            return miles * 0.8684;
        }
        else {
            return miles;
        }
    };
    Helper.deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };
    Helper.rad2deg = function (rad) {
        return rad * (180 / Math.PI);
    };
    Helper.getAreaIdByUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, sts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                            .select("area_assigned")
                            .where("Id", id)];
                    case 1:
                        query = _a.sent();
                        sts = "";
                        if (query.length) {
                            sts = query[0].area_assigned;
                            return [2 /*return*/, sts];
                        }
                        else {
                            return [2 /*return*/, sts];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getApprovalLevelEmp = function (empid, orgid, processtype) {
        return __awaiter(this, void 0, void 0, function () {
            var Id, seniorid, designation, rule, sts, sql, row_1, affected_rows, reportingto, sql_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Id = "0";
                        designation = 0;
                        if (!(empid != 0 && empid != undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("ReportingTo", "Designation")
                                .where("OrganizationId", orgid)
                                .andWhere("Id", empid)];
                    case 1:
                        sql = _a.sent();
                        sql.forEach(function (val) {
                            seniorid = val.ReportingTo;
                            designation = val.Designation;
                        });
                        if (!(seniorid != 0 && designation != 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Database_1["default"].from("ApprovalProcess")
                                .select(" RuleCriteria", "Designation", "HrStatus")
                                .where(" OrganizationId", orgid)
                                .andWhere(" Designation ", designation)
                                .andWhere("ProcessType ", processtype)];
                    case 2:
                        sql = _a.sent();
                        return [4 /*yield*/, sql];
                    case 3:
                        row_1 = _a.sent();
                        affected_rows = sql.length;
                        if (!(affected_rows > 0)) return [3 /*break*/, 6];
                        if (row_1) {
                            rule = row_1[0].RuleCriteria;
                            sts = row_1[0].HrStatus;
                        }
                        return [4 /*yield*/, Helper.getSeniorId(empid, orgid)];
                    case 4:
                        reportingto = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("Id", "Designation")
                                .where("OrganizationId", orgid)
                                .andWhere("DOL", "0000-00-00")
                                .andWhereIn("Designation", rule)
                                .andWhere("Id", reportingto)
                                .orderByRaw(Database_1["default"].raw("FIELD(Designation, " + rule + ")"))];
                    case 5:
                        sql_1 = _a.sent();
                        sql_1.forEach(function (val) {
                            if (seniorid == undefined) {
                                seniorid == val.Id;
                            }
                            else {
                                seniorid += "," + row_1.Id;
                            }
                        });
                        _a.label = 6;
                    case 6: return [2 /*return*/, seniorid];
                }
            });
        });
    };
    Helper.dateFormate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var year, month, day, formattedDate;
            return __generator(this, function (_a) {
                year = date.getFullYear();
                month = String(date.getMonth() + 1).padStart(2, '0');
                day = String(date.getDate()).padStart(2, '0');
                formattedDate = year + "-" + month + "-" + day;
                return [2 /*return*/, formattedDate];
            });
        });
    };
    Helper.getSeniorId = function (empid, organization) {
        return __awaiter(this, void 0, void 0, function () {
            var id, parentId, query1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = "0";
                        parentId = empid;
                        if (!(parentId != 0 && parentId != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("ReportingTo")
                                .where("OrganizationId", organization)
                                .andWhere("Id", parentId)
                                .andWhere("DOL", "0000-00-00")];
                    case 1:
                        query1 = _a.sent();
                        query1.forEach(function (val) {
                            id = val.ReportingTo;
                        });
                        _a.label = 2;
                    case 2: return [2 /*return*/, id];
                }
            });
        });
    };
    Helper.time_to_decimal = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            var timeArr, decTime;
            return __generator(this, function (_a) {
                timeArr = time.split(":").map(Number);
                decTime = timeArr[0] * 60 + timeArr[1] + timeArr[2] / 60;
                return [2 /*return*/, decTime];
            });
        });
    };
    Helper.getshiftmultipletime_sts = function (uid, date, ShiftId) {
        return __awaiter(this, void 0, void 0, function () {
            var query21, count21, multitime_sts, query21_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].query().from('AttendanceMaster').select('multitime_sts').where('EmployeeId', uid).andWhere('AttendanceDate', date)];
                    case 1:
                        query21 = _a.sent();
                        count21 = query21.length;
                        multitime_sts = 0;
                        if (!(count21 > 0)) return [3 /*break*/, 2];
                        multitime_sts = query21[0].multitime_sts;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, Database_1["default"].query().from('ShiftMaster').select('MultipletimeStatus').where('Id', ShiftId)];
                    case 3:
                        query21_1 = _a.sent();
                        if (query21_1.length > 0) {
                            multitime_sts = query21_1[0].MultipletimeStatus;
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, multitime_sts];
                }
            });
        });
    };
    Helper.getTrialDept = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var Orgid, dept, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Orgid = orgid;
                        dept = 0;
                        return [4 /*yield*/, Database_1["default"].from("DepartmentMaster")
                                .select(Database_1["default"].raw("min(Id) as deptid"))
                                .where("Name", "like", "%trial%")
                                .andWhere("OrganizationId", Orgid)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            dept = result[0].deptid;
                            return [2 /*return*/, dept];
                        }
                        else {
                            return [2 /*return*/, dept];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getTrialDesg = function (org_id) {
        return __awaiter(this, void 0, void 0, function () {
            var Orgid, desg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Orgid = org_id;
                        desg = 0;
                        return [4 /*yield*/, Database_1["default"].from("DesignationMaster")
                                .select(Database_1["default"].raw("min(Id) as desgid"))
                                .where("Name", "like", "%trial%")
                                .andWhere("OrganizationId", Orgid)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            desg = result[0].desgid;
                            return [2 /*return*/, desg];
                        }
                        else {
                            return [2 /*return*/, desg];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.sendEmail = function (email, subject, messages, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var getmail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Mail_1["default"].use("smtp").send(function (message) {
                            message
                                .from("noreply@ubiattendance.com", "shakir")
                                .to(email)
                                .subject(subject)
                                .header(headers, headers)
                                .html("" + messages);
                            //message.textView('emails/welcome.plain', {})
                            //.htmlView('emails/welcome', { fullName: 'Virk' })
                        }, {
                            oTags: ["signup"]
                        })];
                    case 1:
                        getmail = _a.sent();
                        return [2 /*return*/, getmail];
                }
            });
        });
    };
    Helper.getTrialShift = function (org_id) {
        return __awaiter(this, void 0, void 0, function () {
            var Orgid, shiftid, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Orgid = org_id;
                        shiftid = 0;
                        return [4 /*yield*/, Database_1["default"].from("ShiftMaster")
                                .select(Database_1["default"].raw("min(Id) as  shiftid "))
                                .where("Name", "like", "%trial%")
                                .andWhere("OrganizationId", Orgid)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            shiftid = result[0].shiftid;
                            return [2 /*return*/, shiftid];
                        }
                        else {
                            return [2 /*return*/, shiftid];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.sendManualPushNotification = function (condition, title, body, empid, orgid, pageName) {
        return __awaiter(this, void 0, void 0, function () {
            var lastInsertedId, adminSts, currentDate, time, insertQuery, zone, defaultZone, zone, defaultZone, urls, jsonObject, jsonString, headers, request, axiosInstances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastInsertedId = 0;
                        adminSts = 0;
                        if (!(empid == 0 && orgid != 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Helper.getEmpTimeZone(empid, orgid)];
                    case 1:
                        zone = _a.sent();
                        defaultZone = luxon_1.DateTime.now().setZone(zone);
                        time = defaultZone.toFormat("HH:mm:ss");
                        currentDate = luxon_1.DateTime.local().toFormat('yyyy-MM-dd');
                        adminSts = 0;
                        if (condition.includes('admin')) {
                            adminSts = 1;
                        }
                        return [4 /*yield*/, Database_1["default"].table('NotificationsList').insert({
                                NotificationTitle: title,
                                NotificationBody: body,
                                NotificationData: '',
                                EmployeeId: empid,
                                OrganizationId: orgid,
                                CreatedDate: currentDate,
                                CreatedTime: time,
                                AdminSts: adminSts
                            })];
                    case 2:
                        insertQuery = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(empid != 0 && orgid != 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Helper.getEmpTimeZone(empid, orgid)];
                    case 4:
                        zone = _a.sent();
                        defaultZone = luxon_1.DateTime.now().setZone(zone);
                        time = defaultZone.toFormat("HH:mm:ss");
                        currentDate = luxon_1.DateTime.local().toFormat('yyyy-MM-dd');
                        adminSts = 0;
                        if (condition.includes('admin')) {
                            adminSts = 1;
                        }
                        return [4 /*yield*/, Database_1["default"].table('NotificationsList').insert({
                                NotificationTitle: title,
                                NotificationBody: body,
                                NotificationData: '',
                                EmployeeId: empid,
                                OrganizationId: orgid,
                                CreatedDate: currentDate,
                                CreatedTime: time,
                                AdminSts: adminSts
                            })];
                    case 5:
                        insertQuery = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (insertQuery && insertQuery[0]) {
                            lastInsertedId = insertQuery[0];
                        }
                        urls = [
                            "http://localhost:3333/SendNotificationDiffOrgEmployee?orgid=149007&contact=8527419630&adminEmail=&adminId="
                        ];
                        jsonObject = {
                            'condition': condition,
                            'priority': 'high',
                            data: {
                                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                                'screen': pageName,
                                'status': 'done'
                            },
                            'notification': { 'body': body, 'title': title, 'click_action': 'FLUTTER_NOTIFICATION_CLICK' }
                        };
                        jsonString = JSON.stringify(jsonObject);
                        headers = [
                            {
                                'authorization': 'key=AAAAsVdW418:APA91bH-KAyzItecPhs8jP95ZlFNOzDKjmzmeMd2iH1HyUpO_T-_Baed-uIkuyYlosgLStcJZBqQFZuu7UdepvKX6lJcHjU__7FV19LLGn0nbveDBcTBJRJulb5fj_iOlsVRURzsu1Ch',
                                'Content-Type': 'application/json'
                            },
                            {
                                'authorization': 'key=AAAA-BiaJfs:APA91bE1hVf8ChrWfLVTxK2T9pkK6jhGFK_1PUwHIjYwVvd3viShAoNYgFdkqr2PPlMCxGGKLAwV8gk3N01CAwQxmdo2XM7o5O_C1QWFIhyIElfv4Jx4biC3qEyMgIwfVIIXz5Whx9Vs',
                                'Content-Type': 'application/json'
                            },
                            {
                                'authorization': 'key=AAAAksjUHhg:APA91bFR2-KVdsVYHc4IHwDMHuCIt5OULa7OWZ9CD39-PT5J-RdF7CH7RcRh13Fwk8P8K-a7fapRpoyAgM0luf0yWpunE7jnUtltdqE7Vw3vZE95hugsgmhnntMSk09UbvcUr92-PK4d',
                                'Content-Type': 'application/json'
                            },
                            {
                                'authorization': 'key=AAAAI_x79EU:APA91bFae5SDovaio3lTLRTgbOz6m6mJwVkeL9dfeFtCN6P_0xpfEVzz-hjRNEpqztlQNyKlE7XbBynWyzDtAILWMN947i0p79qC5Qkrlu52NmygD7OMYhhCDI6d2U4Iu600V_dbSRvc',
                                'Content-Type': 'application/json'
                            }
                        ];
                        request = {};
                        axiosInstances = [];
                        // function sendRequest(url, headers) {
                        //   return new Promise(async (resolve, reject) => {
                        //     try {
                        //       const response = await axios.post(url, jsonString, {
                        //         headers: headers,
                        //         timeout: 10000, // 10 seconds timeout
                        //         httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Disables SSL certificate verification (use with caution)
                        //         responseType: 'json',
                        //       });
                        //       resolve({
                        //         content: response.data,
                        //         http_code: response.status,
                        //       });
                        //     } catch (error) {
                        //       reject(error);
                        //     }
                        //   });
                        // }
                        // Function to send multiple requests concurrently
                        // async function sendRequests() {
                        //   const requestPromises = urls.map((url, index) => sendRequest(url, headers[index]));
                        //   try {
                        //     const responses = await Promise.all(requestPromises);
                        //     // Loop through the responses and process them
                        //     responses.forEach((response, index) => {
                        //       console.log(`Content from URL ${urls[index]}:`, response.content);
                        //       console.log(`HTTP Status Code from URL ${urls[index]}:`, response.http_code);
                        //     });
                        //   } catch (error) {
                        //     console.error('Error:', error);
                        //     // Handle errors here
                        //   }
                        // }
                        // // Call the function to send multiple requests concurrently
                        // sendRequests();
                        // Create separate Axios instances for each request
                        // console.log(urls.length);
                        // // return 
                        // for (let i = 0; i < urls.length; i++) {
                        //   const instance = await axios.create({
                        //     baseURL: urls[i],
                        //     timeout: 10000, // 10 seconds timeout
                        //     headers: headers[i],
                        //     httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Disables SSL certificate verification (use with caution)
                        //     responseType: 'json',
                        //   });
                        //   axiosInstances.push(instance);
                        // }
                        // return
                        // const requests = urls.map(async (url) => {
                        //   // try {
                        //   // return 'hdh'
                        //   const response = await axios.get(url);
                        //   // Handle the response data for each request here
                        //   console.log(`Response from ${url}: ${response.data}`);
                        //   return {
                        //     content: response.data,
                        //     http_code: response.status
                        //   };
                        // } catch (error) {
                        //   console.error(`Error from ${url}: ${error.message}`);
                        //   throw error;
                        // }
                        // });
                        // const responses = await Promise.all(requests);
                        // responses.forEach((response, k) => {
                        //   // Process each response here
                        //   console.log(`Content from URL ${urls[k]}: ${response.content}`);
                        //   console.log(`HTTP Status Code from URL ${urls[k]}: ${response.http_code}`);
                        // });
                        return [2 /*return*/, lastInsertedId];
                }
            });
        });
    };
    Helper.getUbiatt_Ubihrmsts = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("Organization")
                            .select("ubihrm_sts")
                            .where("Id", orgid)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            return [2 /*return*/, result[0].ubihrm_sts];
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    Helper.loctrackPermission = function (empId) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from('EmployeeMaster')
                            .select('livelocationtrack')
                            .where('Id', empId)];
                    case 1:
                        query = _a.sent();
                        if (query) {
                            return [2 /*return*/, query[0].livelocationtrack];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getDesignation = function (Id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("DesignationMaster")
                            .select("Name")
                            .where("Id", Id)];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            return [2 /*return*/, query[0].Name];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getDepartment = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var Name, selectDepartmentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Name = "";
                        return [4 /*yield*/, Database_1["default"].from("DepartmentMaster")
                                .select("name")
                                .where("id", id)];
                    case 1:
                        selectDepartmentId = _a.sent();
                        if (selectDepartmentId.length > 0) {
                            Name = selectDepartmentId[0].name;
                            return [2 /*return*/, Name];
                        }
                        else {
                            return [2 /*return*/, Name];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getDeviceVerification_settingsts = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var data, selectDeviceVerification_settings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = 0;
                        return [4 /*yield*/, Database_1["default"].from("Organization")
                                .select("deviceverification_setting")
                                .where("id", orgid)];
                    case 1:
                        selectDeviceVerification_settings = _a.sent();
                        if (selectDeviceVerification_settings.length > 0) {
                            data = selectDeviceVerification_settings[0].deviceverification_setting;
                            return [2 /*return*/, data];
                        }
                        else {
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.gettimezonebyid = function (zoneid) {
        return __awaiter(this, void 0, void 0, function () {
            var zone, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        zone = "Asia/Kolkata";
                        return [4 /*yield*/, Database_1["default"].from("ZoneMaster")
                                .select("Name")
                                .where("Id", zoneid)];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            return [2 /*return*/, query[0].Name];
                        }
                        else {
                            return [2 /*return*/, zone];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.getDeptNamem = function (deptId, orgId) {
        return __awaiter(this, void 0, void 0, function () {
            var Name, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Name = "";
                        return [4 /*yield*/, Database_1["default"].from("DepartmentMaster")
                                .select("name")
                                .where("Id", deptId)
                                .andWhere("OrganizationId", orgId)];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            Name = query[0].name;
                            return [2 /*return*/, Name];
                        }
                        else {
                            return [2 /*return*/, Name];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Helper.ucfirst = function (str) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof str !== "string" || str.length === 0) {
                    return [2 /*return*/, str];
                }
                return [2 /*return*/, str.charAt(0).toUpperCase() + str.slice(1)];
            });
        });
    };
    Helper.getAttImageStatus = function (orgid) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("admin_login")
                            .where("OrganizationId", orgid)
                            .select("attnImageStatus")];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            return [2 /*return*/, query[0].attnImageStatus];
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    Helper.AutoTimeOffEndWL = function (empid, orgid, time, date, dateTime) {
        return __awaiter(this, void 0, void 0, function () {
            var getmaxEmpidTimeoff, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].from("Timeoff")
                            .max("id as id")
                            .where("EmployeeId", empid)
                            .andWhere("OrganizationId", orgid)];
                    case 1:
                        getmaxEmpidTimeoff = _a.sent();
                        if (!(getmaxEmpidTimeoff.length > 0)) return [3 /*break*/, 3];
                        id = getmaxEmpidTimeoff[0].id;
                        return [4 /*yield*/, Database_1["default"].from("Timeoff")
                                .where("id", id)
                                .andWhere("TimeTo", "00:00:00")
                                .update({ TimeTo: time, TimeoffEndDate: date, ModifiedDate: dateTime })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Helper.calculateOvertime = function (startTime, endTime) {
        var _a = startTime
            .split(":")
            .map(Number), startHours = _a[0], startMinutes = _a[1], startSeconds = _a[2];
        var _b = endTime.split(":").map(Number), endHours = _b[0], endMinutes = _b[1], endSeconds = _b[2];
        var totalStartSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
        var totalEndSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;
        var timeDiffInSeconds = totalEndSeconds - totalStartSeconds;
        // if (timeDiffInSeconds < 0) {
        //   timeDiffInSeconds += 24 * 3600; // Assuming time is within 24 hours range
        // }
        var hours = Math.floor(Math.abs(timeDiffInSeconds) / 3600) *
            (timeDiffInSeconds < 0 ? 1 : 1);
        var remainingSeconds = Math.abs(timeDiffInSeconds) % 3600;
        var minutes = Math.floor(remainingSeconds / 60) * (timeDiffInSeconds < 0 ? 1 : 1);
        var seconds = Math.floor(remainingSeconds % 60) * (timeDiffInSeconds < 0 ? 1 : 1);
        return { hours: hours, minutes: minutes, seconds: seconds };
    };
    return Helper;
}());
exports["default"] = Helper;
