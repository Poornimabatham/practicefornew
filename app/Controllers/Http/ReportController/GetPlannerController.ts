
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
export default class GetplannerController {
  public async data({ request }: HttpContextContract) {
    const userid = 7295;
    request.input("refno");
    request.input("attDate");
    //  const zone = getEmpTimeZone(userid,refno)

    // const datastart = new Date();
    // const overtime = "";
    // const overtime1 = "";
    // const overtime3 = "";
    // const loggedHours = "00:00:00";
    // const shiftin = "";
    // const shiftout = "";






    interface department {
      AttendanceDate: number,
     
    }

    const fetchdatafromTimeOFFandAttendanceMaster = await Database.from(
      "Timeoff as Toff"
    )
      .innerJoin(
        "AttendanceMaster as AM",
        "Toff.TimeofDate",
        "AM.AttendanceDate"
      )

      .select(
        "AM.AttendanceDate",
        "Toff.Reason",
        "Toff.TimeofDate",
        "Toff.TimeTo",
        Database.raw(
          `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(Timeoff_end, Timeoff_start)))) FROM Timeoff WHERE 
       Timeoff.EmployeeId = ${userid} AND Timeoff.ApprovalSts = 2) AS timeoffhours`
        ),
        "AM.ShiftId",
        "AM.TotalLoggedHours AS thours",
        Database.raw(
          `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(TimeTo, TimeFrom)))) FROM Timeoff WHERE Timeoff.EmployeeId = 6 AND Timeoff.ApprovalSts = 2) AS bhour`
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
      .limit(6)
      .whereIn("AttendanceStatus", [1, 2, 3, 4]);

    // return fetchdatafromTimeOFFandAttendanceMaster
    // const fetchdatafromTimeOFF  = TimeOff_data.length
    // return fetchdatafromTimeOFF
    const result = await fetchdatafromTimeOFFandAttendanceMaster;
    const res: any[] = [];

    // result.forEach(function (val) {
    //   const data: any[] = [];

    //   data["AttendanceDate"] = val.AttendanceDate;

    //   res.push(data);
    // })

    
    result.forEach((row) => {
      const data: department = {
        AttendanceDate :row.AttendanceDate
      }
      res.push(data)
    });
    return res;
  }
}
