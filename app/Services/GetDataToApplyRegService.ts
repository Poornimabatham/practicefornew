import moment from "moment";
import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
const { DateTime } = require("luxon");

export default class GetDataToRegService {
  public static async FetchingdatatoReg(data) {
    var count = 0;
    var status = false;

    var currentMonth = data.month;

    if (data.month != undefined) {
      var month1 = new Date(data.month);
      currentMonth = moment(month1).format("yyyy-MM-DD");
    } else {
      currentMonth = moment().format("yyyy-MM-DD");
    }

    var Regularizecount = 0;
    // attendancearr=array();
    const selectRegularizationSettings: any = await Database.from(
      "RegularizationSettings"
    )
      .select("MaxDays", "MinTimes")
      .where("OrganizationId", data.orgid)
      .where("RegularizationSts", 1);

    const results = await selectRegularizationSettings;

    const count1 = results.length;

    let regularizationsettingsts = 0;
    let MaxDays = 0;
    let MinTimes = 0;

    if (count1 >= 1) {
      regularizationsettingsts = 1;
      MaxDays = results[0].MaxDays;
      MinTimes = results[0].MinTimes;
    }

    const regularizeCount: any = await Database.from("AttendanceMaster")
      .where("OrganizationId", data.orgid)
      .andWhereNot("Is_Delete", 1)
      .andWhere("EmployeeId", data.uid)
      .whereRaw(`MONTH(AttendanceDate) = MONTH('${currentMonth}')`)
      .andWhere("AttendanceDate", Database.raw("CURDATE()"))
      .andWhere(
        Database.raw(` ("RegularizeSts" = 0 OR "RegularizeSts" = 1)
      `)
      )
      .orderBy(" AttendanceDate", "desc")

      .count("RegularizeSts as Regularizecount")
      

    const affected_rows = regularizeCount.length;

    if (affected_rows) {
      Regularizecount = regularizeCount[0].Regularizecount;
    }

    const selectAttendancemasterList = Database.from("AttendanceMaster")
      .select(
        "Id",
        "AttendanceStatus",
        "AttendanceDate",
        "device",
        "TimeIn",
        "TimeOut"
      )
      .where("OrganizationId", data.orgid)
      .andWhereNot("Is_Delete", 1)
      .andWhere(
        Database.raw(`((device ='Auto Time Out'  and (TimeIn=TimeOut or TimeOut='00:00:00')) or 
      (device ='Absentee Cron' and  TimeIn='00:00:00' and TimeOut='00:00:00') or 
      (device ='Cron' and  TimeIn='00:00:00' and TimeOut='00:00:00' and AttendanceStatus=8) or 
      (device ='Cron' and  (TimeIn=TimeOut or TimeOut='00:00:00') and AttendanceStatus in (4,10))) `)
      )
      .andWhere("EmployeeId", data.uid)
      .whereRaw(`MONTH(AttendanceDate) = MONTH('${currentMonth}')`)
      .andWhereRaw(`YEAR(AttendanceDate) = YEAR('${currentMonth}')`)
      .andWhereNot("AttendanceDate", Database.raw("CURDATE()"))
      .andWhere(
        Database.raw(` ("RegularizeSts" = 0 OR "RegularizeSts" = 1)
      `)
      )
      .orderBy("AttendanceDate", "desc")
    const attendanceData = await selectAttendancemasterList;

    var attendancearr: any = [];
    attendanceData.forEach((row) => {
      const res1 = {};
      res1["id"] = row.Id;
      res1["sts"] = row.AttendanceStatus;
      let date = new Date(row.AttendanceDate);
      res1["AttendanceDate"] = moment(date).format("YYYY/MM/DD");
      res1["device"] = row.device;
      var timeIn =
        row.TimeIn == "00:00:00"
          ? "00:00"
          : DateTime.fromSQL(row.TimeIn).toFormat("HH:mm");

      res1["timeIn"] = timeIn;
      var timeOut =
        row.TimeOut == "00:00:00"
          ? "00:00"
          : DateTime.fromSQL(row.TimeOut).toFormat("HH:mm");
      res1["timeOut"] = timeOut;
      var date1: any = new Date(row.AttendanceDate);
      // res1["date1"] = moment(date1).format("YYYY/MM/DD");
      var date2: any = new Date();
      // res1["date2"] = moment(date2).format("YYYY/MM/DD")
      const diffInMilliseconds: number = date2 - date1;

      // Calculate the difference in days
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      // res1["diffInDays"] = diffInDays;
      if (MaxDays != 0) {
        if (diffInDays > MaxDays) {
          res1["resultsts"] = 0;
        } else {
          res1["resultsts"] = 1;
        }
      } else {
        res1["resultsts"] = 1;
      }
      if (MinTimes != undefined) {
        if (Regularizecount < MinTimes) {
          res1["Regularizessts"] = 1;
        } else {
          res1["Regularizessts"] = 0;
        }
      } else {
        res1["Regularizessts"] = 1;
      }

      attendancearr.push(res1);
    });

    var result: any = {};
    status = true;

    // return currentMonth
    const parsedDate = DateTime.fromISO(currentMonth);
    const formattedDate = parsedDate.toFormat("MMMM yyyy");

    result["month"] = formattedDate;

    result["data"] = attendancearr;
    result["Regularizecountdone"] = Regularizecount;
    result["TotalRegularizecount"] = MinTimes;
    result["regularizationsettingsts"] = regularizationsettingsts;
    result["status"] = status;
    return result;
  }

