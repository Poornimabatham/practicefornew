import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
export default class ResetPasswordLinkService {
  public static async ResetPassword(data) {
    const una = await Helper.encode5t(data.una);
    const result = {};
    const selectEmployeeList: any = await Database.from("EmployeeMaster")
      .select(
        "Id",
        "OrganizationId",
        "FirstName",
        "LastName",
        Database.raw(
          "(SELECT resetPassCounter FROM  UserMaster  WHERE Username = ? OR username_mobile = ?) as  ctr",
          [una, una]
        ),
        Database.raw(
          "(SELECT Username FROM  UserMaster  WHERE Username = ? OR username_mobile = ?) as  email",
          [una, una]
        )
      )
      .where(
        "Id",
        Database.raw(
          "(SELECT  EmployeeId FROM UserMaster WHERE Username =? OR username_mobile=?)",
          [una, una]
        )
      );
    const rows = selectEmployeeList.length;
    if (rows > 0) {
      if (rows[0] != "") {
        var orgid = selectEmployeeList[0].OrganizationId;
        var email = selectEmployeeList[0].email ? await Helper.decode5t(selectEmployeeList[0].email) : "";
        var Name = `${selectEmployeeList[0].FirstName} ${selectEmployeeList[0].LastName}`;

        const querytest = await Database.from("All_mailers")
          .select("Body", "Subject")
          .where("Id", "23");
        if (querytest.length) {
          var body = querytest[0].Body;
          var subject = querytest[0].Subject;
        }
    //     const encryptedId = Encryption.encrypt( selectEmployeeList[0].Id);
    // const encryptedOrgId = Encryption.encrypt(orgid);
    // const encryptedCtr = Encryption.encrypt( selectEmployeeList[0].ctr);
    // const url = `https://ubiattendance.ubihrm.com/index.php/services/HastaLaVistaUbi?hasta=${encryptedId}&vista=${encryptedOrgId}&ctrpvt=${encryptedCtr}`;
    
    // const logo = "<img src='https://ubiattendance.ubiattendance.xyz/newpanel/index.php/../assets/img/myubiAttendance_logo.jpg' style='width: 200px;' /><p style='text-align: center; line-height:1;'></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot;'>";
  
    const body1 = body.replace('{Admin_Name}', Name);
   
    const headers = 'From: <noreply@ubiattendance.com>\r\n';
    
       result["status"] = "1";
       return result
      } else {
         result["status"] = "0"
         return result;
      }
    } else {
      result["status"] = "2"
      return result;
    }
  }
}
