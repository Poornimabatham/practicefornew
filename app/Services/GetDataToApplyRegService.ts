import moment from "moment";
import Database from "@ioc:Adonis/Lucid/Database";

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
    // $attendancearr=array();
    const selectRegularizationSettings:any = await Database.from(
      "RegularizationSettings"
    )
    .select('MaxDays', 'MinTimes')
    .where('OrganizationId', data.orgid)
    .where('RegularizationSts', 1);
  
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
    .count("RegularizeSts as Regularizecount");

    const affected_rows = regularizeCount.length;

    if (affected_rows) {
      Regularizecount = regularizeCount[0].Regularizecount;
    }

    // var cd =   moment().format("yyyy-MM-DD");
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
      .orderBy("AttendanceDate", "desc");
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
      .where("EmployeeId", id)
      .whereRaw("Month(AttendanceDate) = Month(?)", [month])
      .whereRaw("Year(AttendanceDate) = Year(?)", [month])
      .whereRaw("AttendanceDate != CURDATE()")
      .andWhereNot("RegularizeSts", 0)
      .andWhereNot("RegularizeSts", 1)
      .orderBy("AttendanceDate", "desc");
    const row1 = AttendanceMaster[0];
    const data2 = {
      MinTimes: row1 ? parseInt(row1.MinTimes) : 0,
      Regularizecount: row1 ? parseInt(row1.Regularizecount) : 0,
    };

    return data2;
  }
}
