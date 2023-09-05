import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
const moment = require("moment-timezone");
import { DateTime } from "luxon";
import EmployeeMaster from "App/Models/EmployeeMaster";
export default class DesignationService {
  public static async AddDesignation(a) {
    const currentDate = new Date();

    var designationList = await Database.query()
      .from("DesignationMaster")
      .where("Name", a.name)
      .andWhere("OrganizationId", a.orgid)
      .select("Id");

    const result: any = [];

    const affectedRows = designationList.length;

    if (affectedRows > 0) {
      result["status"] = -1;
      return "user already exist in this list";
    }

    var insertDesignation = await Database.insertQuery()
      .table("DesignationMaster")
      .insert({
        Name: a.name,
        OrganizationId: a.orgid,
        CreatedDate: currentDate,
        CreatedById: a.uid,
        LastModifiedDate: currentDate,
        LastModifiedById: a.uid,
        OwnerId: a.uid,
        Code: 8,
        RoleId: 9,
        Description: a.desc,
        archive: "1",
        daysofnotice: "YourDaysOfNoticeValue",
        add_sts: "YourAddStsValue",
      });

    const affectedRows2 = insertDesignation.length;

    if (affectedRows2 > 0) {
      const timezone = await Helper.getTimeZone(a.orgid);

      var defaulttimeZone = moment().tz(timezone).toDate();
      const dateTime = DateTime.fromJSDate(defaulttimeZone);
      const formattedDate = dateTime.toFormat("yy-MM-dd HH:mm:ss");

      const module = "Attendance app";
      const appModule = "Designation";
      const activityby = 1;
      const actionPerformed = await Helper.getempnameById(a.uid);

      const actionperformed2 = `<b>${a.name}</b> Designation  has been Added by 
       <b>${actionPerformed}</b>from Attendance App`;

      const insertActivityHistoryMaster = await Helper.ActivityMasterInsert(
        formattedDate,
        a.orgid,
        a.uid,
        activityby,
        module,
        actionperformed2,
        appModule
      );
      result["status"] = "Successfully Inserted in ActivityMasterInsert";
    }
    return result["status"];
  }

  public static async getDesignation(a) {
    const begin = (a.currentpage - 1) * a.perpage;

    let getDesignationList: any = Database.from("DesignationMaster")
      .select(
        "Id",
        "OrganizationId",
        Database.raw(
          "IF(LENGTH(`Name`) > 30, CONCAT(SUBSTR(`Name`, 1, 30), '...'), `Name`) AS `Name`"
        ),
        "archive"
      )
      .where("OrganizationId", a.orgid)
      .orderBy("Name", "asc")
      .limit(5);

    if (a.currentpage != 0 && a.pagename == 0) {
      getDesignationList = getDesignationList.offset(begin).limit(a.perpage);
    }

    if (a.status != undefined) {
      getDesignationList = getDesignationList.where("Archive", a.status);
    }

    const result = await getDesignationList;
    var res = 0;
    result.forEach(function (val) {
      const data: any = {};
      data["name"] = val.Name;
      data["archive"] = val.archive;
      const Name = data["name"];

      const archive = data["archive"];
      if (Name.toUpperCase() == "TRIAL DESIGNATION" && archive === 1) {
        res = 1;
      }
    });

    if (res == 1) {
      getDesignationList = Database.from("DesignationMaster")
        .select(
          "Id",
          Database.raw(
            "IF(LENGTH(`Name`) > 30, CONCAT(SUBSTR(`Name`, 1, 30), '...'), `Name`) AS `Name`"
          ),
          "archive"
        )
        .where("OrganizationId", a.orgid)
        .orderBy("name", "asc");
    }

    return getDesignationList;
  }

