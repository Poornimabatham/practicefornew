import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
export default class ResetPasswordLinkService {
  public static async ResetPassword(data) {
    const una = await Helper.encode5t(data.una);
    const result = {};
    const selectEmployeeList: any = await Database.from("EmployeeMaster")
      .select(
        "Id",
        "OrganizationId",
        "FirstName",
        "LastName",
        Database.raw(
          "(SELECT resetPassCounter FROM  UserMaster  WHERE Username = ? OR username_mobile = ?) as  ctr",
          [una, una]
        ),
        Database.raw(
          "(SELECT Username FROM  UserMaster  WHERE Username = ? OR username_mobile = ?) as  email",
          [una, una]
        )
      )
      .where(
        "Id",
        Database.raw(
          "(SELECT  EmployeeId FROM UserMaster WHERE Username =? OR username_mobile=?)",
          [una, una]
        )
      );
    const rows = selectEmployeeList.length;
    if (rows > 0) {
      if (rows[0] != "") {
        var orgid = selectEmployeeList[0].OrganizationId;
        var email = selectEmployeeList[0].email
          ? await Helper.decode5t(selectEmployeeList[0].email)
          : "";
        var Name = `${selectEmployeeList[0].FirstName} ${selectEmployeeList[0].LastName}`;

        const querytest = await Database.from("All_mailers")
          .select("Body", "Subject")
          .where("Id", "23");
        if (querytest.length) {
          var body = querytest[0].Body;
          var subject = querytest[0].Subject;
        }
        //     const encryptedId = Encryption.encrypt( selectEmployeeList[0].Id);
        // const encryptedOrgId = Encryption.encrypt(orgid);
        // const encryptedCtr = Encryption.encrypt( selectEmployeeList[0].ctr);
        // const url = `https://ubiattendance.ubihrm.com/index.php/services/HastaLaVistaUbi?hasta=${encryptedId}&vista=${encryptedOrgId}&ctrpvt=${encryptedCtr}`;

        // const logo = "<img src='https://ubiattendance.ubiattendance.xyz/newpanel/index.php/../assets/img/myubiAttendance_logo.jpg' style='width: 200px;' /><p style='text-align: center; line-height:1;'></p><p class='MsoNormal' style='text-align: center; margin-bottom: 0.0001pt; line-height: 1;'><b><span style='font-size: 24px; font-family: &quot;Times New Roman&quot;'>";

        const body1 = body.replace("{Admin_Name}", Name);

        const headers = "From: <noreply@ubiattendance.com>\r\n";

        result["status"] = "1";
        return result;
      } else {
        result["status"] = "0";
        return result;
      }
    } else {
      result["status"] = "2";
      return result;
    }
  }
  public static async getAllowAttToUserData(input) {
    var AllowToPunchAtt = input.allowToPunchAtt;
    var Id = input.Id;
    var Orgid = input.orgid;
    var Empid = input.empid;
    const status = {};
    const data = {};
    let S1;
    if (AllowToPunchAtt == "true") {
      S1 = 1;
    } else {
      S1 = 0;
    }
    const updateUserMaster: any = await Database.from("UserMaster")
      .where("EmployeeId", Id)
      .update({
        Att_restrict: S1,
      });
    const affectedRows = updateUserMaster;
    if (affectedRows) {
      status["status"] = "true";
    } else {
      status["status"] = "false";
    }

    if (affectedRows == 0) {
      // data["sts"] = 1;

      const zone = await Helper.getTimeZone(Orgid);
      const defaultZone = DateTime.now().setZone(zone);
      const currenttime: string = defaultZone.toFormat("yy-MM-dd HH:mm:ss'");
      var appModule = "Attendance  Restrication";
      var module = "Attendance App";

      var getEmpName = await Helper.getEmpName(Id);
      var getEmpName2 = await Helper.getEmpName(Empid);

      var actionperformed = `<b>".${getEmpName}."</b>
            Attendance Restrected By permission has been updated by <b>"
            .${getEmpName2}."</b> from<b> Attendance App  </b>`;

      var activityby = 1;
      const insertActivityHistoryMaster: any =
        await Helper.ActivityMasterInsert(
          currenttime,
          Orgid,
          Id,
          activityby,
          appModule,
          actionperformed,
          module
        );
    }
    return status;
  }

