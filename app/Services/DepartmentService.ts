import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from 'luxon';

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


    var result: department[] = [];         //declared res as an empty array with type department

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
      // return result;
      return false;
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

      var zone = Helper.getTimeZone(data.OrganizationId);
      const formatteDate = new Intl.DateTimeFormat([],);
      const now = DateTime.local();
      const formattedDate = now.toFormat('yy-MM-dd HH:mm:ss');
      var uid = data.Id;
      var module = "Attendance app";
      var appModule = "Department";
      var activityby = 1;

      const query2 = await Database.insertQuery().table('ActivityHistoryMaster')
        .insert({
          LastModifiedDate: formattedDate,
          LastModifiedById: uid,
          Module: module,
          OrganizationId: data.OrganizationId,
          ActivityBy: activityby,
          adminid: uid,
          AppModule: appModule
        })

    }
    result['status'] = '1';
    return result['status'];

  }


  public static async updateDepartment(data) {
    var currentdate = new Date();

    const query = await Database.from("DepartmentMaster")
      .select("Id", "OrganizationId", "Name")
      .where("Id", data.Id)
      .andWhere("OrganizationId", data.OrganizationId)
      .andWhere("Name", data.Name);
    if (query.length > 0) {
      return false;
    }

    const query2 = await Database.query()
      .from("DepartmentMaster")
      .where("Id", data.Id)
      .update({
        Name: data.Name,
        LastModifiedDate: currentdate,
        LastModifiedById: data.LastModifiedById,
        archive: data.archive,
      });

    return query2;
  }
}
