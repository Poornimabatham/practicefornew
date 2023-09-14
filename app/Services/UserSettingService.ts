import Database from "@ioc:Adonis/Lucid/Database";
import helper from "../Helper/Helper";
import Helper from "../Helper/Helper";
import moment from "moment-timezone";
export default class Usersettingservice {
  constructor() {}

  static async changepassword(data) {
    const orgid = data.uid;
    const empid = data.empid;
    const cpassword = await helper.encode5t(data.cpassword);
    const npass = await helper.encode5t(data.npassword);
    const rptpass = await helper.encode5t(data.rtpassword);
    const res: any[] = [];
    const res1 = {};
    let data1: any;

    const query = await Database.query()
      .from("UserMaster")
      .select("*")
      .where("EmployeeId", empid)
      .andWhere("OrganizationId", orgid)
      .andWhere("Password", cpassword);
    if (query.length == 1) {
      query.forEach(async function (row) {
        var data = {};
        data["sts"] = row.appSuperviserSts;
        res.push(data);
      });
      data1 = res[0].sts;
    } else {
      if (cpassword == npass) {
        res1["status"] = 3;
      } else {
        res1["status"] = "password has been  changed";
      }
    }

    if (query.length == 1) {
      if (npass == rptpass) {
        const qur = await Database.from("UserMaster")
          .where("EmployeeId", empid)
          .andWhere("OrganizationId", orgid)
          .update({ Password: rptpass, Password_sts: 1 });
        res1["status"] = qur;
        res1["message"] = "Changed Password";
        if (data1 == 1) {
          const qur1 = await Database.from("admin_login")
            .where("OrganizationId", orgid)
            .update({ password: rptpass, changepasswordStatus: 1 });
          res1["status"] = qur1;
          res1["message"] = "Changed Password";
        }
      }
    }
    return res1;
  }

  // static async UpdateProfilePhoto(data){
  //    const Emplid = data.empid;
  //    const orgid = data.orgid;
  //    var new_name = Emplid + "jpg";
  //    var filePath = data.file;

  //    }

  static async getPunchInfoCsv(data) {
    const Empid = data.Empid;
    const Orgid = data.Orgid;
    const csv = data.Csv;
    const today = new Date(data.Date);
    const loginEmp = data.loginEmp;
    const currentPage = data.currentPage;
    const perpage = data.perpage;
    const begin = (currentPage - 1) * perpage;
    const zone = await Helper.getEmpTimeZone(Empid, Orgid);
    const adminstatus = await Helper.getAdminStatus(loginEmp);
    const res: any[] = [];

    let new_date = moment(today).format("YYYY-MM-DD");

    if (Empid != 0) {
      var query = Database.query()
        .from("checkin_master")
        .select(
          "Id",
          "EmployeeId",
          "location",
          "location_out",
          "time",
          "time_out",
          Database.raw(
            `SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img`
          ),
          Database.raw(
            `SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img`
          ),
          "client_name",
          "description",
          "latit",
          "longi",
          "latit_out",
          "longi_out"
        )
        .where("OrganizationId", Orgid)
        .andWhere("EmployeeId", Empid)
        .andWhere("date", new_date)
        .andWhereIn(
          "EmployeeId",
          Database.raw(
            `SELECT Id from EmployeeMaster where OrganizationId = ${Orgid} AND Is_Delete = 0`
          )
        )
        .orderBy("Id", "asc");
    } else {
      var query = Database.query()
        .from("checkin_master")
        .select(
          "Id",
          "EmployeeId",
          "location",
          "location_out",
          "time",
          "time_out",
          Database.raw(
            `SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img`
          ),
          Database.raw(
            `SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img`
          ),
          "client_name",
          "description",
          "latit",
          "longi",
          "latit_out",
          "longi_out"
        )
        .where("OrganizationId", Orgid)
        .andWhere("EmployeeId", Empid)
        .andWhere("date", new_date)
        .andWhereIn(
          "EmployeeId",
          Database.raw(
            `SELECT Id from EmployeeMaster where OrganizationId = ${Orgid} AND Is_Delete = 0`
          )
        )
        .orderBy("Id", "asc");
    }

    if (adminstatus == 2) {
      var dptid = await Helper.getDepartmentIdByEmpID(loginEmp);
      query = query.andWhere("Department", dptid);
    }

    var querydata = await query;

    querydata.forEach((row) => {
      const data: any = {};
      data["Id"] = row.Id;
      data["Employeeid"] = row.EmployeeId;
      data["Emp_Name"] = Helper.getempnameById(row.EmployeeId);
      data["loc_in"] = row.location;
      data["loc_out"] = row.location_out;
      data["timein"] = row.time;
      data["timeout"] = row.time_out;
      data["latit"] = row.latit;
      data["logit"] = row.longi;
      data["latit_in"] = row.latit_out;
      data["longi_out"] = row.longi_out;
      data["client"] = row.client_name;
      data["description"] = row.description;

      if (row.checkin_img != "") {
        data["checkin_img"] = row.checkin_img; /////write aws function getPresignedURL
      } else {
        data["checkin_img"] = "";
      }
      if ((row.checkout_img! = "")) {
        data["checout_img"] = row.checkout_img;
      } else {
        data["checout_img"] = "";
      }

      res.push(data);
    });

    return res;
  }

