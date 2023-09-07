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
var Helper_1 = require("../Helper/Helper");
var Helper_2 = require("../Helper/Helper");
var moment_timezone_1 = require("moment-timezone");
var Usersettingservice = /** @class */ (function () {
    function Usersettingservice() {
    }
    Usersettingservice.changepassword = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orgid, empid, cpassword, npass, rptpass, res, res1, data1, query, qur, qur1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgid = data.uid;
                        empid = data.empid;
                        return [4 /*yield*/, Helper_1["default"].encode5t(data.cpassword)];
                    case 1:
                        cpassword = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].encode5t(data.npassword)];
                    case 2:
                        npass = _a.sent();
                        return [4 /*yield*/, Helper_1["default"].encode5t(data.rtpassword)];
                    case 3:
                        rptpass = _a.sent();
                        res = [];
                        res1 = {};
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("UserMaster")
                                .select("*")
                                .where("EmployeeId", empid)
                                .andWhere("OrganizationId", orgid)
                                .andWhere("Password", cpassword)];
                    case 4:
                        query = _a.sent();
                        if (query.length == 1) {
                            query.forEach(function (row) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var data;
                                    return __generator(this, function (_a) {
                                        data = {};
                                        data["sts"] = row.appSuperviserSts;
                                        res.push(data);
                                        return [2 /*return*/];
                                    });
                                });
                            });
                            data1 = res[0].sts;
                        }
                        else {
                            if (cpassword == npass) {
                                res1["status"] = 3;
                            }
                            else {
                                res1["status"] = "password has been  changed";
                            }
                        }
                        if (!(query.length == 1)) return [3 /*break*/, 7];
                        if (!(npass == rptpass)) return [3 /*break*/, 7];
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .where("EmployeeId", empid)
                                .andWhere("OrganizationId", orgid)
                                .update({ Password: rptpass, Password_sts: 1 })];
                    case 5:
                        qur = _a.sent();
                        res1["status"] = qur;
                        res1["message"] = "Changed Password";
                        if (!(data1 == 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, Database_1["default"].from("admin_login")
                                .where("OrganizationId", orgid)
                                .update({ password: rptpass, changepasswordStatus: 1 })];
                    case 6:
                        qur1 = _a.sent();
                        res1["status"] = qur1;
                        res1["message"] = "Changed Password";
                        _a.label = 7;
                    case 7: return [2 /*return*/, res1];
                }
            });
        });
    };
    // static async UpdateProfilePhoto(data){
    //    const Emplid = data.empid;
    //    const orgid = data.orgid;
    //    var new_name = Emplid + "jpg";
    //    var filePath = data.file;
    //    }
    Usersettingservice.getPunchInfoCsv = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var Empid, Orgid, csv, today, loginEmp, currentPage, perpage, begin, zone, adminstatus, res, new_date, query, query, dptid, querydata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Empid = data.Empid;
                        Orgid = data.Orgid;
                        csv = data.Csv;
                        today = new Date(data.Date);
                        loginEmp = data.loginEmp;
                        currentPage = data.currentPage;
                        perpage = data.perpage;
                        begin = (currentPage - 1) * perpage;
                        return [4 /*yield*/, Helper_2["default"].getEmpTimeZone(Empid, Orgid)];
                    case 1:
                        zone = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].getAdminStatus(loginEmp)];
                    case 2:
                        adminstatus = _a.sent();
                        res = [];
                        new_date = moment_timezone_1["default"](today).format("YYYY-MM-DD");
                        if (Empid != 0) {
                            query = Database_1["default"].query()
                                .from("checkin_master")
                                .select("Id", "EmployeeId", "location", "location_out", "time", "time_out", Database_1["default"].raw("SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img"), Database_1["default"].raw("SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img"), "client_name", "description", "latit", "longi", "latit_out", "longi_out")
                                .where("OrganizationId", Orgid)
                                .andWhere("EmployeeId", Empid)
                                .andWhere("date", new_date)
                                .andWhereIn("EmployeeId", Database_1["default"].raw("SELECT Id from EmployeeMaster where OrganizationId = " + Orgid + " AND Is_Delete = 0"))
                                .orderBy("Id", "asc");
                        }
                        else {
                            query = Database_1["default"].query()
                                .from("checkin_master")
                                .select("Id", "EmployeeId", "location", "location_out", "time", "time_out", Database_1["default"].raw("SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img"), Database_1["default"].raw("SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img"), "client_name", "description", "latit", "longi", "latit_out", "longi_out")
                                .where("OrganizationId", Orgid)
                                .andWhere("EmployeeId", Empid)
                                .andWhere("date", new_date)
                                .andWhereIn("EmployeeId", Database_1["default"].raw("SELECT Id from EmployeeMaster where OrganizationId = " + Orgid + " AND Is_Delete = 0"))
                                .orderBy("Id", "asc");
                        }
                        if (!(adminstatus == 2)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Helper_2["default"].getDepartmentIdByEmpID(loginEmp)];
                    case 3:
                        dptid = _a.sent();
                        query = query.andWhere("Department", dptid);
                        _a.label = 4;
                    case 4: return [4 /*yield*/, query];
                    case 5:
                        querydata = _a.sent();
                        querydata.forEach(function (row) {
                            var data = {};
                            data["Id"] = row.Id;
                            data["Employeeid"] = row.EmployeeId;
                            data["Emp_Name"] = Helper_2["default"].getempnameById(row.EmployeeId);
                            data["loc_in"] = row.location;
                            data["loc_out"] = row.location_out;
                            data["timein"] = row.time;
                            data["timeout"] = row.time_out;
                            data["latit"] = row.latit;
                            data["logit"] = row.longi;
                            data["latit_in"] = row.latit_out;
                            data["longi_out"] = row.longi_out;
                            data["client"] = row.client_name;
                            data["description"] = row.description;
                            if (row.checkin_img != "") {
                                data["checkin_img"] = row.checkin_img; /////write aws function getPresignedURL
                            }
                            else {
                                data["checkin_img"] = "";
                            }
                            if ((row.checkout_img = "")) {
                                data["checout_img"] = row.checkout_img;
                            }
                            else {
                                data["checout_img"] = "";
                            }
                            res.push(data);
                        });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Usersettingservice.getPunchInfo = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var Empid, Orgid, csv, today, loginEmp, currentPage, perpage, begin, zone, adminstatus, res, new_date, query, query, dptid, querydata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Empid = data.Empid;
                        Orgid = data.Orgid;
                        csv = data.Csv;
                        today = new Date(data.Date);
                        loginEmp = data.loginEmp;
                        currentPage = data.currentPage;
                        perpage = data.perpage;
                        begin = (currentPage - 1) * perpage;
                        return [4 /*yield*/, Helper_2["default"].getEmpTimeZone(Empid, Orgid)];
                    case 1:
                        zone = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].getAdminStatus(Empid)];
                    case 2:
                        adminstatus = _a.sent();
                        res = [];
                        new_date = moment_timezone_1["default"](today).format("YYYY-MM-DD");
                        if (Empid != 0) {
                            query = Database_1["default"].query()
                                .from("checkin_master")
                                .select("Id", "EmployeeId", "location", "location_out", "time", "time_out", Database_1["default"].raw("SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img"), Database_1["default"].raw("SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img"), "client_name", "description", "latit", "longi", "latit_out", "longi_out", "GeofenceStatusVisitIn", "GeofenceStatusVisitOut")
                                .where("OrganizationId", Orgid)
                                .andWhere("EmployeeId", Empid)
                                .andWhere("date", new_date)
                                .andWhereIn("EmployeeId", Database_1["default"].raw("SELECT Id from EmployeeMaster where OrganizationId = " + Orgid + " AND Is_Delete = 0"))
                                .orderBy("Id", "asc");
                        }
                        else {
                            query = Database_1["default"].query()
                                .from("checkin_master")
                                .select("Id", "EmployeeId", "location", "location_out", "time", "time_out", Database_1["default"].raw("SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img"), Database_1["default"].raw("SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img"), "client_name", "description", "latit", "longi", "latit_out", "longi_out", "GeofenceStatusVisitIn", "GeofenceStatusVisitOut")
                                .where("OrganizationId", Orgid)
                                .andWhere("EmployeeId", Empid)
                                .andWhere("date", new_date)
                                .andWhereIn("EmployeeId", Database_1["default"].raw("SELECT Id from EmployeeMaster where OrganizationId = " + Orgid + " AND Is_Delete = 0"))
                                .orderBy("Id", "asc")
                                .limit(perpage)
                                .offset(begin);
                        }
                        if (!(adminstatus == 2)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Helper_2["default"].getDepartmentIdByEmpID(Empid)];
                    case 3:
                        dptid = _a.sent();
                        query = query.andWhere("Department", dptid);
                        _a.label = 4;
                    case 4: return [4 /*yield*/, query];
                    case 5:
                        querydata = _a.sent();
                        querydata.forEach(function (row) {
                            var data = {};
                            data["Id"] = row.Id;
                            data["Employeeid"] = row.EmployeeId;
                            data["Emp_Name"] = Helper_2["default"].getempnameById(row.EmployeeId);
                            data["loc_in"] = row.location;
                            data["loc_out"] = row.location_out;
                            data["timein"] = row.time;
                            data["timeout"] = row.time_out;
                            data["latit"] = row.latit;
                            data["logit"] = row.longi;
                            data["latit_in"] = row.latit_out;
                            data["longi_out"] = row.longi_out;
                            data["client"] = row.client_name;
                            data["description"] = row.description;
                            data["GeofenceStatusVisitIn"] = row.GeofenceStatusVisitIn;
                            data["GeofenceStatusVisitOut"] = row.GeofenceStatusVisitOut;
                            if (row.checkin_img != "") {
                                data["checkin_img"] = row.checkin_img; /////write aws function getPresignedURL
                            }
                            else {
                                data["checkin_img"] = "";
                            }
                            if (row.checkout_img != "") {
                                data["checout_img"] = row.checkout_img;
                            }
                            else {
                                data["checout_img"] = "";
                            }
                            res.push(data);
                        });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Usersettingservice.getEmployeesList = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var Empid, Orgid, adminstatus, res, query, dptid, getquerydata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Empid = data.Empid;
                        Orgid = data.Orgid;
                        return [4 /*yield*/, Helper_2["default"].getAdminStatus(Empid)];
                    case 1:
                        adminstatus = _a.sent();
                        res = [];
                        query = Database_1["default"].query()
                            .from("EmployeeMaster")
                            .select("Id", "FirstName", "EmployeeCode", "NotificationStatus", Database_1["default"].raw("CONCAT(FirstName, ' ', lastname) as Name"))
                            .where("archive", 1)
                            .andWhere("is_Delete", 0)
                            .andWhere("OrganizationId", Orgid)
                            .orderBy("FirstName", "asc");
                        if (!(adminstatus == 2)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Helper_2["default"].getDepartmentIdByEmpID(Empid)];
                    case 2:
                        dptid = _a.sent();
                        query = query.andWhere("Department", dptid);
                        _a.label = 3;
                    case 3: return [4 /*yield*/, query];
                    case 4:
                        getquerydata = _a.sent();
                        getquerydata.forEach(function (row) {
                            var data = {};
                            data["Id"] = row.Id;
                            data["name"] = row.Name;
                            if (row.NotificationStatus == 1) {
                                data["sts"] = true;
                            }
                            else {
                                data["sts"] = false;
                            }
                            if (row.EmployeeCode != "" || row.EmployeeCode != null) {
                                data["ecode"] = row.EmployeeCode;
                            }
                            else {
                                data["ecode"] = "-";
                            }
                            res.push(data);
                        });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Usersettingservice.getOrgCheck = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var Orgid, status, result, querydata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Orgid = data.Orgid;
                        status = false;
                        result = [];
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("NotificationStatus")
                                .select("*")
                                .where("OrganizationId", Orgid)];
                    case 1:
                        querydata = _a.sent();
                        querydata.forEach(function (row) {
                            var data = {};
                            data["Visit"] = row.Visit;
                            data["OutsideGeofence"] = row.OutsideGeofence;
                            data["FakeLocation"] = row.FakeLocation;
                            data["FaceIdReg"] = row.FaceIdReg;
                            data["FaceIdDisapproved"] = row.FaceIdDisapproved;
                            data["SuspiciousSelfie"] = row.SuspiciousSelfie;
                            data["SuspiciousDevice"] = row.SuspiciousDevice;
                            data["DisapprovedAtt"] = row.DisapprovedAtt;
                            data["AttEdited"] = row.AttEdited;
                            data["TimeOffStart"] = row.TimeOffStart;
                            data["TimeOffEnd"] = row.TimeOffEnd;
                            data["OrganizationId"] = row.OrganizationId;
                            data["BasicLeave"] = row.BasicLeave;
                            data["status"] = true;
                            result.push(data);
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Usersettingservice.NotificationTest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var Columnname, value, orgid, Data, result, query, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Columnname = data.ColumnName;
                        value = data.Value;
                        orgid = data.OrgId;
                        result = {};
                        if (Columnname == "TimeOffStart") {
                            Data = 0;
                        }
                        else {
                            Data = 1;
                        }
                        if (!(Data == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("NotificationStatus")
                                .where("OrganizationId", orgid)
                                .update("" + Columnname, value)
                                .update("TimeOffEnd", value)];
                    case 1:
                        query = _a.sent();
                        result["status"] = 1;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, Database_1["default"].query()
                            .from("NotificationStatus")
                            .where("OrganizationId", orgid)
                            .update("" + Columnname, value)];
                    case 3:
                        query = _a.sent();
                        if (query.length > 0) {
                            result["status"] = 2;
                        }
                        else {
                            result["status"] = "No Update";
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    Usersettingservice.UpdateNotificationStatus = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orgid, status, empid, res, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgid = data.orgid;
                        status = data.status;
                        empid = data.empid;
                        res = {};
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("EmployeeMaster")
                                .where("Id", empid)
                                .andWhere("OrganizationId", orgid)
                                .update({ NotificationStatus: status })];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            if (status == 0) {
                                res["status"] = false;
                            }
                            else {
                                res["status"] = true;
                            }
                            return [2 /*return*/, res];
                        }
                        else {
                            res["status"] = "No Update";
                            return [2 /*return*/, res];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Usersettingservice.setQrKioskPin = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orgId, empId, Qr, result, query, query2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgId = data.orgId;
                        empId = data.empId;
                        Qr = data.qRKioskPin;
                        result = {};
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("UserMaster")
                                .select("*")
                                .where("EmployeeId", empId)
                                .andWhere("OrganizationId", orgId)];
                    case 1:
                        query = _a.sent();
                        if (!(query.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("UserMaster")
                                .where("EmployeeId", empId)
                                .andWhere("OrganizationId", orgId)
                                .update({ kioskPin: Qr })];
                    case 2:
                        query2 = _a.sent();
                        if (query2.length > 0) {
                            result["response"] = 1;
                        }
                        result["response"] = 0;
                        return [3 /*break*/, 4];
                    case 3:
                        result["response"] = 0;
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    Usersettingservice.ChangeQrKioskPin = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var empId, orgId, oldPin, newPin, result, query, query12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        empId = data.userId;
                        orgId = data.orgId;
                        oldPin = data.oldPin;
                        newPin = data.newPin;
                        result = {};
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("UserMaster")
                                .select("kioskPin")
                                .where("EmployeeId", empId)
                                .andWhere("OrganizationId", orgId)
                                .andWhere("kioskPin", oldPin)];
                    case 1:
                        query = _a.sent();
                        if (!(query.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("UserMaster")
                                .where("EmployeeId", empId)
                                .andWhere("OrganizationId", orgId)
                                .update({ kioskPin: newPin })];
                    case 2:
                        query12 = _a.sent();
                        if (query12.length > 0) {
                            result["status"] = 1;
                        }
                        else {
                            result["status"] = 0;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        result["status"] = 2;
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    Usersettingservice.getRegDetailForApproval = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var deta, userid, orgid, hrsts, devhrsts, result, count, startdate, status, zone, enddate, leavestaus, query, query2, value, sql, sql11, total;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deta = data.datafor;
                        userid = data.uid;
                        orgid = data.orgid;
                        hrsts = data.hrsts;
                        devhrsts = data.divhrsts;
                        result = [];
                        count = 0;
                        startdate = "";
                        status = false;
                        return [4 /*yield*/, Helper_2["default"].getTimeZone(orgid)];
                    case 1:
                        zone = _a.sent();
                        enddate = moment_timezone_1["default"]().tz(zone).format("YYYY-MM-DD");
                        leavestaus = "LeaveStatus";
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("Organization")
                                .select("CreatedDate")
                                .where("Id", orgid)];
                    case 2:
                        query = _a.sent();
                        count = query.length;
                        if (count == 1) {
                            startdate = moment_timezone_1["default"](query[0].CreatedDate).format("yyyy-MM-DD");
                        }
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("OtherMaster")
                                .select("ActualValue")
                                .where("DisplayName", deta)
                                .andWhere("OtherType", leavestaus)];
                    case 3:
                        query2 = _a.sent();
                        value = query2[0].ActualValue;
                        sql = Database_1["default"].query()
                            .from("AttendanceMaster")
                            .select("*", Database_1["default"].raw("(SELECT IF(LastName!='',CONCAT(FirstName,' ',LastName),FirstName) FROM EmployeeMaster WHERE Id=EmployeeId) as Name"))
                            .where(Database_1["default"].raw(" DATE(AttendanceDate) between \"" + startdate + "\" and \"" + enddate + "\" "))
                            .orderBy("RegularizeRequestDate", "desc");
                        if (hrsts == 1 || devhrsts == 1) {
                            sql = sql.where(Database_1["default"].raw("OrganizationId=" + orgid + " and RegularizeSts=" + value + " and EmployeeId in (select Id from EmployeeMaster where Is_Delete=0 and (DOL='0000-00-00' or DOL>curdate()))"));
                        }
                        else {
                            sql = sql.where(Database_1["default"].raw("OrganizationId=" + orgid + " and RegularizeSts=" + value + " AND Id IN (SELECT attendanceId FROM RegularizationApproval Where ApproverId=" + userid + ") and EmployeeId in (select Id from EmployeeMaster where Is_Delete=0 and (DOL='0000-00-00' or DOL>curdate()))"));
                        }
                        return [4 /*yield*/, sql];
                    case 4:
                        sql11 = _a.sent();
                        total = sql11.length;
                        if (!(total >= 1)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Promise.all(sql11.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
                                var res, attid, regsts, pstatus, approverid, qur, Name;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            res = {};
                                            res["total"] = total;
                                            attid = row.Id ? row.Id : 0;
                                            res["Id"] = row.Id;
                                            res["employeeId"] = row.EmployeeId;
                                            res["employeeName"] = row.Name;
                                            regsts = row.RegularizeSts ? row.RegularizeSts : 0;
                                            res["device"] = row.device ? row.device : 0;
                                            if (res["device"] == "Auto Time Out") {
                                                res["deviceid"] = 1;
                                            }
                                            else {
                                                res["deviceid"] = 0;
                                            }
                                            res["empRemarks"] = row.RegularizationRemarks;
                                            res["approverRemarks"] = row.RegularizeApproverRemarks;
                                            res["attendanceDate"] = moment_timezone_1["default"](row.AttendanceDate).format("yyyy-MM-DD");
                                            res["regApplyDate"] = moment_timezone_1["default"](row.RegularizeRequestDate).format("yyyy-MM-DD");
                                            res["requestedtimeout"] = moment_timezone_1["default"](row.requestedtimeout).format("HH:mm:ss");
                                            if (!(regsts == 3)) return [3 /*break*/, 4];
                                            res["regularizeSts"] = "pending";
                                            pstatus = 0;
                                            approverid = row.ApproverId;
                                            if (approverid != 0) {
                                                pstatus = approverid;
                                            }
                                            if (pstatus == 0 || pstatus == null) {
                                                pstatus = 0;
                                            }
                                            if (!(pstatus == 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, Database_1["default"].query()
                                                    .from("RegularizationApproval")
                                                    .select("ApproverId")
                                                    .where("attendanceId", attid)
                                                    .andWhere("ApproverSts", regsts)
                                                    .andWhere("approverregularsts", 0)
                                                    .orderBy("Id", "asc")
                                                    .limit(1)];
                                        case 1:
                                            qur = _a.sent();
                                            pstatus = qur[0].ApproverId;
                                            _a.label = 2;
                                        case 2: return [4 /*yield*/, Helper_2["default"].getEmpName(pstatus)];
                                        case 3:
                                            Name = _a.sent();
                                            if (pstatus != 0) {
                                                if (pstatus != userid) {
                                                    res["pstatus"] = "Pending at" + Name;
                                                    res["ApprovalIcon"] = false;
                                                }
                                                else {
                                                    res["pstatus"] = "Pending at" + Name;
                                                    res["ApprovalIcon"] = true;
                                                }
                                            }
                                            else {
                                                res["pstatus"] = "Pending";
                                                res["ApprovalIcon"] = false;
                                            }
                                            _a.label = 4;
                                        case 4:
                                            if (regsts == 2) {
                                                res["regularizeSts"] = "Approved";
                                                res["Pstatus"] = "";
                                                res["ApprovalIcon"] = false;
                                            }
                                            if (regsts == 3) {
                                                res["regularizeSts"] = "Rejected";
                                                res["Pstatus"] = "";
                                                res["ApprovalIcon"] = false;
                                            }
                                            result.push(res);
                                            console.log(result);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, result];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Usersettingservice.recoverPinLoginCredential = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orgId, empId, userName, password, dataresult, recoverPinLoginCredentialQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgId = data.Orgid;
                        empId = data.Empid;
                        return [4 /*yield*/, Helper_2["default"].encode5t(data.userName)];
                    case 1:
                        userName = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].encode5t(data.password)];
                    case 2:
                        password = _a.sent();
                        dataresult = {};
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .select("*")
                                .where("Username", userName)
                                .orWhere("username_mobile", userName)
                                .andWhere("Password", password)
                                .andWhere("OrganizationId", orgId)
                                .andWhere("EmployeeId", empId)];
                    case 3:
                        recoverPinLoginCredentialQuery = _a.sent();
                        if (recoverPinLoginCredentialQuery.length > 0) {
                            dataresult["response"] = "1";
                        }
                        else {
                            dataresult["response"] = "0";
                        }
                        return [2 /*return*/, dataresult];
                }
            });
        });
    };
    Usersettingservice.UpdateQrKioskPageReopen = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, orgId, status, result, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = data.userId;
                        orgId = data.orgId;
                        status = data.status;
                        result = {};
                        return [4 /*yield*/, Database_1["default"].query()
                                .from("UserMaster")
                                .where("EmployeeId", userId)
                                .andWhere("OrganizationId", orgId)
                                .update({ QrKioskPageReopen: status })];
                    case 1:
                        query = _a.sent();
                        if (query) {
                            result["status"] = 1;
                        }
                        else {
                            result["status"] = 2;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Usersettingservice.demoScheduleRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orgid, empid, newDate, Time, cardtitle, result, response, currentDate, Adminmail, Adminname, empmail, Email, Emp_Name, contactemail, contactNumber, CreatedDate, CountryId, demoquery, query, organizationName, PhoneNumber, Email_1, countryname, demoInsert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgid = data.orgId;
                        empid = data.empId;
                        newDate = moment_timezone_1["default"](new Date(data.newDate)).format("YYYY-MM-DD");
                        Time = data.selectTime;
                        cardtitle = data.cardTitle;
                        result = {};
                        response = [];
                        currentDate = moment_timezone_1["default"]().format("YYYY-MM-DD");
                        return [4 /*yield*/, Helper_2["default"].getAdminEmail(orgid)];
                    case 1:
                        Adminmail = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].getAdminNamebyOrgId(orgid)];
                    case 2:
                        Adminname = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].getEmpEmail(empid)];
                    case 3:
                        empmail = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].decode5t(empmail)];
                    case 4:
                        Email = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].getEmpName(empid)];
                    case 5:
                        Emp_Name = _a.sent();
                        if (!(newDate != "")) return [3 /*break*/, 15];
                        return [4 /*yield*/, Database_1["default"].query()
                                .select("*")
                                .from("ScheduleDemoDetail")
                                .where("OrgnanizationId", orgid)
                                .andWhere(Database_1["default"].raw("ScheduleDate >= \"" + newDate + "\""))];
                    case 6:
                        demoquery = _a.sent();
                        if (!(demoquery.length > 0)) return [3 /*break*/, 7];
                        result["sts"] = 0;
                        result["date"] = moment_timezone_1["default"](demoquery[0].ScheduleDate).format("YYYY-MM-DD");
                        result["Time"] = demoquery[0].ScheduleTime;
                        response.push(result);
                        return [3 /*break*/, 14];
                    case 7: return [4 /*yield*/, Database_1["default"].query()
                            .from("Organization")
                            .select("Name", "PhoneNumber", "Email", "CreatedDate", "Country", "countrycode")
                            .where("Id", orgid)];
                    case 8:
                        query = _a.sent();
                        if (!(query.length > 0)) return [3 /*break*/, 12];
                        organizationName = query[0].Name;
                        PhoneNumber = query[0].PhoneNumber;
                        CreatedDate = query[0].CreatedDate;
                        Email_1 = query[0].Email;
                        CountryId = query[0].Country;
                        return [4 /*yield*/, Helper_2["default"].getCountryNameById(CountryId)];
                    case 9:
                        countryname = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].encode5t(PhoneNumber)];
                    case 10:
                        contactNumber = _a.sent();
                        return [4 /*yield*/, Helper_2["default"].encode5t(Email_1)];
                    case 11:
                        contactemail = _a.sent();
                        _a.label = 12;
                    case 12: return [4 /*yield*/, Database_1["default"].table("ScheduleDemoDetail").insert({
                            OrgnanizationId: orgid,
                            ScheduleDate: newDate,
                            ScheduleTime: Time,
                            EmployeeId: empid,
                            Email: contactemail,
                            PhoneNumber: contactNumber,
                            RegisteredDate: CreatedDate,
                            CountryId: CountryId,
                            CreateDate: currentDate,
                            cardTitle: cardtitle
                        })];
                    case 13:
                        demoInsert = _a.sent();
                        result["sts"] = true;
                        response.push(result);
                        if (demoInsert) {
                            //////Email functionality
                        }
                        _a.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        result["sts"] = 1;
                        result["date"] = "";
                        result["Time"] = "";
                        response.push(result);
                        _a.label = 16;
                    case 16: return [2 /*return*/, response];
                }
            });
        });
    };
    Usersettingservice.getTeamPunchInfo = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orgid, Empid, date, currentDate, adminstatus, respons, result, query, dptid, querydata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgid = data.orgid;
                        Empid = data.uid;
                        date = moment_timezone_1["default"](new Date(data.date)).format("YYYY-MM-DD");
                        currentDate = moment_timezone_1["default"]().format();
                        return [4 /*yield*/, Helper_2["default"].getAdminStatus(Empid)];
                    case 1:
                        adminstatus = _a.sent();
                        respons = [];
                        result = {};
                        query = Database_1["default"].query()
                            .from("checkin_master as c")
                            .innerJoin("EmployeeMaster as e", "e.Id", "c.EmployeeId")
                            .select("c.Id", "c.EmployeeId", "c.location", "c.location_out", "c.time", "c.time_out", Database_1["default"].raw("SUBSTRING_INDEX(c.checkin_img, '.com/', -1) as checkin_img"), Database_1["default"].raw("SUBSTRING_INDEX(c.checkout_img, '.com/', -1) as checkout_img"), "c.client_name", "c.description", "c.latit", "c.longi", "c.latit_out", "c.longi_out", "c.GeofenceStatusVisitIn", "c.GeofenceStatusVisitOut")
                            .where("c.OrganizationId", orgid)
                            .andWhere("c.date", date)
                            .andWhere("e.OrganizationId", orgid)
                            .andWhere("e.Is_Delete", 0)
                            .orderBy("time", "asc");
                        if (!(adminstatus == 2)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Helper_2["default"].getDepartmentIdByEmpID(Empid)];
                    case 2:
                        dptid = _a.sent();
                        query = query.andWhere("Department", dptid);
                        _a.label = 3;
                    case 3: return [4 /*yield*/, query];
                    case 4:
                        querydata = _a.sent();
                        querydata.forEach(function (element) {
                            result["Id"] = element.Id;
                            result["emp"] = element.Name;
                            result["empId"] = element.EmployeeId;
                            result["loc_in"] = element.location;
                            result["loc_out"] = element.location_out;
                            result["time_in"] = moment_timezone_1["default"](element.time).format("HH:SS:MM");
                            result["time_out"] = moment_timezone_1["default"](element.time_out).format("HH:SS:MM");
                            result["latit"] = element.latit;
                            result["longi"] = element.longi;
                            result["longi_out"] = element.longi_out;
                            result["latit_in"] = element.latit_out;
                            result["client"] = element.client_name;
                            result["Name"] = element.Name;
                            result["desc"] = element.description;
                            result["GeofenceStatusVisitIn"] = element.GeofenceStatusVisitIn;
                            result["GeofenceStatusVisitOut"] = element.GeofenceStatusVisitOut;
                            if (element.checkin_img != "") {
                                result["checkin_img"] = element.checkin_img; //write this function getPresignedURL;
                            }
                            else {
                                result["checkin_img"] = "-";
                            }
                            if (element.checkout_img != "") {
                                result["checkout_img"] = element.checkout_img; //write this function getPresignedURL;
                            }
                            else {
                                result["checkout_img"] = "-";
                            }
                            result["description"] = element.description;
                            respons.push(result);
                        });
                        return [2 /*return*/, respons];
                }
            });
        });
    };
    Usersettingservice.GetQrKioskStatus = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, selectQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        return [4 /*yield*/, Database_1["default"].from("UserMaster")
                                .select("QrKioskPageReopen", "kioskPin")
                                .where("EmployeeId", "=", data.EmpId)
                                .andWhere("OrganizationId", "=", data.OrgId)];
                    case 1:
                        selectQuery = _a.sent();
                        if (selectQuery.length > 0) {
                            selectQuery.forEach(function (row) {
                                result["response"] = row.QrKioskPageReopen;
                                result["kioskpin"] = row.kioskPin;
                            });
                        }
                        else {
                            result["response"] = "0";
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Usersettingservice.getReferDiscountRequestService = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, getReferDiscountQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        return [4 /*yield*/, Database_1["default"].from("ReferDiscount").select("*")];
                    case 1:
                        getReferDiscountQuery = _a.sent();
                        if (getReferDiscountQuery) {
                            getReferDiscountQuery.forEach(function (row) {
                                result["Id"] = row.Id;
                                result["tittle"] = row.tittle;
                                result["discount"] = row.discount;
                            });
                        }
                        else {
                            result["status"] = 0;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Usersettingservice.DeleteAccount = function (getparam) {
        return __awaiter(this, void 0, void 0, function () {
            var text_area, OrganizationId, UserId, currentdate, result, Mail, Subject, mailbody, emp, empmail, phone, CreatedDate, username, orgname, country, mlbody1, mlbody2, mlbody3, mlbody4, mlbody5, mlbody6, mlbody7, messages, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text_area = getparam.reason;
                        OrganizationId = getparam.refid;
                        UserId = getparam.uid;
                        currentdate = getparam.date;
                        result = {};
                        return [4 /*yield*/, Database_1["default"].from("All_mailers")
                                .select("Subject", "Body")
                                .where("Id", 32)];
                    case 1:
                        Mail = _a.sent();
                        if (Mail) {
                            Subject = Mail[0].Subject;
                            mailbody = Mail[0].Body;
                        }
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster as E")
                                .innerJoin("Organization as O", "E.OrganizationId", "O.Id")
                                .select(Database_1["default"].raw("CONCAT(E.FirstName,' ',E.LastName) as Name"), "E.PersonalNo", "O.Name as Orgname", "E.CompanyEmail as email", "E.CreatedDate as doc", "E.CurrentCountry as countrycode")
                                .where("E.Id", UserId)
                                .andWhere("O.Id", OrganizationId)];
                    case 2:
                        emp = _a.sent();
                        if (emp) {
                            orgname = emp[0].Orgname;
                            username = emp[0].Name;
                            empmail = Helper_2["default"].decode5t(emp[0].email);
                            phone = Helper_2["default"].decode5t(emp[0].PersonalNo);
                            CreatedDate = emp[0].doc;
                            CreatedDate = moment_timezone_1["default"](CreatedDate).format("YYYY-MM-DD");
                            if (CreatedDate == "0000-00-00") {
                                CreatedDate = "N/A";
                            }
                            country = Helper_2["default"].getCountryNameById(emp[0].countrycode);
                        }
                        mlbody1 = mailbody.replace("{Company_Name}", orgname);
                        mlbody2 = mlbody1.replace("{19/08/2022}", currentdate);
                        mlbody3 = mlbody2.replace("{Contact_Person}", username);
                        mlbody4 = mlbody3.replace("{adminmail}", empmail);
                        mlbody5 = mlbody4.replace("{Created_date}", CreatedDate);
                        mlbody6 = mlbody5.replace("{Country_name}", country);
                        mlbody7 = mlbody6.replace("{12345}", phone);
                        messages = mlbody7;
                        headers = "MIME-Version: 1.0" + "\r\n";
                        headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
                        headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";
                        return [2 /*return*/];
                }
            });
        });
    };
    Usersettingservice.getSetKioskPin = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orgId, Emplid, result, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgId = data.orgId;
                        Emplid = data.empId;
                        result = {};
                        return [4 /*yield*/, Database_1["default"].query().from('UserMaster').select('kioskPin').where('EmployeeId', Emplid).andWhere('OrganizationId', orgId)];
                    case 1:
                        query = _a.sent();
                        if (query.length > 0) {
                            result['kioskPin'] = query[0].kioskPin;
                            if (result['kioskPin'] == "") {
                                result['cuperButton'] = 0;
                            }
                            else {
                                result['cuperButton'] = 1;
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Usersettingservice;
}());
exports["default"] = Usersettingservice;
