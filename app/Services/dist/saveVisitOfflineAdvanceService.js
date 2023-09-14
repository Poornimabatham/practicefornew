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
var luxon_1 = require("luxon");
var querystring = require("querystring");
var saveVisitOfflineAdvanceService = /** @class */ (function () {
    function saveVisitOfflineAdvanceService() {
    }
    saveVisitOfflineAdvanceService.saveVisitOfflineAdvance = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var OrganizationId, GeofenceStatusVisitOut, GeofenceStatusVisitIn, EmployeeId, IsVisitInSynced, IsVisitOutSynced, VisitInImageName, VisitInImageBase64, ThumbnailVisitInImageName, VisitInLocation, LatitudeIn, LongitudeIn, VisitInTime, VisitDate, ClientName, ClientId, FakeLocationInStatus, VisitOutTime, Id, ThumbnailVisitOutImageName, VisitOutImageName, LatitudeOut, VisitOutImageBase64, insertInChekin_Master, UpdateCheckin_Master, lastVisitSyncedId, VisitOutLocation, LongitudeOut, FakeLocationOutStatus, Description, date, date2, res, statusArray, AddOnSts, zone, defaultZone, time, stamp, today, selectCheckin_Master, queryVID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        OrganizationId = data.OrganizationId;
                        GeofenceStatusVisitOut = data.GeofenceStatusVisitOut;
                        GeofenceStatusVisitIn = data.GeofenceStatusVisitIn;
                        EmployeeId = data.EmployeeId;
                        IsVisitInSynced = data.IsVisitInSynced;
                        IsVisitOutSynced = data.IsVisitOutSynced;
                        VisitInImageName = data.VisitInImageName;
                        VisitInImageBase64 = data.VisitInImageBase64;
                        ThumbnailVisitInImageName = data.ThumbnailVisitInImageName;
                        VisitInLocation = data.VisitInLocation;
                        LatitudeIn = data.LatitudeIn;
                        LongitudeIn = data.LongitudeIn;
                        VisitInTime = data.VisitInTime;
                        VisitDate = data.VisitDate;
                        ClientName = data.ClientName;
                        ClientId = data.ClientId;
                        FakeLocationInStatus = data.FakeLocationInStatus;
                        VisitOutTime = data.VisitOutTime;
                        Id = data.Id;
                        ThumbnailVisitOutImageName = data.ThumbnailVisitOutImageName;
                        VisitOutImageName = data.VisitOutImageName;
                        LatitudeOut = data.LatitudeOut;
                        VisitOutImageBase64 = data.VisitOutImageBase64;
                        VisitOutLocation = data.VisitOutLocation;
                        LongitudeOut = data.LongitudeOut;
                        FakeLocationOutStatus = data.FakeLocationOutStatus;
                        Description = data.Description;
                        date = VisitDate.toFormat("yyyy-MM-dd");
                        res = [];
                        statusArray = {};
                        return [4 /*yield*/, Helper_1["default"].getAddonPermission(OrganizationId, "Addon_advancevisit")];
                    case 1:
                        AddOnSts = _a.sent();
                        if (AddOnSts == 0) {
                            GeofenceStatusVisitOut = 2;
                            GeofenceStatusVisitIn = 2;
                        }
                        return [4 /*yield*/, Helper_1["default"].getEmpTimeZone(EmployeeId, OrganizationId)];
                    case 2:
                        zone = _a.sent();
                        defaultZone = luxon_1.DateTime.now().setZone(zone);
                        time = defaultZone.toFormat("HH:mm:ss") == "00:00:00"
                            ? "23:59:00"
                            : defaultZone.toFormat("HH:mm:ss");
                        stamp = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
                        today = defaultZone.toFormat("yyyy-MM-dd");
                        if (!(IsVisitInSynced == 1 && IsVisitOutSynced != 1)) return [3 /*break*/, 7];
                        if (ThumbnailVisitInImageName.includes("public")) {
                            VisitInImageName = ThumbnailVisitInImageName;
                        }
                        else {
                            VisitInImageName =
                                "visits/" +
                                    OrganizationId +
                                    "/" +
                                    EmployeeId +
                                    "/" +
                                    ThumbnailVisitInImageName;
                        }
                        if (VisitInImageBase64 == undefined || VisitInImageBase64 == "null") {
                            VisitInImageName = "https://ubitech.ubihrm.com/public/avatars/male.png";
                        }
                        return [4 /*yield*/, Database_1["default"].from("checkin_master")
                                .select("time_out")
                                .where("EmployeeId", EmployeeId)
                                .andWhere("time_out", "00:00:00")
                                .andWhere("time", "!=", "00:00:00")
                                .andWhere("OrganizationId", OrganizationId)];
                    case 3:
                        selectCheckin_Master = _a.sent();
                        if (!selectCheckin_Master.length) return [3 /*break*/, 5];
                        return [4 /*yield*/, Database_1["default"].from("checkin_master")
                                .where("EmployeeId", EmployeeId)
                                .andWhere("OrganizationId", OrganizationId)
                                .andWhere("time_out", "00:00:00")
                                .update({
                                description: "Visit out not punched",
                                location_out: "location",
                                latit_out: "latit",
                                longi_out: "longi",
                                time_out: "time",
                                checkout_img: "",
                                skipped: 1
                            })];
                    case 4:
                        UpdateCheckin_Master = _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, Database_1["default"].insertQuery()
                            .table("checkin_master")
                            .insert({
                            EmployeeId: EmployeeId,
                            location: VisitInLocation,
                            latit: LatitudeIn,
                            longi: LongitudeIn,
                            time: VisitInTime,
                            date: date,
                            client_name: ClientName,
                            ClientId: ClientId,
                            OrganizationId: OrganizationId,
                            checkin_img: VisitInImageName,
                            FakeLocationStatusVisitIn: FakeLocationInStatus,
                            GeofenceStatusVisitIn: GeofenceStatusVisitIn
                        })];
                    case 6:
                        insertInChekin_Master = _a.sent();
                        statusArray["Id"] = Id;
                        statusArray["VisitInTime"] = VisitInTime;
                        statusArray["VisitOutTime"] = VisitOutTime;
                        statusArray["VisitDate"] = date;
                        statusArray["Action"] = "VisitIn";
                        statusArray["EmployeeId"] = EmployeeId;
                        statusArray["OrganizationId"] = OrganizationId;
                        res.push(statusArray);
                        return [3 /*break*/, 12];
                    case 7:
                        if (!(IsVisitInSynced == 1 && IsVisitOutSynced == 1)) return [3 /*break*/, 9];
                        if (ThumbnailVisitInImageName.includes("public")) {
                            VisitInImageName = ThumbnailVisitInImageName;
                        }
                        else {
                            VisitInImageName =
                                "visits/" +
                                    OrganizationId +
                                    "/" +
                                    EmployeeId +
                                    "/" +
                                    ThumbnailVisitInImageName;
                        }
                        if (VisitInImageBase64 == undefined || VisitInImageBase64 == "null") {
                            VisitInImageName = "https://ubitech.ubihrm.com/public/avatars/male.png";
                        }
                        if (ThumbnailVisitOutImageName == undefined) {
                            VisitOutImageName = ThumbnailVisitOutImageName;
                        }
                        else {
                            VisitOutImageName =
                                "visits/" +
                                    OrganizationId +
                                    "/" +
                                    EmployeeId +
                                    "/" +
                                    ThumbnailVisitOutImageName;
                        }
                        if (VisitOutImageBase64 == undefined || VisitOutImageBase64 == "null") {
                            VisitOutImageName =
                                "https://ubitech.ubihrm.com/public/avatars/male.png";
                        }
                        return [4 /*yield*/, Database_1["default"].insertQuery()
                                .table("checkin_master")
                                .insert({
                                EmployeeId: EmployeeId,
                                location: VisitInLocation,
                                location_out: VisitOutLocation,
                                latit: LatitudeIn,
                                longi: LongitudeIn,
                                latit_out: LatitudeOut,
                                longi_out: LongitudeOut,
                                time: VisitInTime,
                                time_out: VisitOutTime,
                                date: date,
                                client_name: ClientName,
                                ClientId: ClientId,
                                OrganizationId: OrganizationId,
                                checkin_img: VisitInImageName,
                                checkout_img: VisitOutImageName,
                                FakeLocationStatusVisitIn: FakeLocationInStatus,
                                FakeLocationStatusVisitOut: FakeLocationOutStatus,
                                GeofenceStatusVisitIn: GeofenceStatusVisitIn,
                                GeofenceStatusVisitOut: GeofenceStatusVisitOut
                            })];
                    case 8:
                        insertInChekin_Master = _a.sent();
                        statusArray["Id"] = Id;
                        statusArray["VisitInTime"] = VisitInTime;
                        statusArray["VisitOutTime"] = VisitOutTime;
                        statusArray["VisitDate"] = date;
                        statusArray["Action"] = "Both";
                        statusArray["EmployeeId"] = EmployeeId;
                        statusArray["OrganizationId"] = OrganizationId;
                        res.push(statusArray);
                        return [3 /*break*/, 12];
                    case 9:
                        if (!(IsVisitInSynced != 1 && IsVisitOutSynced == 1)) return [3 /*break*/, 12];
                        if (ThumbnailVisitOutImageName == undefined) {
                        }
                        else {
                            if (ThumbnailVisitOutImageName.includes("public")) {
                                VisitOutImageName = ThumbnailVisitOutImageName;
                            }
                            else {
                                VisitOutImageName =
                                    "visits/" +
                                        OrganizationId +
                                        "/" +
                                        EmployeeId +
                                        "/" +
                                        ThumbnailVisitOutImageName;
                            }
                        }
                        if (VisitOutImageBase64 == undefined) {
                            VisitOutImageName =
                                "https://ubitech.ubihrm.com/public/avatars/male.png";
                        }
                        return [4 /*yield*/, Database_1["default"].from("checkin_master")
                                .select(Database_1["default"].raw("MAX(id) as VisitId"))
                                .where("EmployeeId", EmployeeId)
                                .andWhere("OrganizationId", OrganizationId)
                                .andWhere("date", date)
                                .orderBy("id", "desc")
                                .limit(1)];
                    case 10:
                        queryVID = _a.sent();
                        if (queryVID.length > 0) {
                            lastVisitSyncedId = queryVID[0].VisitId;
                        }
                        return [4 /*yield*/, Database_1["default"].from("checkin_master")
                                .where("id", lastVisitSyncedId)
                                .andWhere("OrganizationId", OrganizationId)
                                .update({
                                location_out: VisitOutLocation,
                                latit_out: LatitudeOut,
                                longi_out: LongitudeOut,
                                time_out: VisitOutTime,
                                checkout_img: VisitOutImageName,
                                FakeLocationStatusVisitOut: FakeLocationOutStatus,
                                description: Description,
                                GeofenceStatusVisitOut: GeofenceStatusVisitOut
                            })];
                    case 11:
                        UpdateCheckin_Master = _a.sent();
                        statusArray["Id"] = Id;
                        statusArray["VisitInTime"] = VisitInTime;
                        statusArray["VisitOutTime"] = VisitOutTime;
                        statusArray["VisitDate"] = date;
                        statusArray["Action"] = "VisitOut";
                        statusArray["EmployeeId"] = EmployeeId;
                        statusArray["OrganizationId"] = OrganizationId;
                        res.push(statusArray);
                        _a.label = 12;
                    case 12: return [2 /*return*/, res];
                }
            });
        });
    };
    saveVisitOfflineAdvanceService.checkLoginWithSyncAttQr = function (Data) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonString, jsonWithoutSpaces, jsonObject, arrayLength, today, stamp, date, previousDay, EmployeeRecord, Dept_id, Desg_id, areaId, HourlyRateId, OwnerId, interimAttendanceId, attTimeIn, attTimeOut, statusArray, k, profileimage, persongroup_id, flag, suspiciousdevice, ssdisapp_sts, FaceRecognitionThrashhold, FaceRecognitionRestriction, attendance_sts, suspicioustimein_status, suspicioustimeout_status, timein_confidence, timeout_confidence, faceid, loggedHoursAtt, faceidin, faceidout, profileimagein, profileimageout, EmployeeName, shiftType, halfDayStatus, i, keys, j, interimAttendanceId_1, MultipletimeStatus, FakeLocationInStatus, FakeLocationOutStatus, TimeInApp, TimeOutApp, TimeInStampApp, TimeOutStampApp, TimeInRemark, TimeOutRemark, TimeInDeviceId, TimeOutDeviceId, TimeInDeviceName, TimeOutDeviceName, orgTopic, user, userName, userId, userNameByshakir, OrganizationId, AttendanceDate, TimeOutPictureBase64, TimeInPictureBase64, SyncTimeIn, SyncTimeOut, LatitudeIn, LongitudeIn, LatitudeOut, LongitudeOut, TimeInTime, TimeOutTime, GeofenceIn, GeofenceOut, TimeInDevice, TimeOutDevice, TimeInCity, TimeOutCity, TimeInDate, TimeOutDate, TimeInAddress, TimeOutAddress, ThumnailTimeOutPictureBase64, ThumnailTimeInPictureBase64, TimeInAppVersion, TimeOutAppVersion, Platform, new_name, GeofenceInAreaId, latitin, string, query, rows, UserId, ShiftId, geofencePerm, SuspiciousSelfiePerm, SuspiciousDevicePerm, zone, defaultZone, time, stamp_1, today_1, name, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsonString = Data.data;
                        jsonWithoutSpaces = jsonString.replace(/\s/g, "");
                        jsonObject = JSON.parse(jsonWithoutSpaces);
                        arrayLength = jsonObject[0]["2023-06-02"]["interim"].length;
                        today = luxon_1.DateTime.now().toFormat("yyyy-MM-dd");
                        stamp = luxon_1.DateTime.now().toFormat("HH:mm:ss");
                        date = "";
                        previousDay = new Date(Date.now() - 24 * 60 * 60 * 1000)
                            .toISOString()
                            .slice(0, 10);
                        EmployeeRecord = "";
                        Dept_id = "";
                        Desg_id = "";
                        areaId = "";
                        HourlyRateId = "";
                        OwnerId = "";
                        interimAttendanceId = 0;
                        attTimeIn = "";
                        attTimeOut = "";
                        statusArray = [];
                        k = 0;
                        profileimage = "";
                        persongroup_id = "";
                        flag = "0";
                        suspiciousdevice = 0;
                        ssdisapp_sts = 1;
                        FaceRecognitionThrashhold = "";
                        FaceRecognitionRestriction = 0;
                        attendance_sts = 1;
                        suspicioustimein_status = "0";
                        suspicioustimeout_status = "0";
                        timein_confidence = "";
                        timeout_confidence = "";
                        faceid = "";
                        loggedHoursAtt = "";
                        faceidin = "";
                        faceidout = "";
                        profileimagein = "";
                        profileimageout = "";
                        ssdisapp_sts = 1;
                        EmployeeName = "";
                        shiftType = "";
                        halfDayStatus = "";
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < arrayLength)) return [3 /*break*/, 17];
                        keys = Object.keys(jsonObject[i]);
                        console.log(keys);
                        if (!jsonObject[i][keys[0]].hasOwnProperty("interim")) return [3 /*break*/, 16];
                        console.log(jsonObject[i][keys[0]]["interim"].length);
                        j = 0;
                        _a.label = 2;
                    case 2:
                        if (!(j < jsonObject[i][keys[0]]["interim"].length)) return [3 /*break*/, 16];
                        interimAttendanceId_1 = 0;
                        MultipletimeStatus = 0;
                        MultipletimeStatus = 0;
                        FakeLocationInStatus = 0;
                        FakeLocationOutStatus = 0;
                        TimeInApp = "";
                        TimeOutApp = "";
                        TimeInStampApp = "";
                        TimeOutStampApp = "";
                        TimeInRemark = "";
                        TimeOutRemark = "";
                        TimeInDeviceId = "";
                        TimeOutDeviceId = "";
                        TimeInDeviceName = "";
                        TimeOutDeviceName = "";
                        orgTopic = "";
                        user = (jsonObject[i][keys[0]].interim[j].userName !== undefined) ? jsonObject[i][keys[0]].interim[j].userName : 0;
                        return [4 /*yield*/, Helper_1["default"].encode5t(user)];
                    case 3:
                        userName = _a.sent();
                        userId = jsonObject[i][keys[0]].interim[j].UserId || "";
                        userNameByshakir = jsonObject[i][keys[0]].interim[j].userName || 0;
                        OrganizationId = jsonObject[i][keys[0]].interim[j].OrgId || 0;
                        AttendanceDate = jsonObject[i][keys[0]].interim[j].AttendanceDateInOut || '';
                        TimeOutPictureBase64 = jsonObject[i][keys[0]].interim[j].TimeInOutBase64 || '';
                        TimeInPictureBase64 = jsonObject[i][keys[0]].interim[j].TimeInOutBase64 || '';
                        SyncTimeIn = jsonObject[i][keys[0]].interim[j].IsTimeInOutSynced || '';
                        SyncTimeOut = jsonObject[i][keys[0]].interim[j].IsTimeInOutSynced || '';
                        LatitudeIn = jsonObject[i][keys[0]].interim[j].LattitudeInOut || 0;
                        LongitudeIn = jsonObject[i][keys[0]].interim[j].LongiTudeInOut || 0;
                        LatitudeOut = jsonObject[i][keys[0]].interim[j].LattitudeInOut || 0;
                        LongitudeOut = jsonObject[i][keys[0]].interim[j].LongiTudeInOut || 0;
                        TimeInTime = jsonObject[i][keys[0]].interim[j].TimeInOutTime || '';
                        TimeOutTime = jsonObject[i][keys[0]].interim[j].TimeInOutTime || '';
                        GeofenceIn = jsonObject[i][keys[0]].interim[j].GeofenceInOut || '';
                        GeofenceOut = jsonObject[i][keys[0]].interim[j].GeofenceInOut || '';
                        TimeInDevice = jsonObject[i][keys[0]].interim[j].TimeInOutDevice || '';
                        TimeOutDevice = jsonObject[i][keys[0]].interim[j].TimeInOutDevice || '';
                        TimeInCity = jsonObject[i][keys[0]].interim[j].TimeInOutCity || '';
                        TimeOutCity = jsonObject[i][keys[0]].interim[j].TimeInOutCity || '';
                        TimeInDate = jsonObject[i][keys[0]].interim[j].TimeInOutDate || '';
                        TimeOutDate = jsonObject[i][keys[0]].interim[j].TimeInOutDate || '';
                        TimeInAddress = jsonObject[i][keys[0]].interim[j].TimeInOutAddress || '';
                        TimeOutAddress = jsonObject[i][keys[0]].interim[j].TimeInOutAddress || '';
                        ThumnailTimeOutPictureBase64 = jsonObject[i][keys[0]].interim[j].TimeInOutImageName || '';
                        ThumnailTimeInPictureBase64 = jsonObject[i][keys[0]].interim[j].TimeInOutImageName || '';
                        TimeInAppVersion = '';
                        TimeOutAppVersion = '';
                        Platform = '';
                        new_name = "https://ubitech.ubihrm.com/public/avatars/male.png";
                        GeofenceInAreaId = '';
                        latitin = LatitudeIn + "," + LongitudeIn;
                        console.log(orgTopic);
                        if (!(orgTopic == '' || orgTopic == '0' || orgTopic == 'null')) return [3 /*break*/, 15];
                        return [4 /*yield*/, Helper_1["default"].getOrgName(OrganizationId)];
                    case 4:
                        string = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].FirstLettercapital(string)];
                    case 5:
                        string = _a.sent();
                        string = string.replace(/ /g, '-');
                        // Removes characters that are not alphanumeric or hyphens
                        string = string.replace(/[^A-Za-z0-9\-]/g, string);
                        orgTopic = string + OrganizationId;
                        return [4 /*yield*/, Database_1["default"].from('UserMaster')
                                .select('*')
                                .innerJoin('EmployeeMaster', 'UserMaster.EmployeeId', 'EmployeeMaster.id').andWhere("EmployeeMaster.OrganizationId", "UserMaster.OrganizationId")
                                .where('Username', userName)
                                .orWhere('username_mobile', userName)
                                .andWhere("UserMaster.OrganizationId", OrganizationId)
                                .andWhere("UserMaster.archive", 1).andWhere("EmployeeMaster.archive", 1).andWhere("EmployeeMaster.Is_Delete", 0)
                                .andWhereNotIn("EmployeeMaster.OrganizationId", [502, 1074, 138265, 138263, 138262, 138261, 138260, 138259, 138258, 138257, 138256, 138255, 138254,
                                138253, 135095])];
                    case 6:
                        query = _a.sent();
                        rows = query;
                        if (!query.length) return [3 /*break*/, 15];
                        if (!query) return [3 /*break*/, 15];
                        UserId = rows[0].EmployeeId;
                        return [4 /*yield*/, Helper_1["default"].getassignedShiftTimes(UserId, AttendanceDate)];
                    case 7:
                        ShiftId = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getshiftmultipletime_sts(UserId, AttendanceDate, ShiftId)];
                    case 8:
                        MultipletimeStatus = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, 'OutsideGeofence')];
                    case 9:
                        geofencePerm = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, 'SuspiciousSelfie')];
                    case 10:
                        SuspiciousSelfiePerm = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getNotificationPermission(OrganizationId, 'SuspiciousDevice')];
                    case 11:
                        SuspiciousDevicePerm = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].getEmpTimeZone(UserId, OrganizationId)];
                    case 12:
                        zone = _a.sent();
                        defaultZone = luxon_1.DateTime.now().setZone(zone);
                        time = defaultZone.toFormat("HH:mm:ss") == "00:00:00"
                            ? "23:59:00"
                            : defaultZone.toFormat("HH:mm:ss");
                        stamp_1 = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
                        today_1 = defaultZone.toFormat("yyyy-MM-dd");
                        return [4 /*yield*/, Helper_1["default"].getEmpName(UserId)];
                    case 13:
                        name = _a.sent();
                        return [4 /*yield*/, Database_1["default"].from("AppliedLeave").where()];
                    case 14:
                        update = _a.sent();
                        _a.label = 15;
                    case 15:
                        j++;
                        return [3 /*break*/, 2];
                    case 16:
                        i++;
                        return [3 /*break*/, 1];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    return saveVisitOfflineAdvanceService;
}());
exports["default"] = saveVisitOfflineAdvanceService;