  public static async updateDesignation(c) {
    const result: any[] = [];

    result["status"] = 0;

    let curdate = new Date();

    const getDesignationList = await Database.from("DesignationMaster")
      .select("Id")
      .where("Name", c.UpdateName)
      .andWhere("OrganizationId", c.Updateorgid)
      .andWhere("Id", c.Updateid);

    const Result: any = await getDesignationList;
    const response = Result.length;

    if (response > 0) {
      result["status"] = "User already exist in this is id";
      return result["status"];
    }
    const getDesignationList2 = await Database.from("DesignationMaster")
      .select("Name", "archive")
      .where("OrganizationId", c.Updateorgid)
      .where("Id", c.Updateid);
    let name = "";
    let sts1 = "";

    var res: any = "";
    if (name != c.UpdateName) {
      res = 2;
    } else if (name == c.UpdateName && c.sts != sts1) {
      res = c.sts;
    }

    var updateDesignaion: any = await Database.query()
      .from("DesignationMaster")
      .where("id", c.Updateid)
      .update({
        Name: c.UpdateName,
        LastModifiedDate: curdate,
        LastModifiedById: c.Updateid,
        archive: c.sts,
        OrganizationId: c.Updateorgid,
      });

    const count = await updateDesignaion;
    if (count > 0) {
      const timezone = await Helper.getTimeZone(c.Updateorgid);
      var defaulttimeZone = moment().tz(timezone).toDate();

      const dateTime = DateTime.fromJSDate(defaulttimeZone);
      const formattedDate = dateTime.toFormat("yy-MM-dd HH:mm:ss");

      const module = "Attendance app";
      const appModule = "Designation";

      let actionperformed;
      var activityBy = 1;
      var getempname = await Helper.getempnameById(c.Updateid);

      if (res == 2) {
        actionperformed = `<b>${c.UpdateName}</b>. designation has been edited by <b>${getempname}</b> `;
      } else if (res == 1) {
        actionperformed = `<b>${c.UpdateName}</b> designation has been active by <b>${getempname}</b>`;
      } else {
        actionperformed = `<b>${c.UpdateName}</b> designation has been inactive by <b>${getempname}</b> `;
      }

      const insertActivityHistoryMaster: any =
        await Helper.ActivityMasterInsert(
          formattedDate,
          c.orgid,
          c.uid,
          activityBy,
          appModule,
          actionperformed,
          module
        );
      result["status"] = "inserted in activity master";
    }
    return result["status"];
  }

  ///////////// AssignDesignation //////////
  public static async assignDesignation(get) {
    var updateDesignaionset = await EmployeeMaster.query()
      .where("Id", get.empid)
      .andWhere("OrganizationId", get.Orgid)
      .update("Designation", get.desigid);

    if (updateDesignaionset.length > 0) {
      const zone = await Helper.getTimeZone(get.Orgid);
      const timezone = zone;
      const date = moment().tz(timezone).toDate();

      const orgid = get.Orgid;
      const uid = get.adminid;
      const module = "Attendance app";
      const activityBy = 1;
      const appModule = "Update Successfully";
      const actionperformed = `<b>${get.designame}</b>. Designation has been assigned to <b>${get.empname}</b> by <b>${get.adminname}</b> from <b>${module}</b>`;

      var getresult = await Helper.ActivityMasterInsert(
        date,
        orgid,
        uid,
        activityBy,
        appModule,
        actionperformed,
        module
      );
      if (getresult) {
        return "Successfully Inserted in ActivityMasterInsert";
      } else {
        return "Error inserting activity history";
      }
    } else {
      return "Error inserting activity history";
    }
  }

    // GetDesignationStatus

  public static async DesignationStatus(get) {
    var Orgid = get.orgid;
    var DesigId = get.Id;

    const selectEmployeeList = await Database.from("EmployeeMaster")
      .select(Database.raw("COUNT(*) as num"))
      .where("OrganizationId", Orgid)
      .andWhere(" Designation", DesigId)

    const result = await selectEmployeeList;
    const selectAttendanceMasterList = await Database.from("AttendanceMaster")
      .select(Database.raw("COUNT(*) as  totemp"))
      .where("Desg_id", DesigId)
      .andWhere("OrganizationId", Orgid);

    const result2 = await selectAttendanceMasterList;
    return {
      num: result[0].num,
      attNum: result2[0].totemp,
    };
  }
}