  static async getPunchInfo(data) {
    const Empid = data.Empid;
    const Orgid = data.Orgid;
    const csv = data.Csv;
    const today = new Date(data.Date);
    const loginEmp = data.loginEmp;
    const currentPage = data.currentPage;
    const perpage = data.perpage;
    const begin = (currentPage - 1) * perpage;
    const zone = await Helper.getEmpTimeZone(Empid, Orgid);
    const adminstatus = await Helper.getAdminStatus(Empid);
    const res: any[] = [];

    const new_date = moment(today).format("YYYY-MM-DD");

    if (Empid != 0) {
      var query = Database.query()
        .from("checkin_master")
        .select(
          "Id",
          "EmployeeId",
          "location",
          "location_out",
          "time",
          "time_out",
          Database.raw(
            `SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img`
          ),
          Database.raw(
            `SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img`
          ),
          "client_name",
          "description",
          "latit",
          "longi",
          "latit_out",
          "longi_out",
          "GeofenceStatusVisitIn",
          "GeofenceStatusVisitOut"
        )
        .where("OrganizationId", Orgid)
        .andWhere("EmployeeId", Empid)
        .andWhere("date", new_date)
        .andWhereIn(
          "EmployeeId",
          Database.raw(
            `SELECT Id from EmployeeMaster where OrganizationId = ${Orgid} AND Is_Delete = 0`
          )
        )
        .orderBy("Id", "asc");
    } else {
      var query = Database.query()
        .from("checkin_master")
        .select(
          "Id",
          "EmployeeId",
          "location",
          "location_out",
          "time",
          "time_out",
          Database.raw(
            `SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img`
          ),
          Database.raw(
            `SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img`
          ),
          "client_name",
          "description",
          "latit",
          "longi",
          "latit_out",
          "longi_out",
          "GeofenceStatusVisitIn",
          "GeofenceStatusVisitOut"
        )
        .where("OrganizationId", Orgid)
        .andWhere("EmployeeId", Empid)
        .andWhere("date", new_date)
        .andWhereIn(
          "EmployeeId",
          Database.raw(
            `SELECT Id from EmployeeMaster where OrganizationId = ${Orgid} AND Is_Delete = 0`
          )
        )
        .orderBy("Id", "asc")
        .limit(perpage)
        .offset(begin);
    }

    if (adminstatus == 2) {
      var dptid = await Helper.getDepartmentIdByEmpID(Empid);
      query = query.andWhere("Department", dptid);
    }

    var querydata = await query;

    querydata.forEach((row) => {
      const data: any = {};
      data["Id"] = row.Id;
      data["Employeeid"] = row.EmployeeId;
      data["Emp_Name"] = Helper.getempnameById(row.EmployeeId);
      data["loc_in"] = row.location;
      data["loc_out"] = row.location_out;
      data["timein"] = row.time;
      data["timeout"] = row.time_out;
      data["latit"] = row.latit;
      data["logit"] = row.longi;
      data["latit_in"] = row.latit_out;
      data["longi_out"] = row.longi_out;
      data["client"] = row.client_name;
      data["description"] = row.description;
      data["GeofenceStatusVisitIn"] = row.GeofenceStatusVisitIn;
      data["GeofenceStatusVisitOut"] = row.GeofenceStatusVisitOut;

      if (row.checkin_img != "") {
        data["checkin_img"] = row.checkin_img; /////write aws function getPresignedURL
      } else {
        data["checkin_img"] = "";
      }
      if (row.checkout_img != "") {
        data["checout_img"] = row.checkout_img;
      } else {
        data["checout_img"] = "";
      }

      res.push(data);
    });

    return res;
  }

  static async getEmployeesList(data) {
    const Empid = data.Empid;
    const Orgid = data.Orgid;
    const adminstatus = await Helper.getAdminStatus(Empid);
    const res: any[] = [];

    var query = Database.query()
      .from("EmployeeMaster")
      .select(
        "Id",
        "FirstName",
        "EmployeeCode",
        "NotificationStatus",
        Database.raw(`CONCAT(FirstName, ' ', lastname) as Name`)
      )
      .where("archive", 1)
      .andWhere("is_Delete", 0)
      .andWhere("OrganizationId", Orgid)
      .orderBy("FirstName", "asc");

    if (adminstatus == 2) {
      var dptid = await Helper.getDepartmentIdByEmpID(Empid);
      query = query.andWhere("Department", dptid);
    }

    var getquerydata = await query;
    getquerydata.forEach((row) => {
      const data: any = {};
      data["Id"] = row.Id;
      data["name"] = row.Name;
      if (row.NotificationStatus == 1) {
        data["sts"] = true;
      } else {
        data["sts"] = false;
      }
      if (row.EmployeeCode != "" || row.EmployeeCode != null) {
        data["ecode"] = row.EmployeeCode;
      } else {
        data["ecode"] = "-";
      }

      res.push(data);
    });

    return res;
  }

  static async getOrgCheck(data) {
    const Orgid = data.Orgid;
    let status = false;
    const result: any[] = [];

    const querydata = await Database.query()
      .from("NotificationStatus")
      .select("*")
      .where("OrganizationId", Orgid);

    querydata.forEach((row) => {
      const data: any = {};
      data["Visit"] = row.Visit;
      data["OutsideGeofence"] = row.OutsideGeofence;
      data["FakeLocation"] = row.FakeLocation;
      data["FaceIdReg"] = row.FaceIdReg;
      data["FaceIdDisapproved"] = row.FaceIdDisapproved;
      data["SuspiciousSelfie"] = row.SuspiciousSelfie;
      data["SuspiciousDevice"] = row.SuspiciousDevice;
      data["DisapprovedAtt"] = row.DisapprovedAtt;
      data["AttEdited"] = row.AttEdited;
      data["TimeOffStart"] = row.TimeOffStart;
      data["TimeOffEnd"] = row.TimeOffEnd;
      data["OrganizationId"] = row.OrganizationId;
      data["BasicLeave"] = row.BasicLeave;
      data["status"] = true;

      result.push(data);
    });
    return result;
  }

