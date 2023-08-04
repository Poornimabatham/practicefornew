const jwt = require("jsonwebtoken");
import Database from "@ioc:Adonis/Lucid/Database";

export default class Helper {
  public static async encode5t(str: any) {
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
        )); 
    return  query1[0].name;
  }

  public static async getempnameById(empid: number) {
    const query2 = await Database.query()
      .from("EmployeeMaster")
      .select("FirstName")
      .where("Id", empid);
    return query2[0].FirstName;
  }

  public static async generateToken(secretKey: string, data: any = {}) {
    try {
      const payload = {
        audience: data.username,
        Id: data.empid,
      };
      const options = {
        expiresIn: "1m",
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

  public static async getAdminStatus(id:number) {
    let status = 0;
    const queryResult = await Database.query()
      .from("UserMaster").select("appSuperviserSts").where("EmployeeId", id).first();
    if (queryResult) {
      status = queryResult.appSuperviserSts;
    }
    return status;
  }
}
