import Database from "@ioc:Adonis/Lucid/Database";
import helper from "../Helper/Helper";
// import * as moment from "moment-timezone";
import moment from "moment-timezone";
import Helper from "../Helper/Helper";
// import LogicsOnly from "./getAttendances_service";
import EmployeeMaster from "App/Models/EmployeeMaster";
// import DepartmentService from "./DepartmentService";
import { DateTime } from "luxon";
export default class ShiftsService {
  constructor() { }

  static async getShiftData(a) {
    //  const currentpage:number = a.currentpage;
    // const perpage:number = a.perpage;
    //const rowperpage:number = (currentpage - 1) * perpage;

    const currentDate = await helper.getCurrentDate();
    const orgid: number = a.OrganizationId;
    type KeyValuePair = { [key: string]: any };
    const keyValueArray: KeyValuePair[] = [];
    keyValueArray.push({ OrganizationId: orgid });
    let conditionarr = keyValueArray[0];
    const data = await Database.query()
      .from("ShiftMaster")
      .select("*")
      .where(conditionarr)
      .orderBy("Name");
    //.offset(rowperpage).limit(perpage);

    let res: number = 0;
    data.forEach((element) => {
      let name: string = element["Name"];
      let archive: number = element["archive"];
      if (name.toUpperCase() == "TRIAL SHIFT" && archive == 1) {
        res = 1;
      }
    });
    let data1: any = "";
    if (res == 1) {
      let archive: number = a.archive;
      keyValueArray[0].archive = archive;
      conditionarr = keyValueArray[0];
      data1 = await Database.query()
        .from("ShiftMaster")
        .select("*")
        .where(conditionarr)
        .orderBy("Name");
      // console.log(data1.toSQL().toNative());
      return data1;
    } else {
      const row = await Database.table("ShiftMaster").returning("id").insert({
        Name: "Trial Shift",
        TimeIn: "09:00:00",
        TimeOut: "18:00:00",
        TimeInGrace: "17:00:00",
        TimeOutGrace: "17:00:00",
        TimeInBreak: "00:00:00",
        TimeOutBreak: "00:00:00",
        OrganizationId: orgid,
        CreatedDate: currentDate,
        CreatedById: 0,
        LastModifiedDate: currentDate,
        LastModifiedById: 0,
        OwnerId: 0,
        BreakInGrace: "00:00:00",
        BreakOutGrace: "00:00:00",
        archive: 1,
        shifttype: 1,
      });
      const id = row[0].id;
      if (id > 0) {
        for (let i = 1; i < 8; i++) {
          // create default weekly off
          await Database.table("ShiftMasterChild").insert({
            ShiftId: id,
            Day: i,
            WeekOff: "0,0,0,0,0",
            OrganizationId: orgid,
            ModifiedBy: 0,
            ModifiedDate: currentDate,
          });
        }

        let archive: number = a.archive;
        keyValueArray[0].archive = archive;
        conditionarr = keyValueArray[0];
        data1 = await Database.query()
          .from("ShiftMaster")
          .select("*")
          .where(conditionarr)
          .orderBy("Name");
        return data1;
      }
    }
    return data1;
  }

