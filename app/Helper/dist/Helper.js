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
var Database_1 = require("@ioc:Adonis/Lucid/Database");
var AttendanceMaster_1 = require("App/Models/AttendanceMaster");
var EmployeeMaster_1 = require("App/Models/EmployeeMaster");
var Organization_1 = require("App/Models/Organization");
var ShiftMaster_1 = require("App/Models/ShiftMaster");
var ZoneMaster_1 = require("App/Models/ZoneMaster");
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
            var query1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].query()
                            .from("ZoneMaster")
                            .select("name")
                            .where("Id", Database_1["default"].raw("(select TimeZone from Organization where id =" + orgid + "  LIMIT 1)"))];
                    case 1:
                        query1 = _a.sent();
                        return [2 /*return*/, query1[0].name];
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
            var query2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1["default"].query()
                            .from("EmployeeMaster")
                            .select("FirstName")
                            .where("Id", empid)];
                    case 1:
                        query2 = _a.sent();
                        return [2 /*return*/, query2[0].FirstName];
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
                    case 0:
                        console.log(Id);
                        console.log(orgid);
                        return [4 /*yield*/, Database_1["default"].from("ShiftMaster")
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
                        return [2 /*return*/, query[0].FirstName];
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
                        // console.log(allDataOfShiftMaster?.toSQL().toNative());
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
                        if (getshiftid_1.length > 0) {
                            return [2 /*return*/, getshiftid_1[0].Id];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
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
                            .first()];
                    case 1:
                        attendanceRecord = _a.sent();
                        if (!(attendanceRecord && attendanceRecord.multitime_sts)) return [3 /*break*/, 2];
                        return [2 /*return*/, attendanceRecord.multitime_sts];
                    case 2: return [4 /*yield*/, ShiftMaster_1["default"].query()
                            .where("Id", shiftId)
                            .select("MultipletimeStatus")
                            .first()];
                    case 3:
                        shiftRecord = _a.sent();
                        if (shiftRecord && shiftRecord.MultipletimeStatus) {
                            return [2 /*return*/, shiftRecord.MultipletimeStatus];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, 0];
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
