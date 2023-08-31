import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";

export default class CheckUserEmailService {
  public static async CheckUserEmail(data) {
    var email = data.email;

    var result: any = {};
    var usermail = await Helper.encode5t(data.email);
    const checkquery = await Database.from("UserMaster")
      .where("Username", usermail)
      .limit(2);
    const num_rows = checkquery.length;
    if (num_rows > 0) {
      result["status"] = "1"; // already exist E-mail
    } else {
      result["status"] = "2"; // Not exist E-mail
    }
    return result;
  }

  public static async CheckUserPhone(data) {
    var phone = data.phone;
    var result: any = {};
    var userphone = await Helper.encode5t(phone);

    var selectOrganizationList = await Database.from("Organization")
      .where("PhoneNumber", phone)
      .select("Id as OId", "Name as OName");
    const Organization_num_rows = selectOrganizationList;
    const selectUserMasterList = await Database.from("UserMaster")
      .innerJoin("EmployeeMaster as E", "E.Id", "U.EmployeeId")
      .innerJoin(
        "EmployeeMaster as E2",
        "E2.organizationId",
        "U.organizationId"
      )
      .select(
        "U.username_mobile",
        Database.raw("CONCAT(E.FirstName, ' ', E.lastname) as Name"),
        "Password",
        "E.OrganizationId"
      )
      .from("UserMaster as U")
      .andWhere("U.username_mobile", userphone);

    var checkquery_num_row = selectUserMasterList;
    if (checkquery_num_row.length > 0 || Organization_num_rows.length > 0) {
      if (checkquery_num_row.length > 0) {
        console.log("op");
        result["name"] = checkquery_num_row[0].Name;
        result["password"] = await Helper.decode5t(
          checkquery_num_row[0].Password
        );
        var organizationId = checkquery_num_row[0].OrganizationId;
        result["orgName"] = await Helper.getOrgName(organizationId);
        result["orgId"] = checkquery_num_row[0].OrganizationId;
      }

      if (Organization_num_rows.length > 0) {
        console.log("o");
        result["orgName"] = Organization_num_rows[0].Name;
        result["orgId"] = Organization_num_rows[0].Id;
      result["status"] = "1";
    } else {
      result["status"] = "2";
    }
    }
    return result;
  }
    
    public static async CheckUserPhone(data){
        var phone =data.phone
        var  result:any={}
        var userphone = await  Helper.encode5t(phone);  
        
        var selectOrganizationList = await Database.from("Organization").where("PhoneNumber",phone).select("Id as OId","Name as OName")
        
        const Organization_num_rows = selectOrganizationList
        const selectUserMasterList = await Database.from("UserMaster")
        .innerJoin('EmployeeMaster as E', 'E.Id', 'U.EmployeeId').innerJoin('EmployeeMaster as E2', 'E2.organizationId', 'U.organizationId')
        .select(
          'U.username_mobile',
          Database.raw("CONCAT(E.FirstName, ' ', E.lastname) as Name"),
          'Password',
          'E.OrganizationId'
        )
        .from('UserMaster as U')
        .andWhere('U.username_mobile', userphone)

      var checkquery_num_row =selectUserMasterList;
      if(checkquery_num_row.length>0 || Organization_num_rows.length > 0 )
      {
        if (checkquery_num_row.length > 0) {
          console.log("op")
            result['name'] = checkquery_num_row[0].Name;
            result['password'] =await Helper.decode5t(checkquery_num_row[0].Password);
            var organizationId = checkquery_num_row[0].OrganizationId
            result['orgName'] =await Helper.getOrgName(organizationId);
            result['orgId'] = checkquery_num_row[0].OrganizationId;


        
          }
    
          if (Organization_num_rows.length > 0) {
            console.log("o")
            result['orgName'] = Organization_num_rows[0].Name;
            result['orgId'] = Organization_num_rows[0].Id;
          }
          
          
      }
         result['status'] = '1'; 

      }

  public static async VerifyEmailOtpRequest(data) {
    var EmailId = data.emailId;
    var Otp = data.otp;
    var Orgid = data.orgId;

    var newemailId = await Helper.encode5t(EmailId);
    const resultOTP = {};

    const otpVerify = await Database.from("EmailOtp_Authentication")
      .select("*")
      .where("otp", Otp)
      .andWhere("email_id", newemailId);

    const numRowsAffected = otpVerify.length; // Get the number of rows affected by the query

    if (numRowsAffected > 0) {
      var numRowsUpdated: any = await Database.from("Organization")
        .where("Id", Orgid)
        .update({ mail_varified: 1 });
      const count = numRowsUpdated;

      if (count) {
        resultOTP["resultOTP"] = "1";
      }
    } else {
      resultOTP["resultOTP"] = "0";
    }

    const data2 = [resultOTP]; // Put the resultOTP object into an array

    return data2;
  }

  public static async UpdateEmailOTPRequest(data) {
    const EmailNew = data.emailId;
    const OldEmail = data.oldEmail;
    const Empid = data.empId;
    const Orgid = data.orgId;
    const result = {};
    var affectedRows1;
    var EncodeEmail = await Helper.encode5t(EmailNew);
    var fetchemqilEmp = await Database.from("EmployeeMaster")
      .select("CurrentEmailId")
      .where("CurrentEmailId", EncodeEmail);

    affectedRows1 = fetchemqilEmp.length;
    if (affectedRows1 > 0) {
      result["status"] = "1";
      return result;
    }
    var fetchemqilUser = await Database.from("UserMaster")
      .select("Username")
      .where("Username", EncodeEmail);

    affectedRows1 = fetchemqilUser.length;
    if (affectedRows1 > 0) {
      result["status"] = "2";
      return result;
    }
    var fetchemqilAuth = await Database.from("EmailOtp_Authentication")
      .select("email_id")
      .where("email_id", EncodeEmail);

    affectedRows1 = fetchemqilAuth.length;
    if (affectedRows1 > 0) {
      result["status"] = "3";
      return result;
    }
    const updateEmail = await Database.from("EmployeeMaster")
      .where("OrganizationId", Orgid)
      .andWhere("Id", Empid)
      .update({ CurrentEmailId: EncodeEmail });

    const updateUserEmail = await Database.from("UserMaster")
      .where("OrganizationId", Orgid)
      .andWhere("EmployeeId", Empid)
      .update("Username", EncodeEmail);

    const updateEmaiOTPEmail = await Database.from("EmailOtp_Authentication")
      .where("orgId", Orgid)
      .andWhere("empId", Empid)
      .update("email_id", EncodeEmail);

    const updateOrgEmaiOTPEmail = await Database.from("Organization")
      .where("Id", Orgid)
      .update("Email", EmailNew);

    const updateAdminEmaiOTPEmail = await Database.from("admin_login")
      .where("email", OldEmail)
      .andWhere("OrganizationId", Orgid)
      .update({
        email: EmailNew,
        username: EmailNew,
      });
    if (updateEmail || updateUserEmail || updateEmaiOTPEmail) {
      result["status"] = 0;
    } else {
      result["status"] = 4;
    }
    return result;
  }
}
