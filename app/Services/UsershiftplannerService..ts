import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment";
export default class UsershiftplannerService {
  public static async usershiftplanner(getvalue) {
    const userid = getvalue.uid;
    const organizationId = getvalue.orgid;

    var selectAttendanceMasterList = await Database.from(
      "AttendanceMaster as A"
    )
      .innerJoin("ShiftMaster AS S", "A.ShiftId", "S.Id")
      .select(
        "A.AttendanceDate",
        "A.TimeIn as PunchTimeIn",
        "A.TimeOut as PunchTimeOut",
        "A.AttendanceStatus",
        "A.ShiftId",
        "S.shifttype",
        "S.HoursPerDay",
        "S.TimeIn",
        "S.TimeOut",
        "A.disapprove_sts "
      )
      .where("S.OrganizationId", organizationId)
      .where("A.EmployeeId", userid);

    const response: any[] = [];
    selectAttendanceMasterList.forEach((element) => {
      const data: any = {};
      let date = new Date(element.AttendanceDate);
      data["AttendanceDate"] = moment(date).format("YYYY-MM-DD");

      data["AttendanceStatus"] = element.AttendanceStatus;
      data["ShiftType"] = element.shifttype;
      data["STimeIn"] = element.TimeIn.substr(0, 5);
      data["STimeOut"] = element.TimeOut.substr(0, 5);
      data["PunchTimeIn"] = element.PunchTimeIn.substr(0, 5);
      data["PunchTimeOut"] = element.PunchTimeOut.substr(0, 5);
      data["disapprove"] = element.disapprove_sts;
      data["Logged"] = element.HoursPerDay.substr(0, 5);
      response.push(data);
    });
    return response;
  }

  public static async Storedeviceinformation(inputdata) {
    var Empid = inputdata.empid;
    var Deviceid = inputdata.deviceid;
    var Devicename = inputdata.devicename;
    const updateEmployeeMaster = await Database.from("EmployeeMaster")
      .where("Id", Empid)
      .update({
        DeviceName: Devicename,
        DeviceId: Deviceid,
      });
    return updateEmployeeMaster;
  }
}
