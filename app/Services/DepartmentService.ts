import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
import moment from "moment-timezone";
import EmployeeMaster from "App/Models/EmployeeMaster";

export default class DepartmentService {
  public static async getdepartment(data) {
    interface department {
      Id: number;
      Name: string;
      OrganizationId: number;
      archive: number;
    }

    var begin = (data.currentpage - 1) * data.perpage;
    var limit;
    var offset;

    if (data.currentdate != 0 && data.pagename == "DepartmentList") {
      limit = data.perpage;
      offset = begin;
    }

    const departmentList = await Database.from("DepartmentMaster")
      .select(
        "Id",
        Database.raw(
          `if(LENGTH("Name") > 30, concat(SUBSTR("Name", 1, 30), '....'), Name) as Name ,'archive'`
        )
      )
      .where("OrganizationId", data.OrganizationId)
      .orderBy("Name")
      .limit(limit)
      .offset(offset);

    var result: department[] = []; //declared result as an empty array with type department

    departmentList.forEach((row) => {
      const data: department = {
        Id: row.Id,
        Name: row.Name,
        OrganizationId: row.OrganizationId,
        archive: row.archive,
      };
      result.push(data);
    });
    return result;
  }

  public static async addDepartment(data) {
    var currentdate = new Date();
    var result = [];

    const query = await Database.from("DepartmentMaster")
      .select("Id")
      .where("Name", data.Name)
      .andWhere("OrganizationId", data.OrganizationId);

    if (query.length > 0) {
      result["status"] = "-1";
      return result["status"];
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
      const dateTime = DateTime.fromJSDate(defaulttimeZone); //converts the JavaScript Date object to a Luxon DateTime
      const formattedDate = dateTime.toFormat("yy-MM-dd HH:mm:ss");
      var actionPerformed = await Helper.getempnameById(data.Id);
      var uid = data.Id;
      var module = "Attendance app";
      var appModule = "Department";
      var activityBy = 1;

      await Database.insertQuery().table("ActivityHistoryMaster").insert({
        LastModifiedDate: formattedDate,
        LastModifiedById: uid,
        ActionPerformed: actionPerformed,
        Module: module,
        OrganizationId: data.OrganizationId,
        ActivityBy: activityBy,
        adminid: uid,
        AppModule: appModule,
      });

      result["status"] = "1";
    }

    return result["status"];
  }

  public static async updateDepartment(data) {
    var result = [];
    result["status"] = "0";
    const date = DateTime.now();
    const formattedDate = date.toFormat("yy-MM-dd");
    var orgId = data.OrganizationId;
    var DeptId = data.DId;

    var selectQuery = await Database.from("DepartmentMaster")
      .select("Id")
      .where("Id", DeptId)
      .andWhere("OrganizationId", orgId)
      .andWhere("Name", data.Name)
      .andWhere("archive", data.archive);

    if (selectQuery.length > 0) {
      result["status"] = "-1";
      return false;
    }

    const query1 = await Database.from("DepartmentMaster")
      .select("Name", "archive")
      .where("OrganizationId", orgId)
      .andWhere("Id", DeptId);

    var name;
    var status;

    query1.forEach((row) => {
      name = row.Name;
      status = row.archive;
    });

    var archiveStatus;
    if (name != data.Name) {
      archiveStatus = 2;
    } else if (name == data.Name && status != data.archive) {
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
      const formattedDate = dateTime.toFormat("yy-MM-dd HH:mm:ss");
      var module = "Attendance app";
      var appModule = "Department";
      var actionperformed;
      var activityBy = 1;
      var getEmpName = await Helper.getEmpName(data.adminId); //getemployeeName

      if (archiveStatus == 2) {
        actionperformed = ` ${data.Name} department has been edited by ${getEmpName} `;
      } else if (archiveStatus == 1) {
        actionperformed = `${data.Name} department has been active by ${getEmpName} `;
      } else {
        actionperformed = `${data.Name} department has been inactive by ${getEmpName} `;
      }

      await Database.table("ActivityHistoryMaster").insert({
        LastModifiedDate: formattedDate,
        LastModifiedById: DeptId,
        Module: module,
        ActionPerformed: actionperformed,
        OrganizationId: orgId,
        ActivityBy: activityBy,
        adminid: DeptId,
        AppModule: appModule,
      });
      result["status"] = 1;
    }

    return result["status"];
  }