  public static async MoveEmpDataInExistingOrg(data) {
    const Empid = data.uid;
    const NewOrg = data.orgid;
    const OldOrg = data.OldOrgId;
    const Status = data.status;
    const Contact = data.usercontact;

    var Admin_Name = await Helper.getAdminNamebyOrgId(OldOrg);
    var AdminEmail = data.Email;
    const FirstName = await Helper.getEmpName(Empid);
    var EmployeeName = FirstName + Contact;

    var eid;
    var EmpSts;
    var COUNT;
    var dept;
    var desg;
    var shift;
    var CountFlag = 0;
    var deleteQuery;
    var UpdateQuery;
    var body;

    var body1;
    var subject;
    var message_body;
    const result: {} = {};

    if (Status == 1) {
      const selectUsermasterlist = await Database.from("UserMaster")
        .select("*")
        .where("OrganizationId", NewOrg);
      COUNT = selectUsermasterlist.length;
      if (selectUsermasterlist) {
        eid = selectUsermasterlist[0].Id;
        EmpSts = selectUsermasterlist[0].appSuperviserSts;
        dept = await Helper.getTrialDept(OldOrg);
        desg = await Helper.getTrialDesg(OldOrg);
        shift = await Helper.getTrialShift(OldOrg);

        if (COUNT == 1 && EmpSts == 1) {
          const updateQuery: any = await Database.from("EmployeeMaster ")
            .where("OrganizationId", NewOrg)
            .andWhere("Id", Empid)
            .update({
              Department: dept,
              Designation: desg,
              Shift: shift,
            });
          CountFlag = CountFlag + updateQuery;

          const updateQuery2: any = await Database.from("UserMaster")
            .where("OrganizationId", NewOrg)
            .andWhere("EmployeeId", Empid)
            .update({
              OrganizationId: OldOrg,
            });
          CountFlag = CountFlag + updateQuery2;

          const updateQuery3: any = await Database.from("AttendanceMaster")
            .where("OrganizationId", NewOrg)
            .andWhere("EmployeeId", Empid)
            .update({
              OrganizationId: OldOrg,
              ShiftId: shift,
              Dept_id: dept,
              Desg_id: desg,
            });
          CountFlag = CountFlag + updateQuery3;

          const updateQuery4: any = await Database.from("InterimAttendances")
            .where("OrganizationId", NewOrg)
            .andWhere("EmployeeId", Empid)
            .update({
              OrganizationId: OldOrg,
            });
          CountFlag = CountFlag + updateQuery4;

          if (CountFlag > 0) {
            deleteQuery = await Database.from("ShiftMaster")
              .where("OrganizationId", NewOrg)
              .delete();
            deleteQuery = await Database.from("ShiftMasterChild")
              .where("OrganizationId", NewOrg)
              .delete();

            deleteQuery = await Database.from("DepartmentMaster")
              .where(" OrganizationId", NewOrg)
              .delete();
            deleteQuery = await Database.from("DesignationMaster")
              .where("OrganizationId", NewOrg)
              .delete();
            deleteQuery = await Database.from("licence_ubiattendance")
              .where("OrganizationIdd", NewOrg)
              .delete();
            deleteQuery = await Database.from("Organization")
              .where("Id", NewOrg)
              .delete();
          }
        } else {
          UpdateQuery = await Database.from("EmployeeMaster")
            .where("OrganizationId", NewOrg)
            .andWhere("Id", Empid)
            .update({
              Department: dept,
              Designation: desg,
              Shift: shift,
              OrganizationId: OldOrg,
            });
          UpdateQuery = await Database.from("UserMaster")
            .where("OrganizationId", NewOrg)
            .andWhere("Id", Empid)
            .update({
              OrganizationId: OldOrg,
            });
        }
        UpdateQuery = await Database.from("PreventSignup")
          .where("Status", 0)
          .andWhere("EmployeeId ", Empid)
          .andWhere("OrganizationId", NewOrg)
          .update({
            Status: 1,
          });
      }

      result["status"] = 1;
      if (result["status"] == 1) {
        const selectMail = await Database.from("All_mailers")
          .select(" Body", "Subject")
          .where("Id", 39);
        var rows = selectMail;
        if (rows) {
          body = rows[0].Body;
          subject = rows[0].Subject;
        }

        body1 = body.replace("{Admin Name}", Admin_Name);
        message_body = body1.replace("{Employee Name}", EmployeeName);
        var headers = "MIME-Version: 1.0" + "\r\n";
        headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
        headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";

        // console.log(AdminEmail)
        // AdminEmail = "pbatham21@gmail.com";       ////for testing
        // console.log(AdminEmail);

        await Helper.sendEmail(AdminEmail, subject, message_body, headers);
      }
    } else {
      const updatePreventSignup = await Database.from("PreventSignup")
        .where("Status", 0)
        .andWhere("EmployeeId", Empid)
        .andWhere("OrganizationId", NewOrg)
        .update({
          Status: 2,
        });
      result["status"] = 0;
      if (result["status"] == 0) {
        const selectMail = await Database.from("All_mailers")
          .select(" Body", "Subject")
          .where("Id", 39);
        var rows = selectMail;
        if (rows) {
          body = rows[0].Body;
          subject = rows[0].Subject;
        }
        body1 = body.replace("{Admin Name}", Admin_Name);
        message_body = body1.replace("{Employee Name}", EmployeeName);
        var headers = "MIME-Version: 1.0" + "\r\n";
        headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
        headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";

        // AdminEmail = "pbatham21@gmail.com";       ////for testing
        // console.log(AdminEmail);

        await Helper.sendEmail(AdminEmail, subject, message_body, headers);
      }
    }
    return result;
  }
}
