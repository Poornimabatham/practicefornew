import Database from "@ioc:Adonis/Lucid/Database";
// import Helper from "App/Helper/Helper";

export default class loginService {
  public static async login(getData) {
    let userName1: string = getData.userName;
    let password1: string = getData.password;
    const query = await Database.from("OrganizationTemp")
      .where("Email", userName1)
      .andWhere("password", password1)
      .select("*");

    if (query.length > 0) {
      const arr: any = [];
      arr.push(query[0].Name);
      arr.push(query[0].Email);
      arr.push(query[0].password);
      arr.push(query[0].Id);
      arr.push(10);
      return arr;
    } else {
      return 0;
    }
  }
  public static async storetoken(arr: any = {}) {
    const query1 = await Database.query()
      .select("*")
      .from("Emp_key_Storage")
      .where("EmployeeId", arr.id)
      .andWhere("OrganizationId", arr.orgid);
    if (query1.length > 0) {
      await Database.query()
        .from("Emp_key_Storage")
        .where("EmployeeId", arr.id)
        .andWhere("OrganizationId", arr.orgid)
        .update("token", arr.token);
      return arr.id; //id where is updation perform
    } else {
      await Database.table("Emp_key_Storage")
        .insert({
          EmployeeId: arr.id,
          OrganizationId: arr.orgid,
          Token: arr.token,
        })
        .returning("id");

      return arr.id; // last inserted Id;
    }
  }

  public static async logout(getData) {
    try {
      let empid = getData.empid;
      let orgid = getData.orgid;
      let token = "";
      const query = await Database.query()
        .from("Emp_key_Storage")
        .where("EmployeeId", empid)
        .andWhere("OrganizationId", orgid)
        .update("token", token);
      if (query.length > 0) {
        return 1;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
}
