import Database from "@ioc:Adonis/Lucid/Database";
const { Duration, DateTime } = require("luxon");
import Helper from "App/Helper/Helper";
const moment = require("moment");

export default class GetplannerWiseSummary {
  public static async Getlannerwisesummary(a) {
    const currentDate = a.attDen;

    var loggedHours = "00:00:00";
    var hoursPerDay = "00:00:00";
    var shiftin = "00:00:00";
    var shiftout = "00:00:00";

    let overtime;
    let overtime1;

    var shiftType;
    var weekoff_sts;
    var ShiftId;

    var AttendanceDate = currentDate.toFormat("yyyy-MM-dd");
    var fetchdatafromTimeOFFandAttendanceMaster: any = await Database.from(
      "Timeoff as Toff"
    )
      .innerJoin(
        "AttendanceMaster as AM",
        "Toff.TimeofDate",
        "AM.AttendanceDate"
      )
      .select(
        "AM.Id",
        "AM.AttendanceStatus",
        "AM.AttendanceDate",
        "Toff.Reason",
        "Toff.TimeofDate",
        "Toff.TimeTo",
        "AM.TimeIn",
        "AM.TimeOut",
        "AM.timeindate",
        "AM.timeoutdate",
        "AM.TimeOutApp",
        "Toff.EmployeeId as TEID",
        "AM.EmployeeId as AMEID",
        Database.raw(
          `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(Timeoff_end, Timeoff_start)))) AND
          Toff.EmployeeId = ${a.userid} AND Toff.ApprovalSts = 2) AS timeoffhours`
        ),
        "AM.ShiftId",
        "AM.TotalLoggedHours AS thours",
        Database.raw(
          `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(TimeTo, TimeFrom)))) FROM Timeoff WHERE 
                Toff.EmployeeId = ${a.userid}  AND Toff.ApprovalSts = 2) AS bhour`
        ),
        Database.raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage"),
        Database.raw("SUBSTRING_INDEX(ExitImage, '.com/', -1) AS ExitImage"),
        Database.raw("CONCAT(LEFT(checkInLoc, 35), '...') AS checkInLoc"),
        Database.raw("CONCAT(LEFT(CheckOutLoc, 35), '...') AS CheckOutLoc"),
        "latit_in",
        "longi_in",
        "latit_out",
        "longi_out",
        "multitime_sts"
      )
      .where("AM.EmployeeId", a.userid)
      .andWhereIn("AM.AttendanceStatus", [1, 3, 5, 4, 8, 10])
      .andWhere("AM.AttendanceDate", AttendanceDate);

    const result = fetchdatafromTimeOFFandAttendanceMaster;

    let res: any[] = [];

    await Promise.all(
      result.map(async (val) => {
        let data: any = {};

        data["AttendanceStatus"] = val.AttendanceStatus;

        data["TimeIn"] = val.TimeIn;
        data["TimeOut"] = val.TimeOut;
        data["timeoutdate"] = moment(val.timeoutdate).format("YYYY-MM-DD");
        data["timeindate"] = moment(val.timeindate).format("YYYY-MM-DD");
        data["AttendanceDate"] = val.AttendanceDate;
        data["loggedHours"] = val.thours;
        data["ShiftId"] = val.ShiftId;
        ShiftId = data["ShiftId"];
        if (
          loggedHours == "00:00:00" ||
          loggedHours != "" ||
          loggedHours == null
        ) {
          const datetimeString = `${data["timeindate"]} ${data["TimeIn"]}`;
          const datetimeString2 = `${data["timeoutdate"]} ${data["TimeOut"]}`;
          const dateTime1 = DateTime.fromFormat(
            datetimeString,
            "yyyy-MM-dd HH:mm:ss"
          );
          const Time1 = dateTime1.toFormat("HH:mm:ss");
          const dateTime = DateTime.fromFormat(
            datetimeString2,
            "yyyy-MM-dd HH:mm:ss"
          );
          const Time2 = dateTime.toFormat("HH:mm:ss");
          var Interval;
          let startDateTime;
          let endDateTime;
          if (Time1 > Time2) {
            startDateTime = DateTime.fromFormat(Time1, "HH:mm:ss");
            endDateTime = DateTime.fromFormat(Time2, "HH:mm:ss");

            Interval = Duration.fromMillis(
              endDateTime.diff(startDateTime).as("milliseconds")
            );
          } else {
            startDateTime = DateTime.fromFormat(Time1, "HH:mm:ss");
            endDateTime = DateTime.fromFormat(Time2, "HH:mm:ss");

            Interval = Duration.fromMillis(
              endDateTime.diff(startDateTime).as("milliseconds")
            );
          }
          loggedHours = Interval.toFormat("hh:mm:ss");
          data["loggedHours"] = loggedHours;
        }
        data["timeoffhours"] = val.timeoffhours;
        if (data["timeoffhours"] == null || data["timeoffhours"] == "") {
          data["timeoffhours"] = "00:00:00";
          var time = data["timeoffhours"];
        }
        if (data["timeoffhours"] != "00:00:00") {
          var subtimeLoggedhours = await Database.rawQuery(
            `SELECT SUBTIME( "${loggedHours}","${time}") AS Loggedhours`
          );
          if (subtimeLoggedhours.length > 0) {
            loggedHours = subtimeLoggedhours[0][0].Loggedhours;
            data["loggedHours"] = loggedHours;
          }
        }

        data["timeoutplatform"] = val.TimeOutApp;

        const selcthiftMasterId = await Database.from("ShiftMaster")
          .where("Id", ShiftId)
          .select("TimeIn", "TimeOut", "shifttype", "HoursPerDay");
        if (selcthiftMasterId.length > 0) {
          shiftin = selcthiftMasterId[0].TimeIn;
          shiftout = selcthiftMasterId[0].TimeOut;
          shiftType = selcthiftMasterId[0].shifttype;
          hoursPerDay = selcthiftMasterId[0].HoursPerDay;

          if (
            hoursPerDay == "00:00:00" ||
            hoursPerDay == "" ||
            hoursPerDay == null
          ) {
            var shiftin1 = shiftin;
            var shiftout1 = shiftout;

            const startDateTime = DateTime.fromFormat(shiftin1, "HH:mm:ss");
            const endDateTime = DateTime.fromFormat(shiftout1, "HH:mm:ss");

            const Interval1 = Duration.fromMillis(
              endDateTime.diff(startDateTime).as("milliseconds")
            );

            hoursPerDay = Interval1.toFormat("hh:mm:ss");
            data["HoursPerDay"] = hoursPerDay;
          }
        }

        if (
          data["AttendanceStatus"] == 4 ||
          data["AttendanceStatus"] == 10 ||
          data["AttendanceStatus"] == 1
        ) {
          const halfInSeconds = Duration.fromISOTime(hoursPerDay).as("seconds");
          const halfvalue = halfInSeconds / 2;
          const hours = Math.floor(halfvalue / 3600);
          const minutes = Math.floor((halfvalue % 3600) / 60);

          const secs = halfvalue % 60;

          const timeString = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
          hoursPerDay = DateTime.fromFormat(timeString, "H:m:s").toFormat(
            "hh:mm:ss"
          );
        }
        const userid = a.userid;
        const orgidid = a.refno;

        weekoff_sts = await Helper.getWeeklyOff(
          AttendanceDate,
          ShiftId,
          userid,
          orgidid
        );

        if (val.TimeOut != "00:00:00") {
          if (shiftType == 3) {
            data["thours"] = loggedHours;
            if (weekoff_sts == "WO" || weekoff_sts == "H") {
              overtime1 = loggedHours;
            } else {
              overtime = await Database.rawQuery(
                `SELECT SUBTIME( "${loggedHours}","${hoursPerDay}") AS Overtime`
              );

              if (overtime.length > 0) {
                overtime1 = overtime[0][0];
              }
            }
          } else if (shiftType == 1) {
            data["thours"] = loggedHours;
            if (weekoff_sts == "WO" || weekoff_sts == "H") {
              overtime1 = loggedHours;
            } else {
              overtime = await Database.rawQuery(
                `SELECT SUBTIME( "${loggedHours}","${hoursPerDay}") AS Overtime`
              );

              if (overtime.length > 0) {
                overtime1 = overtime[0][0];
              }
            }
          } else if (shiftType == 1) {
            data["thours"] = loggedHours;
            if (weekoff_sts == "WO" || weekoff_sts == "H") {
              overtime1 = loggedHours;
            } else {
              overtime = await Database.rawQuery(
                `SELECT SUBTIME( "${loggedHours}","${hoursPerDay}") AS Overtime`
              );

              if (overtime.length > 0) {
                overtime1 = overtime[0][0];
              }
            }
          } else {
            overtime1 = "00:00:00";
          }
        } else {
          data["thours"] = "00:00:00";
          if (weekoff_sts == "WO" || weekoff_sts == "H") {
            overtime1 = "04:00:00";
          } else {
            overtime1 = "00:00:00";
          }
        }

        data["hoursPerDay"] = hoursPerDay;

        data["shiftin"] = shiftin;
        data["shiftout"] = shiftout;
        data["EntryImage"] = "-";

        if (val.EntryImage != "") {
          data["EntryImage"] = val.EntryImage;
        }
        data["ExitImage"] = "-";
        if (val.ExitImage != "") {
          data["ExitImage"] = val.ExitImage;
        }
        if (val.bhour != null || val.bhour != "") {
          var bhour = val.bhour;
        }
        data["checkInLoc"] = "-";
        if (val.checkInLoc != "") {
          data["checkInLoc"] = val.checkInLoc;
        }
        data["CheckOutLoc"] = "-";
        if (val.CheckOutLoc != "") {
          data["CheckOutLoc"] = val.CheckOutLoc;
        }
        data["latit_in"] = 0;
        if (val.latit_in != "") {
          data["latit_in"] = val.latit_in;
        }
        data["latit_out"] = 0;
        if (val.atit_out != "") {
          data["latit_out"] = val.latit_out;
        }
        data["longi_in"] = 0;
        if (val.latit_out != "") {
          data["longi_in"] = val.longi_in;
        }
        data["longi_out"] = "-";
        if (val.longi_out != "") {
          data["longi_out"] = val.longi_out;
        }

        data["overtime"] = overtime1;
        data["bhour"] = bhour;
        data["plateform"] = "-";
        if (data["timeoutplatform"] == "") {
          data["plateform"] = data["timeoutplatform"];
        }
        let date = new Date(val.AttendanceDate);
        data["AttendanceDate"] = moment(date).format("YYYY/MM/DD");
        data["AttendanceMasterId"] = val.Id;
        data["AttendanceStatus"] = val.AttendanceStatus;
        data["MultipletimeStatus"] = val.multitime_sts;
        if (val.multitime_sts == 1 && shiftType != 3) {
          data["shifttype"] = 1;
        }
        data["getInterimAttAvailableSts"] =
          await Helper.getInterimAttAvailableSt(val.Id);
        res.push(data);
      })
    );

    return res;
  }