  ///////////// assignDepartment //////////
  public static async assignDepartment(get) {
    var updateDepartmentset = await EmployeeMaster.query()
      .where("Id", get.empid)
      .andWhere("OrganizationId", get.Orgid)
      .update("Department", get.deptid);

    if (updateDepartmentset.length > 0) {
      const zone = await Helper.getTimeZone(get.Orgid);
      const timezone = zone;
      const date = moment().tz(timezone).toDate();

      const orgid = get.Orgid;
      const uid = get.adminid;
      const module = "Attendance app";
      const activityBy = 1;
      const appModule = "Update Successfully";
      const actionperformed = `<b>${get.deptname}</b>. Department has been assigned to <b>${get.empname}</b> by <b>${get.adminname}</b> from <b>${module}</b>`;

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
        return "Error inserting ActivityMasterInsert";
      }
    } else {
      return "Error inserting ActivityMasterInsert";
    }
  }

  // GetDepartmentStatus

  public static async DepartmentStatus(get) {
    var orgId = get.orgid;
    var deptId = get.Id;
    const selectEmployeeList = await Database.from("EmployeeMaster")
      .select(Database.raw("COUNT(*) as num"))
      .where("OrganizationId", orgId)
      .andWhere("Department", deptId)
      .andWhere("Is_Delete", "!=", 2);

    const result = await selectEmployeeList;
    const selectAttendanceMasterList = await Database.from("AttendanceMaster")
      .select(Database.raw("COUNT(*) as  totemp"))
      .where("Dept_id", deptId)
      .andWhere("OrganizationId", orgId);

    const result2 = await selectAttendanceMasterList;
    return {
      num: result[0].num,
      attNum: result2[0].totemp,
    };
  }

  public static async getDeptEmp(data){

    const orgId = data.orgid;
    const deptid = data.deptid;
    const empid = data.empid;
    const datafor = data.datafor;
    let res:any = {};
    const zone = await Helper.getTimeZone(orgId);
    const defaultZone = DateTime.now().setZone(zone);  
    let date = defaultZone.toFormat("yyyy-MM-dd");
    let predate = defaultZone.minus({ days: 1 }).toFormat("yyyy-MM-dd");
    let status = false
    let successMsg = "";
    let weekofflg = false;
    let halfflg = false;

    if(datafor == "Yesterday"){
      date = predate;
      res['data_date'] = predate;
    }else{
      res['data_date'] = date;     
    }

    
    let holidayquery = await Database.query().from('HolidayMaster').select('Id').where('OrganizationId',orgId).andWhere(Database.raw(`"${date}" between DateFrom and DateTo`))

    let holidaycount = holidayquery.length;

    let adminstatus = await Helper.getAdminStatus(empid); 

    let query = Database.query().from('EmployeeMaster').select('Id','EmployeeCode','InPushNotificationStatus','OutPushNotificationStatus','FirstName','LastName','Shift','ImageName').where('OrganizationId',orgId).andWhere('Is_Delete',0).andWhere('archive',"!=",0).andWhere('DOL','0000-00-00').andWhere('DOL','>=',date).orderBy('FirstName','asc')

    if(adminstatus == 2)
    {
       var dptid = await Helper.getDepartmentIdByEmpID(empid);
       query = query.andWhere("Department",dptid)
    }
    if(datafor=='')
    {
       query = query.andWhere(Database.raw(`Id not in (select EmployeeId from AttendanceMaster where AttendanceDate="${date}" and OrganizationId = "${orgId}")`));
    }
    if(datafor=='Yesterday')
    {
       query = query.andWhere(Database.raw(`Id in (select EmployeeId from AttendanceMaster where  AttendanceDate="${date}" and OrganizationId ="${orgId}" and ((TimeIn!='00:00:00' AND TimeOut !='00:00:00' and device ='Auto Time Out' AND Timein = Timeout )))`));
    }else{
       query = query.andWhere(Database.raw(`Id not in (select EmployeeId from AttendanceMaster where  AttendanceDate="${date}" and OrganizationId ="${orgId}" and ((TimeIn!='00:00:00' AND TimeOut!='00:00:00') or AttendanceStatus=2))`));
    }

   let querydata = await query
 
   let count = querydata.length
   if(count >= 1){
      
      status = true;
      successMsg = count +" record found";
      querydata.forEach(element => {

        res['OutPushNotificationStatus'] = element.OutPushNotificationStatus;
        res['InPushNotificationStatus'] = element.InPushNotificationStatus;
        res['empid'] = element.Id;
        let dayOfMonth = defaultZone.day;    
        let weekNumber = Math.ceil(dayOfMonth / 7);
        let dayofdate = 1 + defaultZone.weakday;

 
        


        
      });
   }
  }



  public static async getEmpdataDepartmentWiseCount(getdata) {

    const orgId = getdata.orgId;
    const inpdate = getdata.date;
    const formattedInpDate = inpdate.toFormat("yyyy-MM-dd");
    const zone = await Helper.getTimeZone(orgId);
    const defaultZone = DateTime.now().setZone(zone);
    const todayDate = DateTime.now().toISODate();
    const currenttime: string = defaultZone.toFormat("HH:mm:ss")
    var data = {};
    data['departments'] = 0;
    data['present'] = 0;
    data['absent'] = 0;
    data['total'] = 0;
    var selectCountQuery;

    if (formattedInpDate == todayDate) {
      selectCountQuery = await Database.from('DepartmentMaster').select(
        Database.raw(`(select count(id) from EmployeeMaster where OrganizationId = ${orgId} and Is_Delete=0 and archive = 1 )  as total`),
        Database.raw(`(select count(id) from AttendanceMaster where AttendanceStatus in (1,4,8) AND AttendanceDate = '${todayDate}' and OrganizationId=${orgId})  as 'present'`),
        Database.raw(`(Select count(Id) from EmployeeMaster where OrganizationId = ${orgId} AND Is_Delete=0 and archive = 1 AND ( ID NOT IN (SELECT EmployeeId from AttendanceMaster  where OrganizationId = ${orgId} AND AttendanceStatus in (1,4,8) AND AttendanceDate = '${todayDate}')AND  Shift NOT IN (Select id from ShiftMaster where OrganizationId = ${orgId} AND TimeIn > '${currenttime}')) ) as absent`)
      )
        .where('OrganizationId', orgId)
        .count('Id as departments');

      if (selectCountQuery.length > 0) {
        selectCountQuery.forEach((row) => {
          data['departments'] = row.departments;
          data['total'] = row.total;
          data['present'] = row.present;
          data['absent'] = row.absent;
        })
      }
    }

    else {
      var selectCountQuery1 = await Database.from('DepartmentMaster').select(
        Database.raw(`(select count(id) from EmployeeMaster where OrganizationId = ${orgId} and Is_Delete=0 and archive = 1 )  as total`),
        Database.raw(`(select count(id) from AttendanceMaster where AttendanceStatus in (1,4,8) AND AttendanceDate = '${formattedInpDate}' and OrganizationId=${orgId})  as present`),
        Database.raw(`(Select count(Id) from EmployeeMaster where OrganizationId = ${orgId} AND Is_Delete=0 and archive = 1 AND ( ID NOT IN (SELECT EmployeeId from AttendanceMaster  where OrganizationId = ${orgId} AND AttendanceStatus in (1,4,8) AND AttendanceDate = '${formattedInpDate}')))  as absent`)
      )
        .where('OrganizationId', orgId)
        .count('Id as departments');

      if (selectCountQuery1.length > 0) {
        selectCountQuery1.forEach((row) => {
          data['departments'] = row.departments;
          data['total'] = row.total;
          data['present'] = row.present;
          data['absent'] = row.absent;
        })
      }
    }
    return data
  }
}