  static async NotificationTest(data) {
    const Columnname = data.ColumnName;
    const value = data.Value;
    const orgid = data.OrgId;
    var Data;

    const result: any = {};

    if (Columnname == "TimeOffStart") {
      Data = 0;
    } else {
      Data = 1;
    }

    if (Data == 0) {
      var query = await Database.query()
        .from("NotificationStatus")
        .where("OrganizationId", orgid)
        .update(`${Columnname}`, value)
        .update(`TimeOffEnd`, value);
      result["status"] = 1;
    } else {
      var query = await Database.query()
        .from("NotificationStatus")
        .where("OrganizationId", orgid)
        .update(`${Columnname}`, value);

      if (query.length > 0) {
        result["status"] = 2;
      } else {
        result["status"] = "No Update";
      }
    }
    return result;
  }

  static async UpdateNotificationStatus(data) {
    const orgid = data.orgid;
    const status = data.status;
    const empid = data.empid;
    const res: any = {};

    const query = await Database.query()
      .from("EmployeeMaster")
      .where("Id", empid)
      .andWhere("OrganizationId", orgid)
      .update({ NotificationStatus: status });

    if (query.length > 0) {
      if (status == 0) {
        res["status"] = false;
      } else {
        res["status"] = true;
      }
      return res;
    } else {
      res["status"] = "No Update";
      return res;
    }
  }

  static async setQrKioskPin(data) {
    const orgId = data.orgId;
    const empId = data.empId;
    const Qr = data.qRKioskPin;
    const result: any = {};

    const query = await Database.query()
      .from("UserMaster")
      .select("*")
      .where("EmployeeId", empId)
      .andWhere("OrganizationId", orgId);

    if (query.length > 0) {
      const query2 = await Database.query()
        .from("UserMaster")
        .where("EmployeeId", empId)
        .andWhere("OrganizationId", orgId)
        .update({ kioskPin: Qr });

      if (query2.length > 0) {
        result["response"] = 1;
      }
      result["response"] = 0;
    } else {
      result["response"] = 0;
    }
    return result;
  }

  static async ChangeQrKioskPin(data) {
    const empId = data.userId;
    const orgId = data.orgId;
    const oldPin = data.oldPin;
    const newPin = data.newPin;
    const result = {};

    const query = await Database.query()
      .from("UserMaster")
      .select("kioskPin")
      .where("EmployeeId", empId)
      .andWhere("OrganizationId", orgId)
      .andWhere("kioskPin", oldPin);

    if (query.length > 0) {
      const query12 = await Database.query()
        .from("UserMaster")
        .where("EmployeeId", empId)
        .andWhere("OrganizationId", orgId)
        .update({ kioskPin: newPin });

      if (query12.length > 0) {
        result["status"] = 1;
      } else {
        result["status"] = 0;
      }
    } else {
      result["status"] = 2;
    }
    return result;
  }

  static async getRegDetailForApproval(data) {
    const deta = data.datafor;
    const userid = data.uid;
    const orgid = data.orgid;
    const hrsts = data.hrsts;
    const devhrsts = data.divhrsts;
    let result: any[] = [];
    let count = 0;
    let startdate = "";
    let status = false;
    const zone = await Helper.getTimeZone(orgid);
    let enddate = moment().tz(zone).format("YYYY-MM-DD");

    const leavestaus = "LeaveStatus";

    const query = await Database.query()
      .from("Organization")
      .select("CreatedDate")
      .where("Id", orgid);
    count = query.length;

    if (count == 1) {
      startdate = moment(query[0].CreatedDate).format("yyyy-MM-DD");
    }

    const query2 = await Database.query()
      .from("OtherMaster")
      .select("ActualValue")
      .where("DisplayName", deta)
      .andWhere("OtherType", leavestaus);
    let value = query2[0].ActualValue;

    var sql = Database.query()
      .from("AttendanceMaster")
      .select(
        "*",
        Database.raw(
          `(SELECT IF(LastName!='',CONCAT(FirstName,' ',LastName),FirstName) FROM EmployeeMaster WHERE Id=EmployeeId) as Name`
        )
      )
      .where(
        Database.raw(
          ` DATE(AttendanceDate) between "${startdate}" and "${enddate}" `
        )
      )
      .orderBy("RegularizeRequestDate", "desc");

    if (hrsts == 1 || devhrsts == 1) {
      sql = sql.where(
        Database.raw(
          `OrganizationId=${orgid} and RegularizeSts=${value} and EmployeeId in (select Id from EmployeeMaster where Is_Delete=0 and (DOL='0000-00-00' or DOL>curdate()))`
        )
      );
    } else {
      sql = sql.where(
        Database.raw(
          `OrganizationId=${orgid} and RegularizeSts=${value} AND Id IN (SELECT attendanceId FROM RegularizationApproval Where ApproverId=${userid}) and EmployeeId in (select Id from EmployeeMaster where Is_Delete=0 and (DOL='0000-00-00' or DOL>curdate()))`
        )
      );
    }

    const sql11 = await sql;
    const total = sql11.length;

    if (total >= 1) {
      await Promise.all(
        sql11.map(async (row) => {
          const res = {};
          res["total"] = total;
          let attid = row.Id ? row.Id : 0;
          res["Id"] = row.Id;
          res["employeeId"] = row.EmployeeId;
          res["employeeName"] = row.Name;
          let regsts = row.RegularizeSts ? row.RegularizeSts : 0;
          res["device"] = row.device ? row.device : 0;

          if (res["device"] == "Auto Time Out") {
            res["deviceid"] = 1;
          } else {
            res["deviceid"] = 0;
          }
          res["empRemarks"] = row.RegularizationRemarks;
          res["approverRemarks"] = row.RegularizeApproverRemarks;
          res["attendanceDate"] = moment(row.AttendanceDate).format(
            "yyyy-MM-DD"
          );
          res["regApplyDate"] = moment(row.RegularizeRequestDate).format(
            "yyyy-MM-DD"
          );

          res["requestedtimeout"] = moment(row.requestedtimeout).format(
            "HH:mm:ss"
          );

          if (regsts == 3) {
            res["regularizeSts"] = "pending";
            let pstatus = 0;
            let approverid = row.ApproverId;

            if (approverid != 0) {
              pstatus = approverid;
            }
            if (pstatus == 0 || pstatus == null) {
              pstatus = 0;
            }

            if (pstatus == 0) {
              const qur1 = await Database.query()
                .from("RegularizationApproval")
                .select("ApproverId")
                .where("attendanceId", attid)
                .andWhere("ApproverSts", regsts)
                .andWhere("approverregularsts", 0)
                // .orderBy("Id", "asc")
                .limit(1);
              if (qur1.length > 0) {
                pstatus = qur1[0].ApproverId ? qur1[0].ApproverId : 0;
              }
            }

            const Name = await Helper.getEmpName(pstatus);

            if (pstatus != 0) {
              if (pstatus != userid) {
                res["pstatus"] = "Pending at" + Name;
                res["ApprovalIcon"] = false;
              } else {
                res["pstatus"] = "Pending at" + Name;
                res["ApprovalIcon"] = true;
              }
            } else {
              res["pstatus"] = "Pending";
              res["ApprovalIcon"] = false;
            }
          }
          if (regsts == 2) {
            res["regularizeSts"] = "Approved";
            res["Pstatus"] = "";
            res["ApprovalIcon"] = false;
          }
          if (regsts == 3) {
            res["regularizeSts"] = "Rejected";
            res["Pstatus"] = "";
            res["ApprovalIcon"] = false;
          }
          result.push(res);
          console.log(result);
        })
      );
      return result;
    }
  }

