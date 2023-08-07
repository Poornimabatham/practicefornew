import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment-timezone";

export default class LogicsOnly {

  public static async getAttendances__bothchange(data: any){

    let query: any = Database.from("AttendanceMainMaster as A")
      .innerJoin("EmployeeMaster as E","A.EmployeeId","E.Id")
      .innerJoin("DepartmentMaster as D","A.Dept_id","D.Id")
      .innerJoin("DesignationMaster as DM","A.Desg_id","DM.Id")
      .innerJoin("ShiftMaster as C","A.ShiftId","C.Id")
      .select(
      "A.Id","A.EmployeeId","D.Name","E.EmployeeCode","C.shifttype","E.FirstName","E.LastName","A.OrganizationId","A.Dept_id","A.Desg_id","A.ShiftId","E.PersonalNo","A.EntryImage","A.ExitImage","E.MultipletimeStatus","C.TimeIn","C.TimeOut","A.AttendanceDate","A.TimeInEditStatus","A.TimeOutEditStatus","A.FakeLocationStatusTimeIn","A.TotalLoggedHours","C.HoursPerDay","C.HalfdayHours"," C.HalfdayStatus",
     Database.raw(`
      CASE
        WHEN C.shifttype = 3 THEN SUBTIME(A.TotalLoggedHours, C.HoursPerDay)
        ELSE
          CASE
            WHEN A.TimeIn != '00:00:00' AND A.TimeOut != '00:00:00' THEN
              CASE
                WHEN A.timeoutdate != '0000-00-00' THEN
                  CASE
                    WHEN C.shifttype = 2 AND A.timeoutdate = A.timeindate THEN SUBTIME(TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.AttendanceDate, ' ', A.TimeIn)), TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY), ' ', C.TimeOut), CONCAT(A.AttendanceDate, ' ', C.TimeIn)))
                    ELSE SUBTIME(TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.AttendanceDate, ' ', A.TimeIn)), TIMEDIFF(CONCAT(A.timeoutdate, ' ', C.TimeOut), CONCAT(A.AttendanceDate, ' ', C.TimeIn)))
                  END
                ELSE '00:00:00'
              END
            ELSE '00:00:00'
          END
      END AS Overtime,
      SUBSTRING_INDEX(A.EntryImage, ".", 1) as EntryImage,
      SUBSTRING_INDEX(A.ExitImage, "s3", 1) as ExitImage,
      TIME_FORMAT(SEC_TO_TIME((ROUND(TIME_TO_SEC(A.TotalLoggedHours) / 60)) * 60), '%H:%i:%s') AS loggedhours
      `)).limit(2)

    let query2: any = Database.from("ArchiveAttendanceMaster as AA")
      .innerJoin("EmployeeMaster as E","AA.EmployeeId","E.Id")
      .innerJoin("DepartmentMaster as D","AA.Dept_id","D.Id")
      .innerJoin("DesignationMaster as DM","AA.Desg_id","DM.Id")
      .innerJoin("ShiftMaster as C","AA.ShiftId","C.Id")
      .select(
      "AA.Id","AA.EmployeeId","D.Name","E.EmployeeCode","C.shifttype","E.FirstName","E.LastName","AA.OrganizationId","AA.Dept_id","AA.Desg_id","AA.ShiftId","E.PersonalNo","AA.EntryImage","AA.ExitImage","E.MultipletimeStatus","C.TimeIn","C.TimeOut","AA.AttendanceDate","AA.TimeInEditStatus","AA.TimeOutEditStatus","AA.FakeLocationStatusTimeIn","AA.TotalLoggedHours","C.HoursPerDay","C.HalfdayHours"," C.HalfdayStatus",
      Database.raw(`
       CASE
         WHEN C.shifttype = 3 THEN SUBTIME(AA.TotalLoggedHours, C.HoursPerDay)
         ELSE
           CASE
             WHEN AA.TimeIn != '00:00:00' AND AA.TimeOut != '00:00:00' THEN
               CASE
                 WHEN AA.timeoutdate != '0000-00-00' THEN
                   CASE
                     WHEN C.shifttype = 2 AND AA.timeoutdate = AA.timeindate THEN SUBTIME(TIMEDIFF(CONCAT(AA.timeoutdate, ' ', AA.TimeOut), CONCAT(AA.AttendanceDate, ' ', AA.TimeIn)), TIMEDIFF(CONCAT(DATE_ADD(AA.AttendanceDate, INTERVAL 1 DAY), ' ', C.TimeOut), CONCAT(AA.AttendanceDate, ' ', C.TimeIn)))
                     ELSE SUBTIME(TIMEDIFF(CONCAT(AA.timeoutdate, ' ', AA.TimeOut), CONCAT(AA.AttendanceDate, ' ', AA.TimeIn)), TIMEDIFF(CONCAT(AA.timeoutdate, ' ', C.TimeOut), CONCAT(AA.AttendanceDate, ' ', C.TimeIn)))
                   END
                 ELSE '00:00:00'
               END
             ELSE '00:00:00'
           END
       END AS Overtime,
       SUBSTRING_INDEX(AA.EntryImage, ".", 1) as EntryImage,
       SUBSTRING_INDEX(AA.ExitImage, "s3", 1) as ExitImage,
       TIME_FORMAT(SEC_TO_TIME((ROUND(TIME_TO_SEC(AA.TotalLoggedHours) / 60)) * 60), '%H:%i:%s') AS loggedhours
       `)).limit(2)

    const currentDateTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
    // console.log(currentDateTime)

  if(data.searchval == undefined){
      if (data.FirstDate == undefined || data.SecondDate == undefined ){
        let currDate = moment().format("YYYY-MM-DD");   
        query = query.where("A.AttendanceDate", currDate)
        query2 = query2.where("AA.AttendanceDate", currDate)
      }
      if(data.FirstDate!=undefined && data.SecondDate!=undefined){
        const startDate = data.FirstDate.toFormat('yyyy-MM-dd')
        const LastDAte = data.SecondDate.toFormat('yyyy-MM-dd')
        query = query.whereBetween("A.AttendanceDate",[startDate,LastDAte])
        query2 = query2.whereBetween("AA.AttendanceDate",[startDate,LastDAte])
      }
      if(data.orgId !=undefined){
        query = query.where("A.OrganizationId",data.orgId)
        query2 = query2.where("AA.OrganizationId",data.orgId)
      }
      if(data.empId !=undefined){
        query = query.where("A.EmployeeId",data.empId)
        query2 = query2.where("AA.EmployeeId",data.empId)
      }
      if(data.deptId !=undefined){
        query = query.where("A.Dept_id",data.deptId)
        query2 = query2.where("AA.Dept_id",data.deptId)
      }
      if(data.desigId !=undefined){
        query = query.where("A.Desg_id",data.desigId)
        query2 = query2.where("AA.Desg_id",data.desigId)
      }
      if(data.shiftId !=undefined){
        query = query.where("A.ShiftId",data.shiftId)
        query2 = query2.where("AA.ShiftId",data.shiftId)
      }
    }else{
      query = query.where("E.FirstName",data.searchval)
      query2 = query2.where("E.FirstName",data.searchval)
    }
  
    let resp: any[] = [];  
    
    const queryResult:any = await query.union(query2)
    queryResult.forEach(function (val) {
      const data: any = {};
      data["Id"] = val.Id;
      data["EmployeeId"] = val.EmployeeId;
      data["OrganizationId "] = val.OrganizationId;
      data["EmployeeCode"] = val.EmployeeCode;
      data["shifttype"] = val.shifttype;
      data["ShiftName"] = val.Name;
      data["FirstName"] = val.FirstName;
      data["LastName"] = val.LastName;
      data["DesignationName"] = val.Name;
      data["Dept_id"] = val.Dept_id;
      data["Desg_id"] = val.Desg_id;
      data["ShiftId"] = val.ShiftId;
      data["PersonalNo"] = val.PersonalNo;
      data["EntryImage"] = val.EntryImage;
      data["ExitImage"] = val.ExitImage;
      data["TimeIn"] = val.TimeIn;
      data["TimeOut"] = val.TimeOut;
      data["AttendanceDate"] = moment(val.AttendanceDate).utcOffset("Asia/Kolkata").format('YYYY-MM-DD');
      data["Overtime"] = val.Overtime;
      data["TimeInEditStatus"] = val.TimeInEditStatus;
      data["TimeOutEditStatus"] = val.TimeOutEditStatus;
      data["FakeLocationStatusTimeIn"] = val.FakeLocationStatusTimeIn;
      data["TotalLoggedHours"] = val.TotalLoggedHours;
      data["loggedhours"] = val.loggedhours;
      data["HoursPerDay"] = val.HoursPerDay;
      data["HalfdayHours"] = val.HalfdayHours;
      data["HalfdayStatus"] = val.HalfdayStatus;
      resp.push(data);
    });
      return resp;
  }
}

