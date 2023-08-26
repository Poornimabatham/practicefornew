import Helper from "App/Helper/Helper";
const { DateTime } = require("luxon");
import Database from "@ioc:Adonis/Lucid/Database";
export default class GetLastTimeService {
  public static async GetLastTime(data) {
    var orgid = data.orgid;
    var empid = data.empid;
    var EmpTimeZoneDate = data.empTimeZoneDate;
    const curDate = DateTime.local();
    console.log(curDate);
    const Date = curDate.toFormat("yyyy-MM-dd");

    const attDatePastTwodays = curDate
      .minus({ days: 3 })
      .toFormat("yyyy-MM-dd");

    var res: any = {};
    const AttendanceMasterList = await Database.from("AttendanceMaster")
      .where("EmployeeId", empid)
      .andWhere("OrganizationId", orgid)
      .andWhere("AttendanceDate", "<", Date)
      .andWhere("TimeOut", "00:00:00")
      .andWhereIn("AttendanceStatus", [1, 3, 5, 8])
      .andWhereBetween("AttendanceDate", [attDatePastTwodays, Date])
      .orderBy("AttendanceDate", "desc")
      .limit(1)

    const output = await AttendanceMasterList;
    output.forEach(async function (row) {
      var data: any = {};
      data["Id"] = row.Id;
      data["EmployeeId"] = row.EmployeeId;
      data["AttendanceDate"] = row.AttendanceDate;
      data["TimeIn"] = row.TimeIn;
      data["TimeOut"] = row.TimeOut;
      data["ShiftId"] = row.ShiftId;
      data["Deptid"] = row.Dept_id;
      data["Desgid"] = row.Desg_id;
      data["areaId"] = row.areaId;
      data["OrganizationId"] = row.OrganizationId;
      data["EntryImage"] = row.EntryImage;
      data["ExitImage"] = row.ExitImage;
      data["checkInLoc"] = row.checkInLoc;
      data["CheckOutLoc"] = row.CheckOutLoc;
      data["timeindate"] = row.timeindate;
      data["timeoutdate"] = row.timeoutdate;
      data["latit_in"] = row.latit_in;
      data["longi_in"] = row.longi_in;
      data["latit_out"] = row.latit_out;
      data["longi_out"] = row.longi_out;
      data["timeoutdate"] = row.timeoutdate;
      data["timeoutdate"] = row.timeoutdate;
      data["TimeInGeoFence"] = row.TimeInGeoFence;
      data["TimeOutGeoFence"] = row.TimeOutGeoFence;
      data["autotimeout"] = "Auto Time Out";
      res.pus(data);

      if (EmpTimeZoneDate != data["AttendanceDate"]) {
        const query = await Database.from("AttendanceMaster")
          .where("Id", data.Id)
          .andWhere("OrganizationId", orgid)
          .update({
            TimeOut: data["TimeIn"],
            ExitImage: data["EntryImage"],
            CheckOutLoc: data["checkInLoc"],
            TimeOutDate: data["timeindate"],
            device: data["autotimeout"],
          });
      }
    });
    return res
  }
}