  static async recoverPinLoginCredential(data) {
    const orgId = data.Orgid;
    const empId = data.Empid;
    const userName = await Helper.encode5t(data.userName);
    const password = await Helper.encode5t(data.password);
    var dataresult = {};

    var recoverPinLoginCredentialQuery = await Database.from("UserMaster")
      .select("*")
      .where("Username", userName)
      .orWhere("username_mobile", userName)
      .andWhere("Password", password)
      .andWhere("OrganizationId", orgId)
      .andWhere("EmployeeId", empId);

    if (recoverPinLoginCredentialQuery.length > 0) {
      dataresult["response"] = "1";
    } else {
      dataresult["response"] = "0";
    }
    return dataresult;
  }

  static async UpdateQrKioskPageReopen(data) {
    const userId = data.userId;
    const orgId = data.orgId;
    const status = data.status;

    const result = {};

    const query = await Database.query()
      .from("UserMaster")
      .where("EmployeeId", userId)
      .andWhere("OrganizationId", orgId)
      .update({ QrKioskPageReopen: status });

    if (query) {
      result["status"] = 1;
    } else {
      result["status"] = 2;
    }

    return result;
  }

  static async demoScheduleRequest(data) {
    const orgid = data.orgId;
    const empid = data.empId;
    const newDate = moment(new Date(data.newDate)).format("YYYY-MM-DD");
    const Time = data.selectTime;
    const cardtitle = data.cardTitle;
    let Subject = "";
    let result: any = {};
    let response: any[] = [];
    let currentDate = moment().format("YYYY-MM-DD");
    let organizationName = "";
    const Adminmail = await Helper.getAdminEmail(orgid);
    const Adminname = await Helper.getAdminNamebyOrgId(orgid);
    const empmail = await Helper.getEmpEmail(empid);
    const Email = await Helper.decode5t(empmail);
    const Emp_Name = await Helper.getEmpName(empid);
    let contactemail;
    let contactNumber;
    let CreatedDate;
    let CountryId;
    let message = "";
    let body = "";
    let PhoneNumber = 0;
    let countryname = "";
    var headers = "MIME-Version: 1.0" + "\r\n";
    headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
    headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";

    if (cardtitle == "payRoll") {
      Subject = "Schedule Demo Request for PayRoll";
    } else {
      Subject = "Shedule Demo Request";
    }

    if (newDate != "") {
      const demoquery = await Database.query()
        .select("*")
        .from("ScheduleDemoDetail")
        .where("OrgnanizationId", orgid)
        .andWhere(Database.raw(`ScheduleDate >= "${newDate}"`));

      if (demoquery.length > 0) {
        result["sts"] = 0;
        result["date"] = moment(demoquery[0].ScheduleDate).format("YYYY-MM-DD");
        result["Time"] = demoquery[0].ScheduleTime;
        response.push(result);
      } else {
        const query = await Database.query()
          .from("Organization")
          .select(
            "Name",
            "PhoneNumber",
            "Email",
            "CreatedDate",
            "Country",
            "countrycode"
          )
          .where("Id", orgid);

        if (query.length > 0) {
          organizationName = query[0].Name;
          PhoneNumber = query[0].PhoneNumber;
          CreatedDate = query[0].CreatedDate;
          const Email = query[0].Email;
          CountryId = query[0].Country;
          countryname = await Helper.getCountryNameById(CountryId);
          contactNumber = await Helper.encode5t(PhoneNumber);
          contactemail = await Helper.encode5t(Email);
        }

        const demoInsert = await Database.table("ScheduleDemoDetail").insert({
          OrgnanizationId: orgid,
          ScheduleDate: newDate,
          ScheduleTime: Time,
          EmployeeId: empid,
          Email: contactemail,
          PhoneNumber: contactNumber,
          RegisteredDate: CreatedDate,
          CountryId: CountryId,
          CreateDate: currentDate,
          cardTitle: cardtitle,
        });

        if (demoInsert) {
          const query = await Database.query()
            .from("All_mailers")
            .select("Body")
            .where("Id", 34);
          body = query[0].Body;
          let body1 = body.replace("{Admin_Name}", Adminname);
          let body2 = body1.replace("{Date}", currentDate);
          let body3 = body2.replace("{Time}", Time);
          message = body3;
          await Helper.sendEmail(empmail, Subject, message, headers);

          const query2 = await Database.query()
            .from("All_mailers")
            .select("Body")
            .where("Id", 35);
          let bodyy = query[0].Body;
          let bodi1 = bodyy.replace("{Company_Name}", organizationName);
          let bodi2 = bodi1.replace("{Contact_Person}", Emp_Name);
          let bodi3 = bodi2.replace("{Email_Id}", empmail);
          let bodi4 = bodi3.replace("{Phone}", PhoneNumber);
          let bodi5 = bodi4.replace("{Registered_Date}", CreatedDate);
          let bodi6 = bodi5.replace("{Country}", countryname);
          let bodi7 = bodi6.replace("{Date}", currentDate);
          let bodi8 = bodi7.replace("{Time}", Time);

          let message1 = bodi8;

          await Helper.sendEmail(
            "viveksingh@ubitechsolutions.com",
            Subject,
            message1,
            headers
          );
          await Helper.sendEmail(
            "ubiattendance@ubitechsolutions.com",
            Subject,
            message1,
            headers
          );
          await Helper.sendEmail(
            "business@ubitechsolutions.com",
            Subject,
            message1,
            headers
          );

          result["sts"] = 1;
          result["date"] = currentDate;
          result["time"] = Time;
          response.push(result);
        }
      }
    } else {
      result["sts"] = 1;
      result["date"] = "";
      result["Time"] = "";
      response.push(result);
    }

    return response;
  }

