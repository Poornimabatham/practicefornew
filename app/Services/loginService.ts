import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
import moment from "moment";
// import Helper from "App/Helper/Helper";

export default class loginService {
  public static async checkLogin(getData, token) {
    let data: any = [{}];
    let userName: string = "";
    let password: string = "";
    let Org_perm: string = "1,2,3";
    let datetime = DateTime.local();
    let date = datetime.toFormat("yyyy-MM-dd");
    let device = getData.device;
    let qr = getData.qr;
    let mailverified: String = "";
    let ubiHrm_Sts: String = "";
    let visibleSts: String = "";
    let archive: string = "";
    let dataarray: any[] = [];

    if (qr == "true") {
      userName = await Helper.encode5t(getData.userName);
      password = getData.password;
    } else {
      userName = await Helper.encode5t(getData.userName);
      password = await Helper.encode5t(getData.password);
    }

    let userName1 = getData.userName.trim().toLowerCase();
    let password1 = getData.password;
    let getVarifiedMail: any = await Database.from("OrganizationTemp")
      .orWhereRaw("(Email = ? or phoneNumber = ?)", [userName, userName1])
      .where("password", password1);
    if (getVarifiedMail.length > 0) {
      mailverified = getVarifiedMail.mail_varified;
      if (mailverified == "0") {
        data[0].mailStatus = 1;
        return data;
      }
    }

    let loginQuery: any = await Database.from("UserMaster as U")
      .innerJoin("EmployeeMaster as E", "E.Id", "U.EmployeeId")
      .orWhereRaw("(Username = ? or username_mobile = ?)", [userName, userName])
      .where("password", password1)
      .andWhereNotIn(
        "E.OrganizationId",
        [
          502, 1074, 138265, 138263, 138262, 138261, 138260, 138259, 138258,
          138257, 138256, 138255, 138254, 138253, 135095,
        ]
      );
    if (loginQuery.length > 0) {
      archive = loginQuery.archive;
      let is_Delete = loginQuery[0].Is_Delete;
      ubiHrm_Sts = await Helper.getUbiatt_Ubihrmsts(
        loginQuery[0].OrganizationId
      );
      visibleSts = loginQuery[0].VisibleSts;

      if (
        ubiHrm_Sts == "1" &&
        (archive == "0" ||
          is_Delete == "1" ||
          is_Delete == "2" ||
          visibleSts == "0")
      ) {
        data[0].response = "2";

        return data;
      }

      if (archive == "0" || is_Delete == "1" || is_Delete == "2") {
        data[0].response = "2";

        return data;
      }
    }

    let checkloginquery: any = await Database.from("UserMaster")
      .innerJoin("EmployeeMaster", "UserMaster.EmployeeId", "EmployeeMaster.id")
      .orWhereRaw("(Username = ? or username_mobile = ?)", [userName, userName])
      .where("Password", password)
      .andWhere("UserMaster.archive", 1)
      .andWhere("EmployeeMaster.archive", 1)
      .andWhere("EmployeeMaster.Is_Delete", 0)
      .andWhereNotIn(
        "EmployeeMaster.OrganizationId",
        [
          502, 1074, 138265, 138263, 138262, 138261, 138260, 138259, 138258,
          138257, 138256, 138255, 138254, 138253, 135095,
        ]
      )
      .select("*");

    if (checkloginquery.length > 0) {
      data[0].response = 1;
      data[0].fname = await Helper.ucfirst(checkloginquery[0].FirstName);
      data[0].lname = await Helper.ucfirst(checkloginquery[0].LastName);
      data[0].empid = checkloginquery[0].EmployeeId;
      data[0].geofencerestriction = checkloginquery[0].fencearea;
      data[0].token = token.token;
      data[0].attImage = await Helper.getAttImageStatus(
        checkloginquery[0].OrganizationId
      );

      data[0].attSelfie = checkloginquery[0].Selfie;
      data[0].qrkioskPin = checkloginquery[0].kioskPin;
      data[0].timeZoneCountry = await Helper.getEmpTimeZone(
        data[0].empid,
        checkloginquery[0].OrganizationId
      );
      data[0].allowToPunchAtt = checkloginquery[0].Att_restrict;

      data[0].areaIds = "";
      if (checkloginquery[0].area_assigned == "") {
        checkloginquery[0].area_assigned = 0;
      }
      if (checkloginquery[0].area_assigned != 0) {
        let geoFenceSettingquery: any = await Database.from("Geo_Settings")
          .whereIn("Id", [checkloginquery[0].area_assigned])
          .andWhere("OrganizationId", checkloginquery[0].OrganizationId)
          .andWhereNot("Lat_Long", "")
          .select(
            Database.raw(
              "CONCAT('[',GROUP_CONCAT(JSON_OBJECT('lat', SUBSTRING_INDEX(Lat_Long, ',', 1),'long', SUBSTRING_INDEX(Lat_Long, ',', -1),'radius', Radius,'Id', Id)),']') as json"
            )
          );

        if (geoFenceSettingquery.length > 0) {
          data[0].areaIds = geoFenceSettingquery[0].json;
        }
      } else {
        data[0].areaIds = "[]";
      }
      data[0].polyField = [];

      if (checkloginquery[0].area_assigned != 0) {
        let getIdData: any[] = [];
        let getIdDataquery = await Database.from("geofence_polygon_master")
          .whereIn("geo_masterId", [`${checkloginquery[0].area_assigned}`])
          .select("Id", "geo_masterId", "latit_in", "longi_in");

        getIdDataquery.forEach((queryData) => {
          let singleDataArray: any = {};
          singleDataArray.Id = queryData.Id;
          singleDataArray.geo_masterId = queryData.geo_masterId;
          singleDataArray.lat = queryData.latit_in;
          singleDataArray.long = queryData.longi_in;
          getIdData.push(singleDataArray);
        });

        dataarray.push(getIdData);
        // dataarray.push(getIdData)

        data[0].polyField = JSON.stringify(getIdData);

        let shiftId = await Helper.getassignedShiftTimes(
          checkloginquery[0].EmployeeId,
          date
        );

        let shiftType = await Helper.getShiftType(shiftId);

        let MultipletimeStatusq: any = await Helper.getshiftmultipletime_sts(
          checkloginquery[0].EmployeeId,
          date,
          shiftId
        );

        data[0].MultipletimeStatus = MultipletimeStatusq;
        data[0].usrpwd = await Helper.decode5t(checkloginquery[0].Password);
        data[0].ShiftType = shiftType;
        // let loctrackpermission = await Helper.loctrackpermission(
        //   checkloginquery[0].EmployeeId
        // );
        data[0].timeZone = await Helper.gettimezonebyid(
          checkloginquery[0].timezone
        );
        data[0].deviceverificationaddon = await Helper.getAddonPermission(
          checkloginquery[0].OrganizationId,
          "Addon_DeviceVerification"
        );

        data[0].deviceverification_setting =
          await Helper.getDeviceVerification_settingsts(
            checkloginquery[0].OrganizationId
          );
        data[0].addon_livelocationtracking = await Helper.getAddonPermission(
          checkloginquery[0].OrganizationId,
          "addon_livelocationtracking"
        );
        data[0].addonGeoFence = await Helper.getAddonPermission(
          checkloginquery[0].OrganizationId,
          "Addon_GeoFence"
        );
        data[0].Geofence_visit = await Helper.getAddonPermission(
          checkloginquery[0].OrganizationId,
          "Geofence_visit"
        );

        data[0].addon_qrAttendance = await Helper.getAddonPermission(
          checkloginquery[0].OrganizationId,
          "addon_qrAttendance"
        );

        data[0].TrackLocationEnabled = checkloginquery[0].livelocationtrack;
        data[0].persistedface = "0";
        let getPersistedFaceId: any = await Database.from("Persisted_Face")
          .where("EmployeeId", checkloginquery[0].EmployeeId)
          .select("PersistedFaceId");
        if (getPersistedFaceId.length > 0) {
          data[0].persistedface = getPersistedFaceId[0].PersistedFaceId;
        }
        data[0].device = checkloginquery[0].Device_Restriction;
        data[0].deviceandroidid = checkloginquery[0].DeviceId;

        data[0].status = checkloginquery[0].VisibleSts;
        data[0].orgid = checkloginquery[0].OrganizationId;
        data[0].sstatus = checkloginquery[0].appSuperviserSts;
        data[0].org_perm = Org_perm;
        data[0].imgstatus = 1;
        let getAttnImageStatus: any = await Database.from("admin_login")
          .where("OrganizationId", checkloginquery[0].OrganizationId)
          .andWhere("status", 1)
          .select("AttnImageStatus")
          .limit(1);
        if (getAttnImageStatus.length > 0) {
          data[0].imgstatus = getAttnImageStatus[0].AttnImageStatus;
        }
        let getOrgData: any = await Database.from("Organization")
          .where("id", data[0].orgid)
          .select("Name", "Email", "Country", "app");

        if (getOrgData.length > 0)
          if (getOrgData[0].Name.length > 16) {
            data[0].org_name = getOrgData[0].Name.substr(0, 40) + "..";
          } else {
            data[0].org_name = getOrgData[0].Name;
          }
        data[0].orgmail = getOrgData[0].Email;

        data[0].orgcountry = getOrgData[0].Country;
        if (getData.app == "PayPak") {
          data[0].PaypakApp = getOrgData[0].app; //for paypak
          if (data[0].PaypakApp != "PayPak") {
            data[0].response = 0;
            return JSON.stringify(data);
          }
        }
        let getLicence_UbiAttendanceData: any = await Database.from(
          "licence_ubiattendance"
        )
          .where("OrganizationId", data[0].orgid)
          .select("status", "end_date")
          .orderBy("id", "desc")
          .limit(1);

        if (getLicence_UbiAttendanceData.length > 0) {
          data[0].trialstatus = getLicence_UbiAttendanceData[0].status;
          let end_Date = getLicence_UbiAttendanceData[0].end_date;
          if (moment(end_Date).format("yyyy-MM-dd") < date) {
            data[0].trialstatus = "2";
          }
          data[0].buysts = getLicence_UbiAttendanceData[0].status;
        }
        let desgname: any = await Helper.getDesignation(
          checkloginquery[0].Designation
        );

        if (desgname.length > 16) {
          data[0].desination = desgname.substr(0, 40) + "..";
        } else
          data[0].desination = await Helper.getDesignation(
            checkloginquery[0].Designation
          );

        data[0].desinationId = checkloginquery[0].Designation;

        let deptgname: any = await Helper.getDeptNamem(
          checkloginquery[0].Department,
          data[0].orgid
        );

        if (deptgname.length > 16) {
          data[0].departmentName = deptgname.substr(0, 40) + "..";
        } else {
          data[0].departmentName = deptgname;
        }

        if (checkloginquery[0].ImageName != "") {
          let dir =
            "public/uploads/" +
            checkloginquery[0].OrganizationId +
            "/" +
            checkloginquery[0].ImageName;
          data[0].profile = "https://ubitech.ubihrm.com/" + dir;
        } else {
          data[0].profile =
            "http://ubiattendance.ubihrm.com/assets/img/avatar.png";
        }

        let result1: any = await Database.from("PlayStore")
          .select("*")
          .limit(1);

        if (result1.length > 0) {
          if (device == "Android") {
            data[0].store = result1.googlepath;
          } else if (device == "iOS") {
            data[0].store = result1.applepath;
          } else {
            data[0].store = "https://ubiattendance.ubihrm.com";
          }
        }
      }
    } else {
      data[0].response = 0;
    }
    return JSON.stringify(data[0]);
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
    const phoneno = data.phoneno.toString();
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

    if (insertorgquery.length > 0) {
      let otp = insertorgquery[0];
      let potp = strlen(otp);
      let digits = potp;
      if (skipOTP == 1) {
        otp = "00000";
      } else {
        let tempotp = 0; //rand(pow(10, $digits-1), pow(10, $digits)-1);
        otp = otp.tempotp;
      }

      let updatequery = await Database.query()
        .from("Organization")
        .where("id", id)
        .update({ OTP: otp });

      if (app == "ubiAttendance") {
        app = "ubiAttendance";
      } else {
        app = "ubiSales";
      }

      let Body;
      let Subject;
      let logo;
      let msessage;
      let headers = "From: <noreply@ubiattendance.com>";

      let mailquery = await Database.query()
        .from("All_mailers")
        .select("Subject", "Body")
        .where("Id", 4);

      if (mailquery) {
        Body = mailquery[0].Body;
        Subject = mailquery[0].Subject;
      }

      let maillink =
        '<a href="http://ubiattendance.ubihrm.com/index.php/services/activateAccount?iuser="style="color: #FF7D33;">Verify your Account</a> ';

      let mailbtnlink =
        '<a href="http://ubiattendance.ubihrm.com/index.php/services/activateAccount?iuser" style="font-family: georgia, Arial, sans-serif;font-size: 15px;text-align: justify;color: rgb(255, 255, 255);text-decoration: none;background-color: rgb(37, 182, 153);border-color: rgb(248, 249, 250);padding: 15px;font-weight: 700 !important;">Verify your Account</a>';
      //  unsubscribe_link

      if (app == "ubiSales") {
        logo =
          "<img src='https://ubiattendance.ubiattendance.xyz/assets/images/ubisales.png' style='width: 200px;' <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot'>";
      } else {
        logo =
          "<img src='https://ubiattendance.ubiattendance.xyz/assets/images/ubi-Atttendance-Logo_d0bec719579677da36f94f7d3caa2d07.png' style='width: 200px;' <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot'>";
      }

      let body1 = Body.replace("{logo}", logo);
      let body2 = body1.replace("{appname}", app);
      let body3 = body2.replace("{appname}", app);
      let body4 = body3.replace("{appname}", app);
      let body5 = body4.replace("{contact_person_name}", username);
      let body6 = body5.replace("{Verify your Account}", maillink);
      let body7 = body6.replace("{Verify your Account}", mailbtnlink);

      msessage = body7;

      await Helper.sendEmail(useremail, Subject, msessage, headers);
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

    if (UpdateOrg) {
      if (app == "ubiAttendance") {
        app = "ubiAttendance";
      } else {
        app = "ubiSales";
      }

      let Body;
      let Subject;
      let logo;
      let msessage;
      let headers = "From: <noreply@ubiattendance.com>";

      let mailquery = await Database.query()
        .from("All_mailers")
        .select("Subject", "Body")
        .where("Id", 4);

      if (mailquery) {
        Body = mailquery[0].Body;
        Subject = mailquery[0].Subject;
      }

      if (app == "ubiSales") {
        logo =
          "<img src='https://ubiattendance.ubiattendance.xyz/assets/images/ubisales.png' style='width: 200px;' <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot'>";
      } else {
        logo =
          "<img src='https://ubiattendance.ubiattendance.xyz/assets/images/ubi-Atttendance-Logo_d0bec719579677da36f94f7d3caa2d07.png' style='width: 200px;' <p style='text-align: center; line-height:1; ><br></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot'>";
      }

      let body1 = Body.replace("{logo}", logo);
      let body2 = body1.replace("{appname}", app);
      let body3 = body2.replace("{appname}", app);
      let body4 = body3.replace("{appname}", app);
      let body5 = body4.replace("{appname}", app);
      let body6 = body5.replace("{appname}", app);
      let body7 = body6.replace("{employee_number}", phoneno);
      let body8 = body7.replace("{employee_password}", userpassword);

      msessage = body8;

      const takerep = await Helper.sendEmail(
        useremail,
        Subject,
        msessage,
        headers
      );

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

      let insert_licence = await Database.table("licence_ubiattendance").insert(
        column_value
      );

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
            const updateQuery = await Database.from("Organization as o")
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

        // console.log(email);
        // email = "meghwalshivam18@gmail.com";    // for testing
        // console.log(email);

        let getrespons = await Helper.sendEmail(
          email,
          subject,
          messages,
          headers
        );

        if (getrespons != undefined) {
          response["status"] = "true"; //Mail send succesfully
        } else {
          response["status"] = "false"; ////Mail send Unsuccesfull
        }
      })
    );
    return response;
  }





  static async CreateBulkAtt(data: any) {

    console.log(data);
    let result: any[] = [],
      count: number = 0,
      errorMsg: string = "",
      successMsg: string = "",
      status: string = "",
      dataContainer: any[] = [],
      zone: string = "";
      let AttData:any =JSON.parse(data.attlist)
    
    
    if (data.uid != 0) {
      zone = await Helper.getEmpTimeZone(data.uid, data.orgid); // to set the timezone by employee
    } else {
      zone = await Helper.getTimeZone(data.orgid);
    }
    const defaultZone = DateTime.now().setZone(zone);

    let dateTime: string = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss"),
      currentDate: DateTime = DateTime.local(),
      time: string = defaultZone.toFormat("HH:mm:ss"),
      date: string = defaultZone.toFormat("yyyy-MM-dd"),
      $skip: number = 0;

    
      AttData.forEach(async (row) => {



        console.log( row["Id"],
        data.org_id,
        time,
        date,
        dateTime);
        
        await Helper.AutoTimeOffEndWL(
          row["Id"],
          data.org_id,
          time,
          date,
          dateTime
        );

        let todayDate = row["data_date"] != undefined ? row["data_date"] : date;
        count += 1;
        console.log('row["Attid"]');
        
        if (row["Attid"] != undefined && row["Attid"] != "0") {
        console.log(row["Attid"]);
        
          let overtime = "00:00";
          let shifttype = await Helper.getShiftType(row["shift"]);
          let timeoutdate = todayDate;
          if (shifttype != 1) {
            if (row["timein"] > row["timeout"]) {
              const nextDay: any = currentDate.plus({ days: 1 });
              timeoutdate = nextDay.toFormat("yyyy-MM-dd");

              let getOverTime: any = await Database.from("ShiftMaster")
                .select(
                  Database.raw(
                    `SUBTIME( SUBTIME( timein, timeout ) , SUBTIME(  '"${row["timein"]}"',  '"${row["timeout"]}"' ) ) AS overtime`
                  )
                )
                .where("id", row["shift"]);
              if (getOverTime.length > 0) {
                overtime = getOverTime.overtime;
              } else {
                let getOverTime: any = await Database.from("ShiftMaster")
                  .select(
                    Database.raw(
                      `SUBTIME( SUBTIME( timein, timeout ) , SUBTIME(  '"${row["timein"]}"',  '"${row["timeout"]}"' ) ) AS overtime`
                    )
                  )
                  .where("id", row["shift"]);
                if (getOverTime.length > 0) {
                  overtime = getOverTime.overtime;
                }
                time = "24:00:00";
                const timein = DateTime.fromISO(row.timein);
                const timeout = DateTime.fromISO(row.timeout);

                const diffInSeconds = timeout.diff(timein).as("seconds");
                const admintotal = DateTime.fromMillis(
                  diffInSeconds * 1000
                ).toFormat("HH:mm");

                let multitime_Sts = await Helper.getshiftmultipletime_sts(
                  row["Id"],
                  todayDate,
                  row["shift"]
                );
                if (shifttype == 3 || multitime_Sts == 1) {
                  await Database.from("AttendanceMaster")
                    .where("Id", row["Attid"])
                    .andWhere("AttendanceDate", todayDate)
                    .update({
                      TimeOut: row["timeout"],
                      ExitImage:
                        "https://ubiattendance.ubihrm.com/assets/img/managerdevice.png",
                      timeoutdate: timeoutdate,
                      Overtime: overtime,
                      device: "AppManager",
                      TimeOutDevice: "AppManager",
                      TotalLoggedHours: admintotal,
                    });

                  await Database.from("InterimAttendances")
                    .where("AttendanceMasterId", row["Attid"])
                    .andWhere("OrganizationId", data.orgid)
                    .update({
                      TimeOut: row["timeout"],
                      ExitImage:
                        "https://ubiattendance.ubihrm.com/assets/img/managerdevice.png",
                      timeoutdate: timeoutdate,
                      Overtime: overtime,
                      device: "AppManager",
                      TimeOutDevice: "AppManager",
                      TotalLoggedHours: admintotal,
                    });
                } else {
                  await Database.from("AttendanceMaster")
                    .where("Id", row["Attid"])
                    .andWhere("AttendanceDate", todayDate)
                    .update({
                      TimeOut: row["timeout"],
                      ExitImage:
                        "https://ubiattendance.ubihrm.com/assets/img/managerdevice.png",
                      timeoutdate: timeoutdate,
                      Overtime: overtime,
                      device: "AppManager",
                      TimeOutDevice: "AppManager",
                      TotalLoggedHours: admintotal,
                    });
                }
                await Database.from("AttendanceMaster")
                  .where("Id", row["Attid"])
                  .andWhere("AttendanceDate", todayDate)
                  .update({
                    TimeOut: row["timeout"],
                    ExitImage:
                      "https://ubiattendance.ubihrm.com/assets/img/managerdevice.png",
                    timeoutdate: timeoutdate,
                    Overtime: overtime,
                    device: "AppManager",
                    TimeOutDevice: "TimeOutDevice",
                  });
              }
            }
          }
        } else {

          let getEmpid = await Database.from("AttendanceMaster")
            .where("EmployeeId", row["Id"])
            .andWhere("AttendanceDate", todayDate);
        

          let rowCount = getEmpid.length;
          if (rowCount == 0) {
             await Helper.getName(
              "EmployeeMaster",
              "Department",
              "Id",
              row["Id"]
            );
             await Helper.getName(
              "EmployeeMaster",
              "Designation",
              "Id",
              row["Id"]
            );
           await Helper.getName(
              "EmployeeMaster",
              "area_assigned",
              "Id",
              row["Id"]
            );
          }
        }
      })
    
  }
}

