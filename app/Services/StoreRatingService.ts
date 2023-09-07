import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment";
import Helper from "App/Helper/Helper";
export default class StoreRatingService {
  public static async StoreRatings(get) {
    var Empid = get.empid;
    var organizationId = get.orgid;
    var Remark = get.remark;
    var Rating = get.rating;
    var res1;
    const data = {};

    const date = moment().format("YYYY-MM-DD");

    const modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    var selectUbiAttendanceRatings: any = await Database.from(
      "ubiAttendanceRatings"
    )
      .where("EmployeeId", Empid)
      .andWhere("OrganizationId", organizationId)
      .select("*");

    const result = selectUbiAttendanceRatings.length;
    if (result > 0) {
      var updateUbiAttendanceRatings = await Database.from(
        " ubiAttendanceRatings"
      )
        .where("EmployeeId", Empid)
        .where("OrganizationId", organizationId)
        .update({
          Rating: Rating,
          Remark: Remark,
          ModifiedDate: modifiedDate,
        });
      res1 = updateUbiAttendanceRatings;
      if (res1) {
        data["status"] = "true";
      } else {
        data["status"] = "false";
      }

      return data;
    } else {
      var insertUbiAttendanceRatings: any = await Database.insertQuery()
        .table("ubiAttendanceRatings")
        .insert({
          EmployeeId: Empid,
          OrganizationId: organizationId,
          Rating: Rating,
          Remark: Remark,
          CreatedDate: date,
        });

      res1 = insertUbiAttendanceRatings.length;
    }

    if (res1) {
      data["status"] = "TRUE";
    } else {
      data["status"] = "FALSE";
    }

    return data;
  }

  public static async getSelectedEmployeeShift(get){
    const orgid =get.orgid;

    const empid = get.empid
    const shiftid = await Helper.getShiftIdByEmpID(empid);

    const res: any = [];
   
    const selectShiftMasterist = await Database.from('ShiftMaster').select('Id','Name','TimeIn','TimeOut',
      'shifttype','HoursPerDay').where('Id', shiftid).where('OrganizationId',orgid)
      if(selectShiftMasterist.length>0){
       selectShiftMasterist.forEach((row)=>{
        var data = {};
        data['Id'] = row.Id;
        data['Name'] = row.Name;
        data['TimeIn'] = row.TimeIn;
        data['TimeOut'] = row.TimeOut;
        data['shifttype'] = row.shifttype;
        data['HoursPerDay'] = row.HoursPerDay;
        res.push(data)
       })
       return res
      }
  }
}
