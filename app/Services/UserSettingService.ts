import Database from "@ioc:Adonis/Lucid/Database";
import helper from "../Helper/Helper";
import Helper from "../Helper/Helper";
import { DateTime } from "luxon";
import moment from "moment-timezone";
import databaseConfig from "Config/database";
import { runFailedTests } from "@japa/preset-adonis";

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
              const qur = await Database.query()
                .from("RegularizationApproval")
                .select("ApproverId")
                .where("attendanceId", attid)
                .andWhere("ApproverSts", regsts)
                .andWhere("approverregularsts", 0)
                .orderBy("Id", "asc")
                .limit(1);
              pstatus = qur[0].ApproverId;
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
    let result: any = {};
    let response: any[] = [];
    let currentDate = moment().format("YYYY-MM-DD");

    const Adminmail = await Helper.getAdminEmail(orgid);
    const Adminname = await Helper.getAdminNamebyOrgId(orgid);
    const empmail = await Helper.getEmpEmail(empid);
    const Email = await Helper.decode5t(empmail);
    const Emp_Name = await Helper.getEmpName(empid);
    let contactemail;
    let contactNumber;
    let CreatedDate;
    let CountryId;

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
          const organizationName = query[0].Name;
          const PhoneNumber = query[0].PhoneNumber;
          CreatedDate = query[0].CreatedDate;
          const Email = query[0].Email;
          CountryId = query[0].Country;
          const countryname = await Helper.getCountryNameById(CountryId);
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
        result["sts"] = true;
        response.push(result);
        if (demoInsert) {
          //////Email functionality
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
    const text_area = getparam.reason;
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
      empmail = Helper.decode5t(emp[0].email);
      phone = Helper.decode5t(emp[0].PersonalNo);
      CreatedDate = emp[0].doc;
      CreatedDate = moment(CreatedDate).format("YYYY-MM-DD");
      if (CreatedDate == "0000-00-00") {
        CreatedDate = "N/A";
      }
      country = Helper.getCountryNameById(emp[0].countrycode);
    }
    var mlbody1 = mailbody.replace("{Company_Name}", orgname);
    var mlbody2 = mlbody1.replace("{19/08/2022}", currentdate);
    var mlbody3 = mlbody2.replace("{Contact_Person}", username);
    var mlbody4 = mlbody3.replace("{adminmail}", empmail);
    var mlbody5 = mlbody4.replace("{Created_date}", CreatedDate);
    var mlbody6 = mlbody5.replace("{Country_name}", country);
    var mlbody7 = mlbody6.replace("{12345}", phone);

    var messages = mlbody7;

    var headers = "MIME-Version: 1.0" + "\r\n";
    headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
    headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";
    
    // var respons = sendEmail_new(
    //   "attendancesupport@ubitechsolutions.com",
    //   Subject,
    //   messages,
    //   headers 
    // );

    // ////// UNCOMPLETE waiting for sendEmail_new() /////

    // if (respons) {
    //   result["status"] = "true";
    // } else {
    //   result["status"] = "false";
    // }
    // return result;
  }  
}
