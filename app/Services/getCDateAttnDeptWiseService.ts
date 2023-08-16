import { DateTime } from "luxon";
import Helper from "App/Helper/Helper";
import moment from "moment";
import Database from "@ioc:Adonis/Lucid/Database";

export default class getCDateAttnDeptWiseService{

  static async getCDateAttnDeptWise(getData){

    var Begin = (getData.currentPage - 1) * getData.perPage;
    var limit;
    if (getData.csv == " ") {
      limit = Begin;
    } else {
      limit;
    }

    var currDate = DateTime.now().setZone(timeZone)
    var getDate = getData.date?getData.date:currDate;
    var zone = await Helper.getTimeZone(getData.orgid);
    var timeZone = zone;
    var formattedDate1 = getDate.toFormat("yyyy-MM-dd");
    var dateTimeUTC = DateTime.fromISO(formattedDate1, { zone: "Pacific/Pago_Pago" });
    var dateTimeInTimeZone = dateTimeUTC.setZone(timeZone);
    var date = dateTimeInTimeZone.toFormat("yyyy-MM-dd");

    // var time = moment().format('HH:mm:ss')

    if (getData.datafor == "present"){
      // console.log("helo");
    
      var getdataforPresentees = Database.from("AttendanceMaster as A")
       .innerJoin("EmployeeMaster as E","A.EmployeeId","E.Id")
       .innerJoin("InterimAttendances as I","A.Id"," I.AttendanceMasterId")
       .innerJoin("ShiftMaster as S","A.ShiftId","S.Id")
       .innerJoin("DepartmentMaster as D","A.Dept_id","D.Id")
       .select( "A.latit_in","A.longi_in","A.latit_out","A.longi_out","A.Id","A.TotalLoggedHours","A.AttendanceStatus","A.ShiftId","A.multitime_sts","A.OrganizationId","A.Dept_id",Database.raw("DATE_FORMAT(A.AttendanceDate,'%Y-%m-%d') as AttendanceDate"),
         Database.raw(`(select CONCAT(FirstName,' ',LastName)  from EmployeeMaster where E.Id= ${38054345}) as name,
         IF((SELECT Count(id) FROM InterimAttendances WHERE I.AttendanceMasterId=A.Id)>0,'true','false') as  getInterimAttAvailableSts 
         `),
         Database.raw(`
         (Select S.shifttype from ShiftMaster where Id=ShiftId) as shiftType, SUBSTR(S.TimeIn, 1, 5) as TimeIn,
         SUBSTR(S.TimeOut, 1, 5) as TimeOut ,'Present' as status,
         SUBSTRING_INDEX(EntryImage, '.com/', -1) as EntryImage,
         SUBSTRING_INDEX(ExitImage, '.com/', -1) as ExitImage,
         SUBSTR(checkInLoc, 1, 40) as checkInLoc, 
         SUBSTR(CheckOutLoc, 1, 40) as CheckOutLoc
         `)
        )                   
        .where("A.AttendanceDate",date)
        .where("A.OrganizationId",getData.orgid)
        .whereIn("A.AttendanceStatus",[1,3,4,5,8]).orderBy("name")
        .limit(limit)
return getdataforPresentees
        // if(getData.dept!==0){
        //   getdataforPresentees = getdataforPresentees.where("A.Dept_id",getData.dept)
        //   // getdataforPresentees = getdataforPresentees.where("E.Department",getData.dept)
        // }
      
        if((await getdataforPresentees).length >0){
       
        var sendResponse: getdataforPresenteesInterface[] = [];
        var queryResult = await getdataforPresentees;
        queryResult.forEach(function (val) {
        var data: getdataforPresenteesInterface = {
          latit_in : val.latit_in,
          longi_in : val.longi_in,
          latit_out : val.latit_out,
          longi_out : val.longi_out,
          Id:val.Id,
          name:val.name,
          TotalLoggedHours : val.TotalLoggedHours,
          AttendanceStatus:val.AttendanceStatus,
          ShiftId: val.ShiftId,
          multitime_sts : val.multitime_sts,
          OrganizationId: val.OrganizationId,
          AttendanceDate: val.AttendanceDate,
          getInterimAttAvailableSts: val.getInterimAttAvailableSts,
          TimeIn: val.TimeIn,
          checkInLoc:val.checkInLoc,
          shiftType: val.shiftType,
          EntryImage: val.EntryImage,
          ExitImage:val.ExitImage,
          status: val.status,
          TimeOut:val.TimeOut,
        };
        sendResponse.push(data);
        
       });
      }else{
      sendResponse= [];
      }
      return sendResponse;
  }else if(getData.datafor == "absent"){
   
    if(date != moment().format("yyyy-MM-DD")) { // for other day's absentees

       var fetchothersdaysabsentees = Database
       .from('AttendanceMaster as A')
       .innerJoin('EmployeeMaster as E', 'A.EmployeeId', 'E.Id')
       .innerJoin('AppliedLeave as AL', 'A.EmployeeId', 'AL.EmployeeId')
       .select("E.Id","A.OrganizationId","AL.Date","A.AttendanceStatus",Database.raw("DATE_FORMAT(A.AttendanceDate,'%Y-%m-%d') as AttendanceDate"),
         Database.raw('CONCAT(E.FirstName, " ", E.LastName) as name'),'TimeOut as - ',
         'TimeIn as - ',
        
         Database.raw('AL.ApprovalStatus as LeaveStatus')
        )
        .where('AttendanceDate',date)
       .where('A.OrganizationId', getData.orgid)
       .whereIn('A.AttendanceStatus', [2, 7])
       .whereIn('A.EmployeeId',Database.rawQuery(`(SELECT Id from EmployeeMaster where OrganizationId =${getData.orgid} AND Is_Delete = 0 )`))
       .where('AL.ApprovalStatus',2)
      //  .where('AL.Date',date)
      //  .orderBy('name')
       .limit(limit);

      //  if(getData.dept!==0){
      //   fetchothersdaysabsentees = fetchothersdaysabsentees.where("A.Dept_id",getData.dept);
      //   // getdataforPresentees = getdataforPresentees.where("E.Department",getData.dept)
      // }
    //   if(Date != moment().format("yyyy-MM-dd")){

    // // return Date
    //     query= query.where('A.AttendanceDate',Date)
    //     // query= query.andWhere('AL.Date',Date)
    //   }
        
       return fetchothersdaysabsentees








  // const subquery = Database.from('AppliedLeave')
  // .select('ApprovalStatus')
  // .whereRaw('EmployeeId = A.EmployeeId')
  // .andWhere('ApprovalStatus', 2)
  // .andWhere('Date', Date)
  // .limit(1);
  // const getAbsenteesQuery = Database.from('AttendanceMaster as A')
  // .innerJoin('EmployeeMaster as E', 'A.EmployeeId', 'E.Id')
  // .select(
  //   'E.Id',
  //   'E.FirstName',
  //   'E.LastName',
  //   subquery.as('LeaveStatus'),
  //   Database.raw('CONCAT(E.FirstName, " ", E.LastName) as name')
  // )
  // .limit(3);



    //   Database.raw(`
    // CONCAT(E.FirstName, " ", E.LastName) as name'),
    //   `),
      // Database.raw(`
      // (select ApprovalStatus from AppliedLeave where AL.EmployeeId=A.EmployeeId and ApprovalStatus=2 and Date=${Date}) as LeaveStatus
      // `)
      
      // .where("A.AttendanceDate",Date).where("A.OrganizationId",getData.orgid).whereIn("A.AttendanceStatus",[2,7])
      // .where("A.EmployeeId",Database.raw(`(SELECT Id from EmployeeMaster where OrganizationId =  ${getData.orgid} AND Is_Delete = 0)`))
      // .orderBy("name")

      // if(getData.dept!==0){
      //   getAbsenteesQuery = getAbsenteesQuery.where("A.Dept_id",getData.dept)
      //     // getdataforPresentees = getdataforPresentees.where("E.Department",getData.dept)
      //   }
    
    // return getAbsenteesQuery
    }
  }
  
}};