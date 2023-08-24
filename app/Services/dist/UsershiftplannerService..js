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
var moment_1 = require("moment");
var UsershiftplannerService = /** @class */ (function () {
    function UsershiftplannerService() {
    }
    UsershiftplannerService.usershiftplanner = function (getvalue) {
        return __awaiter(this, void 0, void 0, function () {
            var userid, organizationId, selectAttendanceMasterList, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userid = getvalue.uid;
                        organizationId = getvalue.orgid;
                        return [4 /*yield*/, Database_1["default"].from("AttendanceMaster as A")
                                .innerJoin("ShiftMaster AS S", "A.ShiftId", "S.Id")
                                .select("A.AttendanceDate", "A.TimeIn as PunchTimeIn", "A.TimeOut as PunchTimeOut", "A.AttendanceStatus", "A.ShiftId", "S.shifttype", "S.HoursPerDay", "S.TimeIn", "S.TimeOut", "A.disapprove_sts ")
                                .where("S.OrganizationId", organizationId)
                                .where("A.EmployeeId", userid)];
                    case 1:
                        selectAttendanceMasterList = _a.sent();
                        response = [];
                        selectAttendanceMasterList.forEach(function (element) {
                            var data = {};
                            var date = new Date(element.AttendanceDate);
                            data["AttendanceDate"] = moment_1["default"](date).format("YYYY-MM-DD");
                            data["AttendanceStatus"] = element.AttendanceStatus;
                            data["ShiftType"] = element.shifttype;
                            data["STimeIn"] = element.TimeIn.substr(0, 5);
                            data["STimeOut"] = element.TimeOut.substr(0, 5);
                            data["PunchTimeIn"] = element.PunchTimeIn.substr(0, 5);
                            data["PunchTimeOut"] = element.PunchTimeOut.substr(0, 5);
                            data["disapprove"] = element.disapprove_sts;
                            data["Logged"] = element.HoursPerDay.substr(0, 5);
                            response.push(data);
                        });
                        return [2 /*return*/, response];
                }
            });
        });
    };
    UsershiftplannerService.Storedeviceinformation = function (inputdata) {
        return __awaiter(this, void 0, void 0, function () {
            var Empid, Deviceid, Devicename, updateEmployeeMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Empid = inputdata.empid;
                        Deviceid = inputdata.deviceid;
                        Devicename = inputdata.devicename;
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .where("Id", Empid)
                                .update({
                                DeviceName: Devicename,
                                DeviceId: Deviceid
                            })];
                    case 1:
                        updateEmployeeMaster = _a.sent();
                        return [2 /*return*/, updateEmployeeMaster];
                }
            });
        });
    };
    return UsershiftplannerService;
}());
exports["default"] = UsershiftplannerService;
