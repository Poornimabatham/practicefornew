import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
const { DateTime } = require("luxon");

export default class GetapprovalRegularService {
  public static async GetregularizationApproverRejectedAPI(data) {
    var ActivityBy = 0;
    var module = "";
    var count = 0;
    var count1 = 0;
    var successMsg = "";
    var Msg1 = "Regularization could not be rejected.";
    var Msg = "Regularization could not be approved.";
    var status = false;
    var count11: number = 0;
    var con: number = 0;
    var regularizetimein = "00:00:00";
    var totalovertime;

    var newtimeout = "00:00:00";
    if (data.RegularizationAppliedFrom != 2) {
      ActivityBy = 0;
      module = "ubiHRM APP";
    }
    if (data.RegularizationAppliedFrom == 2) {
      ActivityBy = 1;
      module = "ubiattendance APP";
    }
    if (data.attendance_id != undefined && data.attendance_id != 0) {
      try {
        const selectAttendanceMasterList: any = await Database.from(
          "AttendanceMaster"
        )
          .select(
            "Id",
            "RegularizeTimeOut",
            "RegularizeTimeIn",
            "TimeIn",
            "TimeOut",
            "AttendanceDate",
            "EmployeeId"
          )
          .where("Id", data.attendance_id);

        count1 = selectAttendanceMasterList.length;
        if (count1 == 1) {
          await Promise.all(
            selectAttendanceMasterList.map(async (val) => {
              newtimeout = val.RegularizeTimeOut;
              var timein = val.TimeIn;
              var timeout = val.TimeOut;
              regularizetimein = val.RegularizeTimeIn;
              var attendancedate = val.AttendanceDate;
              var orginaltimein = val.TimeIn;
              var empid = val.EmployeeId;
              const selectEmployeeMasterList = await Database.from(
                "EmployeeMaster"
              )
                .select(
                  Database.raw(`
    IF(LastName != '', CONCAT(FirstName, ' ', LastName), FirstName) as name
  `),
                  "Shift",
                  "Department",
                  "Designation",

                  "area_assigned",
                  "CompanyEmail"
                )
                .where("Id", empid)
                .orWhere("organizationId", data.orgid)
                .limit(2);

              if (selectEmployeeMasterList.length > 0) {
                var empname = selectEmployeeMasterList[0].name;
              }

              if (data.approverresult == 2) {
                const selectAttendanceMasterList = await Database.from(
                  "AttendanceMaster"
                )
                  .select("*")
                  .where("ApproverId", "!=", 0)
                  .andWhere("Id", data.attendance_id);

                var hrid = data.uid;

                if (selectAttendanceMasterList.length > 0) {
                  var shiftId = selectAttendanceMasterList[0].ShiftId;
                  if (regularizetimein == timein) {
                    totalovertime = await Helper.getOvertimeForRegularization(
                      timein,
                      newtimeout,
                      shiftId
                    );
                    var mdate = DateTime.local().toFormat(
                      "yyyy-MM-dd HH:mm:ss"
                    );

                    const updateAttendanceMaster: any = await Database.query()
                      .from("AttendanceMaster")
                      .where("Id", data.attendance_id)
                      .andWhere("RegularizeSts", 3)
                      .update({
                        TimeOut: newtimeout,
                        Overtime: totalovertime,
                        RegularizeSts: data.approverresult,
                        RegularizeApprovalDate: mdate,
                        RegularizeApproverRemarks: data.comment,
                        LastModifiedById: hrid,
                      });
                    count = updateAttendanceMaster;
                  } else {
                    var affected_rows = 0;
                    totalovertime = await Helper.getOvertimeForRegularization(
                      timein,
                      newtimeout,
                      shiftId
                    );
                    const selectAttendaneMasterList2: any = await Database.from(
                      "AttendanceMaster"
                    )
                      .select("*")
                      .where("Id", data.attendance_id)
                      .andWhere("RegularizeSts", 3);
                    affected_rows = selectAttendaneMasterList2.length;
                    var attsts;
                    if (affected_rows == 1) {
                      attsts = selectAttendaneMasterList2[0].AttendanceStatus;
                      if (attsts == 2) {
                        attsts = 1;
                      }
                      const updateAttendanceMaster: any = await Database.query()
                        .from("AttendanceMaster")
                        .where("Id", data.attendance_id)
                        .andWhere("RegularizeSts", 3)
                        .update({
                          AttendanceStatus: attsts,
                          TimeIn: regularizetimein,
                          TimeOut: newtimeout,
                          LastModifiedDate: mdate,
                          LastModifiedById: data.uid,
                          Overtime: totalovertime,
                          RegularizeSts: data.approverresult,
                          RegularizeApproverRemarks: data.comment,
                          RegularizeApprovalDate: mdate,
                        });
                      count = updateAttendanceMaster;
                    }
                  }

                  if (count >= 1) {
                    var msg = `Regularization request of <b>${empname}</b> has been approved </br> Attendance Date: <b>${attendancedate}</b>`;

                    const insertActivityHistoryMaster =
                      await Database.insertQuery()
                        .table("ActivityHistoryMaster")
                        .insert({
                          LastModifiedById: data.uid,
                          ActionPerformed: msg,
                          Module: module,
                          OrganizationId: data.orgid,
                          ActivityBy: ActivityBy,
                        });

                    var title = `Alert:Your Regularization Request is approved`;
                    var emailmsg = `Dear ${empname}<br><br> This is to inform you that your regularization
                   request has been approved.<br>Remarks :  .${data.comment}`;
                  }
                } else {
                  const updateRegularizationApproval: any = await Database.from(
                    "RegularizationApproval"
                  )
                    .where(" attendanceId", data.attendance_id)
                    .andWhere("ApproverId", data.uid)
                    .andWhere("OrganizationId", data.orgid)
                    .andWhere("ApproverSts", 3)
                    .andWhere("approverregularsts", 0)
                    .update({
                      ApproverSts: data.approverresult,
                      ApprovalDate: mdate,
                      ApproverComment: data.comment,
                    });
                  count = updateRegularizationApproval;
                  hrid = data.uid;
                  if (count >= 1) {
                    msg = `Regularization request of <b>${empname}</b> has been approved </br> Attendance Date: <b>${attendancedate}</b>`;
                    const insertActivityHistoryMaster =
                      await Database.insertQuery()
                        .table("ActivityHistoryMaster")
                        .insert({
                          LastModifiedById: data.uid,
                          ActionPerformed: msg,
                          Module: module,
                          OrganizationId: data.orgid,
                          ActivityBy: ActivityBy,
                        });
                    const selectRegulariationList = await Database.from(
                      "RegularizationApproval"
                    )
                      .select("ApproverId")
                      .where(" attendanceId", data.attendance_id)
                      .andWhere("ApproverId", data.uid)
                      .andWhere("OrganizationId", data.orgid)
                      .andWhere("ApproverSts", 3)
                      .andWhere("approverregularsts", 0);

                    con = selectRegulariationList.length;
                    if (con > 0) {
                      var approverId = con[0].ApproverId;
                      hrid = con[0].ApproverId;
                      if (regularizetimein == orginaltimein) {
                        var timeincondition = "";
                      } else {
                        timeincondition = `The requested timein is: ${regularizetimein}<br><br><br>`;
                      }

                      msg = `Dear $Hrname,<br><br>
										This is to inform you that, ${empname} has requested regularization for 
                    the ${attendancedate}. Kindly approve the request.<br>
										${timeincondition}
										The requested timeout is: ${newtimeout}<br><br><br>`;
                    } else {
                      if (regularizetimein == timein) {
                        // $totalovertime=$this->getOvertimeForRegularization($timein,$newtimeout,$shiftid);

                        const updateAttendanceMaster = await Database.query()
                          .from("AttendanceMaster")
                          .where("Id", data.attendance_id)
                          .andWhere("RegularizeSts", 3)
                          .update({
                            TimeOut: newtimeout,
                            Overtime: totalovertime,
                            RegularizeSts: data.approverresult,
                            LastModifiedDate: mdate,
                            RegularizeApproverRemarks: data.comment,

                            LastModifiedById: hrid,
                          });

                        count = updateAttendanceMaster.length;
                      } else {
                        affected_rows = 0;
                        var selectAttendaneMasterList2: any =
                          await Database.from("AttendanceMaster")
                            .select("*")
                            .where("Id", data.attendance_id)
                            .andWhere("RegularizeSts", 3);

                        if (affected_rows == 1) {
                          attsts =
                            selectAttendaneMasterList2[0].AttendanceStatus;
                        }
                        if (attsts == 2) {
                          attsts = 1;
                        }
                        const updateAttendanceMaster = await Database.from(
                          "AttendanceMaster"
                        )
                          .where("Id", data.attendanceId)
                          .where("RegularizeSts", 3)
                          .update({
                            TimeOut: newtimeout,
                            Overtime: totalovertime,
                            RegularizeSts: data.approverResult,
                            RegularizeApprovalDate: mdate,
                            RegularizeApproverRemarks: data.comment,
                            LastModifiedById: hrid,
                          });
                      }
                    }

                    if (count >= 1) {
                      msg = `Regularization request of <b>${empname}</b> has been approved </br> Attendance Date: <b>${attendancedate}</b>`;
                      const insertActivityHistoryMaster =
                        await Database.insertQuery()
                          .table("ActivityHistoryMaster")
                          .insert({
                            LastModifiedById: data.uid,
                            ActionPerformed: msg,
                            Module: module,
                            OrganizationId: data.orgid,
                            ActivityBy: ActivityBy,
                          });

                      title = `Alert:Your Regularization Request is approved`;
                      emailmsg = `Dear ${empname},<br><br> This is to inform you that your regularization request has been approved.<br>Remarks : 
                       ".${data.comment}`;
                    }
                  }
                }
              }

              if (data.approverresult == 1) {
                const selectAttendanceMasterList: any = Database.from(
                  "AttendanceMaster"
                )
                  .where("ApproverId", "!=", 0)
                  .andWhere("Id", data.attendance_id)
                  .select("Id");

                if (selectAttendanceMasterList.length > 0) {
                  const updateAttendanceMaster = await Database.from(
                    "AttendanceMaster"
                  )
                    .where("Id", data.attendanceId)
                    .where("RegularizeSts", 2)
                    .update({
                      RegularizeSts: data.approverResult,
                      RegularizeApprovalDate: mdate,
                      RegularizeApproverRemarks: data.comment,
                    });
                  if (count >= 1) {
                    msg = `Regularization request of <b>${empname}</b> has been rejected</br> Attendance Date: <b>${attendancedate}</b>`;
                    const insertActivityHistoryMaster =
                      await Database.insertQuery()
                        .table("ActivityHistoryMaster")
                        .insert({
                          LastModifiedById: data.uid,
                          ActionPerformed: msg,
                          Module: module,
                          OrganizationId: data.orgid,
                          ActivityBy: ActivityBy,
                        });

                    title = `Alert:Your Regularization Request is  rejected`;
                    emailmsg = `Dear ${empname},<br><br> This is to inform you that your regularization request has been rejected.<br>Remarks : 
         ".${data.comment}`;
                  }
                } else {
                  const updateRegularizationApproval = await Database.from(
                    "RegularizationApproval"
                  )
                    .where("attendanceId", data.attendanceId)
                    .where("ApproverId", data.uid)
                    .where("OrganizationId", data.orgid)
                    .where("ApproverSts", 3)
                    .where("ApprovalDate", "0000-00-00 00:00:00")
                    .update({
                      ApproverSts: data.approverResult,
                      ApprovalDate: mdate,
                      ApproverComment: data.comment,
                      approverregularsts: 1,
                    });
                  count11 = updateRegularizationApproval.length;
                  if (count11 >= 1) {
                    const updateAttendanceMaster = await Database.from(
                      "AttendanceMaster"
                    )
                      .where("Id", data.attendanceId)
                      .where("RegularizeSts", 3)
                      .update({
                        RegularizeSts: data.approverResult,
                        RegularizeApprovalDate: mdate,
                        RegularizeApproverRemarks: data.comment,
                      });
                    count = updateAttendanceMaster.length;
                    if (count >= 1) {
                      msg = `Regularization request of <b>${empname}</b> has been rejected | 
    AttendanceDate: <b>${attendancedate}</b>`;
                      const insertActivityHistoryMaster =
                        await Database.insertQuery()
                          .table("ActivityHistoryMaster")
                          .insert({
                            LastModifiedById: data.uid,
                            ActionPerformed: msg,
                            Module: module,
                            OrganizationId: data.orgid,
                            ActivityBy: ActivityBy,
                          });
                      title = "Alert:Your Regularization Request is rejected";
                      emailmsg = `Dear ${empname},<br><br> This
                     is to inform you that your regularization request has 
                      rejected.<br>HR Remarks :  ".${data.comment}`;
                    }
                  }
                }
              }
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (count >= 1) {
      status = true;

      if (data.approverresult == 2) {
        successMsg = `Regularization has been Approved`;
        Msg = `Regularization has been Approved`;
      } else if (data.approverresult == 1) {
        successMsg = `Regularization has been Rejected`;
        Msg1 = "Regularization has been Rejected";
      }
    }

    if (data.platform == undefined) {
      return status;
    } else {
      const response = {
        status: status,
        Msg: Msg,
        Msg1: Msg1,
      };

      return response;
    }
  }
}
