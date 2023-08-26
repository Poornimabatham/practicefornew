import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment";
export default class StoreRatingService {
  public static async StoreRatings(data) {
    var Empid = data.empid;
    var organizationId = data.orgid;
    var Remark = data.remark;
    var Rating = data.rating;
    var res1;

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
}
