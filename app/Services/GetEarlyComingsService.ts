import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment-timezone";
import Helper from "App/Helper/Helper";

export default class GetEarlyComingsService  {
  static async EarlyCommers(getData) {

    const Begin = (getData.currentPage-1) * getData.perPage;

    const zone = await Helper.getTimeZone(getData.orgid)
    const zonedate = moment(getData.date).tz(zone)
    // console.log(zonedate);
    // const date = moment(zonedate).format("YYYY-MM-DD")
    // console.log(date)

    const datefrom = new Date(getData.date); 
    const dateString = datefrom.toLocaleDateString('en-US'); 
    const RequestedDate = moment(dateString, 'MM/DD/YYYY').format('YYYY/MM/DD');

    const adminstatus = await Helper.getAdminStatus(getData.empid);

    var ConditionForadminStatus = "";
    if(adminstatus === 1 ){
       const deptId =await Helper.getDepartmentIdByEmpID(getData.empid)
       ConditionForadminStatus = `AND A.Dept_id = ${deptId}`;  
    }

    interface DefineTypes{
      FirstName:number,
      LastName:string,
      TimeIn:string,
      Earlyby:number,
    }

    const sendResponse:DefineTypes[] = [];

    const getEarlyComingsdata = await Database
    .from("AttendanceMaster as A" )
    .innerJoin("EmployeeMaster as E","A.EmployeeId","E.Id")
    .innerJoin("ShiftMaster as S","A.shiftId","S.Id")
    .select(  "E.FirstName",
      "E.LastName",
      "A.TimeIn as atimein","S.TimeInGrace","S.TimeIn","A.AttendanceDate","S.shifttype",
      Database.raw(`
       TIMEDIFF(CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END,A.TimeIn) as Earlyby,A.ShiftId`))
      .where("E.Id",getData.empid)
      .andWhere(" A.OrganizationId",getData.orgid).andWhere(Database.raw(`A.TimeIn < (CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END)`))
      .andWhere(Database.raw(`TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) < '00:00:59'`)).andWhere( "A.AttendanceDate",RequestedDate).whereNotIn("A.AttendanceStatus",[2,3,5]).limit(Begin)
      
    const queryResult:any = await getEarlyComingsdata
    queryResult.forEach(function (val) {
      const data: DefineTypes = {
      FirstName:val.FirstName,
      LastName:val.LastName,
      TimeIn:val.TimeIn,
      Earlyby:val.Earlyby
      }
      sendResponse.push(data)
    })
    return sendResponse
 }
}