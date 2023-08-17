import Database from "@ioc:Adonis/Lucid/Database";

export default class GetapprovalRegularService {
  public static async GetregularizationApproverRejectedAPI(data) {
    var ActivityBy = 0;
    var module = "";
    var count = 0;
    var count1 = 0;
    var errorMsg = "";
    var successMsg = "";
    var Msg1 = "Regularization could not be rejected.";
    var Msg = "Regularization could not be approved.";
    var status = false;
    var count11 = 0;
    var con = 0;
    var regularizetimein = "00:00:00";
	
	var empname;







    var newtimeout = "00:00:00";
    if (data.RegularizationAppliedFrom != 2) {
      ActivityBy = 0;
      module = "ubiHRM APP";
    }
    if (data.RegularizationAppliedFrom == 2) {
      ActivityBy = 1;
      module = "ubiattendance APP";
    }

    if (data.attendance_id != "" && data.attendance_id != 0) {
      try {
        var selectRegularizaList: any = Database.from("AttendanceMaster")
          .select(
            "RegularizeTimeOut",
            "RegularizeTimeIn",
            "TimeIn",
            "TimeOut",
            "AttendanceDate",
            "EmployeeId"
          )
          .where("Id", data.attendance_id)
          .first();

        count1 = await selectRegularizaList.length;
        if (count1 == 1) {
          await Promise.all(
            selectRegularizaList.map(async (val) => {
              newtimeout = val.RegularizeTimeOut;
              var timein = val.TimeIn;
              var timeout = val.TimeOut;
              var regularizetimein = val.RegularizeTimeIn;
              var orginaltimein = val.TimeIn;
              var empid = val.EmployeeId;

              const queryResult: any = await Database.from("EmployeeMaster")
                .select(
                  "Shift",
                  "Department",
                  "Designation",
                  "area_assigned",
                  "CompanyEmail",
                  Database.raw(`
						SELECT IF(LastName != '', CONCAT(FirstName, ' ', LastName), FirstName) as name,
						 
					  `)
                )
                .where("Id", empid)
                .andWhere("organizationId", data.organizationId);

              const resultRows = queryResult.rows;

            })
          );
        }
      } catch (err) {}
    }
  }
}
