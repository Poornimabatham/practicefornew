import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";

export default class ResetPasswordLinkService {
  // public static async ResetPassword(data) {
  //   const una = await Helper.encode5t(data.una);

  //   const query = await Database.from("UserMaster")
  //     .select([
  //       "Id",
  //       "OrganizationId",
  //       "FirstName",
  //       "LastName",
  //       Database.rawQuery(
  //         `(SELECT  resetPassCounter FROM UserMaster WHERE Username =  ? or username_mobile= ?)as ctr `,[una,una]
  //       ),
  //       Database.rawQuery(
  //         `(SELECT  Username FROM UserMaster WHERE Username = ? or username_mobile= ?)as email `,[una,una]
  //       ),
  //     ])
  //     .from("EmployeeMaster AS E")
  //     .where("E.Id", Database.rawQuery(
  //       `(SELECT  EmployeeId FROM UserMaster WHERE Username = ? or username_mobile= ?) `,[una,una]
  //     ) );
  //   return query;
   










  public static async ResetPassword (data){
    const una = await Helper.encode5t(data.una);

    const selectEmployeeList = await Database.from("EmployeeMaster")
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
   
    if (selectEmployeeList.length > 0) {
      const row = selectEmployeeList[0];
      const orgid = row.OrganizationId;
      const email = row.email ?await Helper.decode5t(row.email) : '';
      const Name = `${row.FirstName} ${row.LastName}`;
  
      const querytest = await Database.from('All_mailers')
        .select('Body', 'Subject')
        .where('Id', '23')
      if (querytest.length) {
        const body = querytest[0].Body;
        const subject = querytest[0].Subject;
  
        // const url = `https://ubiattendance.ubihrm.com/index.php/services/HastaLaVistaUbi?hasta=${Encryption.encrypt(row.Id)}&vista=${Encryption.encrypt(orgid)}&ctrpvt=${Encryption.encrypt(row.ctr)}`;
  
        // const logo = "<img src='https://ubiattendance.ubiattendance.xyz/newpanel/index.php/../assets/img/myubiAttendance_logo.jpg' style='width: 200px;'  <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot;'>";
  
        // const body1 = body.replace('{Admin_Name}', Name);
        // const body2 = body1.replace('{variable_here}', url);
        // const body3 = body2.replace('{logo}', logo);
  
        // const headers = 'From: <noreply@ubiattendance.com>\r\n';
        // // sendEmailNew(email, subject, body3, headers);
  
        // console.log('reset password link mail');
        // console.log(body3);
  
        return { status: '1' };
      } else {
        return { status: '0' };
      }
    } 
    else {
      return { status: '2' };
  }
}
}