  static async getTeamPunchInfo(data) {
    const orgid = data.orgid;
    const Empid = data.uid;
    const date = moment(new Date(data.date)).format("YYYY-MM-DD");
    const currentDate = moment().format();
    const adminstatus = await Helper.getAdminStatus(Empid);
    let respons: any[] = [];
    let result = {};

    let query = Database.query()
      .from("checkin_master as c")
      .innerJoin("EmployeeMaster as e", "e.Id", "c.EmployeeId")
      .select(
        "c.Id",
        "c.EmployeeId",
        "c.location",
        "c.location_out",
        "c.time",
        "c.time_out",
        Database.raw(
          `SUBSTRING_INDEX(c.checkin_img, '.com/', -1) as checkin_img`
        ),
        Database.raw(
          `SUBSTRING_INDEX(c.checkout_img, '.com/', -1) as checkout_img`
        ),
        "c.client_name",
        "c.description",
        "c.latit",
        "c.longi",
        "c.latit_out",
        "c.longi_out",
        "c.GeofenceStatusVisitIn",
        "c.GeofenceStatusVisitOut"
      )
      .where("c.OrganizationId", orgid)
      .andWhere("c.date", date)
      .andWhere("e.OrganizationId", orgid)
      .andWhere("e.Is_Delete", 0)
      .orderBy("time", "asc");

    if (adminstatus == 2) {
      var dptid = await Helper.getDepartmentIdByEmpID(Empid);
      query = query.andWhere("Department", dptid);
    }

    let querydata = await query;

    querydata.forEach((element) => {
      result["Id"] = element.Id;
      result["emp"] = element.Name;
      result["empId"] = element.EmployeeId;
      result["loc_in"] = element.location;
      result["loc_out"] = element.location_out;
      result["time_in"] = moment(element.time).format("HH:SS:MM");
      result["time_out"] = moment(element.time_out).format("HH:SS:MM");
      result["latit"] = element.latit;
      result["longi"] = element.longi;
      result["longi_out"] = element.longi_out;
      result["latit_in"] = element.latit_out;
      result["client"] = element.client_name;
      result["Name"] = element.Name;
      result["desc"] = element.description;
      result["GeofenceStatusVisitIn"] = element.GeofenceStatusVisitIn;
      result["GeofenceStatusVisitOut"] = element.GeofenceStatusVisitOut;
      if (element.checkin_img != "") {
        result["checkin_img"] = element.checkin_img; //write this function getPresignedURL;
      } else {
        result["checkin_img"] = "-";
      }
      if (element.checkout_img != "") {
        result["checkout_img"] = element.checkout_img; //write this function getPresignedURL;
      } else {
        result["checkout_img"] = "-";
      }
      result["description"] = element.description;
      respons.push(result);
    });

    return respons;
  }

  static async GetQrKioskStatus(data) {
    var result: {} = {};

    const selectQuery = await Database.from("UserMaster")
      .select("QrKioskPageReopen", "kioskPin")
      .where("EmployeeId", "=", data.EmpId)
      .andWhere("OrganizationId", "=", data.OrgId);

    if (selectQuery.length > 0) {
      selectQuery.forEach(function (row) {
        result["response"] = row.QrKioskPageReopen;
        result["kioskpin"] = row.kioskPin;
      });
    } else {
      result["response"] = "0";
    }

    return result;
  }

  static async getReferDiscountRequestService() {
    var result: {} = {};
    var getReferDiscountQuery = await Database.from("ReferDiscount").select(
      "*"
    );

    if (getReferDiscountQuery) {
      getReferDiscountQuery.forEach(function (row) {
        result["Id"] = row.Id;
        result["tittle"] = row.tittle;
        result["discount"] = row.discount;
      });
    } else {
      result["status"] = 0;
    }
    return result;
  }

