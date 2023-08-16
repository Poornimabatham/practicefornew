const jwt = require("jsonwebtoken");
import Database from "@ioc:Adonis/Lucid/Database";

export default class Helper {

  public static async encode5t(str: any) {
    for (let i = 0; i < 5; i++) {
      str = Buffer.from(str).toString('base64');
      str = str.split('').reverse().join('');
    }
    return str;
  }
  public static decode5t(str: string) {
    for (let i = 0; i < 5; i++) {
      str = str.split("").reverse().join("");
      str = Buffer.from(str, 'base64').toString('utf-8');
    }
    return str;
  }
  public static async getTimeZone(orgid: any) {
    const query1: any = await Database.query().from('ZoneMaster').select('name').where('id', Database.raw(`(select TimeZone from Organization where id =${orgid}  LIMIT 1)`));

    return query1;

  }
  public static async getempnameById(empid: number) {
    const query2 = await Database.query().from('EmployeeMaster').select('FirstName').where('Id', empid);
    return query2[0].FirstName;

  }
  public static generateToken(secretKey: string, data: any = {}) {
    try {
      const payload = {
        audience: data.username,
        Id: data.empid,
      }
      const options = {
        expiresIn: "1m",
        issuer: "Ubiattendace App",
      }
      const token = jwt.sign(payload, secretKey, options, {
        "alg": "RS512",
        "typ": "JWT"
      })
      return token;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  public static async getOrgId(Id: number) {

    const query = await Database.from('EmployeeMaster').select('OrganizationId').where('Id', Id);

    return query[0].OrganizationId;
  }

  public static async getAdminStatus(id: any) {
    let status = 0;
    const queryResult = await Database.query().from('UserMaster')
      .select('appSuperviserSts')
      .where('EmployeeId', id)
      .first();

    if (queryResult) {
      status = queryResult.appSuperviserSts;
    }

    return status;
  }

  public static async getDepartmentIdByEmpId(empId: number) {

    const getDeptIdQuery = await Database.from('DepartmentMaster').select('Id').whereIn('Id', Database.rawQuery('SELECT Department FROM `EmployeeMaster` where Id= 15213'))
    return getDeptIdQuery[0].Id;
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

  public static async getShiftType(ShiftId: number) {
    const getShiftTypeQuery = await Database.from('ShiftMaster').select('shifttype').where('Id', ShiftId);
    return getShiftTypeQuery[0].shiftType;
  }
}



