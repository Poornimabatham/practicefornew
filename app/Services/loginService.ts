import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import moment from "moment";
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

  public static async newregister_orgTemp(data) {
    const username = data.username;
    const Org_Name = data.companyName;
    const useremail = data.useremail;
    const userpassword = data.userpassword;
    const countrycode = data.countrycode;
    const countrycodeid = data.countrycodeid;
    const phoneno = (data.phoneno).toString();
    const appleAuthId = data.appleAuthId;
    let platform = data.platform;
    let app = data.app;    
    const skipOTP = data.skipOTP;
    const emailVerification = data.emailVerification;

    const date = moment().format("YY-MM-DD");
    const empid = 0;
    const orgid = 0;
    const result: any = {};
    const email = await Helper.encode5t(useremail);
    const phone = await Helper.encode5t(phoneno); 
    const Password = await Helper.encode5t(userpassword);
    const res: any = {};
    let id = 0;
    let timezone = 0;
    let days = 1;
    let emplimit = 0;
    let addonbulkatt = 0;
    let addonlocationtrack = 0;
    let addonvisit = 0;
    let addongeofence = 0;
    let addonpayroll = 0;
    let addontimeoff = 0;
    let address = "";

    const query1 = await Database.query()
      .from("Organization")
      .select("Id")
      .where("Email", useremail);
    if (query1.length > 0) {
      res["status"] = "false1";
      return res;
    }

    const query2 = await Database.query()
      .from("Organization")
      .where("PhoneNumber", `${phoneno}`);   
    if (query2.length > 0) {
      res["status"] = "false2";
      return res;
    }

    const query3 = await Database.query()
      .from("Organization")
      .where("Email", useremail)
      .andWhereNot("cleaned_up", 1)
      .andWhereNot("delete_sts", "1")
      .andWhereNot("delete_sts", "2");
    if (query3.length > 0) {
      res["status"] = "false1"; /////emailid duplicate
      return res;
    }

    const query4 = await Database.query()
      .from("UserMaster")
      .where("Username", email);
    if (query4.length > 0) {
      res["status"] = "false1"; ///////emailid duplicate
      return res;
    }

    const query5 = await Database.query()
      .from("Organization")
      .where("PhoneNumber", `${phoneno}`)
      .andWhereNot("cleaned_up", 1)
      .andWhereNot("delete_sts", "1"); 
    if (query5.length > 0) {
      res["status"] = "false2";
      return res;
    }

    const query6 = await Database.query()
      .from("UserMaster")
      .where("username_mobile", `${phone}`);
    if (query6.length > 0) {
      res["status"] = "false2";
      return res;
    }
    const insertorgquery = await Database.table("Organization")
      .insert({
        Name: Org_Name,
        smtpuser: username,
        Email: useremail,
        countrycode: countrycode,
        PhoneNumber: phoneno,
        smtppassword: userpassword,
        platform: platform,
        app: app,
        Country: countrycodeid,
      })
      .returning("Id");

      id = insertorgquery[0];

    if (insertorgquery.length > 0) 
    {
        let otp  = insertorgquery[0];
        let potp = strlen(otp);
        let digits = potp;
        if(skipOTP == 1){
          otp='00000';
        }else{
            let tempotp = 0;//rand(pow(10, $digits-1), pow(10, $digits)-1);
            otp  = otp.tempotp;        
        }
          
        let updatequery = await Database.query().from('Organization').where('id',id).update({OTP:otp})

       if(app == "ubiAttendance"){
          app = "ubiAttendance";
       }else{
          app = "ubiSales";
       }

       let Body;
       let Subject;
       let logo;
       let msessage;
       let headers ='From: <noreply@ubiattendance.com>';

       let mailquery = await Database.query().from('All_mailers').select('Subject','Body').where('Id',4);
        
       if(mailquery){

        Body = mailquery[0].Body;
        Subject = mailquery[0].Subject; 
       }

       let maillink ='<a href="http://ubiattendance.ubihrm.com/index.php/services/activateAccount?iuser="style="color: #FF7D33;">Verify your Account</a> ';

       let mailbtnlink='<a href="http://ubiattendance.ubihrm.com/index.php/services/activateAccount?iuser" style="font-family: georgia, Arial, sans-serif;font-size: 15px;text-align: justify;color: rgb(255, 255, 255);text-decoration: none;background-color: rgb(37, 182, 153);border-color: rgb(248, 249, 250);padding: 15px;font-weight: 700 !important;">Verify your Account</a>';
      //  unsubscribe_link

       if(app == "ubiSales")
       {
        logo="<img src='https://ubiattendance.ubiattendance.xyz/assets/images/ubisales.png' style='width: 200px;' <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot'>"
       }else{
        logo="<img src='https://ubiattendance.ubiattendance.xyz/assets/images/ubi-Atttendance-Logo_d0bec719579677da36f94f7d3caa2d07.png' style='width: 200px;' <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot'>"
       } 
        
        let body1 = Body.replace("{logo}",logo)
        let body2 = body1.replace("{appname}",app);
        let body3 = body2.replace("{appname}",app);
        let body4 = body3.replace("{appname}",app);
        let body5 = body4.replace("{contact_person_name}", username);
        let body6 = body5.replace("{Verify your Account}",maillink);
        let body7 = body6.replace("{Verify your Account}",mailbtnlink);

        msessage = body7;
      
        await Helper.sendEmail(useremail,Subject,msessage,headers);

    }

    const FetchZone = await Database.query()
      .from("ZoneMaster")
      .select("*")
      .where("CountryId", countrycodeid);
    if (FetchZone.length > 0) {
      timezone = FetchZone[0].Id;
    }

    const fetchquery = await Database.query().from("ubitech_login").select("*");
    if (fetchquery.length > 0) {
      days = fetchquery[0].trial_days;
      emplimit = fetchquery[0].user_limit;
      addonbulkatt = fetchquery[0].bulk_attendance;
      addonlocationtrack = fetchquery[0].location_tracing;
      addonvisit = fetchquery[0].visit_punch;
      addongeofence = fetchquery[0].geo_fence;
      addonpayroll = fetchquery[0].payroll;
      addontimeoff = fetchquery[0].time_off;
    }

    const start_date = moment().format("YY-MM-DD");
    const a = moment();
    const b = moment.duration(`${days}`, "days");
    const end_date = a.add(b).format("YY-MM-DD");

    const UpdateOrg = await Database.query()
      .from("Organization")
      .where("Id", id)
      .update({
        Address: address,
        TimeZone: timezone,
        CreatedDate: date,
        LastModifiedDate: date,
        Country: countrycodeid,
        mail_varified: emailVerification,
        fiscal_start: "1 April",
        fiscal_end: "31 March",
      });      
      
      if(UpdateOrg){
       if(app == "ubiAttendance"){
          app = "ubiAttendance";
       }else{
          app = "ubiSales";
       }

       let Body;
       let Subject;
       let logo;
       let msessage;
       let headers ='From: <noreply@ubiattendance.com>';

       let mailquery = await Database.query().from('All_mailers').select('Subject','Body').where('Id',4);
        
       if(mailquery){

        Body = mailquery[0].Body;
        Subject = mailquery[0].Subject; 
       }

       if(app == "ubiSales")
       {

        logo="<img src='https://ubiattendance.ubiattendance.xyz/assets/images/ubisales.png' style='width: 200px;' <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot'>"
       }else{
        logo="<img src='https://ubiattendance.ubiattendance.xyz/assets/images/ubi-Atttendance-Logo_d0bec719579677da36f94f7d3caa2d07.png' style='width: 200px;' <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot'>"
       } 
        
        let body1 = Body.replace("{logo}",logo)
        let body2 = body1.replace("{appname}",app);
        let body3 = body2.replace("{appname}",app);
        let body4 = body3.replace("{appname}",app);
        let body5 = body4.replace("{appname}",app);
        let body6 = body5.replace("{appname}",app);
        let body7 = body6.replace("{employee_number}", phoneno);
        let body8 = body7.replace("{employee_password}",userpassword);

      msessage = body8;
      
      const takerep = await Helper.sendEmail(useremail,Subject,msessage,headers);
   
    
        //////////write Zone 

       const insert_adminlogin = await Database.table("admin_login").insert({
        username: username,
        password: userpassword,
        email: useremail,
        OrganizationId: id,
        name: username,
      });

      ///////////write function encrypted form for password

      const insert_notification = await Database.table(
        "NotificationStatus"
      ).insert({ OrganizationId: id });

      const insert_whitelabel = await Database.table("WhiteLabeling").insert({
        OrganizationId: id,
      });

      const insert_alert = await Database.table("Alert_Settings").insert({
        OrganizationId: id,
        Created_Date: date,
      });

      const column_value: { [key: string]: any } = {};
      column_value["OrganizationId"] = id;
      column_value["start_date"] = start_date;
      column_value["end_date"] = end_date;
      column_value["extended"] = "1";
      column_value["user_limit"] = emplimit;
      column_value["Addon_BulkAttn"] = addonbulkatt;
      column_value["Addon_VisitPunch"] = addonvisit;
      column_value["Addon_GeoFence"] = addongeofence;
      column_value["Addon_Payroll"] = addonpayroll;
      column_value["Addon_TimeOff"] = addontimeoff;
      if (app == "ubiSales") {
        column_value["Addon_LocationTracking"] = addonlocationtrack;
      }

      let insert_licence = await Database.table("licence_ubiattendance")
        .insert(column_value);

      let dept_array: any = {};

      dept_array = [
        {
          Name: "Trial Department",
          OrganizationId: `${id}`,
        },
        {
          Name: "Human Resource",
          OrganizationId: `${id}`,
        },
        {
          Name: "Finance",
          OrganizationId: `${id}`,
        },
        {
          Name: "Clerk",
          OrganizationId: `${id}`,
        },
      ];

      const insert_Department = await Database.table("DepartmentMaster").insert(
        dept_array
      );

      let shift_array: any = {};

      shift_array = [
        {
          Name: "Trial Shift",
          TimeIn: "09:00:00",
          TimeOut: "18:00:00",
          OrganizationId: `${id}`,
          HoursPerDay: "09:00:00",
        },
      ];

      const insert_shift = await Database.table("ShiftMaster").insert(
        shift_array
      );

      let desi_array: any = {};

      desi_array = [
        {
          Name: "Trial Designation",
          OrganizationId: `${id}`,
        },
        {
          Name: "Manager",
          OrganizationId: `${id}`,
        },
        {
          Name: "HR",
          OrganizationId: `${id}`,
        },
        {
          Name: "Clerk",
          OrganizationId: `${id}`,
        },
      ];

      const insert_desi = await Database.table("DesignationMaster").insert(
        desi_array
      );

      const roleid = await Helper.getDesignationId("Trial Designation", id);

      let permission_array: any = {};

      permission_array = [
        {
          RoleId: roleid,
          ModuleId: "12",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
        {
          RoleId: roleid,
          ModuleId: "13",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
        {
          RoleId: roleid,
          ModuleId: "18",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
        {
          RoleId: roleid,
          ModuleId: "42",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
        {
          RoleId: roleid,
          ModuleId: "179",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
        {
          RoleId: roleid,
          ModuleId: "305",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
        {
          RoleId: roleid,
          ModuleId: "19",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
        {
          RoleId: roleid,
          ModuleId: "47",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
        {
          RoleId: roleid,
          ModuleId: "60",
          ViewPermission: 1,
          EditPermission: 1,
          DeletePermission: 1,
          AddPermission: 1,
          OrganizationId: id,
          LastModifiedDate: date,
          CreatedDate: date,
        },
      ];

      const insert_permission = await Database.table("UserPermission").insert(
        permission_array
      );

      let shift = 0;
      let desg = 0;
      let dept = 0;

      let fetchshift = await Database.query()
        .from("ShiftMaster")
        .select("Id")
        .where("OrganizationId", id)
        .orderBy("Id", "asc")
        .limit(1);
      if (fetchshift.length > 0) {
        shift = fetchshift[0].Id;
      }

      let fetchdept = await Database.query()
        .from("DepartmentMaster")
        .select("Id")
        .where("OrganizationId", id)
        .orderBy("Id", "asc")
        .limit(1);
      if (fetchdept.length > 0) {
        dept = fetchdept[0].Id;
      }

      let fetchdesg = await Database.query()
        .from("DesignationMaster")
        .select("Id")
        .where("OrganizationId", id)
        .orderBy("Id", "asc")
        .limit(1);
      if (fetchdesg.length > 0) {
        desg = fetchdesg[0].Id;
      }

      let insert_EmployeeMaster = await Database.table("EmployeeMaster")
        .insert({
          FirstName: username,
          doj: "0000-00-00",
          countrycode: countrycode,
          PersonalNo: phone,
          Shift: shift,
          OrganizationId: id,
          Department: dept,
          Designation: desg,
          CompanyEmail: email,
        })
        .returning("Id");
      let Emp_id = insert_EmployeeMaster[0].Id;
      result["empid"] = Emp_id;

      if (insert_EmployeeMaster.length > 0) {
        const insert_UserMaster = await Database.table("UserMaster").insert({
          EmployeeId: Emp_id,
          appSuperviserSts: 1,
          AuthorizationAppleID: appleAuthId,
          Password: Password,
          Username: username,
          OrganizationId: id,
          CreatedDate: start_date,
          LastModifiedDate: date,
          username_mobile: phone,
          archive: 1,
          HRSts: 1,
          Password_sts: 1,
        });

        for (let i = 0; i < 8; i++) {
          const query = await Database.table("ShiftMasterChild").insert({
            ShiftId: shift,
            Day: i,
            WeekOff: "0,0,0,0,0",
            OrganizationId: id,
            ModifiedBy: Emp_id,
            ModifiedDate: date,
          });
          result["ord_id"] = id;
        }
      }

      let referrerId = 0;
      let referringOrg = 0;
      let referrencedOrg = id;
      let currentReferrerDiscount = 0;
      let currentReferenceDiscount = 0;
      let currentReferrerDiscountType = 2;
      let currentReferenceDiscountType = 2;
      let validFrom = "00:00:00";
      let validTo = "00:00:00";
      let referrerDiscountValidUpTo = "0000-00-00";

      const query = await Database.query()
        .from("OrganizationTemp")
        .select("*")
        .where("id", id);

      if (query.length > 0) {
        referrerId = query[0].referrerId;
        // referringOrg = getOrgIdByEmpId(referrerId)
        currentReferrerDiscount = query[0].referrerAmt;
        currentReferenceDiscount = query[0].referrenceAmt;
        validFrom = query[0].ReferralValidFrom;
        validTo = query[0].ReferralValidTo;
      }

      const fetchquery2 = await Database.query()
        .from("licence_ubiattendance")
        .select("*")
        .where("OrganizationId", referringOrg);
      if (fetchquery2.length > 0) {
        let end_date2 = fetchquery2[0].end_date;
        let a = moment(end_date2);
        let b = moment.duration(1, "months");
        referrerDiscountValidUpTo = a.add(b).format("YY-MM-DD");
      }

      if (referrerId != 0 && id != 0) {
        validFrom = query[0].ReferralValidFrom;
        const queryref = await Database.table("Referrals").insert({
          ReferrerId: referrerId,
          ReferringOrg: referringOrg,
          ReferenceId: Emp_id,
          ReferrencedOrg: referrencedOrg,
          DiscountForReferrer: currentReferrerDiscount,
          DiscountForReferrence: currentReferenceDiscount,
          ReferrerDiscountType: currentReferrerDiscountType,
          ReferenceDiscountType: currentReferenceDiscountType,
          DiscountType: 2,
          ValidFrom: validFrom,
          ValidTo: validTo,
          ReferrerDiscountValidUpTo: referrerDiscountValidUpTo,
          ReferrenceDate: date,
        });
      }
      result["sts"] = true;
      result["phone"] = phoneno;
      result["password"] = Password;

      return result;
    }
  }

  /////////////  Loginverifymail  ///////////

  static async Loginverifymail(getparam) {
    const emailNew = getparam.email;

    var selectquery = await Database.from("Organization as O")
      .innerJoin("admin_login as A", "A.OrganizationId", "O.Id")
      .innerJoin("licence_ubiattendance as lic", "O.Id", "lic.OrganizationId")
      .select(
        "A.name",
        "O.email",
        "A.OrganizationId",
        "O.mail_varified",
        Database.raw("DATEDIFF(lic.end_date, lic.start_date) as trialdays")
      )
      .where("O.Id", getparam.org_id)
      .andWhere("O.mail_varified", 0);
    
    var response = {};
    if (selectquery.length == 0) {
      response["response"] = 0; ///User Not exist on given org_id
    }
    interface Forselectquery {
      contact_person_name: string;
      email: string;
      trialdays: string;
    }
    const getresp = await selectquery;
    await Promise.all(
      getresp.map(async (val) => {
        const showdata: Forselectquery = {
          contact_person_name: val.name,
          email: val.email,
          trialdays: val.trialdays,
        };

        var oldmail = showdata.email;
        var email;
        if (oldmail != emailNew) {
          console.log("HAAA");
          
          email = emailNew;          
          let encodeemail = await Helper.encode5t(email);          
          var COUNTER = 0;
          var orgCount;
          orgCount = await Database.from("Organization")
            .select("*")
            .where("Email", email);
          COUNTER = orgCount.length;

          orgCount = await Database.from("admin_login")
            .where("username", email)
            .andWhere("email", email);
          COUNTER += orgCount.length;

          orgCount = await Database.from("UserMaster")
            .select("*")
            .where("Username", encodeemail);
          COUNTER += orgCount.length;

          if (COUNTER > 0) {            
            response["response"] = 1; // Already exist
          } else {   
          console.log(email);
          
            const updateQuery = await Database .from("Organization as o")
              .innerJoin("admin_login as a", "o.Id", "a.OrganizationId")
              .innerJoin("EmployeeMaster as e", "o.Id", "e.OrganizationId")
              .innerJoin("UserMaster as u", "o.Id", "u.OrganizationId")
              .where("o.Id", getparam.org_id)
              .update({
                "o.Email": email,
                "a.email": email,
                "a.username": email,
                "e.CurrentEmailId": encodeemail,
                "u.Username": encodeemail,
              });

            if (updateQuery) {
              response["response"] = 2; //updated Successfully
            }
          }
        } else {
          email = oldmail;
        }
        var subject;
        var mailbody;
        var getmail = await Database.from("All_mailers")
          .select("Subject", "Body")
          .where("Id", 2);
        if (getmail.length > 0) {
          subject = getmail[0].Subject;
          mailbody = getmail[0].Body;
        }

        const orgIdEncrypted = await Helper.encode5t(getparam.org_id);

        const verify1 = `<a href="https://ubiattendance.ubihrm.com/index.php/services/activateOrg?iuser=${orgIdEncrypted}" style="font-family: georgia, Arial, sans-serif; font-size: 15px; text-align: justify; color: rgb(255, 255, 255); text-decoration: none; background-color: rgb(37, 182, 153); border-color: rgb(248, 249, 250); padding: 15px; font-weight: 700 !important">Verify your Account</a>`;

        const verify2 = `<a style="color: #ff7d33;" href="https://ubiattendance.ubihrm.com/index.php/services/activateOrg?iuser=${orgIdEncrypted}">Verify your Account</a>`;

        const verify3 = `<a href="https://www.ubiattendance.com/contact-us">Contact us</a>`;

        const mlbody = mailbody;

        var mlbody1 = mlbody.replace(
          "{contact_person_name}",
          showdata.contact_person_name
        );
        var mlbody2 = mlbody1.replace("{Verify_your_Account}", verify1);
        var mlbody3 = mlbody2.replace("{Verify your Account}", verify2);
        var mlbody4 = mlbody3.replace("Contact us", verify3);

        var messages = mlbody4;

        var headers = "MIME-Version: 1.0" + "\r\n";
        headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
        headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";

        console.log(email);
        email = "meghwalshivam18@gmail.com";
        console.log(email);
        let getrespons = await Helper.sendEmail(
          email,
          subject,
          messages,
          headers
        );

        if (getrespons !=undefined) {
          response["status"] = "true"; //Mail send succesfully
        } else {
          response["status"] = "false"; ////Mail send Unsuccesfully
        }
      })
    );
    return response;
  }
}
function strlen($otp: any) {
  throw new Error("Function not implemented.");
}

