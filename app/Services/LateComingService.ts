import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import moment from "moment";

export default class LateComingService {
  public static async getLateComing(data) {
    var Begin = (data.Currentpage - 1) * data.Perpage;
    // var Date2 = data.Date;
  
      var month1 = new Date(data.Date);
var Date2 = moment(month1).format("yyyy-MM-DD");
      
    

    var lateComersList: any = Database.from("AttendanceMaster as A")
      .innerJoin("EmployeeMaster as E", "E.Id", "A.EmployeeId")
      .innerJoin("ShiftMaster as S", "S.Id", "A.ShiftId")
      .select(
        "E.FirstName",
        "E.LastName",
        "A.ShiftId",
        "A.EmployeeId",
        "A.ShiftId",
        "A.AttendanceDate",
        Database.raw(
          `(SELECT TIMEDIFF(A.TimeIn, CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END))
         as earlyby`
        ),
        Database.raw(
          `A.TimeIn > (CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END)
  AND TIMEDIFF(A.TimeIn, CASE WHEN S.TimeInGrace != '00:00:00' THEN S.TimeInGrace ELSE S.TimeIn END) >
  '00:00:59'`
        ),
        Database.raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage")
      )
      .andWhere("A.OrganizationId", data.Orgid)
      .andWhereNotIn("A.AttendanceStatus", [2, 3, 5])
      .andWhere("S.shifttype","!=", 3)
      .andWhere(" E.Is_Delete", 0)
      .andWhere("A.AttendanceDate", Date2)
      .orderBy("E.FirstName", "desc")
      

    var adminStatus = await Helper.getAdminStatus(data.Empid);
    var condition;
    if (adminStatus == 2) {
      const Empid = data.Empid;
      condition = `A.Dept_id = ${Empid}`;

      lateComersList = lateComersList.where("A.Dept_id", condition);
    }

    const response: any[] = [];

    const Output = await lateComersList;

    Output.forEach((element) => {
      const data2: any = {};

      data2["lateBy"] =  moment(element.earlyby, 'HH:mm').format('HH:mm');

      data2["timein"] = element.atimein ? element.atimein.substr(0, 5) : null;

      data2["fullname"] = `${element.FirstName} ${element.LastName}`;
      data2["EntryImage"] = element.EntryImage;
      data2["ShiftId"] = element.ShiftId;
      data2["AttendanceDate"] = moment(element.AttendanceDate).format(
        "YYYY/MM/DD"
      );
      data2["A.EmployeeId"] = element.EmployeeId;
      response.push(data2);
    });

    return response;
  }
}
