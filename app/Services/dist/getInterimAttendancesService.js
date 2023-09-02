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
var GetInterimAttendancesService = /** @class */ (function () {
    function GetInterimAttendancesService() {
    }
    GetInterimAttendancesService.getInterimAttendances = function (data2) {
        return __awaiter(this, void 0, void 0, function () {
            var attendanceMasterId, selectInterimAttenceslist, response, Output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attendanceMasterId = data2.attendanceMasterId;
                        return [4 /*yield*/, Database_1["default"].from("InterimAttendances")
                                .select("id", "TimeIn", "TimeInLocation", "LatitudeIn", "LongitudeIn", "TimeOut", "TimeOutLocation", "LatitudeOut", "LongitudeOut", "TimeInEditStatus", "TimeOutEditStatus", "AttendanceStatus", "Device", "TimeInIp", "TimeOutIp", "IsDelete", "FakeLocationStatusTimeIn", "FakeLocationStatusTimeOut", "Platform", "TimeInFaceId", "TimeOutFaceId", "SuspiciousTimeInStatus", "SuspiciousTimeOutStatus", "PersistedFaceTimeIn", "PersistedFaceTimeOut", "TimeInConfidence", "TimeOutConfidence", "TimeInDeviceId", "TimeOutDeviceId", "TimeInCity", "TimeOutCity", "TimeInAppVersion", "TimeOutAppVersion", "TimeInGeofence", "TimeOutGeofence", "AttendanceMasterId", "SuspiciousDeviceTimeInStatus", "SuspiciousDeviceTimeOutStatus", "TimeInDeviceName", "TimeOutDeviceName", "LoggedHours", "TimeInApp", "TimeOutApp", Database_1["default"].raw("SUBSTRING_INDEX(TimeInImage, '.com/', -1) AS TimeInImage"), Database_1["default"].raw("SUBSTRING_INDEX(TimeOutImage, '.com/', -1) AS TimeOutImage"))
                                .where("AttendanceMasterId", attendanceMasterId)
                                .orderBy("id", "desc")];
                    case 1:
                        selectInterimAttenceslist = _a.sent();
                        response = [];
                        return [4 /*yield*/, selectInterimAttenceslist];
                    case 2:
                        Output = _a.sent();
                        Output.forEach(function (row) {
                            var data2 = {};
                            data2["id"] = row.id;
                            data2["TimeIn"] = row.TimeIn;
                            if (row.TimeInImage != "") {
                                data2["TimeInImage"] = row.TimeInImage;
                            }
                            else {
                                data2["TimeInImage"] = "";
                            }
                            if (row.TimeOutImage != "") {
                                data2["TimeOutImage"] = row.TimeOutImage;
                            }
                            else {
                                data2["TimeOutImage"] = "";
                            }
                            data2["TimeInLocation"] = row.TimeInLocation;
                            data2["LatitudeIn"] = row.LatitudeIn;
                            data2["LongitudeIn"] = row.LongitudeIn;
                            data2["TimeOut"] = row.TimeOut;
                            //data2['TimeOutImage']   = row.TimeOutImage;
                            data2["TimeOutLocation"] = row.TimeOutLocation;
                            data2["LatitudeOut"] = row.LatitudeOut;
                            data2["LongitudeOut"] = row.LongitudeOut;
                            data2["TimeInEditStatus"] = row.TimeInEditStatus;
                            data2["TimeOutEditStatus"] = row.TimeOutEditStatus;
                            data2["AttendanceStatus"] = row.AttendanceStatus;
                            data2["Device"] = row.Device;
                            data2["TimeInIp"] = row.TimeInIp;
                            data2["TimeOutIp"] = row.TimeOutIp;
                            data2["FakeLocationStatusTimeIn"] = row.FakeLocationStatusTimeIn;
                            data2["FakeLocationStatusTimeOut"] = row.FakeLocationStatusTimeOut;
                            data2["Platform"] = row.Platform;
                            data2["TimeInFaceId"] = row.TimeInFaceId;
                            data2["TimeOutFaceId"] = row.TimeOutFaceId;
                            data2["SuspiciousTimeInStatus"] = row.SuspiciousTimeInStatus;
                            data2["SuspiciousTimeOutStatus"] = row.SuspiciousTimeOutStatus;
                            data2["PersistedFaceTimeIn"] = row.PersistedFaceTimeIn;
                            data2["PersistedFaceTimeOut"] = row.PersistedFaceTimeOut;
                            data2["TimeInConfidence"] = row.TimeInConfidence;
                            data2["TimeOutConfidence"] = row.TimeOutConfidence;
                            data2["TimeInDeviceId"] = row.TimeInDeviceId;
                            data2["TimeOutDeviceId"] = row.TimeOutDeviceId;
                            data2["TimeInCity"] = row.TimeInCity;
                            data2["TimeOutCity"] = row.TimeOutCity;
                            data2["TimeInAppVersion"] = row.TimeInAppVersion;
                            data2["TimeOutAppVersion"] = row.TimeOutAppVersion;
                            data2["TimeInGeofence"] = row.TimeInGeofence;
                            data2["TimeOutGeofence"] = row.TimeOutGeofence;
                            data2["AttendanceMasterId"] = row.AttendanceMasterId;
                            data2["SuspiciousDeviceTimeInStatus"] = row.SuspiciousDeviceTimeInStatus;
                            data2["SuspiciousDeviceTimeOutStatus"] =
                                row.SuspiciousDeviceTimeOutStatus;
                            data2["TimeInDeviceName"] = row.TimeInDeviceName;
                            data2["TimeOutDeviceName"] = row.TimeOutDeviceName;
                            data2["LoggedHours"] = row.LoggedHours;
                            data2["TimeInApp"] = row.TimeInApp;
                            data2["TimeOutApp"] = row.TimeOutApp;
                            data2["IsDelete"] = row.IsDelete;
                            response.push(data2);
                        });
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return GetInterimAttendancesService;
}());
exports["default"] = GetInterimAttendancesService;
