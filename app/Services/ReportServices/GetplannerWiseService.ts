import Database from "@ioc:Adonis/Lucid/Database";
const { Duration, DateTime } = require("luxon");

const moment = require("moment");

export default class GetplannerWiseSummary {
  public static async Getlannerwisesummary(a) {
    const currentDate = a.attDen;

    var loggedHours = "00:00:00";
    var hoursPerDay = "00:00:00";
    var shiftin = "00:00:00";
    var shiftout = "00:00:00";

    var Date2 = currentDate.toFormat("yyyy-MM-dd");
    const fetchdatafromTimeOFFandAttendanceMaster = await Database.from(
      "Timeoff as Toff"
    )
      .innerJoin(
        "AttendanceMaster as AM",
        "Toff.TimeofDate",
        "AM.AttendanceDate"
      )

      .select(
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
          `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(Timeoff_end, Timeoff_start)))) FROM Timeoff WHERE 
                Toff.EmployeeId = ${a.userid} AND Toff.ApprovalSts != 2) AS timeoffhours`
        ),
        "AM.ShiftId",
        "AM.TotalLoggedHours AS thours",
        Database.raw(
          `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(TimeTo, TimeFrom)))) FROM Timeoff WHERE 
                Toff.EmployeeId = ${a.userid} AND Toff.ApprovalSts != 2) AS bhour`
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
      .limit(2)
      .andWhere("AM.AttendanceDate", Date2)
      .whereIn("AM.AttendanceStatus", [1, 2, 3]);

    const result = await fetchdatafromTimeOFFandAttendanceMaster;
    const res: any[] = [];

    result.forEach(async (val) => {
      let data: any = {};

      data["AttendanceStatus"] = val.AttendanceStatus;

      data["TimeIn"] = val.TimeIn;
      data["TimeOut"] = val.TimeOut;
      data["timeoutdate"] = moment(val.timeoutdate).format("YYYY-MM-DD");
      data["timeindate"] = moment(val.timeindate).format("YYYY-MM-DD");
      data["AttendanceDate"] = val.AttendanceDate;
      data["loggedHours"] = val.thours;
      data["ShiftId"] = val.ShiftId;
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
      data["hoursPerDay"] = hoursPerDay;

      data["shiftin"] = shiftin;
      data["shiftout"] = shiftout;
      data["EntryImage"] = "-";

      data["MultipletimeStatus"] = val.multitime_sts;

      res.push(data);
    });
    return res;
  }
}
