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
    var getDate = getData.cdate ? getData.cdate : currDate;
    var zone = await Helper.getTimeZone(getData.orgid);
    var timeZone = zone[0]?.name;
    var formattedDate1 = getDate.toFormat("yyyy-MM-dd");
    var dateTimeUTC = DateTime.fromISO(formattedDate1, { zone: timeZone });
    var dateTimeInTimeZone = dateTimeUTC.setZone(timeZone);
    var Date = dateTimeInTimeZone.toFormat("yyyy-MM-dd");

    var getEarlyComingsdata = Database.from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
      .innerJoin("ShiftMaster as S", "A.shiftId", "S.Id")
      .select(
        "E.FirstName",
        "E.LastName",
        "A.TimeIn as atimein",
        "A.ShiftId",
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
     
    const adminStatus = await Helper.getAdminStatus(getData.uid);
    var deptId;
    
    if (adminStatus === 2) {
      deptId = await Helper.getDepartmentIdByEmpID(getData.uid);
      getEarlyComingsdata = getEarlyComingsdata.where("A.Dept_id", deptId);
    }

    const queryResult = await getEarlyComingsdata;
    const ShiftTio = await Helper.getShiftTimes(queryResult[0].ShiftId);
    queryResult.forEach(function (val) {
      const data: EarlyCommersInterface = {
        lateby: val.Earlyby.substr(0, 5),
        name: val.FirstName + " " + val.LastName,
        timein: val.atimein.substr(0, 5),
        shift: ShiftTio,
        date: Date,
        EntryImage: val.EntryImage,
      };
      sendResponse.push(data);
    });
    return sendResponse;
  }

  static async EarlyCommersCsv(getData) {
    
    const sendResponse: EarlyCommersInterface[] = [];

    var currDate = DateTime.now().setZone(timeZone);
    var getDate = getData.cdate ? getData.cdate : currDate;
    var zone = await Helper.getTimeZone(getData.orgid);
    var timeZone = zone[0]?.name;
    var formattedDate1 = getDate.toFormat("yyyy-MM-dd");
    var dateTimeUTC = DateTime.fromISO(formattedDate1, { zone: timeZone });
    var dateTimeInTimeZone = dateTimeUTC.setZone(timeZone);
    var Date = dateTimeInTimeZone.toFormat("yyyy-MM-dd");

    var getEarlyComingsdata = Database.from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
      .innerJoin("ShiftMaster as S", "A.shiftId", "S.Id")
      .select(
        "E.FirstName",
        "E.LastName",
        "A.TimeIn as atimein",
        "A.ShiftId",
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
     
    const adminStatus = await Helper.getAdminStatus(getData.uid);
    var deptId;
    
    if (adminStatus === 2) {
      deptId = await Helper.getDepartmentIdByEmpID(getData.uid);
      getEarlyComingsdata = getEarlyComingsdata.where("A.Dept_id", deptId);
    }

    const queryResult = await getEarlyComingsdata;
    const ShiftTio = await Helper.getShiftTimes(queryResult[0].ShiftId);
    queryResult.forEach(function (val) {
      const data: EarlyCommersInterface = {
        lateby: val.Earlyby.substr(0, 5),
        name: val.FirstName + " " + val.LastName,
        timein: val.atimein.substr(0, 5),
        shift: ShiftTio,
        date: Date,
        EntryImage: val.EntryImage,
      };
      sendResponse.push(data);
    });
    return sendResponse;
  }
}