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
var getProfileImageService = /** @class */ (function () {
    function getProfileImageService() {
    }
    getProfileImageService.getProfileImage = function (getvalue) {
        return __awaiter(this, void 0, void 0, function () {
            var Orgid, Empid, selectEmployeemasterlist, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Orgid = getvalue.orgId;
                        Empid = getvalue.empId;
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("ImageName", "OrganizationId")
                                .where("id", Empid)
                                .andWhere("OrganizationId", Orgid)];
                    case 1:
                        selectEmployeemasterlist = _a.sent();
                        res = [];
                        selectEmployeemasterlist.forEach(function (ROW) {
                            var Data = {};
                            var organizationId = ROW.OrganizationId;
                            var imageName = ROW.ImageName;
                            var combinedString = "{organizationId}/{imageName}";
                            if (ROW.ImageName != "" && combinedString) {
                                var timestamp = Date.now();
                                var dir = "{organizationId}/{imageName}";
                                (Data["profile"] = "uploads/profile/{dir}?r={timestamp}"),
                                    (Data["profilePath"] = "{imageName}?r={timestamp}"),
                                    (Data["profileEndPoint"] = "uploads/profile/{organizationId}/");
                            }
                            else {
                                Data["profile"] =
                                    "http://ubiattendance.ubihrm.com/assets/img/avatar.png";
                            }
                            res.push(Data);
                        });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    getProfileImageService.sendBrodCastNotificationFromService = function (get) {
        return __awaiter(this, void 0, void 0, function () {
            var Orgid, Empid, Title, Body, Topic, PageName, Zone, currentDate, _a, datePart, timePart, date, time, admminSts, insertNotificationList, NotificationId, updateNotificationList;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Orgid = get.refno;
                        Empid = get.uid;
                        Title = get.title;
                        Body = get.body;
                        Topic = get.topic;
                        PageName = get.PageName;
                        return [4 /*yield*/, Helper_1["default"].getEmpTimeZone(Empid, Orgid)];
                    case 1:
                        Zone = _b.sent();
                        currentDate = luxon_1.DateTime.now().setZone(Zone).toString();
                        _a = currentDate.split("T"), datePart = _a[0], timePart = _a[1];
                        date = datePart;
                        time = timePart;
                        admminSts = 0;
                        return [4 /*yield*/, Database_1["default"].insertQuery()
                                .table("NotificationsList")
                                .insert({
                                NotificationTitle: Title,
                                NotificationBody: Body,
                                EmployeeId: Empid,
                                OrganizationId: Orgid,
                                CreatedDate: date,
                                CreatedTime: time,
                                AdminSts: admminSts
                            })];
                    case 2:
                        insertNotificationList = _b.sent();
                        NotificationId = insertNotificationList[0];
                        return [4 /*yield*/, Database_1["default"].from("NotificationsList")
                                .where("Id", NotificationId)
                                .update({
                                PageName: PageName
                            })];
                    case 3:
                        updateNotificationList = _b.sent();
                        return [2 /*return*/, NotificationId];
                }
            });
        });
    };
    getProfileImageService.generateNumericOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var EmailId, Empid, Orgid, EncodeEmailForCheck, data2, resresultOTP, nameQuery, fName, lName, name, Count, n, generator, result, i, randomIndex, message, headers, subject, mailresponse, selectEmailOtp_Auth, affected_rows, updateEmaiOTPEmail, insertEmailOtp_Authentication;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        EmailId = data.emailId;
                        Empid = data.empId;
                        Orgid = data.orgId;
                        EncodeEmailForCheck = Helper_1["default"].encode5t(EmailId);
                        data2 = [];
                        resresultOTP = {};
                        return [4 /*yield*/, Database_1["default"].from("EmployeeMaster")
                                .select("*")
                                .where("Id", Empid)];
                    case 1:
                        nameQuery = _a.sent();
                        fName = "";
                        lName = "";
                        name = "";
                        nameQuery.forEach(function (row) {
                            fName = row.FirstName;
                            lName = row.LastName;
                        });
                        if (lName == "" || lName == "") {
                            name = fName;
                        }
                        else {
                            name = fName + lName;
                        }
                        n = 10;
                        generator = "1357902468";
                        result = "";
                        for (i = 1; i <= n; i++) {
                            randomIndex = Math.floor(Math.random() * generator.length);
                            result += generator.charAt(randomIndex);
                        }
                        message = "<html>\n    <head>\n        <meta http-equiv=Content-Type content=\"text/html; charset=windows-1252\">\n        <meta name=Generator content=\"Microsoft Word 12 (filtered)\">\n        <style>\n            div.ex1\n            {\n                width: 600px;\n                margin: auto;\n                border: 2px solid #73AD21;\n                padding : 20px;\n            }\n        </style>  \n    </head>  \n   \n    <body lang=EN-US link=blue vlink=purple>    \n        <div class=\"ex1\">\n        <h1 style = text-align:center>ubiAttendance: Verify your Email</h1>\n        <div class=\"col-sm-6\"><a href=\"\">\n        <img src=\"'.URL1.'assets/img/ubiattendance_logo_rectangle.png\" class=\"img-fluid w-75 w-60 text-center\" style=\"width:30%!important; margin-left: 35%;\"></a>\n    </div>\n        <p style=\"text-align: left; color : #000000\" class=\"paragraph-text\"> <b> Hi '." + name + ".',</b>\n         <p>Please enter the Verification Code below to verify your Email ID. The code is only valid for 10 minutes.</p>\n         <p style=\"color: #06D0A8; font-size: 24px; font-family: monospace;\">'." + result + ".'</p>\n         <p> Please don't share your verification Code with anyone.</p>\n        <p style=\"color:#FFA319; font-weight: bold; font-size: 16px;\">Cheers,<br/>\n        ubiAttendance Team</p>\n        </p>\n</div>  \n                    </body>  \n                    </html>";
                        headers = "";
                        subject = "ubiAttendance- Email verification";
                        mailresponse = null;
                        if (!(mailresponse == null)) return [3 /*break*/, 7];
                        return [4 /*yield*/, Database_1["default"].from("EmailOtp_Authentication")
                                .select("*")
                                .where("orgId", Orgid)
                                .andWhere("empId", Empid)];
                    case 2:
                        selectEmailOtp_Auth = _a.sent();
                        affected_rows = selectEmailOtp_Auth.length;
                        if (!(affected_rows > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Database_1["default"].from("EmailOtp_Authentication")
                                .where("orgId", Orgid)
                                .andWhere("empId", Empid)
                                .update({ email_id: EncodeEmailForCheck, otp: result })];
                    case 3:
                        updateEmaiOTPEmail = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, Database_1["default"].insertQuery()
                            .table("EmailOtp_Authentication")
                            .insert({
                            empId: Empid,
                            orgId: Orgid,
                            email_id: EncodeEmailForCheck,
                            otp: result,
                            status: 0
                        })];
                    case 5:
                        insertEmailOtp_Authentication = _a.sent();
                        Count = insertEmailOtp_Authentication.length;
                        _a.label = 6;
                    case 6:
                        if (Count) {
                            resresultOTP["resultOTP"] = 1;
                            data2.push(resresultOTP);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        resresultOTP["resultOTP"] = 0;
                        data2.push(resresultOTP);
                        _a.label = 8;
                    case 8: return [2 /*return*/, data2];
                }
            });
        });
    };
    return getProfileImageService;
}());
exports["default"] = getProfileImageService;
