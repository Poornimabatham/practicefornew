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
var Helper_1 = require("App/Helper/Helper");
var StoreRatingService = /** @class */ (function () {
    function StoreRatingService() {
    }
    StoreRatingService.StoreRatings = function (get) {
        return __awaiter(this, void 0, void 0, function () {
            var Empid, organizationId, Remark, Rating, res1, data, date, modifiedDate, selectUbiAttendanceRatings, result, updateUbiAttendanceRatings, insertUbiAttendanceRatings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Empid = get.empid;
                        organizationId = get.orgid;
                        Remark = get.remark;
                        Rating = get.rating;
                        data = {};
                        date = moment_1["default"]().format("YYYY-MM-DD");
                        modifiedDate = moment_1["default"]().format("YYYY-MM-DD HH:mm:ss");
                        return [4 /*yield*/, Database_1["default"].from("ubiAttendanceRatings")
                                .where("EmployeeId", Empid)
                                .andWhere("OrganizationId", organizationId)
                                .select("*")];
                    case 1:
                        selectUbiAttendanceRatings = _a.sent();
                        result = selectUbiAttendanceRatings.length;
                        if (!(result > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Database_1["default"].from(" ubiAttendanceRatings")
                                .where("EmployeeId", Empid)
                                .where("OrganizationId", organizationId)
                                .update({
                                Rating: Rating,
                                Remark: Remark,
                                ModifiedDate: modifiedDate
                            })];
                    case 2:
                        updateUbiAttendanceRatings = _a.sent();
                        res1 = updateUbiAttendanceRatings;
                        if (res1) {
                            data["status"] = "true";
                        }
                        else {
                            data["status"] = "false";
                        }
                        return [2 /*return*/, data];
                    case 3: return [4 /*yield*/, Database_1["default"].insertQuery()
                            .table("ubiAttendanceRatings")
                            .insert({
                            EmployeeId: Empid,
                            OrganizationId: organizationId,
                            Rating: Rating,
                            Remark: Remark,
                            CreatedDate: date
                        })];
                    case 4:
                        insertUbiAttendanceRatings = _a.sent();
                        res1 = insertUbiAttendanceRatings.length;
                        _a.label = 5;
                    case 5:
                        if (res1) {
                            data["status"] = "TRUE";
                        }
                        else {
                            data["status"] = "FALSE";
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    StoreRatingService.getSelectedEmployeeShift = function (get) {
        return __awaiter(this, void 0, void 0, function () {
            var orgid, empid, shiftid, res, selectShiftMasterist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgid = get.orgid;
                        empid = get.empid;
                        return [4 /*yield*/, Helper_1["default"].getShiftIdByEmpID(empid)];
                    case 1:
                        shiftid = _a.sent();
                        res = [];
                        return [4 /*yield*/, Database_1["default"].from('ShiftMaster').select('Id', 'Name', 'TimeIn', 'TimeOut', 'shifttype', 'HoursPerDay').where('Id', shiftid).where('OrganizationId', orgid)];
                    case 2:
                        selectShiftMasterist = _a.sent();
                        if (selectShiftMasterist.length > 0) {
                            selectShiftMasterist.forEach(function (row) {
                                var data = {};
                                data['Id'] = row.Id;
                                data['Name'] = row.Name;
                                data['TimeIn'] = row.TimeIn;
                                data['TimeOut'] = row.TimeOut;
                                data['shifttype'] = row.shifttype;
                                data['HoursPerDay'] = row.HoursPerDay;
                                res.push(data);
                            });
                            return [2 /*return*/, res];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return StoreRatingService;
}());
exports["default"] = StoreRatingService;
