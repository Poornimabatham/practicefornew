import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";

export default class getEarlyLeavingsService {
  
  static async EarlyLeavers(getData) {
    var Begin = (getData.currentPage - 1) * getData.perPage;
    var limit;
    if (getData.csv == " ") {
      limit = Begin;
    } else {
      limit;
    }

    var currDate = DateTime.now().setZone(timeZone)
    var getDate = getData.date? getData.date : currDate;
    var zone = await Helper.getTimeZone(getData.orgid);
    var timeZone = zone[0]?.name;
    var formattedDate1 = getDate.toFormat("yyyy-MM-dd");
    var dateTimeUTC = DateTime.fromISO(formattedDate1, { zone: "Pacific/Pago_Pago" });
    var dateTimeInTimeZone = dateTimeUTC.setZone(timeZone);
    var Date = dateTimeInTimeZone.toFormat("yyyy-MM-dd");

    let getEarlyLeaversdata = Database.from("AttendanceMaster as A")
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
        "A.EmployeeId",
        "A.ShiftId",
        "A.TimeOut as TimeOut",
        "timeoutdate",
        Database.raw(`SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage,
        (CASE WHEN (A.timeoutdate!='0000-00-00')
        THEN
            (CASE WHEN (S.shifttype=2 AND A.timeindate=A.timeoutdate)
        THEN
            TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),
        SUBSTRING(S.TimeOut,1,5)),CONCAT(A.AttendanceDate,' ',SUBSTRING(A.TimeOut,1,5))) 
        ELSE TIMEDIFF
            (CONCAT(A.AttendanceDate,' ',SUBSTRING(S.TimeOut,1,5)),CONCAT(A.timeoutdate,' ',SUBSTRING(A.TimeOut,1,5))) END) 
        ELSE SUBTIME(S.TimeOut, A.TimeIn) END) as earlyleaver`)
      )
      .where(
        Database.raw(
          `A.EmployeeId=E.Id And S.Id=A.ShiftId 
          And 
          (CASE 
               WHEN (S.shifttype=2 AND A.timeindate=A.timeoutdate) 
               THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut) 
               WHEN(S.shifttype=2 AND A.timeindate!=A.timeoutdate) 
               THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut) 
               ELSE CONCAT(A.AttendanceDate,' ',S.TimeOut) END)>
          (CASE 
              WHEN
              (A.timeoutdate!='00:00:00') THEN CONCAT(A.timeoutdate,' ',A.TimeOut) WHEN(S.shifttype=2 AND A.timeindate!=A.timeoutdate) THEN  CONCAT(A.timeoutdate,' ',A.TimeOut) 
          ELSE CONCAT(A.AttendanceDate,' ',A.TimeOut) END)And A.TimeIn!='00:00:00' And 
              A.TimeOut!='00:00:00' and A.AttendanceStatus NOT IN(2,3,5) AND
          (CASE WHEN (A.timeoutdate!='0000-00-00')
              THEN 
          (CASE 
              WHEN
                (S.shifttype=2 AND A.timeindate=A.timeoutdate) 
              THEN
               TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeOut)) ELSE TIMEDIFF
           ((CASE WHEN
                (S.shifttype=2 AND A.timeindate!=A.timeoutdate)
              THEN 
            CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut)
             ELSE  
            CONCAT(A.AttendanceDate,' ',S.TimeOut) END ),CONCAT(A.timeoutdate,' ',A.TimeOut))    END)
            ELSE 
            SUBTIME(S.TimeOut, A.TimeIn) END) > '00:00:59'`
        )
      )
      .where("A.OrganizationId", getData.orgid).where("A.AttendanceDate", Date).where("E.Is_Delete", 0).whereNot("S.shifttype", 3).orderBy("E.FirstName", "asc").limit(limit);

    const adminStatus = await Helper.getAdminStatus(getData.empid);
 
    var ConditionForadminStatus = "";

    if (adminStatus === 2) {
      const deptId = getData.deptId;
      ConditionForadminStatus = `A.Dept_id = ${deptId}`;
      getEarlyLeaversdata = getEarlyLeaversdata.where(
        "A.Dept_id",
        ConditionForadminStatus
      );
    }
    if (getData.empid !== 0) {
      getEarlyLeaversdata = getEarlyLeaversdata.where("E.Id", getData.empid);
    }

    var sendResponse: EarlyLeaversInterface[] = [];
    var queryResult = await getEarlyLeaversdata;
    queryResult.forEach(function (val) {
      var data: EarlyLeaversInterface = {
        FirstName: val.FirstName,
        LastName: val.LastName,
        EmployeeId: val.EmployeeId,
        ShiftId: val.ShiftId,
        shifttype: val.shifttype,
        atimein: val.atimein,
        TimeOut: val.TimeOut,
        earlyleaver: val.earlyleaver,
        EntryImage: val.EntryImage,
      };
      sendResponse.push(data);
    });
    return sendResponse;
  }
}
