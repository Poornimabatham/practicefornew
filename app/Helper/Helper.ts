const jwt = require("jsonwebtoken");
import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";
import AttendanceMaster from "App/Models/AttendanceMaster";
import EmployeeMaster from "App/Models/EmployeeMaster";
import Organization from "App/Models/Organization";
import ShiftMaster from "App/Models/ShiftMaster";
import ZoneMaster from "App/Models/ZoneMaster";
import { DateTime } from "luxon";
import moment from "moment";
export default class Helper {
  public static encode5t(str: string) {
    var contactNum = str.toString();
    for (let i = 0; i < 5; i++) {
      str = Buffer.from(str).toString("base64");
      str = str.split("").reverse().join("");
    }
    return str;
  }

  public static decode5t(str: string) {
    for (let i = 0; i < 5; i++) {
      str = str.split("").reverse().join("");
      str = Buffer.from(str, "base64").toString("utf-8");
    }
    return str;
  }

  public static async getTimeZone(orgid: any) {
    let TimeZone = "Asia/kolkata";
    let Name = "";
    const query1: any = await Database.query()
      .from("ZoneMaster")
      .select("Name")
      .where(
        "Id",
        Database.raw(
          `(select TimeZone from Organization where id =${orgid}  LIMIT 1)`
        )
      );
    if (query1.length > 0) {
      return query1[0].Name;
    } else {
      return TimeZone;
    }
  }

  public static async getAdminStatus(id: any) {
    let status = 0;
    const queryResult = await Database.query()
      .from("UserMaster")
      .select("appSuperviserSts")
      .where("EmployeeId", id)
      .first();

    if (queryResult) {
      status = queryResult.appSuperviserSts;
    }

    return status;
  }

  public static async getempnameById(empid: number) {
    let FirstName = "";
    const query2: any = await Database.query()
      .from("EmployeeMaster as E")
      .select(
        Database.raw(
          `IF(E.lastname != '', CONCAT(E.FirstName, ' ', E.lastname), E.FirstName) as Name`
        )
      )
      .where("Id", empid);
    if (query2.length > 0) {
      return query2[0].Name;
    } else {
      return FirstName;
    }
  }

