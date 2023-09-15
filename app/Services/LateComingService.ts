import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import moment from "moment";

export default class LateComingService {
  public static async getLateComing(data) {
    var Orgid = data.orgid;
    var Currentpage = data.currentPage;
    var Date3 = data.cdate;
    var Perpage = data.perPage;
    var Empid = data.empid;
    var csv = data.csv;
    var limit: any = "";
    var offset;
    var Begin = (Currentpage - 1) * Perpage;

    if (csv == undefined) {
      limit = Perpage;
      offset = Begin;
    } else {
      limit;
    }
    var month1 = new Date(Date3);
    var Date2 = moment(month1).format("yyyy-MM-DD");

    const lateComersList = await Database.from("AttendanceMaster as A")
      .select(
        Database.raw(
          "SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage"
        ),
        "E.FirstName",
        "E.LastName",
        "A.TimeIn as atimein",
        "A.TimeOut",
        "A.AttendanceDate",
        Database.raw(
          "TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) as Earlyby"
        ),
        "A.ShiftId"
      )
      .from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "E.Id", "A.EmployeeId")
      .innerJoin("ShiftMaster as S", "S.Id", "A.ShiftId")
      .whereNotNull("A.TimeIn")
      .where("A.OrganizationId", Orgid)
      .whereRaw(
        "A.TimeIn > (CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END)"
      )
      .whereRaw(
        "TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) > '00:00:59'"
      )
      .andWhere("A.AttendanceDate", Date2)
      .andWhere("E.Is_Delete", 0)
      .andWhereNotIn("A.AttendanceStatus", [2, 3, 5])
      .whereNot("S.shifttype", 3)
      .orderBy("E.FirstName", "asc")
      .limit(limit)
      .offset(Begin);

    var adminstatus = await Helper.getAdminStatus(Empid);
    var condition;
    if (adminstatus == 2) {
      const dptid = Empid;
      condition = `AND A.Dept_id = ${dptid}`;
    }

    const response: any[] = [];

    const Output = await lateComersList;

    Output.forEach((element) => {
      const data2: any = {};

      data2["lateBy"] = element.Earlyby.substr(0, 5);

      data2["timein"] = element.atimein ? element.atimein.substr(0, 5) : null;
      var TimeIn = data2["timein"];
      var TimeOut = element.TimeOut.substr(0, 5);
      data2["shift"] = TimeIn.slice(0, 5) + " - " + TimeOut.slice(0, 5);
      data2["name"] = `${element.FirstName} ${element.LastName}`;
      data2["EntryImage"] = element.EntryImage;
      let date = new Date(element.AttendanceDate);
      data2["Date"] = moment(date).format("YYYY/MM/DD");

      response.push(data2);
    });

    return response;
  }

  public static async getLateComingCsv(data) {
    var month1 = new Date(data.Date);
    var Date2 = moment(month1).format("yyyy-MM-DD");

    const lateComersList = await Database.from("AttendanceMaster as A")
      .select(
        Database.raw(
          "SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage"
        ),
        "E.FirstName",
        "E.LastName",
        "A.TimeIn as atimein",
        "A.AttendanceDate",
        Database.raw(
          "TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) as Earlyby"
        ),
        "A.ShiftId"
      )
      .from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "E.Id", "A.EmployeeId")
      .innerJoin("ShiftMaster as S", "S.Id", "A.ShiftId")
      .whereNotNull("A.TimeIn")
      .where("A.OrganizationId", data.Orgid)
      .whereRaw(
        "A.TimeIn > (CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END)"
      )
      .whereRaw(
        "TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) > '00:00:59'"
      )
      .where("A.AttendanceDate", Date2)
      .where("E.Is_Delete", 0)
      .whereNotIn("A.AttendanceStatus", [2, 3, 5])
      .whereNot("S.shifttype", 3)
      .orderBy("E.FirstName", "asc");

    var adminstatus = await Helper.getAdminStatus(data.Empid);
    var condition;
    if (adminstatus == 2) {
      const dptid = data.Empid;
      condition = `AND A.Dept_id = ${dptid}`;
    }

    const response: any[] = [];

    const Output = await lateComersList;

    Output.forEach((element) => {
      const data2: any = {};

      data2["lateBy"] = element.Earlyby.substr(0, 5);

      data2["timein"] = element.atimein ? element.atimein.substr(0, 5) : null;

      data2["fullname"] = `${element.FirstName} ${element.LastName}`;
      data2["EntryImage"] = element.EntryImage;
      data2["ShiftId"] = element.ShiftId;
      let date = new Date(element.AttendanceDate);
      data2["AttendanceDate"] = moment(date).format("YYYY/MM/DD");
      data2["A.EmployeeId"] = element.EmployeeId;
      response.push(data2);
    });

    return response;
  }
}