  public static async getRegSummary(get) {
    const Orgid = get.orgid;
    const Uid = get.uid;

    var attid;
    var selectAttendanceMasterList;
    var currentMonth = get.month;
    let res: any[] = [];
    if (get.month != undefined) {
      var month1 = new Date(get.month);
      currentMonth = moment(month1).format("yyyy-MM-DD");
    } else {
      const timeZone = await Helper.getTimeZone(Orgid); // Assuming this function returns the desired time zone

      const currentTime = DateTime.now().setZone(timeZone);

      // You don't need to parse the DateTime object; it's already in the desired format.
      const currentMonth = currentTime.toFormat("yyyy-MM-dd");
    }
    try {
      selectAttendanceMasterList = await Database.from("AttendanceMaster as AM")
        .innerJoin("EmployeeMaster", "AM.EmployeeId", "EmployeeMaster.Id")
        .select(
          "*",
          Database.raw(
            `IF(LastName != '', CONCAT(FirstName, ' ', LastName), FirstName) as Name`
          ),
          "AM.Id AS Id"
        )
        .where("AM.OrganizationId", Orgid)
        .whereRaw(`Month(RegularizeRequestDate) = Month('${currentMonth}')`)
        .whereRaw(`Year(RegularizeRequestDate) = Year('${currentMonth}')`)
        .andWhere("AM.EmployeeId", Uid)
        .andWhereNot("RegularizeSts", 0)
        .orderBy("RegularizeRequestDate", "desc");
      const count1 = selectAttendanceMasterList.length;

      if (count1 >= 1) {
        var status = true;
        selectAttendanceMasterList.forEach(async (val) => {
          let data: any = {};
          attid = val.Id;
          data["id"] = val.Id;
          data["employeeid"] = val.EmployeeId;
          data["employee"] = val.Name;
          data["device"] = val.device;
          data["deviceid"] = 0;
          var regsts = val.RegularizeSts;

          if (val.device == "Auto Time Out") {
            data["deviceid"] = 1;
            data["empRemarks"] = val.RegularizationRemarks;
            data["approverRemarks"] = val.RegularizeApproverRemarks;
            const date = new Date(val.AttendanceDate);
            data["attendanceDate"] = moment(date).format("YYYY/MM/DD");
            const date2 = new Date(val.RegularizeRequestDate);
            data["regApplyDate"] = moment(date2).format("YYYY/MM/DD");
            data["requestedtimeout"] = val.RegularizeTimeOut;
            data["requestedtimein"] = val.RegularizeTimeIn;
            var approverid = val.ApproverId;
            var pendingapprover;

            if (regsts == 3) {
              if (approverid != 0) {
                pendingapprover = val.ApproverId;
              }
              if (pendingapprover == undefined) {
                selectAttendanceMasterList = await Database.from(
                  " RegularizationApproval"
                )
                  .select("ApproverId")
                  .where("attendanceId", attid)
                  .andWhere("ApproverSts", regsts)
                  .andWhere("approverregularsts", 0)
                  .orderBy("Id", "asc")
                  .limit(1);
                const resut1 = await selectAttendanceMasterList;

                if (resut1.length) {
                  pendingapprover = val.ApproverId;
                }
              }

              if (pendingapprover != undefined) {
                var pendingapp = await Helper.getEmpName(pendingapprover);
                data["Pstatus"] = "Pending";
              }
              if (pendingapp != undefined) {
                data["Pstatus"] = "Pending at " + pendingapp;
              }
              if (regsts == 2) {
                data["Pstatus"] = "Approved";
              }
              if (regsts == 1) {
                data["Pstatus"] = "Rejected";
              }
              res["regsts"] = regsts;
            }
          }

          res.push(data);
        });
      }
    } catch {}
    return res;
  }
}
