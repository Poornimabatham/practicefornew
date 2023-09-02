const jwt = require("jsonwebtoken");
import Database from "@ioc:Adonis/Lucid/Database";
import EmployeeMaster from "App/Models/EmployeeMaster";
import Organization from "App/Models/Organization";
import ShiftMaster from "App/Models/ShiftMaster";
import ZoneMaster from "App/Models/ZoneMaster";
const { format, parse,parseISO } = require('date-fns');
import { DateTime } from "luxon";

export default class Helper {
  public static encode5t(str: any) {
    for (let i = 0; i < 5; i++) {
      str = Buffer.from(str).toString("base64");
      str = str.split("").reverse().join("");
    }
    return str;
  }

  public static decode5t(str: string) {
    for (let i = 0; i < 5; i++) {
      str = str.split("").reverse().join("");
      str = Buffer.from(str, "base64").toString("utf-8");
    }
    return str;
  }

  public static async getTimeZone(orgid: any) {
    const query1 = await Database.query()
      .from("ZoneMaster")
      .select("name")
      .where(
        "id",
        Database.raw(
          `(select TimeZone from Organization where id =${orgid}  LIMIT 1)`
        )
      );
    return query1[0].name;
  }

  public static async getmpnameById(empid: number) {
    const query2 = await Database.query()
      .from("EmployeeMaster")
      .select("FirstName")
      .where("Id", empid);
    return query2[0].FirstName;
  }

