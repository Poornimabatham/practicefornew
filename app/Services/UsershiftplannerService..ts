import Database from "@ioc:Adonis/Lucid/Database";

export default class UsershiftplannerService {
  public static async usershiftplanner(getvalue) {
    const userid = getvalue.uid;
    const organizationId = getvalue.orgid;

    var selectAttendanceMasterList = await Database.from(
      "AttendanceMaster as A"
    )
      .innerJoin("ShiftMaster AS S", "A.ShiftId", "S.Id")
      .select("A.AttendanceDate","A.TimeIn as PunchTimeIn","A.TimeOut as PunchTimeOut","A.AttendanceStatus","A.ShiftId", "S.shifttype","S.HoursPerDay",
     "S.TimeIn","S.TimeOut","A.disapprove_sts ").where("S.OrganizationId",organizationId).where("A.EmployeeId",userid)
     const response: any[] = [];
     selectAttendanceMasterList.forEach((element) => {
        const data: any = {};
        // data['AttendanceDate'] = moment(element.AttendanceDate).format('YYYY-MM-DD');
        data['AttendanceDate'] = element.AttendanceDate;

        data['AttendanceStatus'] =  element.AttendanceStatus;
        data['ShiftType'] =  element.shifttype;
        data['STimeIn'] =  element.TimeIn;
        data['STimeOut'] =  element.TimeOut;
        data['PunchTimeIn'] =  element.PunchTimeIn;
        data['PunchTimeOut'] =  element.PunchTimeOut;
        data['disapprove'] =  element.disapprove_sts;
        data['Logged'] =  element.HoursPerDay;
        response.push(data)
      })
      return response
  }


  public static async  Storedeviceinformation(inputdata){
    var Empid = inputdata.empid
    var Deviceid = inputdata.deviceid;
    var Devicename = inputdata.devicename
   const updateEmployeeMaster= await Database.from('EmployeeMaster')
  .where('Id', Empid)
  .update({
    DeviceName: Devicename,
    DeviceId: Deviceid
  });
  return updateEmployeeMaster
  }
  
}