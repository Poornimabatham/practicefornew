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


    var result: department[] = []; //declared result as an empty array with type department

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
    const insertQuery = await Database.insertQuery()
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

    if (insertQuery.length > 0) {

      var zone = await Helper.getTimeZone(data.OrganizationId);
      var timeZone = zone;
      var defaulttimeZone = moment().tz(timeZone).toDate();
      const dateTime = DateTime.fromJSDate(defaulttimeZone);    //converts the JavaScript Date object to a Luxon DateTime
      const formattedDate = dateTime.toFormat('yy-MM-dd HH:mm:ss');
      var actionPerformed = await Helper.getempnameById(data.Id);
      var uid = data.Id;
      var module = "Attendance app";
      var appModule = "Department";
      var activityBy = 1;

      await Database.insertQuery().table('ActivityHistoryMaster')
        .insert({
          LastModifiedDate: formattedDate,
          LastModifiedById: uid,
          ActionPerformed: actionPerformed,
          Module: module,
          OrganizationId: data.OrganizationId,
          ActivityBy: activityBy,
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
    var DeptId = data.DId;
    var orgId = data.OrganizationId;

    var selectQuery = await Database.from("DepartmentMaster")
      .select("Id")
      .where("Id", DeptId)
      .andWhere("OrganizationId", orgId)
      .andWhere("Name", data.Name)
      .andWhere("archive", data.archive);

    if (selectQuery.length > 0) {
      result['status'] = '-1'; /// department already exist
      return false
    }  

    const query1 = await Database.from('DepartmentMaster').select('Name', 'archive').where('OrganizationId', orgId).andWhere('Id', DeptId);

    var name;
    var status;

    query1.forEach((row) => {
      name = row.Name;
      status = row.archive;
    })

    var archiveStatus;
    if (name != data.Name) {
      archiveStatus = 2;
    }

    else if (name == data.Name && status != data.archive) {
      archiveStatus = data.archive;
    }
    const updateQuery = await Database.query()
      .from("DepartmentMaster")
      .where("Id", DeptId)
      .update({
        Name: data.Name,
        LastModifiedDate: formattedDate,
        LastModifiedById: DeptId,
        archive: data.archive,
      });

    if (updateQuery) {

      var zone = await Helper.getTimeZone(orgId);
      var timeZone = zone;
      var defaulttimeZone = moment().tz(timeZone).toDate();
      const dateTime = DateTime.fromJSDate(defaulttimeZone);
      const formattedDate = dateTime.toFormat('yy-MM-dd HH:mm:ss');
      var module = "Attendance app";
      var appModule = "Department";
      var actionperformed;
      var activityBy = 1;
      var getEmpName = await Helper.getEmpName(data.EmpID)       //getemployeeName

      if (archiveStatus == 2) {
        actionperformed = ` ${data.Name} department has been edited by ${getEmpName} `;
      }

      else if (archiveStatus == 1) {
        actionperformed = `${data.Name} department has been active by ${getEmpName} `;
      }

      else {
        actionperformed = `${data.Name} department has been inactive by ${getEmpName} `;
      }

      await Database.table('ActivityHistoryMaster').insert({
        LastModifiedDate: formattedDate,
        LastModifiedById: DeptId,
        Module: module,
        ActionPerformed: actionperformed,
        OrganizationId: orgId,
        ActivityBy: activityBy,
        adminid: DeptId,
        AppModule: appModule
      })
      result['status'] = 1;
    }

    return result['status'];
  }
}
