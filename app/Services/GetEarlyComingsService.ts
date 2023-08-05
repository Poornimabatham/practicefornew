import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment-timezone";
import Helper from "App/Helper/Helper";
export default class GetEarlyComingsService {
  static async EarlyCommers(getData) {

    const Begin =  (getData.currentPage - 1) * getData.perPage;    
    var limit;
    if(getData.csv ==" "){

      limit = Begin
    }else{
      limit
    }

    const zone = await Helper.getTimeZone(getData.orgid);
    const zonedate = moment().tz(zone);
    // console.log(zonedate);
    // const date = moment(zonedate).format("YYYY-MM-DD")
    // console.log(date)

    const datefrom = new Date(getData.date);
    const dateString = datefrom.toLocaleDateString("en-US");
    const RequestedDate = moment(dateString, "MM/DD/YYYY").format("YYYY/MM/DD");

    const adminStatus = await Helper.getAdminStatus(getData.empid);

    var ConditionForadminStatus = "";
    if (adminStatus === 1) {
      const deptId = await Helper.getDepartmentIdByEmpID(getData.empid);
      ConditionForadminStatus = ` A.Dept_id = ${deptId}`;
    }

    interface DefineTypes {
      FirstName: number;
      LastName: string;
      TimeIn: string;
      Earlyby: number;
      EntryImage: string;
    }

    const sendResponse: DefineTypes[] = [];

    const getEarlyComingsdata = await Database.from("AttendanceMaster as A")
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
        CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END,A.TimeIn) as Earlyby`))

      .where("E.Id", getData.empid)
      .andWhere(" A.OrganizationId", getData.orgid)
      .andWhere(
        Database.raw(
          `A.TimeIn < (CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END)`))
      .andWhere(
        Database.raw(
          `TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) < '00:00:59'`))
      .andWhere("A.AttendanceDate", RequestedDate).whereNotIn("A.AttendanceStatus", [2, 3, 5])
      .whereNot("S.shifttype", 3).where("E.Is_Delete", 0).whereRaw(ConditionForadminStatus)
      .limit(limit);

    const queryResult: any = await getEarlyComingsdata;
    queryResult.forEach(function (val) {
      const data: DefineTypes = {
        FirstName: val.FirstName,
        LastName: val.LastName,
        TimeIn: val.TimeIn,
        Earlyby: val.Earlyby,
        EntryImage: val.EntryImage,
      };
      sendResponse.push(data);
    });
    return sendResponse;
  }
}
