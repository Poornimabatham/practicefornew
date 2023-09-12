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
var moment_1 = require("moment");
var luxon_1 = require("luxon");
var TempAssignClientService = /** @class */ (function () {
    function TempAssignClientService() {
    }
    TempAssignClientService.TempAssignClient = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var id, cid, orgid, date, res, selectClientList, data2, insertClientList, contactPersons, selectClientList2, Name, timezone, defaulttimeZone, dateTime, formattedDate, getempname, appModule, module, actionPerformed, activityby, insertActivityHistoryMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = data.uid;
                        cid = data.cid;
                        orgid = data.cid;
                        date = new Date();
                        return [4 /*yield*/, Database_1["default"].from("clientlist")
                                .select("id")
                                .where("employeeid", id)
                                .andWhere("clientid", cid)
                                .andWhere("OrganizationId", orgid)
                                .andWhere("AssignStatus", 1)];
                    case 1:
                        selectClientList = _a.sent();
                        res = selectClientList.length;
                        data2 = {};
                        if (res > 0) {
                            data2["sts"] = "2"; // if row already exist
                            return [2 /*return*/, data2];
                        }
                        insertClientList = Database_1["default"].table("clientlist").insert({
                            employeeid: id,
                            clientid: cid,
                            organizationid: orgid,
                            createddate: date,
                            AssignStatus: 1
                        });
                        contactPersons = [];
                        return [4 /*yield*/, insertClientList];
                    case 2:
                        res = (_a.sent()).length;
                        data2["sts"] = res;
                        return [4 /*yield*/, Database_1["default"].from("ClientMaster ")
                                .where("Id", cid)
                                .select("Name")];
                    case 3:
                        selectClientList2 = _a.sent();
                        Name = selectClientList2;
                        Name.forEach(function (val) {
                            var contactPerson = val.Name;
                            contactPersons.push(contactPerson);
                        });
                        if (!(Name > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, Helper_1["default"].getTimeZone(orgid)];
                    case 4:
                        timezone = _a.sent();
                        defaulttimeZone = moment_1["default"]().tz(timezone).toDate();
                        dateTime = luxon_1.DateTime.fromJSDate(defaulttimeZone);
                        formattedDate = dateTime.toFormat("yy-MM-dd HH:mm:ss");
                        return [4 /*yield*/, Helper_1["default"].getempnameById(id)];
                    case 5:
                        getempname = _a.sent();
                        appModule = "Client";
                        module = "Attendance App";
                        actionPerformed = "Client <b>\"." + contactPersons + ".\"</b> has been temporary assign to <b>\"." + getempname + " .\n        \"</b> from <b> Attendance App  </b>";
                        activityby = 1;
                        return [4 /*yield*/, Helper_1["default"].ActivityMasterInsert(formattedDate, orgid, id, activityby, appModule, actionPerformed, module)];
                    case 6:
                        insertActivityHistoryMaster = _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, res];
                }
            });
        });
    };
    TempAssignClientService.getServicePrivateKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, selectCredentialMasterList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = [];
                        data = {};
                        return [4 /*yield*/, Database_1["default"].from("credentialsMaster")
                                .select("*")
                                .where("Status", 1)
                                .andWhere("serviceUpdateSts", 0)];
                    case 1:
                        selectCredentialMasterList = _a.sent();
                        if (selectCredentialMasterList.length) {
                            selectCredentialMasterList.forEach(function (val) {
                                data["host"] = val.Host;
                                data["privateKey"] = val.PrivateKey;
                                data["serviceUpdateSts"] = false;
                                res.push(data);
                            });
                        }
                        else {
                            data["host"] = "";
                            data["privateKey"] = "";
                            data["serviceUpdateSts"] = true;
                            res.push(data);
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return TempAssignClientService;
}());
exports["default"] = TempAssignClientService;
