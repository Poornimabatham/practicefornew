const jwt = require("jsonwebtoken");
import Database from "@ioc:Adonis/Lucid/Database";
import LogicsOnly from "App/Services/getAttendances_service";

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
        "id",
        Database.raw(
          `(select TimeZone from Organization where id =${orgid}  LIMIT 1)`
        )
      );
    return query1[0].name;
  }

  public static async getempnameById(empid: number) {
    const query2 = await Database.query()
      .from("EmployeeMaster")
      .select("FirstName")
      .where("Id", empid);
    return query2[0].FirstName;
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

  public static async getAdminStatus(id: number) {
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


   public static async  getWeeklyOff(date, ShiftId, emplid, orgid) {
      const dt = date;
    
      const dayOfWeek = 1 + new Date(dt).getDay();
  
      let week;
    



    const selectShiftId:any = await Database
    .from('AttendanceMaster')
    .select('ShiftId')
    .where('AttendanceDate', '<', date)
    .where('EmployeeId', 7292)
    .orderBy('AttendanceDate', 'desc')
    .limit(1);
    
    const result = selectShiftId.length;
      
     
    
      let shiftid;
      if (result.length > 0) {
        shiftid = result[0].ShiftId;
      } else {
        // return "N/A";
      }
      
    
      const selectWeekOfff = await Database
      .from('ShiftMasterChild')
      .select('WeekOff')
      .where('OrganizationId', 10)
      .where('Day', dayOfWeek)
      .where('ShiftId', 48);
    return selectWeekOfff
      let flage = false;
      if (v > 0) {
        const row = shiftQuery2.rows[0];
        week = row.WeekOff.split(",");
        flage = true;
      }
    
      const currentDate = new Date(date);
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const weekOfMonth = Math.ceil(currentDate.getDate() / 7);
    
      if (flage && week[weekOfMonth - 1] === '1') {
        return "WO";
      } else {
        const holidayQuery:any = await Database.raw("SELECT `DateFrom`, `DateTo` FROM `HolidayMaster` WHERE `OrganizationId` = ? AND ? BETWEEN `DateFrom` AND `DateTo`", [orgid, dt]);
    
        if (holidayQuery.rows.length > 0) {
          return "H";
        } else {
          return "N/A";
        }
      }
    }







  




    
  }

