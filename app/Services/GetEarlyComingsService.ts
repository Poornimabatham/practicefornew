import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment-timezone";
import Helper from "App/Helper/Helper";
export default class GetEarlyComingsService {
  static async EarlyCommers(getData) {

    console.log(getData.orgid);
    
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

    const getdate = new Date(getData.date);
    const dateString = getdate.toLocaleDateString("en-US");
    const RequestedDate = moment(dateString, "MM/DD/YYYY").format("YYYY/MM/DD");

    interface DefineTypes {
      FirstName: number;
      LastName: string;
      TimeIn: string;
      Earlyby: number;
      EntryImage: string;
    }

    const sendResponse: DefineTypes[] = [];

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
        CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END,A.TimeIn) as Earlyby`))
      .where(
        Database.raw(
          `A.TimeIn < (CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END)`))
      .where(
        Database.raw(
          `TIMEDIFF(A.TimeIn,CASE WHEN(S.TimeInGrace!='00:00:00') THEN S.TimeInGrace ELSE S.TimeIn END) < '00:00:59'`))
      .where("A.OrganizationId",getData.orgid).where("E.Is_Delete",0).whereNotIn("A.AttendanceStatus",[2,3,5]).whereNot("S.shifttype",3).orderBy("Earlyby","desc").limit(limit);
     
      const adminStatus = await Helper.getAdminStatus(getData.empid);

      var ConditionForadminStatus = "";

      if (adminStatus === 2) {
        const deptId = getData.deptId
        ConditionForadminStatus = `A.Dept_id = ${deptId}`;
        getEarlyComingsdata = getEarlyComingsdata.where("A.Dept_id",ConditionForadminStatus)
      }
      if(getData.empid!==0){
        getEarlyComingsdata = getEarlyComingsdata.where("E.Id",getData.empid)
      }
      if(getData.orgid!==0){
        getEarlyComingsdata = getEarlyComingsdata.where("A.OrganizationId",getData.orgid)
      }
      if(getData.date!=0){
        getEarlyComingsdata = getEarlyComingsdata.where("A.AttendanceDate",RequestedDate)
      }

    const queryResult = await getEarlyComingsdata;
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