  static async DeleteAccount(getparam) {
    // const text_area = getparam.reason
    const OrganizationId = getparam.refid;
    const UserId = getparam.uid;
    const currentdate = getparam.date;

    var result = {};

    var Mail = await Database.from("All_mailers")
      .select("Subject", "Body")
      .where("Id", 32);
    var Subject;
    var mailbody;

    if (Mail) {
      Subject = Mail[0].Subject;
      mailbody = Mail[0].Body;
    }
    var emp = await Database.from("EmployeeMaster as E")
      .innerJoin("Organization as O", "E.OrganizationId", "O.Id")
      .select(
        Database.raw("CONCAT(E.FirstName,' ',E.LastName) as Name"),
        "E.PersonalNo",
        "O.Name as Orgname",
        "E.CompanyEmail as email",
        "E.CreatedDate as doc",
        "E.CurrentCountry as countrycode"
      )
      .where("E.Id", UserId)
      .andWhere("O.Id", OrganizationId);
    var empmail;
    var phone;
    var CreatedDate;
    var username;
    var orgname;
    var country;

    if (emp) {
      orgname = emp[0].Orgname;
      username = emp[0].Name;
      empmail = await Helper.decode5t(emp[0].email);
      phone = await Helper.decode5t(emp[0].PersonalNo);
      CreatedDate = emp[0].doc;
      CreatedDate = moment(CreatedDate).format("YYYY-MM-DD");
      if (CreatedDate == "0000-00-00") {
        CreatedDate = "N/A";
      }
      country = await Helper.getCountryNameById(emp[0].countrycode);
    } else {
      result["response"] = 0; // No user Found
    }

    var mlbody1 = mailbody.replace("{Company_Name}", orgname);
    var mlbody2 = mlbody1.replace("{Company_Name}", orgname);
    var mlbody3 = mlbody2.replace("{19/08/2022}", currentdate);
    var mlbody4 = mlbody3.replace("{Contact_Person}", username);
    var mlbody5 = mlbody4.replace("{adminmail}", empmail);
    var mlbody6 = mlbody5.replace("{Created_date}", CreatedDate);
    var mlbody7 = mlbody6.replace("{Country_name}", country);
    var mlbody8 = mlbody7.replace("{12345}", phone);

    var messages = mlbody8;

    var headers = "MIME-Version: 1.0" + "\r\n";
    headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
    headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";

    var getrespons = await Helper.sendEmail(
      "attendancesupport@ubitechsolutions.com",
      Subject,
      messages,
      headers
    );

    if (getrespons != undefined) {
      result["status"] = "true"; //Mail send succesfully
    } else {
      result["status"] = "false";
    }
    return result;
  }

  static async getSetKioskPin(data) {
    const orgId = data.orgId;
    const Emplid = data.empId;
    const result = {};

    const query = await Database.query()
      .from("UserMaster")
      .select("kioskPin")
      .where("EmployeeId", Emplid)
      .andWhere("OrganizationId", orgId);

    if (query.length > 0) {
      result["kioskPin"] = query[0].kioskPin;
      if (result["kioskPin"] == "") {
        result["cuperButton"] = 0;
      } else {
        result["cuperButton"] = 1;
      }
    }
    return result;
  }

