import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
const { Duration, DateTime } = require("luxon");


const moment = require("moment");

export default class GetplannerWiseSummary {
  public static async Getlannerwisesummary(a) {
    const currentDate = a.attDen;
   
  
    var overtime="00:00:00";
    var overtime1 = '00:00:00';
    
    var loggedHours = "00:00:00"; 
    var hoursPerDay = "00:00:00";
    var shiftin="00:00:00";
    var shiftout="00:00:00";
    var shiftType; 
    var weekoff_sts="-"; 
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
      .where("AM.AttendanceDate", Date2)
      . whereIn("AM.AttendanceStatus", [1,2,3]);

    const result = await fetchdatafromTimeOFFandAttendanceMaster;
    const res: any[] = [];

    result.forEach(async (val) => {
      const data: any = {};
      data["AttendanceStatus"] = val.AttendanceStatus;
      const status = data["AttendanceStatus"];
      data["AttendanceDate"] = val.AttendanceDate;
      data["loggedHours"] = val.thours;
      data["Reason"] = val.Reason;
      data["TimeTo"] = val.TimeTo;
      let logged = data["loggedHours"];
      data["TimeIn"] = val.TimeIn;
      data["TimeOut"] = val.TimeOut;
      data["timeoutdate"] = moment(val.timeoutdate).format("YYYY-MM-DD");
      data["timeindate"] = moment(val.timeindate).format("YYYY-MM-DD");
      data["ShiftId"] = val.ShiftId;
      let ShiftId = data["ShiftId"];
      data["timeoffhours"] = val.timeoffhours;
      data["TimeOutApp"] = val.TimeOutApp;
      data["timeoffhours"] = val.timeoffhours;
      data["timeoutplatform"] = val.TimeOutApp;
      data["ShiftId"] = val.ShiftId;
      // res.push(data)
      if (logged == "00:00:00" || logged != "" || logged == null) {
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
      }



      			///logged hours End//////

      if (data["timeoffhours"] == null || data["timeoffhours"] == "") {
        data["timeoffhours"] = "00:00:00";
        var time = data["timeoffhours"];
      
      }

      if (data["timeoffhours"] != "00:00:00") {
        var subtimeLoggedhours = await Database.rawQuery(
          `SELECT SUBTIME( "${loggedHours}","${time}") AS Loggedhours`
        );

        if (subtimeLoggedhours.length> 0) {
          loggedHours = subtimeLoggedhours[0][0]
        }
      }
// ///ShiftHoursEND
      const selcthiftMasterId = Database.from("ShiftMaster")
        .where("Id", ShiftId )
        .select("TimeIn", "TimeOut", "shifttype", "HoursPerDay");

      const affectedRows2 = await selcthiftMasterId.first();
      if (affectedRows2) {
         shiftin = affectedRows2.TimeIn;
         shiftout = affectedRows2.TimeOut;
         shiftType = affectedRows2.shifttype;
         hoursPerDay = affectedRows2.HoursPerDay;
        if (
          hoursPerDay === "00:00:00" ||
          hoursPerDay == "" ||
          hoursPerDay === null
        ) {
          let shiftin1 = shiftin;
          let shiftout1 = shiftout;

          const startDateTime = DateTime.fromFormat(shiftin1, "HH:mm:ss");
          const endDateTime = DateTime.fromFormat(shiftout1, "HH:mm:ss");

          const Interval1 = Duration.fromMillis(
            endDateTime.diff(startDateTime).as("milliseconds")
          );

          hoursPerDay = Interval1.toFormat("hh:mm:ss");
          
        }
      }

//       			/// for manageHalfday///////

      if (status == 4 || status == 10) {
        const halfInSeconds = Duration.fromISOTime(hoursPerDay).as("seconds");
        const halfvalue = halfInSeconds / 2;
        const hours = Math.floor(halfvalue / 3600);
        const minutes = Math.floor((halfvalue % 3600) / 60);

        const secs = halfvalue % 60;

        const timeString = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
          hoursPerDay  = DateTime.fromFormat(
          timeString,
          "H:m:s"
        ).toFormat("hh:mm:ss");
      }
      const userid = a.userid;
      const orgidid = a.refno;
     
      
     
      
      			/////////////ShiftHours End ///////////

       weekoff_sts = await Helper.getWeeklyOff(
        Date2,
        ShiftId,
        userid,
        orgidid
      );
    
    
      if (val.TimeOut != "00:00:00") {
        if (shiftType == 3) {
              `SELECT SUBTIME( "${loggedHours}","${ hoursPerDay }") AS Overtime`
          data["thours"] = loggedHours;
          if (weekoff_sts == "WO" || weekoff_sts == "H") {
            overtime = loggedHours;
          } else {
            overtime = await Database.rawQuery(
              `SELECT SUBTIME( "${loggedHours}","${ hoursPerDay }") AS Overtime`
            );
           
            if (overtime.length > 0) {
              overtime1 = overtime[0][0]
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
            // console.log(overtime)


            if ( overtime.length> 0) {
              console.log("a")
              overtime1 = overtime[0][0];
              console.log(overtime1)
            }
          }
        } else if (shiftType == 2) {
          data["thours"] = loggedHours;
          if (weekoff_sts == "WO" || weekoff_sts == "H") {
            overtime1 = loggedHours;
          } else {
            overtime = await Database.rawQuery(
              `SELECT SUBTIME( "${loggedHours}","${ hoursPerDay}") AS Overtime`
            );
            
            if (overtime.length > 0) {
              overtime1 = overtime[0][0]
              console.log(overtime1)
            }
          }
        } 
        
        else {
          overtime1 = "00:00:00";
        }
      }

       else {
        data["thours"] = "00:00:00";
        if (weekoff_sts == "WO" || weekoff_sts == "H") {
          overtime1 = loggedHours;
        } else {
          overtime1 = "00:00:00";
        }
      }

      data["shiftin"] =  shiftin ;
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
      if (data["timeoutplatform"] != "") {
        data["plateform"] = data["timeoutplatform"];
      }
      data["HoursPerDay"] =  hoursPerDay;
      data["AttendanceDate"] = val.AttendanceDate;
      data["AttendanceMasterId"] = val.Id;
      data["AttendanceStatus"] = val.AttendanceStatus;
      data["MultipletimeStatus"] = val.multitime_sts;
      if (val.multitime_sts == 1 && shiftType != 3) {
        data["shifttype"] = 1;
      }
res.push(data)
    
    });
    return res;
  }
}
