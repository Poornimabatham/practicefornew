import Database from "@ioc:Adonis/Lucid/Database";
// import moment from "moment";
import Helper from "App/Helper/Helper";
// import { Connection } from "mysql2/typings/mysql/lib/Connection";
// const moment = require("moment-timezone");

export default class DesignationService {
  // Insert Designation method
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
      return "user already exist";
    }

    var insertDesignation = await Database.insertQuery()
      .table("DesignationMaster")
      .insert({
        Name: a.name,
        OrganizationId: a.orgid,
        CreatedDate: currentDate,
        CreatedById: 1,
        LastModifiedDate: currentDate,
        LastModifiedById: 2,
        OwnerId: 3,
        Code: 8,
        RoleId: 9,
        HRSts: a.sts,
        Description: "YourDescriptionValue",
        archive: "YourArchiveValue",
        daysofnotice: "YourDaysOfNoticeValue",
        sts: a.sts,
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
          LastModifiedDate: currentDate,
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
  // Fetch data method
  public static async getDesignation(a) {
    const begin = (a.currentpage - 1) * a.perpage;

    let designationList: any = Database.from("DesignationMaster")
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
      designationList = designationList.offset(begin).limit(a.perpage);
    }

    if (a.status != undefined) {
      designationList = designationList.where("Archive", a.status);
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
      designationList = Database.from("DesignationMaster")
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

    return designationList;
  }








  // Update designation Method
  public static async updateDesignation(c) {


   
    const result: any[] = [];

    result["status"] = 0;

    let curdate = new Date();

    const designationList = await Database.from("DesignationMaster")
      .select("Id")
      .where("Name", c.UpdateName)
      .andWhere("OrganizationId", c.Updateorgid)
      .andWhere("Id", c.Updateid);

    const Result: any = await designationList;
    const r = Result.length;
    

    if (r > 0) {
      result["status"] = -1;
      return result["status"];
      // if dept already exists
      return false;
    }
    const designationList2 = await Database.from("DesignationMaster")
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

      let actionperformed = await Helper.getempnameById(c.Updateid);

      // const activityby = 1;
       await Database.insertQuery()
        .table("ActivityHistoryMaster")
        .insert({
          ActionPerformed: actionperformed,
          AppModule: appModule,
        });
      result["status"] = 1;
      return result;

    } 
  }
}