  public static generateToken(secretKey: string, data: any = {}) {
    try {
      const payload = {
        audience: data.username,
        Id: data.empid,
      };
      const options = {
        expiresIn: "1h",
        issuer: "Ubiattendace App",
      };
      const token = jwt.sign(payload, secretKey, options, {
        alg: "RS512",
        typ: "JWT",
      });
      return token;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  public static async getDepartmentIdByEmpID(empid: number) {
    const EmpQuery = await Database.from("EmployeeMaster")
      .select("Department")
      .where("id", empid);
    if (EmpQuery.length > 0) {
      const departmentId: number = EmpQuery[0].Department;
      const DepQuery = await Database.from("DepartmentMaster")
        .select("Id")
        .where("Id", departmentId);

      if (DepQuery.length > 0) {
        return DepQuery[0].Id;
      }
    }
    return 0;
  }
  public static FirstLettercapital(sentence: string) {
    var words = sentence.split(" ");
    var capitalizedWords = words.map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  }

  public static async getCountryIdByOrg1(orgid: number) {
    const getCountryId = await Database.from("Organization")
      .select("Country")
      .where("Id", orgid);
    if (getCountryId.length > 0) {
      const CountryId: number = getCountryId[0].Country;
      return CountryId;
    }
    return 0;
  }

  public static async getOrgId(Id: number) {
    let OrgId;
    const getOrgIdQuery = await Database.from("EmployeeMaster")
      .select("OrganizationId")
      .where("Id", Id);

    if (getOrgIdQuery.length > 0) {
      OrgId = getOrgIdQuery[0].OrganizationId;
    }
    return OrgId;
  }

  public static async getWeeklyOff(
    date: string,
    shiftId: number,
    emplid: number,
    orgid: number
  ) {
    const dt = date;
    const dayOfWeek = 1 + new Date(dt).getDay();
    const weekOfMonth = Math.ceil(new Date(dt).getDate() / 7);
    let week = [];
    const selectShiftId: any = await Database.from("AttendanceMaster")
      .select("ShiftId")
      .where("AttendanceDate", "<", dt)
      .where("EmployeeId", emplid)
      .orderBy("AttendanceDate", "desc")
      .limit(1);

    if (selectShiftId.length > 0) {
      let shiftid;

      shiftid = selectShiftId[0].ShiftId;
    } else {
      return "N/A";
    }

    const shiftRow = await Database.from("ShiftMasterChild")
      .where("OrganizationId", orgid)
      .where("Day", dayOfWeek)
      .where("ShiftId", shiftId)
      .first();
    let flage = false;
    if (shiftRow) {
      week = shiftRow.WeekOff.split(",");
      flage = true;
    }
    if (flage && week[weekOfMonth - 1] != "1") {
      return "WO";
    } else {
      const holidayRow = await Database.from("HolidayMaster")
        .where("OrganizationId", orgid)
        .where("DateFrom", "<=", dt)
        .where("DateTo", ">=", dt)
        .first();

      if (holidayRow) {
        return "H";
      } else {
        return "N/A";
      }
    }
  }

  public static async getEmpTimeZone(userid, orgid) {
    let defaultZone = "Asia/Kolkata";
    const { CurrentCountry: country, timezone: id } =
      await EmployeeMaster.findByOrFail("Id", userid);

    if (id) {
      const zoneData = await ZoneMaster.find(id);
      return zoneData ? zoneData.Name : defaultZone;
    }
    if (!country) {
      const organization = await Organization.findByOrFail("Id", orgid);
      if (organization) {
        const zoneData = await ZoneMaster.find(organization.TimeZone);
        return zoneData ? zoneData.Name : defaultZone;
      }
    } else {
      const zoneData = await ZoneMaster.query()
        .where("CountryId", country)
        .first();
      return zoneData ? zoneData.Name : defaultZone;
    }

    return defaultZone;
  }

  public static async getInterimAttAvailableSt(value: number) {
    const GetIntermAttendanceId = await Database.from("InterimAttendances")
      .where("AttendanceMasterId", value)
      .select("id");

    if (GetIntermAttendanceId.length > 0) {
      return GetIntermAttendanceId[0].id;
    }
    return 0;
  }

  public static async getCurrentDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  public static async getShiftName(Id: number, orgid: number) {
    let ShiftName: any;
    const getshiftname: any = await Database.from("ShiftMaster")
      .select("Name")
      .where("Id", Id)
      .andWhere("OrganizationId", orgid);
    if (getshiftname.length > 0) {
      ShiftName = getshiftname[0].Name;
    }
    return ShiftName;
  }

  public static async getEmpName(Id: number) {
    const query = await Database.from("EmployeeMaster")
      .select("FirstName", "LastName")
      .where("Id", Id)
      .where("Is_Delete", 0);

    if (query.length > 0) {
      return query[0].FirstName;
    } else {
      return 0;
    }
  }

  public static async getName(
    tablename: any,
    getcol: any,
    wherecol: any,
    id: any
  ) {
    let name: string = "";
    const query = await Database.query()
      .from(tablename)
      .select(getcol)
      .where(wherecol, id);
    const count = query.length;
    if (count > 0) {
      query.forEach((row) => {
        name = row[getcol];
      });
    }
    return name;
  }

  public static async getShiftType(shiftId) {
    const defaultshifttype = 0;
    const allDataOfShiftMaster: any = await ShiftMaster.find(shiftId);
    if (allDataOfShiftMaster) {
      return allDataOfShiftMaster
        ? allDataOfShiftMaster.shifttype
        : defaultshifttype;
    } else {
      return defaultshifttype;
    }
  }

  public static async getassignedShiftTimes(empid, ShiftDate) {
    let getshiftid = await Database.from("ShiftPlanner")
      .select("shiftid")
      .where("empid", empid)
      .andWhere("ShiftDate", ShiftDate);
    if (getshiftid.length > 0) {
      return getshiftid[0].shiftid;
    } else {
      let getshiftid = await Database.from("ShiftMaster")
        .select("Id")
        .where(
          "id",
          Database.rawQuery(
            `(SELECT Shift FROM EmployeeMaster where id=${empid})`
          )
        );
      if (getshiftid.length > 0) {
        return getshiftid[0].Id;
      }
    }
  }

  public static async getAddonPermission(orgid: number, addon: string) {
    let getaddonpermission = await Database.from("licence_ubiattendance")
      .select(Database.raw(`${addon} as addon`))
      .where("OrganizationId", orgid);
    if (getaddonpermission.length > 0) {
      return getaddonpermission[0].addon;
    } else {
      return 0;
    }
  }

  public static async getAddon_geoFenceRestrictionByUserId(
    userId,
    addon,
    orgid
  ) {
    const result = await Database.from("EmployeeMaster")
      .where("OrganizationId", orgid)
      .where("Id", userId)
      .select(addon as "addon")
      .first();
    return result ? result.addon : null;
  }

  public static async getNotificationPermission(
    orgid: number,
    notification: string
  ) {
    let getNotificationPermission = await Database.from("NotificationStatus")
      .select(Database.raw(`${notification} as notification`))
      .where("OrganizationId", orgid);
    if (getNotificationPermission.length > 0) {
      return getNotificationPermission[0].notification;
    } else {
      return 0;
    }
  }

  public static async getShiftmultists(id: number) {
    let getshiftMultiplests = await Database.from("ShiftMaster")
      .select("MultipletimeStatus")
      .where("Id", id);
    if (getshiftMultiplests.length > 0) {
      return getshiftMultiplests[0].MultipletimeStatus;
    } else {
      return 0;
    }
  }

  static async getCountryIdByOrg(orgid: number) {
    const query: any = await Database.query()
      .from("Organization")
      .select("Country")
      .where("Id", orgid);
    return query;
  }

  public static async getShiftMultipleTimeStatus(userId, today, shiftId) {
    const attendanceRecord = await AttendanceMaster.query()
      .where("EmployeeId", userId)
      .where("AttendanceDate", today)
      .whereNot("TimeIn", "00:00:00")
      .select("multitime_sts")
      .first();

    if (attendanceRecord && attendanceRecord.multitime_sts) {
      return attendanceRecord.multitime_sts;
    } else {
      const shiftRecord = await ShiftMaster.query()
        .where("Id", shiftId)
        .select("MultipletimeStatus")
        .first();
      if (shiftRecord && shiftRecord.MultipletimeStatus) {
        return shiftRecord.MultipletimeStatus;
      }
    }
    return 0;
  }

  public static calculateOvertime = (startTime, endTime) => {
    const [startHours, startMinutes, startSeconds] = startTime
      .split(":")
      .map(Number);
    const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);
    const totalStartSeconds =
      startHours * 3600 + startMinutes * 60 + startSeconds;
    const totalEndSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;
    let timeDiffInSeconds = totalEndSeconds - totalStartSeconds;

    // if (timeDiffInSeconds < 0) {
    //   timeDiffInSeconds += 24 * 3600; // Assuming time is within 24 hours range
    // }
    const hours =
      Math.floor(Math.abs(timeDiffInSeconds) / 3600) *
      (timeDiffInSeconds < 0 ? 1 : 1);
    const remainingSeconds = Math.abs(timeDiffInSeconds) % 3600;
    const minutes =
      Math.floor(remainingSeconds / 60) * (timeDiffInSeconds < 0 ? 1 : 1);
    const seconds =
      Math.floor(remainingSeconds % 60) * (timeDiffInSeconds < 0 ? 1 : 1);

    return { hours, minutes, seconds };
  };

  public static ActivityMasterInsert(
    date,
    orgid,
    uid,
    activityBy,
    appModule,
    actionperformed,
    module
  ) {
    let InsertActivityHistoryMaster = Database.table(
      "ActivityHistoryMaster"
    ).insert({
      LastModifiedDate: date,
      LastModifiedById: uid,
      module: module,
      ActionPerformed: actionperformed,
      OrganizationId: orgid,
      activityBy: activityBy,
      adminid: uid,
      appmodule: appModule,
    });
    return InsertActivityHistoryMaster;
  }

  public static async getOvertimeForRegularization(timein, timeout, id) {
    var name: string = " ";
    var selectShiftMasterData: any = await Database.from("ShiftMaster")
      .select("TimeIn", "TimeOut")
      .where("Id", id);

    try {
      for (const row of selectShiftMasterData) {
        const stime1 = moment(`1980-01-01 ${row.TimeIn}`).unix();

        const stime2 = moment(`1980-01-01 ${row.TimeOut}`).unix();
        const time1 = moment(`1980-01-01 ${timein}`).unix();
        const time2 = moment(`1980-01-01 ${timeout}`).unix();
        const totaltime = time2 - time1;

        const stotaltime = stime2 - stime1;
        const overtime = Math.abs(totaltime - stotaltime);
        const overtimeInMinutes = overtime / 60;

        if (overtime > 0) {
          name = moment()
            .startOf("day")
            .minutes(overtimeInMinutes)
            .format("HH:mm:00");
        }
        if (totaltime - stotaltime < 0) {
          name = "-" + `${name}`;
        }
        if (timein == "00:00:00") {
          name = "00:00:00";
        }
      }
    } catch (error) {
      console.error(error.message);
    }
    return name;
  }

  public static async getShiftIdByEmpID(empid) {
    let shift;
    let getshiftid = await Database.from("ShiftMaster")
      .select("Id")
      .where(
        "id",
        Database.rawQuery(
          `(SELECT Shift FROM EmployeeMaster where id=${empid})`
        )
      );

    if (getshiftid.length > 0) {
      shift = getshiftid[0].Id;
      return shift;
    } else {
      return shift;
    }
  }

  public static async getShiftByEmpID(Id: any) {
    const query: any = await Database.query()
      .from("ShiftMaster")
      .select("Name")
      .where("id", Id);
    query.forEach((row: any) => {
      const Name = row.Name;
      return Name;
    });
  }
  public static async myUrlEncode(country_code) {
    const entities = [
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
    const replacements = [
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

    let encodedString = encodeURIComponent(country_code);
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const replacement = replacements[i];
      encodedString = encodedString.split(entity).join(replacement);

      return encodedString;
    }
  }

  public static async getDesignationId(name, orgid) {
    let desi;
    let designationdata = await Database.query()
      .from("DesignationMaster")
      .select("*")
      .where("Name", name)
      .andWhere("OrganizationId", orgid);
    if (designationdata.length > 0) {
      desi = designationdata[0].Id;
      return desi;
    } else {
      return desi;
    }
  }

  public static async getFlexiShift(id) {
    let query = await Database.query()
      .from("ShiftMaster")
      .select("HoursPerDay")
      .where("Id", id);
    let HoursPerDay;

    if (query.length > 0) {
      HoursPerDay = query[0].HoursPerDay;
      return HoursPerDay;
    } else {
      return HoursPerDay;
    }
  }

  public static async getShiftTimes(id) {
    let query = await Database.query()
      .from("ShiftMaster")
      .select("TimeIn", "TimeOut", "HoursPerDay")
      .where("Id", id);

    if (query.length > 0) {
      if (query[0].TimeIn == "00:00:00" || query[0].TimeIn == "") {
        return query[0].HoursPerDay;
      } else {
        return query[0].TimeIn + "-" + query[0].TimeOut;
      }
    }
  }

  public static async getOrgName(id: number) {
    let Name = "";
    const queryResult = await Database.from("Organization")
      .where("Id", id)
      .select("Name");
    if (queryResult.length > 0) {
      Name = queryResult[0].Name;
      return Name;
    } else {
      return Name;
    }
  }

  public static async getAdminEmail(id) {
    let Email;
    const query = await Database.from("Organization")
      .where("Id", id)
      .select("Email");

    if (query.length > 0) {
      Email = query[0].Email;
      return Email;
    } else {
      return (Email = "");
    }
  }

  public static async getAdminNamebyOrgId(orgid) {
    let Name;

    const query = await Database.from("admin_login")
      .where("OrganizationId", orgid)
      .select("name");

    if (query.length > 0) {
      Name = query[0].name;
      return Name;
    } else {
      return Name;
    }
  }

  public static async getEmpEmail(id) {
    const query = await Database.from("EmployeeMaster")
      .where("Id", id)
      .andWhere("Is_Delete", 0)
      .select("CurrentEmailId");
    let Email;
    if (query.length > 0) {
      Email = query[0].CurrentEmailId;
      return Email;
    } else {
      return Email;
    }
  }

  public static async getCountryNameById(id) {
    const query = await Database.from("CountryMaster")
      .select("Name")
      .where("Id", id);
    let Name = "";
    if (query.length) {
      Name = query[0].Name;
      return Name;
    } else {
      return Name;
    }
  }

  public static async getDeptName(deptId, orgId) {
    const query = await Database.from("DepartmentMaster")
      .select("name")
      .where("id", deptId)
      .where("OrganizationId", orgId)
      .first();

    if (query) {
      return query.name;
    }
    return null; // Return null or handle the case when no result is found
  }

  public static async getDesigName(desigId, orgId) {
    const query = await Database.from("DesignationMaster")
      .select("Name")
      .where("Id", desigId)
      .where("OrganizationId", orgId)
      .first();

    if (query) {
      return query.Name;
    }
    return null; // Return null or handle the case when no result is found
  }

  public static async getShiftplannershiftIdByEmpID(
    EmpId: number,
    date: string
  ) {
    let selectQuery = await Database.from("ShiftPlanner")
      .select("shiftid")
      .where("empid", EmpId)
      .where("ShiftDate", date);
    if (selectQuery.length > 0) {
      return selectQuery[0].shiftid;
    } else {
      return 0;
    }
  }

  public static async getweeklyoffnew(
    date: string,
    shiftid: number,
    empid: number,
    orgid: number
  ) {
    var dateTime = DateTime.fromISO(date);
    var dayOfWeek = dateTime.weekday; // Convert Luxon weekday to 1-7 format

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

    var weekOfMonth = Math.ceil(dateTime.day / 7);
    var week;
    var selectQuery = await Database.from("ShiftMasterChild")
      .select("WeekOff")
      .where("OrganizationId", orgid)
      .where("Day", dayOfWeek)
      .where("ShiftId", shiftid);

    var flag = false;
    if (selectQuery.length > 0) {
      const weekOffString = selectQuery[0].WeekOff;
      week = weekOffString.split(","); // Split the comma-separated string into an array
      flag = true;
    }

    if (flag && week[weekOfMonth - 1] == 1) {
      return "WeekOff";
    } else {
      return "noWeekOff";
    }
  }

  static async getAreaInfo(Id) {
    const query = await Database.from("Geo_Settings")
      .select("Lat_Long", "Radius")
      .where("Id", Id)
      .where("Lat_Long", "!=", "")
      .limit(1)
      .first();
    if (query) {
      const arr: any = {};
      const arr1 = query.Lat_Long.split(",");
      arr.lat = arr1[0] ? parseFloat(arr1[0]) : 0.0;
      arr.long = arr1[1] ? parseFloat(arr1[1]) : 0.0;
      arr.radius = query.Radius;
      return arr;
    }
    return 0;
  }

  public static async getSettingByOrgId(id) {
    const query = await Database.from("Att_OrgSetting")
      .select("outside_geofence_setting")
      .where("OrganizationId", id);
    let sts = "";
    if (query.length) {
      sts = query[0].outside_geofence_setting;
      return sts;
    } else {
      return sts;
    }
  }

  public static calculateDistance(lat1, lon1, lat2, lon2, unit = "K") {
    const theta = lon1 - lon2;
    let dist =
      Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.cos(this.deg2rad(theta));
    dist = Math.acos(dist);
    dist = this.rad2deg(dist);
    let miles = dist * 60 * 1.1515;

    unit = unit.toUpperCase();

    if (unit === "K") {
      return miles * 1.609344;
    } else if (unit === "N") {
      return miles * 0.8684;
    } else {
      return miles;
    }
  }

  public static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  public static rad2deg(rad) {
    return rad * (180 / Math.PI);
  }

  public static async getAreaIdByUser(id) {
    const query = await Database.from("EmployeeMaster")
      .select("area_assigned")
      .where("Id", id);
    let sts = "";
    if (query.length) {
      sts = query[0].area_assigned;
      return sts;
    } else {
      return sts;
    }
  }

  public static async getApprovalLevelEmp(empid, orgid, processtype) {
    var Id = "0";
    var seniorid;
    var designation = 0;

    var rule;
    var sts;
    var sql;
    if (empid != 0 && empid != undefined) {
      sql = await Database.from("EmployeeMaster")
        .select("ReportingTo", "Designation")
        .where("OrganizationId", orgid)
        .andWhere("Id", empid);

      sql.forEach(function (val) {
        seniorid = val.ReportingTo;
        designation = val.Designation;
      });

      if (seniorid != 0 && designation != 0) {
        sql = await Database.from("ApprovalProcess")
          .select(" RuleCriteria", "Designation", "HrStatus")
          .where(" OrganizationId", orgid)
          .andWhere(" Designation ", designation)
          .andWhere("ProcessType ", processtype);
        const row = await sql;

        const affected_rows = sql.length;

        if (affected_rows > 0) {
          if (row) {
            rule = row[0].RuleCriteria;
            sts = row[0].HrStatus;
          }

          var reportingto = await Helper.getSeniorId(empid, orgid);
          const sql = await Database.from("EmployeeMaster")
            .select("Id", "Designation")
            .where("OrganizationId", orgid)
            .andWhere("DOL", "0000-00-00")
            .andWhereIn("Designation", rule)
            .andWhere("Id", reportingto)
            .orderByRaw(Database.raw(`FIELD(Designation, ${rule})`));

          sql.forEach((val) => {
            if (seniorid == undefined) {
              seniorid == val.Id;
            } else {
              seniorid += "," + row.Id;
            }
          });
        }
      }
    }
    return seniorid;
  }

  static async getSeniorId(empid, organization) {
    var id = "0";
    var parentId = empid;
    if (parentId != 0 && parentId != undefined) {
      const query1 = await Database.from("EmployeeMaster")
        .select("ReportingTo")
        .where("OrganizationId", organization)
        .andWhere("Id", parentId)
        .andWhere("DOL", "0000-00-00");

      query1.forEach((val) => {
        id = val.ReportingTo;
      });
    }
    return id;
  }

  public static async time_to_decimal(time: string) {
    const timeArr = time.split(":").map(Number);
    let decTime = timeArr[0] * 60 + timeArr[1] + timeArr[2] / 60; //converting time in minutes
    return decTime;
  }

  public static async getTrialDept(orgid) {
    var Orgid = orgid;
    var dept = 0;

    const result = await Database.from("DepartmentMaster")
      .select(Database.raw("min(Id) as deptid"))
      .where("Name", "like", `%trial%`)
      .andWhere("OrganizationId", Orgid);
    if (result) {
      dept = result[0].deptid;
      return dept;
    } else {
      return dept;
    }
  }
  public static async getTrialDesg(org_id) {
    var Orgid = org_id;
    var desg = 0;

    const result: any = await Database.from("DesignationMaster")
      .select(Database.raw("min(Id) as desgid"))
      .where("Name", "like", `%trial%`)
      .andWhere("OrganizationId", Orgid);

    if (result) {
      desg = result[0].desgid;
      return desg;
    } else {
      return desg;
    }

  }
  public static async sendEmail(email, subject, messages, headers) {
    // Create an SES client
    const getmail = await Mail.use("smtp").send(
      (message) => {
        message
          .from("noreply@ubiattendance.com", "shakir")
          .to(email)
          .subject(subject)
          .header(headers,headers)
          .html(`${messages}`);
        //message.textView('emails/welcome.plain', {})
        //.htmlView('emails/welcome', { fullName: 'Virk' })
      },
      {
       oTags: ["signup"],
      }
    );
    return getmail;
  }

  public static async getTrialShift(org_id) {
    var Orgid = org_id;
    var shiftid = 0;

    const result: any = await Database.from("ShiftMaster")
      .select(Database.raw("min(Id) as  shiftid "))
      .where("Name", "like", `%trial%`)
      .andWhere("OrganizationId", Orgid);

    if (result) {
      shiftid = result[0].shiftid;
      return shiftid;
    } else {
      return shiftid;
    }
  }
}