  public static async FetchRegularizationCount(data) {
    var orgId = data.orgid;
    var id = data.uid;
    var month = data.month;

    if (month != undefined) {
      var month1 = new Date(data.month);
      month = moment(month1).format("yyyy-MM-DD");
    } else {
      month = moment().format("yyyy-MM-DD");
    }
    const AttendanceMaster = await Database.from("AttendanceMaster")
      .select(
        Database.raw(
          `(SELECT MinTimes FROM RegularizationSettings WHERE OrganizationId = ${orgId} and RegularizationSts = 1)
           as MinTimes`
        ),
        Database.raw(`count(RegularizeSts) as Regularizecount`)
      )
      .where("OrganizationId", orgId)
      .andWhereNot("Is_Delete", 1)
      .andWhere("EmployeeId", id)
      .whereRaw("Month(AttendanceDate) = Month(?)", [month])
      .whereRaw("Year(AttendanceDate) = Year(?)", [month])
      .whereRaw("AttendanceDate != CURDATE()")
      .andWhere(
        Database.raw(` ("RegularizeSts" != 0 AND "RegularizeSts" != 1)
      `)
      )
      .orderBy("AttendanceDate", "desc");

    const row1 = AttendanceMaster[0];
    const data2 = {
      MinTimes: row1 ? parseInt(row1.MinTimes) : 0,
      Regularizecount: row1 ? parseInt(row1.Regularizecount) : 0,
    };

    return data2;
  }

