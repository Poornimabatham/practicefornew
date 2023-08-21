const jwt = require("jsonwebtoken");
import Database from "@ioc:Adonis/Lucid/Database";

export default class Helper {
  public static encode5t(str: any) {
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
    const query1 = await Database.query()
      .from("ZoneMaster")
      .select("name")
      .where(
        "Id",
        Database.raw(

          `(select TimeZone from Organization where id =${orgid}  LIMIT 1)`
        )
      );
    return query1[0].name;
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
    const query2 = await Database.query()
      .from("EmployeeMaster")
      .select("FirstName")
      .where("Id", empid);
    return query2[0].FirstName;
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
    const defaultZone = "Asia/Kolkata";
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
    console.log(Id);
    console.log(orgid);
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

    return query[0].FirstName;
  }

  public static async getShiftType(shiftId) {
    const defaultshifttype = 0;
    const allDataOfShiftMaster: any = await ShiftMaster.find(shiftId);
    // console.log(allDataOfShiftMaster?.toSQL().toNative());

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

}