  static async checkuseremailforgoogle(getparam) {
    var active = 1;
    var date = moment().format("YYYY-MM-DD");
    var org_perm = "1,2,3";
    var email = getparam.useremail ? getparam.useremail : " ";
    var result: any = [];
    var data: any = [];
    var data12: any = {};
    var usermail = await Helper.encode5t(email);
    var userName = usermail;
    var ubihrm_sts;
    var VisibleSts;
    var archive;
    var is_Del;

    let checkquery = await Database.from("UserMaster")
      .select("Username")
      .where("Username", usermail)
      .orWhere("AuthorizationAppleID", email);

    if (checkquery.length > 0) {
      let getPass = await Database.from("UserMaster")
        .select("Password")
        .where("Username", usermail)
        .orWhere("AuthorizationAppleID", email);

      if (getPass.length > 0) {
        var Password = getPass[0].Password;
        var selectQuery = await Database.from("UserMaster as U")
          .innerJoin("EmployeeMaster as E", "U.EmployeeId", "E.Id")
          .select("*")
          .where("U.Username", userName)
          .orWhere("U.username_mobile", userName)
          .orWhere("U.AuthorizationAppleID", email)
          .andWhere("U.Password", Password)
          .andWhereNotIn("E.OrganizationId", [502, 1074]);

        if (selectQuery.length > 0) {
          archive = selectQuery[0].archive;
          is_Del = selectQuery[0].Is_Delete;
          let orgId = selectQuery[0].OrganizationId;
          ubihrm_sts = await Helper.getUbiatt_Ubihrmsts(orgId);
          VisibleSts = selectQuery[0].VisibleSts;

          if (
            ubihrm_sts == "1" &&
            (archive == "0" ||
              is_Del == "1" ||
              is_Del == "2" ||
              VisibleSts == "0")
          ) {
            data["response"] = 2;
            return data;
          }
          if (archive == "0" || is_Del == "1" || is_Del == "2") {
            data["response"] = 2;
            return data;
          }
        }

        var selectQuery2 = await Database.from("UserMaster as U")
          .innerJoin("EmployeeMaster as E", "U.EmployeeId", "E.Id")
          .select("E.archive as E_archive", "U.archive as U_archive")
          .where("U.Username", userName)
          .orWhere("U.username_mobile", userName)
          .andWhere("U.Password", Password)
          .andWhere("Is_Delete", 0)
          .andWhereNotIn("E.OrganizationId", [502, 1074]);

        if (selectQuery2.length > 0) {
          var E_archive = selectQuery2[0].E_archive;
          var U_archive = selectQuery2[0].U_archive;

          if (E_archive == 1 && U_archive == 0) {
            var updateQuery = await Database.from("UserMaster as U")
              .innerJoin("EmployeeMaster as E", "U.EmployeeId", "E.ID")
              .where("U.Username", userName)
              .orWhere("U.username_mobile", userName)
              .andWhere("U.Password", Password)
              .andWhere("E.Is_Delete", 0)
              .andWhereNotIn("E.OrganizationId", [502, 1074])
              .update("U.archive", 1);
          }
        }

        var query = await Database.from("UserMaster as U")
          .innerJoin("EmployeeMaster as E", "U.EmployeeId", "E.Id")
          .select("*")
          .where("U.Username", userName)
          .orWhere("U.username_mobile", userName)
          .orWhere("AuthorizationAppleID", email)
          .andWhere("U.Password", Password)
          .andWhere("U.archive", 1)
          .andWhere("E.archive", 1)
          .andWhere("E.Is_Delete", 0)
          .andWhereNotIn("E.OrganizationId", [502, 1074]);

        if (query.length > 0) {
          await Promise.all(
            query.map(async (row) => {
              data12["response"] = 1;
              data12["fname"] = row.FirstName;
              data12["lname"] = row.LastName;
              data12["empid"] = row.EmployeeId;
              data12["areaIds"] = " ";
              data12["attSelfie"] = row.Selfie;
              data12["qrkioskPin"] = row.kioskPin;
              data12["geofencerestriction"] = row.fencearea;
              data12["attImage"] = await Helper.getAttImageStatus(
                row.OrganizationId
              );
              data12["timeZoneCountry"] = await Helper.getEmpTimeZone(
                data12["empid"],
                row.OrganizationId
              );

              if (row.area_assigned != 0) {
                const forGeoSetting = await Database.from("Geo_Settings")
                  .select(
                    Database.raw(
                      "CONCAT('[', GROUP_CONCAT(JSON_OBJECT('lat', SUBSTRING_INDEX(Lat_Long, ',', 1), 'long', SUBSTRING_INDEX(Lat_Long, ',', -1), 'radius', Radius, 'Id', Id)), ']') as json"
                    )
                  )
                  .whereRaw(
                    `Id IN (${row.area_assigned}) AND OrganizationId = ? AND Lat_Long != ''`,
                    [row.OrganizationId]
                  );
                if (forGeoSetting.length > 0) {
                  data12["areaIds"] = forGeoSetting[0].json;
                }
              } else {
                data12["areaIds"] = [];
              }
              data12["polyField"] = " ";

              if (row.area_assigned != 0) {
                var Id_data: any = [];
                var getgefenseData = await Database.from(
                  "geofence_polygon_master"
                )
                  .select("Id", "geo_masterId", "latit_in", "longi_in")
                  .whereIn("geo_masterId", [row.area_assigned]);

                getgefenseData.forEach((row2) => {
                  // var data2 = {};
                  data12["Id"] = row2.Id;
                  data12["geo_masterId"] = row2.geo_masterId;
                  data12["long"] = row2.long;
                  data12["lat"] = row2.lat;
                  Id_data.push(data12);
                });
                data12["polyField"] = await Helper.encode5t(Id_data);
              } else {
                data12["polyField"] = "[]";
              }
              let shiftId = await Helper.getassignedShiftTimes(
                row.EmployeeId,
                date
              );
              let shiftType = await Helper.getShiftType(shiftId);
              let MultipletimeStatus = await Helper.getShiftMultipleTimeStatus(
                row.EmployeeId,
                date,
                shiftId
              );

              data12["MultipletimeStatus"] = MultipletimeStatus;
              data12["usrpwd"] = await Helper.decode5t(row.Password);
              data12["shiftType"] = shiftType;
              data12["timezone"] = await Helper.getTimeZone(row.timezone);
              data12["deviceverificationaddon"] =
                await Helper.getAddonPermission(
                  row.OrganizationId,
                  "Addon_DeviceVerification"
                );
              data12["deviceVerification_setting"] =
                await Helper.getDeviceVerification_settingsts(
                  row.OrganizationId
                );
              data12["addon_livelocationtracking"] =
                await Helper.getAddonPermission(
                  row.OrganizationId,
                  "Addon_livelocationtracking"
                );
              data12["addonGeoFence"] = await Helper.getAddonPermission(
                row.OrganizationId,
                "Addon_GeoFence"
              );
              data12["addonQrAttendance	"] = await Helper.getAddonPermission(
                row.OrganizationId,
                "Addon_QrAttendance	"
              );
              data12["TrackLocationEnabled"] = row.livelocationtrack;
              data12["persistedface"] = "0";

              var queryselect = await Database.from("Persisted_Face")
                .select("PersistedFaceId")
                .where("EmployeeId", row.EmployeeId);

              if (queryselect.length > 0) {
                data12["persistedface"] = queryselect[0].PersistedFaceId;
              }
              data12["device"] = row.Device_Restriction;
              data12["deviceandroidid"] = row.deviceandroidid;
              data12["status"] = row.status;
              data12["orgid"] = row.OrganizationId;
              data12["sstatus"] = row.appSuperviserSts;
              data12["org_perm"] = org_perm;
              data12["imgstatus"] = 1;

              var selectimg = await Database.from("admin_login")
                .select("AttnImageStatus")
                .where("OrganizationId", row.OrganizationId)
                .andWhere("status", 1)
                .limit(1);
              if (selectimg.length > 0) {
                data12["imgstatus"] = row.AttnImageStatus;
              }

              var selectdetails = await Database.from("Organization")
                .select("Name", "Email", "Country", "app")
                .where("Id", data12["orgid"]);

              if (selectdetails.length > 0)
                if (selectdetails[0].Name.length > 16)
                  data12["org_name"] =
                    selectdetails[0].Name.slice(0, 16) + "..";
                else data12["org_name"] = selectdetails[0].Name;

              data12["orgmail"] = selectdetails[0].Email;
              data12["orgcountry"] = selectdetails[0].Country;

              if (selectdetails[0].app == "PayPak") {
                data12["PaypakApp"] = selectdetails[0].app;

                if (data12["PaypakApp"] != "PayPak") {
                  data12["response"] = 0;
                }
              }

              const query333 = await Database.from("licence_ubiattendance")
                .select("status", "end_date")
                .where("OrganizationId", data12["orgid"])
                .orderBy("Id", "desc")
                .limit(1);

              if (query333.length > 0) {
                data12["trialstatus"] = query333[0].status;
                let endDate = query333[0].end_date;
                let enddate2 = moment(endDate).format("YYYY-MM-DD");
                if (enddate2 < date) {
                  data12["trialstatus"] = 2;
                }
                data12["buysts"] = query333[0].status;
              }
              let desgname: any = await Helper.getDesignation(row.Designation);

              if (desgname.length > 16)
                data12["designation"] = desgname.slice(0, 16) + "...";
              else
                data12["designation"] = await Helper.getDesignation(
                  row.Designation
                );

              data12["desinationId"] = row.Designation;
              if (row.ImageName != "") {
                let dir =
                  "public/uploads/" +
                  row.OrganizationId +
                  "../.." +
                  row.ImageName;
                data12["profile"] = "https://ubitech.ubihrm.com/" + dir;
              } else {
                data12["profile"] =
                  "http://ubiattendance.ubihrm.com/assets/img/avatar.png";
              }
              data.push(data12);
            })
          );

          let selectqueryall = await Database.from("PlayStore").select("*");
          if (selectqueryall.length > 0) {
            selectqueryall.forEach((row3) => {
              if (selectQuery[0].device == "Android")
                data12["store"] = row3.googlepath;
              else if (selectQuery[0].device == "iOS")
                data12["store"] = row3.applepath;
              else data12["store"] = "https://ubiattendance.ubihrm.com";
            });
          }
        } else {
          data12["response"] = 0;
          data.push(data12);
        }
        result.push(data);
      }
    } else {
      let querytocheckmail = await Database.from("Organization")
        .select("*")
        .where("Email", email)
        .andWhereNot("cleaned_up", 1)
        .andWhereNot("delete_sts", 1)
        .andWhereNot("delete_sts", 2);
      if (querytocheckmail.length > 0) {
        data12["response"] = 3; // E-mail duplicacy occurs
      } else {
        data12["response"] = 4; // E-mail Not exist
      }
      result.push(data12);
    }
    return result;
  }

