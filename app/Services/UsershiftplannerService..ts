import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment";
import Helper from "App/Helper/Helper";
export default class UsershiftplannerService {
  public static async usershiftplanner(getvalue) {
    const userid = getvalue.empid;
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
      .andWhere("S.OrganizationId", organizationId)
      .where("A.EmployeeId", userid);

    const response: any[] = [];
    selectAttendanceMasterList.forEach((element) => {
      const data: any = {};
      let date = new Date(element.AttendanceDate);
      data["AttendanceDate"] = moment(date).format("YYYY-MM-DD");

      data["AttendanceStatus"] = element.AttendanceStatus;
      data["ShiftType"] = element.shifttype;
      data["TimeIn"] = element.TimeIn;
      data["TimeOut"] = element.TimeOut;
      data["PunchTimeIn"] = element.PunchTimeIn;
      data["PunchTimeOut"] = element.PunchTimeOut;
      data["disapprove"] = element.disapprove_sts;
      data["Logged"] = element.HoursPerDay;
      response.push(data);
    });
    return response;
  }

  public static async Storedeviceinformation(inputdata) {
    var Empid = inputdata.empid;
    var Deviceid = inputdata.deviceid;
    var Devicename = inputdata.devicename;
    const data2: any[] = [];

    const resresultOTP = {};
    const updateEmployeeMaster:any = await Database.from("EmployeeMaster")
      .where("Id", Empid)
      .update({
        DeviceName: Devicename,
        DeviceId: Deviceid,
      })
      
    if (updateEmployeeMaster>0) {
      resresultOTP["status"] = "Device saved successfully";
      data2.push(resresultOTP);
    } else {
      resresultOTP["status"] = "Unable to save device";
      data2.push(resresultOTP);
    }
    return data2
  }

  public static async getShiftDetailsdata(inputdata) {
    const userid = inputdata.empid;
    const refno = inputdata.orgid;
    const attDate = inputdata.attDate;
    const Date = attDate.toFormat("yyyy-MM-dd");

    const shiftId = await Helper.getassignedShiftTimes(userid, Date);
    var selectShiftMasterList = await Database.from("ShiftMaster")
      .select("*")
      .where("OrganizationId", refno)
      .andWhere("Id", shiftId);
    const res: any = [];
    var result = selectShiftMasterList;
    result.forEach((row) => {
      var data = {};
      data["shiftName"] = row.Name;
      data["ShiftTimeIn"] = row.TimeIn;
      data["ShiftTimeOut"] = row.TimeOut;
      data["shiftType"] = row.shifttype;
      data["HoursPerDay"] = row.HoursPerDay;
      res.push(data);
    });
    return res;
  }
}
