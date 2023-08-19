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
var moment = require("moment-timezone");
var luxon_1 = require("luxon");
var DesignationService = /** @class */ (function () {
    function DesignationService() {
    }
    DesignationService.AddDesignation = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, designationList, result, affectedRows, insertDesignation, affectedRows2, timezone, defaulttimeZone, dateTime, formattedDate, module, appModule, activityby, actionPerformed, actionperformed2, insertActivityHistoryMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentDate = new Date();
                        console.log(currentDate);
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("DesignationMaster")
                                .where("Name", a.name)
                                .andWhere("OrganizationId", a.orgid)
                                .select("Id")];
                    case 1:
                        designationList = _a.sent();
                        console.log(designationList);
                        result = [];
                        affectedRows = designationList.length;
                        console.log(affectedRows);
                        if (affectedRows > 0) {
                            result["status"] = -1;
                            return [2 /*return*/, "user already exist in this list"];
                        }
                        return [4 /*yield*/, Database_1["default"].insertQuery()
                                .table("DesignationMaster")
                                .insert({
                                Name: a.name,
                                OrganizationId: a.orgid,
                                CreatedDate: currentDate,
                                CreatedById: a.uid,
                                LastModifiedDate: currentDate,
                                LastModifiedById: a.uid,
                                OwnerId: a.uid,
                                Code: 8,
                                RoleId: 9,
                                Description: a.desc,
                                archive: '1',
                                daysofnotice: "YourDaysOfNoticeValue",
                                add_sts: "YourAddStsValue"
                            })];
                    case 2:
                        insertDesignation = _a.sent();
                        affectedRows2 = insertDesignation.length;
                        if (!(affectedRows2 > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Helper_1["default"].getTimeZone(a.orgid)];
                    case 3:
                        timezone = _a.sent();
                        defaulttimeZone = moment().tz(timezone).toDate();
                        dateTime = luxon_1.DateTime.fromJSDate(defaulttimeZone);
                        formattedDate = dateTime.toFormat("yy-MM-dd HH:mm:ss");
                        module = "Attendance app";
                        appModule = "Designation";
                        activityby = 1;
                        return [4 /*yield*/, Helper_1["default"].getempnameById(a.uid)];
                    case 4:
                        actionPerformed = _a.sent();
                        actionperformed2 = a.name + " Designation \u00A0has been Added by \u00A0" + actionPerformed + "from Attendance App";
                        return [4 /*yield*/, Database_1["default"].insertQuery()
                                .table("ActivityHistoryMaster")
                                .insert({
                                LastModifiedDate: formattedDate,
                                LastModifiedById: a.uid,
                                ActionPerformed: actionperformed2,
                                Module: module,
                                OrganizationId: a.orgid,
                                ActivityBy: activityby,
                                adminid: a.uid,
                                AppModule: appModule
                            })];
                    case 5:
                        insertActivityHistoryMaster = _a.sent();
                        result["status"] = 1;
                        _a.label = 6;
                    case 6: return [2 /*return*/, result["status"]];
                }
            });
        });
    };
    DesignationService.getDesignation = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var begin, getDesignationList, result, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        begin = (a.currentpage - 1) * a.perpage;
                        getDesignationList = Database_1["default"].from("DesignationMaster")
                            .select("Id", "OrganizationId", Database_1["default"].raw("IF(LENGTH(`Name`) > 30, CONCAT(SUBSTR(`Name`, 1, 30), '...'), `Name`) AS `Name`"), "archive")
                            .where("OrganizationId", a.orgid)
                            .orderBy("Name", "asc")
                            .limit(5);
                        if (a.currentpage != 0 && a.pagename == 0) {
                            getDesignationList = getDesignationList.offset(begin).limit(a.perpage);
                        }
                        if (a.status != undefined) {
                            getDesignationList = getDesignationList.where("Archive", a.status);
                        }
                        return [4 /*yield*/, getDesignationList];
                    case 1:
                        result = _a.sent();
                        res = 0;
                        result.forEach(function (val) {
                            var data = {};
                            data["name"] = val.Name;
                            data["archive"] = val.archive;
                            var Name = data["name"];
                            var archive = data["archive"];
                            if (Name.toUpperCase() == "TRIAL DESIGNATION" && archive === 1) {
                                res = 1;
                            }
                        });
                        if (res == 1) {
                            getDesignationList = Database_1["default"].from("DesignationMaster")
                                .select("Id", Database_1["default"].raw("IF(LENGTH(`Name`) > 30, CONCAT(SUBSTR(`Name`, 1, 30), '...'), `Name`) AS `Name`"), "archive")
                                .where("OrganizationId", a.orgid)
                                .orderBy("name", "asc");
                        }
                        return [2 /*return*/, getDesignationList];
                }
            });
        });
    };
    DesignationService.updateDesignation = function (c) {
        return __awaiter(this, void 0, void 0, function () {
            var result, curdate, getDesignationList, Result, response, getDesignationList2, name, sts1, res, updateDesignaion, count, timezone, defaulttimeZone, dateTime, formattedDate, module, appModule, actionperformed, activityBy, getempname, insertActivityHistoryMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        result["status"] = 0;
                        curdate = new Date();
                        return [4 /*yield*/, Database_1["default"].from("DesignationMaster")
                                .select("Id")
                                .where("Name", c.UpdateName)
                                .andWhere("OrganizationId", c.Updateorgid)
                                .andWhere("Id", c.Updateid)];
                    case 1:
                        getDesignationList = _a.sent();
                        return [4 /*yield*/, getDesignationList];
                    case 2:
                        Result = _a.sent();
                        response = Result.length;
                        if (response > 0) {
                            result["status"] = "User already exist in this is id";
                            return [2 /*return*/, result["status"]];
                        }
                        return [4 /*yield*/, Database_1["default"].from("DesignationMaster")
                                .select("Name", "archive")
                                .where("OrganizationId", c.Updateorgid)
                                .where("Id", c.Updateid)];
                    case 3:
                        getDesignationList2 = _a.sent();
                        name = "";
                        sts1 = "";
                        res = "";
                        if (name != c.UpdateName) {
                            res = 2;
                        }
                        else if (name == c.UpdateName && c.sts != sts1) {
                            res = c.sts;
                        }
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("DesignationMaster")
                                .where("id", c.Updateid)
                                .update({
                                Name: c.UpdateName,
                                LastModifiedDate: curdate,
                                LastModifiedById: c.Updateid,
                                archive: c.sts,
                                OrganizationId: c.Updateorgid
                            })];
                    case 4:
                        updateDesignaion = _a.sent();
                        return [4 /*yield*/, updateDesignaion];
                    case 5:
                        count = _a.sent();
                        if (!(count > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, Helper_1["default"].getTimeZone(c.Updateorgid)];
                    case 6:
                        timezone = _a.sent();
                        defaulttimeZone = moment().tz(timezone).toDate();
                        dateTime = luxon_1.DateTime.fromJSDate(defaulttimeZone);
                        formattedDate = dateTime.toFormat("yy-MM-dd HH:mm:ss");
                        module = "Attendance app";
                        appModule = "Designation";
                        actionperformed = void 0;
                        activityBy = 1;
                        return [4 /*yield*/, Helper_1["default"].getempnameById(c.Updateid)];
                    case 7:
                        getempname = _a.sent();
                        if (res == 2) {
                            actionperformed = c.UpdateName + " designation has been edited by " + getempname + " ";
                        }
                        else if (res == 1) {
                            actionperformed = c.UpdateName + " designation has been active by " + getempname + " ";
                        }
                        else {
                            actionperformed = c.UpdateName + " designation has been inactive by " + getempname + " ";
                        }
                        return [4 /*yield*/, Database_1["default"].insertQuery()
                                .table("ActivityHistoryMaster")
                                .insert({
                                ActionPerformed: actionperformed,
                                AppModule: appModule,
                                LastModifiedById: c.uid,
                                LastModifiedDate: formattedDate,
                                Module: module,
                                OrganizationId: c.orgid,
                                ActivityBy: activityBy,
                                adminid: c.uid
                            })];
                    case 8:
                        insertActivityHistoryMaster = _a.sent();
                        result["status"] = "inserted in activity master";
                        _a.label = 9;
                    case 9: return [2 /*return*/, result["status"]];
                }
            });
        });
    };
    return DesignationService;
}());
exports["default"] = DesignationService;