  static async createdata(data) {
    const name = data.name;
    const orgid = data.org_id;
    let ti = data.ti;
    let to = data.to;
    const tib = data.tib;
    const tob = data.tob;
    const tig = data.tig ? data.tig : "00:00";
    const tog = data.tog ? data.tog : "00:00";
    const big = data.big ? data.big : "00:00";
    const bog = data.bog ? data.bog : "00:00";
    const sts = data.sts;
    const shifttype1 = data.shifttype;
    const multiplepunches = data.multiplepunches;
    let HoursPerDay1 = "00:00:00";

    const empid = data.empid;
    const empname = await helper.getempnameById(empid);
    const shiftcalendardata = data.shiftcalendardata;
    // Replace single quotes with double quotes in the JSON string
    const string = shiftcalendardata.replace(/'/g, '"');

    // Parse the JSON string into an object
    const result1 = JSON.parse(string);
    if (shifttype1 != "3") {
      ti = ti == "00:00:00" ? "00:01:00" : ti;
      to = to == "00:00:00" ? "23:59:00" : to;
    }

    if (shifttype1 == "2") {
    } else {
      if (HoursPerDay1 == "00:00:00") {
        function parseTime(timeStr: string): Date {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return new Date(0, 0, 0, hours, minutes);
        }

        function formatTimeDiff(timeDiff: number): string {
          const hours = Math.floor(timeDiff / (60 * 60 * 1000));
          const minutes = Math.floor(
            (timeDiff % (60 * 60 * 1000)) / (60 * 1000)
          );
          const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

          return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        const time1 = parseTime(to);
        const time2 = parseTime(ti);

        const timeDiffInMillis = time1.getTime() - time2.getTime();
        HoursPerDay1 = formatTimeDiff(timeDiffInMillis);
      }
      const currentDate: Date = new Date();
      const year: number = currentDate.getFullYear();
      const month: number = currentDate.getMonth() + 1;
      const day: number = currentDate.getDate();

      const date: string = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const result = {};
      const query = await Database.query()
        .from("ShiftMaster")
        .select("*")
        .where("Name", name)
        .andWhere("OrganizationId", orgid);
      const numberOfRows = query.length;
      result["status"] = 0;
      if (numberOfRows > 0) {
        result["status"] = -1;
      } else {
        const row = await Database.table("ShiftMaster").returning("id").insert({
          Name: name,
          TimeIn: ti,
          TimeOut: to,
          TimeInGrace: tig,
          TimeOutGrace: tog,
          TimeInBreak: tib,
          TimeOutBreak: tob,
          OrganizationId: orgid,
          CreatedDate: date,
          CreatedById: empid,
          LastModifiedDate: date,
          LastModifiedById: empid,
          OwnerId: 0,
          BreakInGrace: big,
          BreakOutGrace: bog,
          archive: sts,
          shifttype: shifttype1,
          HoursPerDay: HoursPerDay1,
          MultipletimeStatus: multiplepunches,
        });
        var Id: any = row;
        if (Id > 0) {
          let i = 0;
          let j = 0;
          // var row1: any;
          result1.forEach(async (element) => {
            let day = i++;
            await Database.table("ShiftMasterChild").returning("id").insert({
              ShiftId: Id,
              Day: day,
              WeekOff: element[j],
              OrganizationId: orgid,
              ModifiedBy: empid,
              ModifiedDate: date,
            });
            j++;
          });
          if (i == 7) {
            const zone: any = await helper.getTimeZone(orgid);
            const Zonename = zone[0].name;
            moment.tz.setDefault(Zonename);
            const module: string = "Attendance app";
            const appModule: string = "Shift";
            const actionperformed: string =
              "<b>" +
              name +
              "</b> Shift has been added by <b>" +
              empname +
              "</b> from <b> Attendance App </b>";
            const activityby = 1;
            await Database.table("ActivityHistoryMaster")
              .returning("id")
              .insert({
                LastModifiedDate: date,
                LastModifiedById: empid,
                Module: module,
                ActionPerformed: actionperformed,
                OrganizationId: orgid,
                ActivityBy: activityby,
                adminid: empid,
                AppModule: appModule,
              });
            result["status"] = 1;
          }
        }
      }
      return result;
    }
  }

  //update shift function
  static async updateShift(data) {
    const uid = data.uid;
    const shift = data.shift;
    const sts = data.sts;
    const id = data.id;
    const multiple_timests = data.multiple_timests;
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1;
    const day: number = currentDate.getDate();

    const date: string = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    let result: any = {};
    const orgid: any = await helper.getOrgId(uid);
    const row = await Database.query()
      .from("ShiftMaster")
      .select("*")
      .where("Name", shift)
      .andWhere("OrganizationId", orgid)
      .andWhere("id", "!=", id)
      .orderBy("Name");
    const count = row.length;
    if (count > 0) {
      result["Status"] = "-1";
      return result;
    } else {
      const row2: any = await Database.query()
        .from("ShiftMaster")
        .where("Id", id)
        .andWhere("OrganizationId", orgid)
        .update({
          Name: shift,
          MultipletimeStatus: multiple_timests,
          LastModifiedDate: date,
          archive: sts,
        });
      if (row2 > 0) {
        result["Status"] = 1;
        return result;
      } else {
        result["Status"] = 0;
        return result;
      }
    }
  }

  ///////////// assignShift //////////
  public static async assignShift(get) {
    var updateShiftset = await EmployeeMaster.query()
      .where("Id", get.empid)
      .andWhere("OrganizationId", get.Orgid)
      .update("Shift", get.shiftid);

    if (updateShiftset.length > 0) {
      const zone = await helper.getTimeZone(get.Orgid);
      const timezone = zone;
      const date = moment().tz(timezone).toDate();

      const orgid = get.Orgid;
      const uid = get.adminid;
      const module = "Attendance app";
      const activityBy = 1;
      const appModule = "Update Successfully";
      const actionperformed = `<b>${get.shiftname}</b>. shift has been assigned to <b>${get.empname}</b> by <b>${get.adminname}</b> from <b>${module}</b>`;

      var getresult = await helper.ActivityMasterInsert(
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

  static async deleteInActivateShift(data) {
    const orgid = data.orgId;
    const Id = data.id;
    const empId = data.empId;
    const result = {};
    let ShiftName: any = await Helper.getShiftName(Id, orgid);

    const Deleteshiftdata: any = await Database.from('ShiftMaster').select('*').where('OrganizationId', orgid).andWhere('Id', Id).andWhere('archive', '0').delete();

    if (Deleteshiftdata == 1) {
      const query = await Database.from('ShiftMasterChild').where('OrganizationId', orgid).andWhere('ShiftId', Id).delete();
      if (query) {
        let date = moment().format("YY-MM-DD");
        let appModule = "Delete Shift";
        let module = "Attendance App";
        let activityBy = 1;
        let actionperformed = `<b> ${ShiftName}</b>.Shift has been deleted successfully`;
        let res = await Helper.ActivityMasterInsert(date, orgid, empId, activityBy, appModule, actionperformed, module)
        result['status'] = true;
      } else {
        result['status'] = false;
      }

    } else {
      result['status'] = false;
    }

    return result;
  }


  static async getMultiShiftsList(data) {

    const orgid = data.refno;
    const emplid = data.empid;
    const res: any[] = [];
    let shiftid;

    const shiftdata = await Database.query().from('ShiftPlanner as S').select('*').innerJoin('ShiftMaster as SM', 'S.shiftid', 'SM.Id').where('empid', emplid).andWhere('orgid', orgid)


    if (shiftdata.length > 0) {

      shiftdata.forEach(async (element) => {
        let result: any = {};
        result['shiftdate'] = moment(element.ShiftDate).format('YY-MM-DD');
        shiftid = element.shiftid;
        result['shiftid'] = shiftid;
        result['weekoffStatus'] = element.weekoffStatus;
        // result['shiftTiming']= await Helper.getShiftType(shiftid) == '3' ? await Helper.getFlexiShift(shiftid) : await Helper.getShiftTimes(shiftid);
        result['shiftype'] = element.shifttype;
        if (result['shiftype'] == "3") {
          result['shiftTiming'] = element.HoursPerDay
        } else {
          result['shiftTiming'] = element.TimeIn + "-" + element.TimeOut
        }
        result['HoursPerDay'] = element.HoursPerDay
        res.push(result);
      })
      return res;
    } else {
      return false
    }
  }

  public static async AssignShiftByDepart(reqdata) {
    const date = moment(reqdata['date']).format('YYYY-MM-DD');
    const zone = await Helper.getTimeZone(reqdata['Orgid']);
    const defaultZone = DateTime.now().setZone(zone);
    let currentDate = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
    const data = {};
    data['status'] = 'false';
    const EmpdataDepartmentwise = await Database.query().select('E.Id').from('EmployeeMaster as E').innerJoin('DepartmentMaster as D', 'D.Id', 'E.Department').where('E.OrganizationId', reqdata['Orgid']).andWhere('E.archive', 1).andWhere('E.Is_Delete', 0).andWhere('E.Department', reqdata['departid']);
    await EmpdataDepartmentwise.forEach(async row => {
      const Empid = row.Id;
      if (reqdata['status'] == 1) {

        const assignshiftDataEmp = await Database.query().select('*').from('ShiftPlanner').where('ShiftDate', date).andWhere('empid', Empid)
        if (assignshiftDataEmp.length > 0) {

          const updatedata: any = await Database.query().from("ShiftPlanner").where("empid", Empid)
            .andWhere("ShiftDate", date)
            .update({ ShiftDate: date, assignmentStatus: 2, weekoffStatus: reqdata['WeekoffStatus'], shiftid: reqdata['shiftid'], AssignedById: reqdata['adminid'], LastModifiedDate: currentDate, AddedFrom: 0 });
          if (updatedata > 0) {
            data['status'] = 'Shift is inserted and updated'; //shift was already assigned on this date now its updated with status 2

          }
        } else {
          const Insertdata: any = await Database.table("ShiftPlanner")
            .insert({
              ShiftDate: date,
              assignmentStatus: reqdata['status'],
              weekoffStatus: reqdata['WeekoffStatus'],
              shiftid: reqdata['shiftid'],
              empid: Empid,
              orgid: reqdata['Orgid'],
              extra: 0,
              AddedFrom: 0,
              AssignedById: reqdata['adminid'],
              LastModifiedDate: currentDate
            }).returning('Id');

          if (Insertdata > 0) {
            data['status'] = 'Shift is inserted';
          }
        }

      }
      // This Condition is worked for when the shift assign status is 2
      if (reqdata['status'] == 2) {
        const updatedata: any = await Database.query().from("ShiftPlanner").where("empid", Empid)
          .andWhere("ShiftDate", date)
          .update({ ShiftDate: date, assignmentStatus: reqdata['status'], weekoffStatus: reqdata['WeekoffStatus'], shiftid: reqdata['shiftid'], AssignedById: reqdata['adminid'], LastModifiedDate: currentDate });
        if (updatedata > 0) {
          data['status'] = 'Shift is updated';
        }

      }
      // This Condition is worked for when the shift assign status is 0
      if (reqdata['status'] == 0) {
        const assignshiftDataEmp = await Database.query().select('*').from('ShiftPlanner').where('ShiftDate', date).andWhere('empid', Empid).andWhere('shiftid', reqdata['shiftid']);


        if (assignshiftDataEmp.length > 0) {

          await Database.query().delete().from('ShiftPlanner').where('ShiftDate', date).andWhere('empid', Empid)
          data['status'] = 'Shift is deleted';
        }
      }
    });

    if (reqdata['status'] == 1) {

      const ShiftPlannerByDepartment = await Database.query().select('*').from('ShiftPlannerByDepartment').where('ShiftDate', date).andWhere('DepartId', reqdata['departid'])

      if (ShiftPlannerByDepartment.length > 0) {

        await Database.query().from("ShiftPlannerByDepartment").where("DepartId", reqdata['departid']).andWhere("ShiftDate", date)
          .update({ ShiftDate: date, assignmentStatus: 2, weekoffStatus: reqdata['WeekoffStatus'], shiftid: reqdata['shiftid'], AssignedById: reqdata['adminid'], LastModifiedDate: currentDate });
      } else {

        const ShiftPlannerByDepartment = await Database.table("ShiftPlannerByDepartment")
          .insert({
            ShiftDate: date,
            AssignmentStatus: reqdata['status'],
            WeekOffStatus: reqdata['WeekoffStatus'],
            ShiftId: reqdata['shiftid'],
            DepartId: reqdata['departid'],
            OrgId: reqdata['Orgid'],
            Extra: 0,
            AssignedById: reqdata['adminid'],
            LastModifiedDate: currentDate
          });


      }
    }
    if (reqdata['status'] == 2) {
      await Database.query().from("ShiftPlannerByDepartment")
        .where("DepartId", reqdata['departid']).andWhere("ShiftDate", date)
        .update({ ShiftDate: date, AssignmentStatus: reqdata['status'], WeekOffStatus: reqdata['WeekoffStatus'], ShiftId: reqdata['shiftid'], AssignedById: reqdata['adminid'], LastModifiedDate: currentDate });
    }
    if (reqdata['status'] == 0) {

      await Database.query().delete().from('ShiftPlannerByDepartment').where('ShiftDate', date).andWhere('DepartId', reqdata['departid']);
    }

    if (data['status'] != 'false') {
      const module: string = "Attendance App";
      const actionperformed: string = "<b>" + reqdata['shiftname'] + "</b> has been assigned for  <b>" + reqdata['departname'] + "'S" + " </b> by <b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
      const activityby: any = '1';
      const appmodule: string = "ShiftPlanner";
      const InsertActivity = await Database.table("ActivityHistoryMaster")
        .insert({
          LastModifiedDate: currentDate,
          LastModifiedById: reqdata['adminid'],
          Module: module,
          ActionPerformed: actionperformed,
          OrganizationId: reqdata['Orgid'],
          ActivityBy: activityby,
          adminid: reqdata['adminid'],
          AppModule: appmodule
        });
    }
    return data;
  }

  // ================saveMultiShifts===========
  public static async addMultiShift(data: any) {
    const orgid = data.refno ? data.refno : 0;
    const date1 = data.date ? data.date : 0;
    const status = data.status ? data.status : 0;
    const shiftid = data.shiftid ? data.shiftid : 0;
    const empid = data.empid ? data.empid : 0;
    const WeekoffStatus = data.WeekoffStatus ? data.WeekoffStatus : 0;
    const assignedbyid = data.assignedbyid ? data.assignedbyid : 0;
    let oldShiftId = 0;
    const zone = await Helper.getTimeZone(orgid);
    const defaultZone = DateTime.now().setZone(zone);
    const todaydate = date1 ? date1.toFormat('yyyy-MM-dd') : DateTime.now();
    const newch = DateTime.now().toFormat("yyyy-MM-dd HH:ii");
    let NewShiftName =  await Helper.getShiftName(shiftid , orgid);
    let oldShiftName = '';
    const empname = await Helper.getEmpName(empid)
    const data1 ={};
    if (status == '1') {
      const query = await Database.query().from('ShiftPlanner').select('*').where('ShiftDate', todaydate).andWhere('empid', empid);
      if (query.length > 0) {
        const query1 = await Database.query().from('ShiftPlanner').select('shiftid').where('ShiftDate', todaydate).andWhere('empid', empid);
        if (query1.length > 0) {
          oldShiftId = query1[0].shiftid;
          oldShiftName = await Helper.getShiftName(oldShiftId , orgid);
        }
        const query3 : any = await Database.query().from('ShiftPlanner').select('ShiftDate', 'assignmentStatus', "weekoffStatus", "shiftid", "AssignedById").where('ShiftDate', todaydate).andWhere('empid', empid).update({
          'ShiftDate': todaydate,
          'assignmentStatus': 2,
          "weekoffStatus": WeekoffStatus,
          "shiftid": shiftid,
          "AssignedById": assignedbyid
        });
        const activityBy = '1'
        const module = 'Attendance app'
        const appModule =  'Shift Planner'
        const actionperformed = '<b> '+`${empname}`+'<b>'+' shift has been changed from <b> ' +`${oldShiftName}`+' to '+`${NewShiftName}`+'<b> for '+`${newch}`+ ' from Attendance App' 
       const activity =  await Helper.ActivityMasterInsert(
        newch,
          orgid,
          assignedbyid,
          activityBy,
          appModule,
          actionperformed,
          module
        ) 
        
          if(query3 > 0){
            data1['status']='Shift is inserted and updated';
            return data1;
          }else{
            data1['status']='error occurs';
            return data1;
          }
      }else{
        const query21:any = await Database.table('ShiftPlanner').returning('id').insert({
          "ShiftDate": `${todaydate}`,
           "assignmentStatus": status,
           "weekoffStatus" : WeekoffStatus,
            "shiftid" :shiftid ,
             "empid" :empid ,
              "orgid" : orgid, 
              "extra" : 0,
              "AssignedById" : assignedbyid
        });
        const activityBy = '1'
        const module = 'Attendance app'
        const appModule =  'Shift Planner'
        const actionperformed = '<b> '+`${NewShiftName}`+'<b>'+' Shift has been assigned to <b> ' +`${empname}`+'<b> for '+`${newch}`+ ' from Attendance App' 
       const activity =  await Helper.ActivityMasterInsert(
        newch,
          orgid,
          assignedbyid,
          activityBy,
          appModule,
          actionperformed,
          module
        ) 
        
        if(query21 > 0){
          data1['status']='Shift is inserted';
          return data1;
        }else{
          data1['status']='error occurs';
          return data1;
        }
       
      }
    }
    if(status == '2'){ //update
      const query12= await Database.query().from(`ShiftPlanner`).select("shiftid").where('ShiftDate',todaydate).andWhere('empid',empid)
      if(query12.length > 0){
        const oldShiftId = query12[0].shiftid;
       oldShiftName =  await Helper.getShiftName(oldShiftId , orgid)
      }
     
      const query21:any = await Database.query().from(`ShiftPlanner`).where("ShiftDate",todaydate).andWhere('empid',empid).update({'ShiftDate':todaydate,
      'assignmentStatus':status,
      'weekoffStatus':WeekoffStatus,
      'shiftid':shiftid,
      'AssignedById' :assignedbyid 
      });
      const activityBy = '1'
        const module = 'Attendance app'
        const appModule =  'Shift Planner'
        const actionperformed = '<b> '+`${empname}`+'<b>'+' shift has been changed from to <b> ' +`${oldShiftName}`+'<b> to ' +`${NewShiftName}`+' for '+`${newch}`+ ' from Attendance App' 
      const activity =  await Helper.ActivityMasterInsert(
        newch,
          orgid,
          assignedbyid,
          activityBy,
          appModule,
          actionperformed,
          module
        ) 
        if(query21 > 0){
          data1['status']='Shift is updated';
          return data1;
        }else{
          data1['status']='error occurs';
          return data1;
        }
        
  
    }
   
    if(status == 0){
        const query21:any = await Database.query().from('ShiftPlanner').where('ShiftDate',todaydate).andWhere('empid',empid).delete();
        const activityBy = '1'
        const module = 'Attendance app'
        const appModule =  'Shift Planner'
        const adminName = await Helper.getempnameById(empid)
        const actionperformed = '<b> '+`${NewShiftName}`+'<b>'+' shift has been unassigned for  <b> ' +`${empname}`+'<b> By ' +`${adminName}`+' for '+`${newch}`+ ' from Attendance App' 
        const activity =  await Helper.ActivityMasterInsert(
        newch,
          orgid,
          assignedbyid,
          activityBy,
          appModule,
          actionperformed,
          module
        ) 
        if(query21 > 0){
          data1['status']='Shift is deleted';
          return data1;
        }else{
          data1['status']='error occurs';
          return data1;
        }
        
    }
  }
  static async  ShiftCheckData(data){
    var Orgid = data.orgid;
    var shiftId = data.id;
    const selectEmployeeList = await Database.from("EmployeeMaster")
      .select(Database.raw("COUNT(*) as num"))
      .where("OrganizationId", Orgid)
      .andWhere("Shift", shiftId)

    const result = await selectEmployeeList;
    const selectAttendanceMasterList = await Database.from("AttendanceMaster")
      .select(Database.raw("COUNT(*) as  nums"))
      .andWhere("ShiftId", shiftId)
      .where("OrganizationId", Orgid);

    const result2 = await selectAttendanceMasterList;
    return {
      num: result[0].num,
      attNum: result2[0].nums,
    };
  }

  // ==================AssignShiftsByDesignation==========?
  public static async AssignShiftsByDesignation(data){
    const orgid = data.orgid ? data.orgid: 0;
    const desgid = data.desgid ? data.desgid : 0;
    const appdate = data.date ? data.date : 0;
    const status = data.status ? data.status : 0;
    const shiftid = data.shiftid ? data.shiftid : 0;
    const WeekoffStatus = data.WeekoffStatus ? data.WeekoffStatus : '';
    const assignedbyid = data.assignedbyid ? data.assignedbyid : 0;
    const formateddate = appdate.toFormat("yyyy-MM-dd");
    let empid = 0 ;
    let data1 :any= {};
    data1['status']='';
    const deptquery:any = await Database.query().select('E.Id as EmployeeId' ).from('EmployeeMaster as E').innerJoin('DesignationMaster as D','E.Designation','D.Id').where('E.OrganizationId',orgid).andWhere('D.Id',desgid);
    const affected_rows=deptquery.length;
    console.log();
    
    if(affected_rows > 0)
    {
      await Promise.all(deptquery.map(async(element:any,row)=>
      {
            empid = element.EmployeeId ;
            if(status == 1)
            {
              const query1 :any  = await Database.query().from("ShiftPlanner").select('*').where('ShiftDate',formateddate).andWhere('empid',empid);
              const count = query1.length;
              if(count > 0)
              {
                const querysp :any= await Database.query().from('ShiftPlanner').where("ShiftDate",formateddate).andWhere('empid',empid).update({
                  "ShiftDate" : formateddate,
                  "assignmentStatus" : 2,
                  "weekoffStatus" : WeekoffStatus,
                  "shiftid" : shiftid,
                  "AssignedById" : assignedbyid,
                });
                //console.log(querysp.length  > 0);
                if(querysp > 0)
                {
                  data1['status'] = 'Shift is inserted and updated'; //shift was already assigned on this date now its updated with status 2
                }
              }
              else
              {
                  const querysp: any = await Database.table('ShiftPlanner').returning('id').insert({
                    "ShiftDate" : formateddate,
                    "assignmentStatus" : status,
                    "weekoffStatus" : WeekoffStatus,
                    "shiftid" : shiftid,
                    "empid" : empid,
                    "orgid" : orgid,
                    "extra" : 0,
                    "AssignedById" : assignedbyid,
                  })
                  if(querysp.length > 0){
                    data1['status'] = 'Shift is inserted'; 
                  }      
              }
            }
            // This Condition is worked for when the shift assign status is 2
            if(status == '2')
            {
              const querysp :any = await Database.query().from('ShiftPlanner').where('ShiftDate',formateddate).andWhere('empid',empid).update({
                "ShiftDate" : formateddate,
                "assignmentStatus" : status,
                "weekoffStatus" : WeekoffStatus,
                "shiftid" : shiftid,
                "AssignedById" : assignedbyid,
              })
              if(querysp > 0){
                data1['status']='Shift is updated';
              }
            } 
            if(status == 0)
            { 
              const query1:any = await Database.query().from("ShiftPlanner").select("*").where('shiftid',shiftid).andWhere('empid',empid).andWhere('ShiftDate',formateddate);
              const coun1 = query1.length;
              if(coun1 > 0){
                const querysp = await Database.query().from('ShiftPlanner').where('ShiftDate',formateddate).andWhere('empid',empid).delete();
                data1['status']='Shift is deleted';
              } 
            }
          })
        )
        if(status == 1){
          const query1 :any = await Database.query().from('ShiftPlannerByDesignation').select('*').where('ShiftDate',formateddate).andWhere('DesgId',desgid);
          console.log(query1);
          console.log(query1.length);
          
          if(query1.length > 0){
            const querysp:any = await Database.query().from('ShiftPlannerByDesignation').where('ShiftDate',formateddate).andWhere('DesgId',desgid).update({
              "ShiftDate" : formateddate,
              "assignmentStatus" : 2,
              "weekoffStatus" : WeekoffStatus,
              "shiftid" : shiftid,
              "AssignedById" : assignedbyid

            })
          }else{
            const querydsp = await Database.table("ShiftPlannerByDesignation").returning("id").insert({
              "ShiftDate" : formateddate , 
              "AssignmentStatus" :status , 
              "WeekOffStatus" : WeekoffStatus,
               "ShiftId" : shiftid, 
               "DesgId" : desgid, 
               "OrgId" : orgid,
                "Extra" : 0 ,
                "AssignedById" : assignedbyid
            })
            console.log('inserted');
            
          }
        }
        if(status == 2)
        {
          const querydsp = await Database.query().from('ShiftPlannerByDesignation').where('ShiftDate',formateddate).andWhere('DesgId',desgid).update({
            "ShiftDate" : formateddate,
            "AssignmentStatus" : status,
            "WeekOffStatus" : WeekoffStatus,
            "ShiftId" : shiftid,
            "AssignedById" : assignedbyid,
          })
        }
        if(status == 0)
        {
          const querydsp:any = await Database.query().from('ShiftPlannerByDesignation').where('ShiftDate',formateddate).andWhere("DesgId",desgid).delete(); 
          console.log(querydsp);
           
               if(querydsp > 0){
                console.log("deleted");
                
               }        
        }
        return data1;
      }
    }
}