import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from 'luxon';
import moment from 'moment-timezone';


export default class DepartmentService {

  public static async getdepartment(data) {

    interface department {
      Id: number,
      Name: string,
      OrganizationId: number,
      archive: number,
    }

    var begin = (data.currentpage - 1) * data.perpage;
    var limit;
    var offset;

    if (data.currentdate != 0 && data.pagename == 'DepartmentList') {
      limit = data.perpage;
      offset = begin;
    }

    const departmentList = await Database.from('DepartmentMaster').select('Id', Database.raw(`if(LENGTH("Name") > 30, concat(SUBSTR("Name", 1, 30), '....'), Name) as Name ,'archive'`)).where('OrganizationId', data.OrganizationId).orderBy('Name').limit(limit).offset(offset);


    var result: department[] = [];         //declared result as an empty array with type department

    departmentList.forEach((row) => {
      const data: department = {
        Id: row.Id,
        Name: row.Name,
        OrganizationId: row.OrganizationId,
        archive: row.archive
      }
      result.push(data)
    });
    return result;

  }

  public static async addDepartment(data) {
    var currentdate = new Date();
    var result = [];

    const query = await Database.from("DepartmentMaster").select('Id')
      .where("Name", data.Name)
      .andWhere("OrganizationId", data.OrganizationId);

    if (query.length > 0) {
      result['status'] = '-1';
      return result['status'];

    }
    const query1 = await Database.insertQuery()
      .table("DepartmentMaster")
      .insert({
        Name: data.Name,
        OrganizationId: data.OrganizationId,
        CreatedDate: currentdate,
        CreatedById: data.Id,
        LastModifiedDate: currentdate,
        LastModifiedById: data.Id,
        OwnerId: data.Id,
        archive: data.archive,
      });

    if (query1.length > 0) {

      var zone = await Helper.getTimeZone(data.OrganizationId);
      var timeZone = zone[0]?.name;
      var defaulttimeZone = moment().tz(timeZone).toDate();
      const dateTime = DateTime.fromJSDate(defaulttimeZone);    //converts the JavaScript Date object to a Luxon DateTime
      const formattedDate = dateTime.toFormat('yy-MM-dd HH:mm:ss');
      var actionPerformed = await Helper.getempnameById(data.Id);
      var uid = data.Id;
      var module = "Attendance app";
      var appModule = "Department";
      var activityby = 1;

      const query2 = await Database.insertQuery().table('ActivityHistoryMaster')
        .insert({
          LastModifiedDate: formattedDate,
          LastModifiedById: uid,
          ActionPerformed: actionPerformed,
          Module: module,
          OrganizationId: data.OrganizationId,
          ActivityBy: activityby,
          adminid: uid,
          AppModule: appModule
        })

      result['status'] = '1';
    }

    return result['status'];

  }


  public static async updateDepartment(data) {

    var result = [];
    result['status'] = '0';
    const date = DateTime.now();
    const formattedDate = date.toFormat('yy-MM-dd');
    var orgid = await Helper.getName(data.Id);
    var uid = data.Id;

    var query = await Database.from("DepartmentMaster")
      .select("Id")
      .where("Id", uid)
      .andWhere("OrganizationId", orgid)
      .andWhere("Name", data.Name);

      
    if (query.length > 0) {
      result['status'] = '-1';
      return result['status'];
    }

    const query1 = await Database.from('DepartmentMaster').select('Name', 'archive').where('OrganizationId', orgid).andWhere('Id', uid);
    query = query1;
    var name;
    var sts1;

    query1.forEach((row) => {
      name = row.Name;
      sts1 = row.archive;
    })

    var r;
    if (name != data.Name) {
      r = 2;
    }
    else if (name == data.Name || sts1 != data.archive) {
      r = data.archive;
    }

    const query2 = await Database.query()
      .from("DepartmentMaster")
      .where("Id", uid)
      .update({
        Name: data.Name,
        LastModifiedDate: formattedDate,
        LastModifiedById: uid,
        archive: data.archive,
      });

    var count = query.length;
    if (count > 0) {
      var zone = await Helper.getTimeZone(orgid);
      var timeZone = zone[0]?.name;
      var defaulttimeZone = moment().tz(timeZone).toDate();
      const dateTime = DateTime.fromJSDate(defaulttimeZone);
      const formattedDate = dateTime.toFormat('yy-MM-dd HH:mm:ss');
      var id = uid;
      var module = "Attendance app";
      var appModule = "Department";
      var actionperformed;

      if (r == 2) {
        actionperformed = await Helper.getempnameById(uid) + data.Name;
        return 'yes'

      }

      else if (r == 1) {
        actionperformed = await Helper.getempnameById(uid) + data.Name
        return 'no'
      }
      else {
        actionperformed = await Helper.getempnameById(uid) + data.Name
        return 'too'
      }

      var activityBy = 1;

      const query3 = await Database.table('ActivityHistoryMaster').insert({
        LastModifiedDate: formattedDate,
        LastModifiedById: uid,
        Module: module,
        ActionPerformed: actionperformed,
        OrganizationId: orgid,
        ActivityBy: activityBy,
        adminid: uid,
        AppModule: appModule
      })
      result['status'] = 1;
    }

    // return result['status'];
  }
}
