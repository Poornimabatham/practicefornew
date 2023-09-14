import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { lastDayOfMonth } from "date-fns";
import LogicsOnly from "./getAttendances_service";

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
        result["name"] = checkquery_num_row[0].Name;
        result["password"] = await Helper.decode5t(
          checkquery_num_row[0].Password
        );
        var organizationId = checkquery_num_row[0].OrganizationId;
        result["orgName"] = await Helper.getOrgName(organizationId);
        result["orgId"] = checkquery_num_row[0].OrganizationId;
      }

      if (Organization_num_rows.length > 0) {
        result["orgName"] = Organization_num_rows[0].Name;
        result["orgId"] = Organization_num_rows[0].Id;
      }

      result["status"] = "1";
    } else {
      result["status"] = "2";
    }
    return result;
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

  public static async sendSignUpMail(getparam) {
    const app= getparam.appName ? getparam.appName : "";
    const username = getparam.userName ? getparam.userName : "";
    const password = getparam.password ? getparam.password : "";
    const loginResp = getparam.response ? getparam.response : "";
    const phone = getparam.phone ? getparam.phone : 0;
    const tmp = JSON.parse(loginResp);   
    const orgid = tmp.OrganizationId;
    const empId = await Helper.encode5t(tmp.EmployeeId.toString());    

    var logo;
    if (app == "ubiAttendance") {
      logo =
        '<img src="https://ubiattendance.ubiattendance.xyz/index.php/../assets/img/newlogo.png" alt = "Ubitech" style = "width: 130px; margin-left: 50px; margin-right: 50px;" >';        
    } else {
      logo =
        "<img src='https://ubihrmimages.s3.ap-south-1.amazonaws.com/ubisalesAssets/ubisales-logo-circle-final.png'style='width: 100px;' <p style='text-align: center; line-height:1;'><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot;'>";	
    }

    let subject = "UbiAttendance- Account verification";
    var querytest = await Database.from("All_mailers").select("Body").where("Id", 2);
    
    var namebody = "";    
    if (querytest.length > 0) {
      namebody = querytest[0].Body;
    }

    var message = namebody;
    
    const maillink ='<a href="http://ubiattendance.ubihrm.com/index.php/services/activateAccount?iuser='+empId+'" style="color: #FF7D33;">Verify your Account</a> ';

    const mailbtnlink = '<a href="http://ubiattendance.ubihrm.com/index.php/services/activateAccount?iuser=' + empId + '" style="font-family: georgia, Arial, sans-serif;font-size: 15px;text-align: justify;color: rgb(255, 255, 255);text-decoration: none;background-color: rgb(37, 182, 153);border-color: rgb(248, 249, 250);padding: 15px;font-weight: 700 !important;">Verify your Account</a>';
    
    const unsubscribe_link = '<a href="' + "URL" + 'cron/unsubscribeOrgMails/' + orgid + '" target="_top">unsubscribe </a>';

    message = message.replace("{contact_person_name}", tmp.ClientName);
    message = message.replace("{Verify your Account}", maillink);
    message = message.replace("{Verify_your_Account}", mailbtnlink);
    message = message.replace("{logo}", logo);
    message = message.replace("{ubiAttendance}", app);
    message = message.replace("{ubiAttendance}", app);
    message = message.replace("{ubiAttendance}", app);
    message = message.replace("{Unsubscribe_link}", unsubscribe_link);
    
    const headers = " ";    
    
    // await Helper.sendEmail("meghwalshivam18@gmail.com",subject + "testMail",message,headers); 
    await Helper.sendEmail(tmp.orgmail, subject, message, headers);
    
    var  querytest2 = await Database.from("All_mailers").select("Body").where("Id", 4);
    var namebody2 = "";
    if (querytest2) {
    namebody2 = querytest2[0].Body;
    }

    var message1 = namebody2;
    
    var platFormName = app == "ubiAttendance" ? "ubiAttendance" : "ubiSales";
    
    var subject1 = "Please share the circular to the Employees for starting with " + platFormName;    

    var headers1 = "From: <noreply@ubiattendance.com>" + "\r\n";

    if (platFormName == "ubiSales") {       
      logo ="<img src='https://ubihrmimages.s3.ap-south-1.amazonaws.com/ubisalesAssets/ubisales-logo-circle-final.png'style='width: 100px;' <p style='text-align: center; line-height:1;'><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot;'>";      
    }
    else {                
      logo = '<img src="https://ubiattendance.ubiattendance.xyz/index.php/../assets/img/newlogo.png" alt = "Ubitech" style = "width: 130px; margin-left: 50px; margin-right: 50px;" >'; 
      
    }
    
    message1 = message1.replace("{employee_number}", username);
    message1 = message1.replace("{employee_password}", password);
    message1 = message1.replace("{logo}", logo);
    message1 = message1.replace("ubiAttendance", platFormName);
    message1 = message1.replace("ubiAttendance", platFormName);
    message1 = message1.replace("ubiAttendance", platFormName);
    message1 = message1.replace("ubiAttendance", platFormName);
    message1 = message1.replace("ubiAttendance", platFormName);

    // await Helper.sendEmail("meghwalshivam18@gmail.com",subject1 + "testMail",message1,headers1);
    await Helper.sendEmail(tmp.orgmail,subject1,message1,headers1);
    
    }
  }
  


