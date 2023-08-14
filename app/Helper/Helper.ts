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
          `(select TimeZone from Organization where Id =${orgid}  LIMIT 1)`
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

  public static async getOrgId(Id: number) {
    let OrgId: any;
    const getOrgIdQuery = await Database.from("EmployeeMaster")
      .select("OrganizationId")
      .where("Id", Id);

    if (getOrgIdQuery.length > 0) {
      OrgId = getOrgIdQuery[0].OrganizationId;
    }
    return OrgId;
  }
  public static async getCurrentDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  //get shiftname by shift Id
  public static async getShiftName(Id: number, orgid: number) {
    let ShiftName: any;
    console.log(Id);
    console.log(orgid);
    const getshiftname: any = await Database.from("ShiftMaster")
      .select("Name")
      .where("Id", Id)
      .andWhere("OrganizationId", orgid);
    //console.log(rowh.toSQL().toNative());
    if (getshiftname.length > 0) {
      ShiftName = getshiftname[0].Name;
    }

    return ShiftName;
  }
}