  public static generateToken(secretKey: string, data: any = {}) {
    try {
      const payload = {
        audience: data.username,
        Id: data.empid,
      };
      const options = {
        expiresIn: "1h",
        issuer: "Ubiattendace App",
      };
      const token = jwt.sign(payload, secretKey, options, {
        alg: "RS512",
        typ: "JWT",
      });
      return token;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  public static async getDepartmentIdByEmpID(empid: number) {
    const EmpQuery = await Database.from("EmployeeMaster")
      .select("Department")
      .where("id", empid);

    if (EmpQuery.length > 0) {
      const departmentId: number = EmpQuery[0].Department;

      const DepQuery = await Database.from("DepartmentMaster")
        .select("Id")
        .where("Id", departmentId);

      if (DepQuery.length > 0) {
        return DepQuery[0].Id;
      }
    }
    return 0;
  }

  public static async getAdminStatus(id: number) {
    let status = 0;
    const queryResult = await Database.query()
      .from("UserMaster")
      .select("appSuperviserSts")
      .where("EmployeeId", id)
      .first();
    if (queryResult) {
      status = queryResult.appSuperviserSts;
    }
    return status;
  }

  public static async getWeeklyOff(
    date: string,
    shiftId: number,
    emplid: number,
    orgid: number
  ) {
    const dt = date;
    const dayOfWeek = 1 + new Date(dt).getDay();
    const weekOfMonth = Math.ceil(new Date(dt).getDate() / 7);
    let week = [];
    const selectShiftId: any = await Database.from("AttendanceMaster")
      .select("ShiftId")
      .where("AttendanceDate", "<", dt)
      .where("EmployeeId", emplid)
      .orderBy("AttendanceDate", "desc")
      .limit(1);

    if (selectShiftId.length > 0) {
      let shiftid;

      shiftid = selectShiftId[0].ShiftId;
    } else {
      return "N/A";
    }

    const shiftRow = await Database.from("ShiftMasterChild")
      .where("OrganizationId", orgid)
      .where("Day", dayOfWeek)
      .where("ShiftId", shiftId)
      .first();
    let flage = false;
    if (shiftRow) {
      week = shiftRow.WeekOff.split(",");
      flage = true;
    }
    if (flage && week[weekOfMonth - 1] != "1") {
      return "WO";
    } else {
      const holidayRow = await Database.from("HolidayMaster")
        .where("OrganizationId", orgid)
        .where("DateFrom", "<=", dt)
        .where("DateTo", ">=", dt)
        .first();

      if (holidayRow) {
        return "H";
      } else {
        return "N/A";
      }
    }
  }

  public static async getEmpTimeZone(userid, orgid) {
    const defaultZone = "Asia/Kolkata";
    const { CurrentCountry: country, timezone: id } =
      await EmployeeMaster.findByOrFail("Id", userid);

    if (id) {
      const zoneData = await ZoneMaster.find(id);
      return zoneData ? zoneData.Name : defaultZone;
    }
    if (!country) {
      const organization = await Organization.findByOrFail("Id", orgid);
      if (organization) {
        const zoneData = await ZoneMaster.find(organization.TimeZone);
        return zoneData ? zoneData.Name : defaultZone;
      }
    } else {
      const zoneData = await ZoneMaster.query()
        .where("CountryId", country)
        .first();
      return zoneData ? zoneData.Name : defaultZone;
    }

    return defaultZone;
  }

  public static async getInterimAttAvailableSt(value: number) {
    const GetIntermAttendanceId = await Database.from("InterimAttendances")
      .where("AttendanceMasterId", value)
      .select("id");

    if (GetIntermAttendanceId.length > 0) {
      return GetIntermAttendanceId[0].id;
    }
    return 0;
  }

  public static async getCurrentDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  public static async getShiftName(Id: number, orgid: number) {
    let ShiftName: any;
    console.log(Id);
    console.log(orgid);
    const getshiftname: any = await Database.from("ShiftMaster")
      .select("Name")
      .where("Id", Id)
      .andWhere("OrganizationId", orgid);
    if (getshiftname.length > 0) {
      ShiftName = getshiftname[0].Name;
    }
    return ShiftName;
  }

  public static async getEmpName(Id: number) {
    const query  =  await Database.from("EmployeeMaster")
      .select("FirstName", "LastName")
      .where("Id", Id)
      .where("Is_Delete", 0);
 
    return query[0].FirstName;
  }

  public static async getShiftType(shiftId) {
    const defaultshifttype = 0;
    const allDataOfShiftMaster: any = await ShiftMaster.find(shiftId);
    // console.log(allDataOfShiftMaster?.toSQL().toNative());

    if (allDataOfShiftMaster) {
      return allDataOfShiftMaster
        ? allDataOfShiftMaster.shifttype
        : defaultshifttype;
    } else {
      return defaultshifttype;
    }
  }

  public static async getassignedShiftTimes(empid, ShiftDate) {
    let getshiftid = await Database.from("ShiftPlanner")
      .select("shiftid")
      .where("empid", empid)
      .andWhere("ShiftDate", ShiftDate);
    if (getshiftid.length > 0) {
      return getshiftid[0].shiftid;
    } else {
      let getshiftid = await Database.from("ShiftMaster")
        .select("Id")
        .where(
          "id",
          Database.rawQuery(
            `(SELECT Shift FROM EmployeeMaster where id=${empid})`
          )
        );
      if (getshiftid.length > 0) {
        return getshiftid[0].Id;
      }
    }
  }

  public static async getAddonPermission(orgid: number, addon: string) {
    let getaddonpermission = await Database.from("licence_ubiattendance")
      .select(Database.raw(`${addon} as addon`))
      .where("OrganizationId", orgid);
    if (getaddonpermission.length > 0) {
      return getaddonpermission[0].addon;
    } else {
      return 0;
    }
  }

  public static async getNotificationPermission(
    orgid: number,
    notification: string
  ) {
    let getNotificationPermission = await Database.from("NotificationStatus")
      .select(Database.raw(`${notification} as notification`))
      .where("OrganizationId", orgid);
    if (getNotificationPermission.length > 0) {
      return getNotificationPermission[0].notification;
    } else {
      return 0;
    }
  }

  public static async getShiftmultists(id: number) {
    let getshiftMultiplests = await Database.from("ShiftMaster")
      .select("MultipletimeStatus")
      .where("Id", id);
    if (getshiftMultiplests.length > 0) {
      return getshiftMultiplests[0].MultipletimeStatus;
    } else {
      return 0;
    }
  }

    static async getCountryIdByOrg(orgid:number)
    {
      const query:any =  await Database.query().from('Organization').select('Country').where('Id',orgid)
      return query
    }


  static async  getCurrentOrgStatus(orgId) 
  {
    const todayDate = new Date().toISOString().split('T')[0];
    let customizeOrg = 0;
    let status = 0;
    let endDate = '0000-00-00';
    let deleteSts = 0;
    let extended = 0;

   const queryResult = await Database
    .from('Organization')
    .join('licence_ubiattendance', 'Organization.Id', '=', 'licence_ubiattendance.OrganizationId')
    .select('Organization.customize_org AS customize_org','Organization.delete_sts AS delete_sts')
    .select('licence_ubiattendance.status AS status','licence_ubiattendance.end_date AS end_date','licence_ubiattendance.extended AS extended')
    .where('Organization.Id',orgId)
   
    const row = queryResult[0];

    if (row) {
      customizeOrg = row.customize_org;
      status = row.status;
      endDate = DateTime.fromJSDate(new Date(row.end_date)).toFormat('yyyy-MM-dd');
      deleteSts = row.delete_sts;
      extended = row.extended;
    }
    if (status === 0 && extended === 1 && todayDate <= endDate && customizeOrg === 0 && deleteSts === 0 ) 
    {
      return 'TrialOrg';
    } 
    else if (status === 1 && todayDate <= endDate && deleteSts === 0 && customizeOrg === 0 ) 
    {
      return 'PremiumStandardOrg';
    } 
    else if (customizeOrg === 1 && deleteSts === 0) 
    {
      return 'PremiumCustomizedOrg';
    } 
    else if ( status === 0 && todayDate > endDate && deleteSts === 0 && customizeOrg === 0  ) 
    {
      return 'ExpiredTrialOrg';
    } 
    else if ( status === 0 && extended > 1 && endDate >= todayDate && deleteSts === 0 && customizeOrg === 0)
    {
      return 'ExtendedTrialOrg';
    }
    else if ( status === 0 && todayDate > endDate && deleteSts === 0 && customizeOrg === 0 ) 
    {
      return 'PremiumExpiredOrg';
    }
  }

  static async getShiftIdByEmpID(uid) 
  {
    const shiftId = await Database.from("EmployeeMaster")
      .select("Shift")
      .where("Id", uid);

    const shiftIds = shiftId.map((row) => row.Shift);
    return shiftIds[0];    
  }

  static async getAddon_Regularization(orgid) 
  {
    const Addon_Regularization = await Database.from("Organization")
      .select("Addon_Regularization")
      .where("Id", orgid);

    const Addon_Regularizations = Addon_Regularization.map((row) => row.Addon_Regularization);
    return Addon_Regularizations[0];    
  }

  static async getAreaInfo(Id) 
  {
    const query = await Database.from('Geo_Settings')
      .select('Lat_Long', 'Radius')
      .where('Id', Id)
      .where('Lat_Long', '!=', '')
      .limit(1)
      .first();

    if (query) 
    {
        const arr:any = {};
        const arr1 = query.Lat_Long.split(',');
        arr.lat = arr1[0] ? parseFloat(arr1[0]) : 0.0;
        arr.long = arr1[1] ? parseFloat(arr1[1]) : 0.0;
        arr.radius = query.Radius;
        return arr;
    }

    return 0;
  }

  static async getLeaveCountApp(orgid, empid, leavedate)
  {
    const fiscaldate = await this.getOrgFiscal(orgid, leavedate);
    const fiscal = fiscaldate.split(' ');
    const fiscalstart = fiscal[0];
    const fiscalend = fiscal[2];
  
    const query = await Database.from('AppliedLeave')
    .where('EmployeeId', empid)
    .whereIn('ApprovalStatus', [1, 2])
    .whereBetween('Date', [fiscalstart, fiscalend])
    .count('Id as noofleave');

      //const result = await query;

      const noofleave = query[0].noofleave;

      return noofleave;
  }

    static async getOrgFiscal(orgid, leavedate) 
    {
      const query = Database.from('Organization')
        .where('Id', orgid)
        .select('fiscal_start', 'fiscal_end')
        .first();

      const row = await query;

      if (!row) {
        throw new Error('Organization not found');
      }

      const f_start = row.fiscal_start;
      const f_end = row.fiscal_end;

      const leavedateFormatted = leavedate || new Date().toISOString().slice(0, 10);

      const dateofjoin = new Date(leavedateFormatted);
      const fiscalstart = new Date(f_start);
      const fiscalend = new Date(f_end);

      if (dateofjoin < fiscalstart) {
        fiscalstart.setFullYear(fiscalstart.getFullYear() - 1);
      }

      if (dateofjoin > fiscalend) {
        fiscalend.setFullYear(fiscalend.getFullYear() + 1);
      }

      const startDate = fiscalstart.toISOString().slice(0, 10);
      const endDate = fiscalend.toISOString().slice(0, 10);

      return `${startDate} And ${endDate}`;
    }


  static async getBalanceLeave(orgid, uid, date = '') 
  {
    const data = await Database
    .from('EmployeeMaster as E')
    .join('Organization as O', 'E.OrganizationId', '=', 'O.Id')
    .select('E.FirstName','E.entitledleave','E.DOJ',)
    .select('O.fiscal_start','O.fiscal_end','O.entitled_leave')
    .where('O.Id',orgid)
    .where('E.Id',uid).first()
   
    let entitledleave :any ,doj;
    if (!data.entitledleave || data.entitledleave.trim() === 'undefined') {
      entitledleave = data.entitled_leave;
    } else {
      entitledleave = data.entitledleave;
    }

      const todaydate = new Date();
      const new_fiscal_start_year = todaydate.getFullYear();
      const new_fiscal_end_year = new_fiscal_start_year + 1;
      const startDate_year = format(parse(data.fiscal_start, 'd MMMM', new Date()), 'MM-dd');
      const endDate_year = format(parse(data.fiscal_end, 'd MMMM', new Date()), 'MM-dd');  
      const endDate_fnew = `${new_fiscal_end_year}-${endDate_year}`;
      const startDate_fnew = `${new_fiscal_start_year}-${startDate_year}`;

      ////////////////////fiscal start/////////////////
       const currentDate = data.DOJ.toISOString().split('T')[0];
       let dateofjoin:any =  format(parse(currentDate, 'yyyy-MM-dd', new Date()), 'MM/dd/Y');
       const fiscalstart =  format(parse(startDate_fnew, 'yyyy-MM-dd', new Date()), 'MM/dd');
       const fiscalstartmon = fiscalstart.substring(0, 2);
       const dateofjoinmon = dateofjoin.substring(0, 2);
       let fiscalstartdate = fiscalstart.substring(3, 2);
       const joindate = dateofjoin.substring(3, 2);
       
      if (dateofjoinmon < fiscalstartmon) {
        doj = parseInt(dateofjoin.split('/')[2]) - 1;
        fiscalstartdate = `${fiscalstart}/${doj}`;
      } else if (dateofjoinmon === fiscalstartmon && joindate < fiscalstart.substring(3, 5)) {
        doj = parseInt(dateofjoin.split('/')[2]) - 1;
        fiscalstartdate = `${fiscalstart}/${doj}`;
      } else if (dateofjoinmon === fiscalstartmon && joindate === fiscalstart.substring(3, 5)) {
        doj = parseInt(dateofjoin.split('/')[2]);
        fiscalstartdate = `${fiscalstart}/${doj}`;
      } else {
        doj = parseInt(dateofjoin.split('/')[2]);
        fiscalstartdate = `${fiscalstart}/${doj}`;
      }
      //////////////////////Fiscal End//////////////////////

      const fiscalend =  format(parse(endDate_fnew, 'yyyy-MM-dd', new Date()), 'MM/dd');
      const fiscalendmon = fiscalend.substring(0, 2);
      let fiscalenddate = fiscalend.substring(3, 2);
      
      if (dateofjoinmon > fiscalendmon) {
        doj = parseInt(dateofjoin.split('/')[2]) - 1;
        fiscalenddate = `${fiscalend}/${doj}`;
      } else if (dateofjoinmon === fiscalendmon && joindate > fiscalend.substring(3, 5)) {
        doj = parseInt(dateofjoin.split('/')[2]) - 1;
        fiscalenddate = `${fiscalend}/${doj}`;
      } else if (dateofjoinmon === fiscalendmon && joindate === fiscalend.substring(3, 5)) {
        doj = parseInt(dateofjoin.split('/')[2]);
        fiscalenddate = `${fiscalend}/${doj}`;
      } else {
        doj = parseInt(dateofjoin.split('/')[2]);
        fiscalenddate = `${fiscalend}/${doj}`;
      }
     /////////////////////////////*******/////////////////////////////////
     const startDate = new Date(fiscalstartdate);
     let endDate :any = new Date(fiscalenddate);

      if (currentDate >= startDate && currentDate <= endDate) 
      {
        const diff = endDate - dateofjoin;
        const differenceInDays = Math.abs(Math.round(diff / (1000 * 60 * 60 * 24)));
    
        const bal1 = entitledleave / 12;
        const bal2 = differenceInDays / 30.4167;
        let balanceleave1 = bal1 * bal2;
        const str = Math.round(balanceleave1 * 100) / 100;
    
        let after = Math.round((str % 1) * 100);
    
        if (after <= 50) {
          if (entitledleave <= 0) {
            after = 0;
          } else {
            after = 5;
          }
          const balanceleave = parseFloat(`${Math.floor(str)}.${after}`);
          return balanceleave;
        } else {
          const balanceleave = Math.round(str);
          return balanceleave;
        }
      } else {
        const balanceleave = entitledleave;
        return balanceleave;
      }
    }

  static async getDepartmentName(deptid) 
  {
    const DeptName = await Database.from("DepartmentMaster")
      .select("Name")
      .where("Id", deptid);

    const deptName = DeptName.map((row) => row.Name);
    return deptName[0];    
  }

  static async getDesignationName(desgid) 
  {
    const DesgName = await Database.from("DesignationMaster")
      .select("Name")
      .where("Id", desgid);

    const desgName = DesgName.map((row) => row.Name);
    return desgName[0];    
  }

  static async getShiftTimeByEmpID(uid) 
  {
    const shiftInfo = await Database
    .from('ShiftMaster')
    .select('Name','TimeIn', 'TimeOut','shifttype','HoursPerDay',Database.raw('TIMEDIFF(TimeIn, TimeOut) AS diffShiftTime'))
    .whereIn('id', (subquery) => {
      subquery.select('Shift').from('EmployeeMaster').where('id', uid);
    }).first();
     
    if (shiftInfo) 
    {
        const arr:any = {};
        arr.shiftName = shiftInfo.Name;
        arr.shiftTimeIn = shiftInfo.TimeIn;
        arr.ShiftTimeOut = shiftInfo.TimeOut;
        arr.shifttype = shiftInfo.shifttype;
        arr.minworkhrs = shiftInfo.HoursPerDay;
        arr.diffShiftTime = shiftInfo.diffShiftTime;
        return arr;
    }   
  }



}


