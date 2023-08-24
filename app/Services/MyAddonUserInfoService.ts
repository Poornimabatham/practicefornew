import Database from "@ioc:Adonis/Lucid/Database";

export default class MyAddonUserInfoService {
  public static async getdetailsMyaddonuser(data) {
    var Empid = data.empid;
    var orgidId = data.orgid;

    var result: any = {};

    const UserMaster = await Database.from("UserMaster")
      .select("*")
      .where("EmployeeId", Empid)
      .where("OrganizationId", orgidId);

    UserMaster.forEach((row) => {
      result.qrKioskPin = row.kioskPin;
      result.LoginSts = row.LoginSts;
      result.username_mobile = row.username_mobile;
    });
    return result;
  }
}