  public static async updateProfilePhoto(getparam) {
    const uid = getparam.uid ? getparam.uid : 0;
    const orgid = getparam.refno ? getparam.refno : 0;
    const new_name = uid + ".jpg";
    var res = 0;
    var status = false;

    if (!getparam.file) {
      console.log("HEY");
      
      // No file was uploaded
      const query = await Database.from("EmployeeMaster")
        .where("Id", uid)
        .where("OrganizationId", orgid)
        .update({ ImageName: "" });

      if (query) {
        const zone = await Helper.getTimeZone(orgid);
        const date = new Date();
        const id = uid;
        const sna = await Helper.getEmpName(uid);
        const module = "Attendance app";
        const appModule = "Profile";
        const actionperformed = `<b>${sna}'s</b> Profile has been removed from <b>${module}</b>`;
        const activityby = 1;

        await Helper.ActivityMasterInsert(
          date,
          orgid,
          id,
          activityby,
          appModule,
          actionperformed,
          module
        );
        status = true;
      }
    } else {
      //if (S3::putObject(S3::inputFile($_FILES["file"]["tmp_name"]), 'ubihrmimages',''.$orgid.'/'.$new_name, S3::ACL_PUBLIC_READ))
      //{
      // $tmpfile = $_FILES['file']['tmp_name'];
      // $s3 = new Aws\S3\S3Client([
      // 	'region'  => 'ap-south-1',
      // 	'version' => 'latest',
      // 	'credentials' => [
      // 	'key'    => IAMHRM_KEY,
      // 	'secret' => IAMHRM_SECRET,
      // 	]
      // ]);

      // $result_save = $s3->putObject([
      // 	'Bucket' => 'ubihrmimages',
      // 	'Key'    => $orgid . '/' . $new_name,
      // 	'SourceFile' => $tmpfile
      // ]);

      const query = await Database.from("EmployeeMaster")
        .where("Id", uid)
        .where("OrganizationId", orgid)
        .update({ ImageName: new_name });

      if (query) {
        const zone = await Helper.getTimeZone(orgid);
        const date = new Date();
        const id = uid;
        const sna = await Helper.getEmpName(uid);
        const module = "Attendance app";
        const appModule = "Profile";
        const actionperformed = `<b>${sna}'s</b> Profile has been Updated from <b>${module}</b>`;
        const activityby = 1;

        await Helper.ActivityMasterInsert(
          date,
          orgid,
          id,
          activityby,
          appModule,
          actionperformed,
          module
        );
        status = true;
      }
    }
    return { status };
  }
}