  public static async OnSendRegularizeRequest(data) {
    const date = data.attdate;
    const platform = data.platform;
    const uid = data.uid;
    const orgid = data.orgid;
    const remark = data.remark;
    const Attendance_id = data.id;
    const timeIn = data.timein;
    const timeOut = data.timeout;
    const attendancedate = data.attdate;
    let email: any = 0;
    var empname;
    var designation;
    let senior;
    let Empemail;
    var status;
    let seniorname: any;
    let Hrname;
    let Hremail;
    let msg;
    var regularizetimein;
    let timeincondition;
    var orginaltimein;
    let errorMsg;

    var data2: any = {};
    const RegularizationAppliedFrom = data.RegularizationAppliedFrom;

    const currentDate = DateTime.now();
    const currentMonth = currentDate.toFormat("yyyy-MM-dd");

    const mdate = currentDate.toFormat("yyyy-MM-dd HH:mm:ss");

    const date2 = currentDate.toFormat("yyyy-MM-dd");

    const selectEmployeeList = await Database.from("EmployeeMaster")
      .select("*")
      .select(
        Database.raw(
          "(SELECT div_hrsts FROM DivisionMaster WHERE Id = Division) AS divhr"
        )
      )
      .where("Id", uid)
      .where("OrganizationId", orgid);

    let divhrsts;
    let module;
    let ActivityBy;
    let sql;
    let sql1;
    const result = await selectEmployeeList;
    result.forEach(async (row) => {
      designation = row.Designation;
      var divid = row.Division;
      divhrsts = row.divhr;
      empname = row.FirstName + row.LastName;
      var Empemail = await Helper.decode5t(row.CompanyEmail);
    });

    if (RegularizationAppliedFrom != 2) {
      module = "ubiHRM APP";
      ActivityBy = 0;

      if (divhrsts != 0) {
        var hrid = divhrsts;
      } else {
        sql = await Database.from("UserMaster")
          .select("EmployeeId")
          .where(" OrganizationId", orgid)
          .andWhere("HRSts", 1);

        sql.forEach((val) => {
          hrid = val.EmployeeId;
        });
      }
    } else {
      module = "ubiattendance APP";
      ActivityBy = 1;
      sql = await Database.from("Organization")
        .select("Email")
        .where("Id", orgid);

      await Promise.all(
        sql.map(async (val) => {
          const email1: any = await Helper.encode5t(val.Email);
          email = email1;
        })
      );

      var sqlemp = await Database.from("UserMaster")
        .select("EmployeeId ")
        .where("OrganizationId", orgid)
        .andWhere("Username", email);

      sqlemp.forEach((val) => {
        hrid = val.EmployeeId;
      });
      senior = hrid;
    }

    if (Attendance_id != undefined && (hrid != 0 || hrid != "")) {
      sql1 = await Database.from("AttendanceMaster")
        .where("Id", Attendance_id)
        .update({
          RegularizationRemarks: remark,
          RegularizeApproverRemarks: "",
          RegularizeTimeOut: timeOut,
          RegularizeTimeIn: timeIn,
          RegularizeSts: 3,
          RegularizeRequestDate: date2,
          RegularizationAppliedFrom: RegularizationAppliedFrom,
          LastModifiedDate: mdate,
        });
      try {
        var updSts: any = sql1;
        if (updSts == 1) {
          msg = `<b>${empname}</b> requested for regularization for the attendance date of <b>${attendancedate}</b>`;
          sql = await Helper.ActivityMasterInsert(
            date2,
            orgid,
            uid,
            ActivityBy,
            module,
            msg,
            module
          );
          sql1 = await Database.from("AttendanceMaster ")
            .select("RegularizeTimeIn", "TimeIn")
            .where("Id", Attendance_id);

          const count = sql1.length;

          sql1.forEach((val) => {
            regularizetimein = val.RegularizeTimeIn;
            orginaltimein = val.TimeIn;
          });

          if (RegularizationAppliedFrom != 2) {
            const sql4 = await Database.from("ApprovalProcess")
              .where("OrganizationId", orgid)
              .where(
                Database.raw(
                  `(Designation = ${designation} OR Designation = 0)`
                )
              )
              .andWhere(Database.raw(`(ProcessType = 13 OR ProcessType = 0)`))

              .orderBy("Designation", "desc")
              .orderBy("ProcessType", "desc");
            const query4 = sql4.length;

            if (query4 > 0) {
              senior = await Helper.getApprovalLevelEmp(uid, orgid, 13);
            } else {
              senior = hrid;
            }
          }

          if (senior != 0) {
            const senior2 = `${senior}`; // Your input string
            const temp = Array.from(senior2);

            const filteredTemp = temp.filter((item) => item);

            const finalTemp = [...filteredTemp];

            for (let i = 0; i < temp.length; i++) {
              if (temp[i] != "0") {
                sql = await Database.insertQuery()
                  .table("RegularizationApproval")
                  .insert({
                    attendanceId: Attendance_id,
                    ApproverId: temp[i],
                    ApproverSts: 3,
                    CreatedDate: mdate,
                    OrganizationId: orgid,
                    RegularizationAppliedFrom: RegularizationAppliedFrom,
                  });

                const sqlapproveremp = await Database.from("EmployeeMaster")
                  .select("Id", "FirstName", "LastName", "CompanyEmail")
                  .where("OrganizationId", orgid)
                  .andWhere("Id", 4120);
                const seniornameArray: any = [];
                const HrnameArray: any = [];
                const HremailArray: any = [];

                for (const rapproveremp of sqlapproveremp) {
                  seniorname = `${rapproveremp.FirstName} ${rapproveremp.LastName}`;
                  Hrname = seniorname;
                  Hremail = await Helper.decode5t(rapproveremp.CompanyEmail);

                  seniornameArray.push(seniorname);
                  HrnameArray.push(Hrname);
                  HremailArray.push(Hremail);
                }

                if (i == 0) {
                  const title = "Request for Regularization Approval";
                  if (regularizetimein == orginaltimein) {
                    timeincondition = "";
                  } else {
                    timeincondition = `"The requested timein is: ${timeIn}<br>";`;
                  }
                  var remarkcondition = "<br><br>";
                  // if (remark != "") {
                  //   remarkcondition = `Remarks: ${remark}<br><br><br>`;
                  //   var buttoncondition;
                  // if (RegularizationAppliedFrom != 2) {
                  //   buttoncondition =
                  //     "<a href='$approvelink' style='text-decoration:none;padding: 10px 15px; background: #ffffff; color:green; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; border: solid 1px green; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4); -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)' >Approve</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='$rejectlink' style='text-decoration:none;padding: 10px 15px; background: #ffffff; color: brown;-webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; border: solid 1px brown; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4); -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)' >Reject</a>";
                  // }
                  // msg = `Dear $Hrname,<br><br>This is to inform you that, $empname has requested regularization for the $attendancedate. Kindly approve the request.<br>${timeincondition} The requested timeout is: $timeout<br><br><br>
                  //  ${remarkcondition}${buttoncondition}`;
                  // //  if(Hremail!=undefined){

                  //  }
                  // const title1 =
                  //   "Acknowledgement of Regularization request sent";
                  // const msg1 = `Dear $empname,<br><br>This is to inform you that your regularization request has been sent for approval.<br><br><br>Thanks & Regards<br>`;
                  // if (Empemail != "") {
                  //   /* $sts1=sendEmail_new($Empemail, $title1, $msg1, "");
                  //   Trace($msg1."<br>mailsts ".$sts1." empemail ".$Empemail ); */
                  // }
                  // }
                }
              }
            }
          }

          status = "true";
          errorMsg = "Regularization request submitted successfully";
          data2["status"] = status;
          data2["msg"] = errorMsg;
        } else {
          status = "false";
          errorMsg = "There is some problem while requesting regularization";
          data2["status"] = status;
          data2["msg"] = errorMsg;
        }
      } catch {}
    } else {
      status = "false";
      errorMsg = "No approver found";
      data2["status"] = status;
      data2["msg"] = errorMsg;
    }

    if (platform == undefined) {
      return status;
    } else {
      return data2;
    }
  }
}
