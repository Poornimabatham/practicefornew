import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
export default class GetEarlyComingsService {
  static async EarlyCommers(getData) {
   
    const sendResponse: EarlyCommersInterface[] = [];
    const Begin = (getData.currentPage - 1) * getData.perPage;
    var limit;
    if (getData.csv == " ") {
      limit = Begin;
    } else {
      limit;
    }

    var currDate = DateTime.now().setZone(timeZone);
    var getDate = getData.date ? getData.date : currDate;
    var zone = await Helper.getTimeZone(getData.orgid);
    var timeZone = zone[0]?.name;
    var formattedDate1 = getDate.toFormat("yyyy-MM-dd");
    var dateTimeUTC = DateTime.fromISO(formattedDate1, { zone: timeZone });
    var dateTimeInTimeZone = dateTimeUTC.setZone(timeZone);
    var Date = dateTimeInTimeZone.toFormat("yyyy-MM-dd");

    let getEarlyComingsdata = Database.from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
      .innerJoin("ShiftMaster as S", "A.shiftId", "S.Id")
      .select(
        "E.FirstName",
        "E.LastName",
        "A.TimeIn as atimein",
        "S.TimeInGrace",
        "S.TimeIn",
        "A.AttendanceDate",
        "S.shifttype",
        Database.raw(`SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage,
       TIMEDIFF(
        CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END,A.TimeIn) as Earlyby`)
      )
      .where(
        Database.raw(
          `A.TimeIn < (CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END)`
        )
      )
      .where(
        Database.raw(
          `TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) < '00:00:59'`
        )
      )
      .where("A.AttendanceDate", Date)
      .where("A.OrganizationId", getData.orgid)
      .where("E.Is_Delete", 0)
      .whereNotIn("A.AttendanceStatus", [2, 3, 5])
      .whereNot("S.shifttype", 3)
      .orderBy("Earlyby", "desc")
      .limit(limit);

    const adminStatus = await Helper.getAdminStatus(getData.empid);
    var ConditionForadminStatus = "";

    if (adminStatus === 2) {
      const deptId = getData.deptId;
      ConditionForadminStatus = `A.Dept_id = ${deptId}`;
      getEarlyComingsdata = getEarlyComingsdata.where(
        "A.Dept_id",
        ConditionForadminStatus
      );
    }
    if (getData.empid !== 0) {
      getEarlyComingsdata = getEarlyComingsdata.where("E.Id", getData.empid);
    }
    if (getData.orgid !== 0) {
      getEarlyComingsdata = getEarlyComingsdata.where(
        "A.OrganizationId",
        getData.orgid
      );
    }

    const queryResult = await getEarlyComingsdata;
    queryResult.forEach(function (val) {
      const data: EarlyCommersInterface = {
        FirstName: val.FirstName,
        LastName: val.LastName,
        atimein: val.atimein,
        TimeIn: val.TimeIn,
        Earlyby: val.Earlyby,
        EntryImage: val.EntryImage,
      };
      sendResponse.push(data);
    });
    return sendResponse;
  }

  static async EarlyCommersCsv(getData) {
    const sendResponse: EarlyCommersInterface[] = [];

    var currDate = DateTime.now().setZone(timeZone);
    var getDate = getData.date ? getData.date : currDate;
    var zone = await Helper.getTimeZone(getData.orgid);
    var timeZone = zone[0]?.name;
    var formattedDate1 = getDate.toFormat("yyyy-MM-dd");
    var dateTimeUTC = DateTime.fromISO(formattedDate1, { zone: timeZone });
    var dateTimeInTimeZone = dateTimeUTC.setZone(timeZone);
    var Date = dateTimeInTimeZone.toFormat("yyyy-MM-dd");

    let getEarlyComingsdata = Database.from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
      .innerJoin("ShiftMaster as S", "A.shiftId", "S.Id")
      .select(
        "E.FirstName",
        "E.LastName",
        "A.TimeIn as atimein",
        "S.TimeInGrace",
        "S.TimeIn",
        "A.AttendanceDate",
        "S.shifttype",
        Database.raw(`SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage,
       TIMEDIFF(
        CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END,A.TimeIn) as Earlyby`)
      )
      .where(
        Database.raw(
          `A.TimeIn < (CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END)`
        )
      )
      .where(
        Database.raw(
          `TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) < '00:00:59'`
        )
      )
      .where("A.AttendanceDate", Date)
      .where("A.OrganizationId", getData.orgid)
      .where("E.Is_Delete", 0)
      .whereNotIn("A.AttendanceStatus", [2, 3, 5])
      .whereNot("S.shifttype", 3)
      .orderBy("Earlyby", "desc")

    const adminStatus = await Helper.getAdminStatus(getData.empid);
    var ConditionForadminStatus = "";

    if (adminStatus === 2) {
      const deptId = getData.deptId;
      ConditionForadminStatus = `A.Dept_id = ${deptId}`;
      getEarlyComingsdata = getEarlyComingsdata.where(
        "A.Dept_id",
        ConditionForadminStatus
      );
    }
    if (getData.empid !== 0) {
      getEarlyComingsdata = getEarlyComingsdata.where("E.Id", getData.empid);
    }
    if (getData.orgid !== 0) {
      getEarlyComingsdata = getEarlyComingsdata.where(
        "A.OrganizationId",
        getData.orgid
      );
    }

    const queryResult = await getEarlyComingsdata;
    queryResult.forEach(function (val) {
      const data: EarlyCommersInterface = {
        FirstName: val.FirstName,
        LastName: val.LastName,
        atimein: val.atimein,
        TimeIn: val.TimeIn,
        Earlyby: val.Earlyby,
        EntryImage: val.EntryImage,
      };
      sendResponse.push(data);
    });
    return sendResponse;
  }
}
