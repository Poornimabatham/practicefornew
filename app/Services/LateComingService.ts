import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
const moment = require("moment-timezone");

export default class LateComingService {
  public static async getLateComing(data) {
    const datefrom = new Date(data.Date); // Assuming you have a date object or a valid date string
    const dateString = datefrom.toLocaleDateString("en-US"); // Change 'en-US' to your preferred locale
    const DateFrom = moment(dateString, "MM/DD/YYYY").format("YYYY/MM/DD");

    var Begin = (data.Currentpage - 1) * data.Perpage;

    let limit: any = {};
    if (data.Csv == undefined) {
      limit = `${Begin}`;
    } else {
      limit;
    }

    var lateComersList = Database.from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "E.Id", "A.EmployeeId")
      .innerJoin("ShiftMaster as S", "S.Id", "A.ShiftId")
      .select(
        "E.FirstName",
        "E.LastName",
        "A.TimeIn as atimein",
        "A.ShiftId",
        "A.EmployeeId",
        "A.AttendanceDate",
        Database.raw(
          `(SELECT TIMEDIFF(A.TimeIn, CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END)) as latehours`
        ),
        Database.raw(
          `A.TimeIn > (CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END)
    AND TIMEDIFF(A.TimeIn, CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END) > '00:00:59' as l`
        ),
        Database.raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage")
      )
      .where("A.OrganizationId", data.Orgid)
      .whereNotIn("A.AttendanceStatus", [2, 3, 5])
      .whereNot("S.shifttype", 3)
      .orderBy("E.FirstName", "asc")
      .limit(limit);

    const zone = await Helper.getTimeZone(data.Orgid);
    moment().tz(zone);

    // const dateFormatted = moment(currentDateTime).format("YYYY-MM-DD");

    // const timeFormatted = moment(currentDateTime).format("HH:mm:ss");
    const res: any[] = [];

    var adminStatus = await Helper.getAdminStatus(data.Empid);
    //let condition ;
    if (adminStatus == 2) {
      //let DeptId = await Helper.getDepartmentIdByEmpID(data.Empid);
      //condition = `${DeptId}`;
    }

    const lateComersList = await Database.from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "E.Id", "A.EmployeeId")
      .innerJoin("ShiftMaster as S", "S.Id", "A.ShiftId")
      .select(
        "E.FirstName",
        "E.LastName",
        "A.TimeIn as atimein",
        "A.ShiftId",
        Database.raw(
          `(SELECT TIMEDIFF(A.TimeIn, CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END)) as latehours`
        ),
        Database.raw(
          `A.TimeIn > (CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END)
      AND TIMEDIFF(A.TimeIn, CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END) > '00:00:59' as l`
        ),
        Database.raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage")
      )
      .where("A.OrganizationId", data.Orgid)
      .andWhere("A.AttendanceDate", DateFrom)
      .whereNotIn("A.AttendanceStatus", [2, 3, 5])
      .whereNot("S.shifttype", 3)
      .orderBy("E.FirstName", "asc")
      .limit(limit);

    const Output = lateComersList;

    Output.forEach((element) => {
      const data2: any = {};
      data2["lateBy"] = element.latehours;

      data2["timein"] = element.atimein ? element.atimein.substr(0, 5) : null;

      data2["fullname"] = `${element.FirstName} ${element.LastName}`;
      data2["EntryImage"] = element.EntryImage;
      data2["ShiftId"] = element.ShiftId;
      data2["AttendanceDate"] = element.AttendanceDate;
      data2["A.EmployeeId"] = element.EmployeeId;
      response.push(data2);
    });

    return response;
  }
}
