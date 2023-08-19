import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
// import { Connection } from "mysql2/typings/mysql/lib/Connection";
// const moment = require("moment-timezone");

export default class DesignationService {
  public static async AddDesignation(a) {
    const currentDate = new Date();
     console.log(currentDate);
     
  
    var designationList = await Database.query()
      .from("DesignationMaster")
      .where("Name", a.name)
      .andWhere("OrganizationId", a.orgid)
      .select("Id");
      console.log(designationList);
   

    const result: any = [];

     const affectedRows = designationList.length;
    console.log(affectedRows)

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
        archive: '1',
        daysofnotice: "YourDaysOfNoticeValue",
        add_sts: "YourAddStsValue",
      });

    const affectedRows2 = insertDesignation.length;

    if (affectedRows2 > 0) {
      // const timezone = await Helper.getTimeZone(a.orgid);

      // const currentDateTime = moment().tz(timezone);
      // const date = new Date();
      // const module = "Attendance app";
      const appModule = "Designation";
      const activityby = 1;
      const actionPerformed = await Helper.getempnameById(a.uid);

    await Database.insertQuery()
        .table("ActivityHistoryMaster")
        .insert({
          LastModifiedDate: formattedDate,
          LastModifiedById: a.uid,
          ActionPerformed: actionPerformed,
          Module: module,
          OrganizationId: a.orgid,
          ActivityBy: activityby,
          adminid: a.uid,
          AppModule: appModule,
        });
      result["status"] = 1;
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
    // const currentDate = new Date();

    const result = await designationList;
    // const s: any[] = [];
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

  // Update designation Method
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

     await designationList2;
    // const count3 = designationList2.length;

    //let res: any ;
    if (name != c.UpdateName) {
    //  res = 2;
    } else if (name == c.UpdateName && c.sts != sts1) {
     // res = c.sts;
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
      const zone = timezone;
      console.log(zone);
      // const currentDateTime = moment().tz(zone);

      // const date = new Date();
      // const module = "Attendance app";
      const appModule = "Designation";

      let actionperformed;
      var activityBy = 1;
      var getempname = await Helper.getempnameById(c.Updateid);

      // const activityby = 1;
       await Database.insertQuery()
        .table("ActivityHistoryMaster")
        .insert({
          ActionPerformed: actionperformed,
          AppModule: appModule,
          LastModifiedById: c.uid,
          LastModifiedDate: formattedDate,
          Module: module,
          OrganizationId: c.orgid,
          ActivityBy: activityBy,
          adminid: c.uid,
        });
      result["status"] = "inserted in activity master";
    }
    return result["status"];
  }
}
