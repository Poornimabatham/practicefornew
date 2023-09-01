import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import AttendanceMaster from "App/Models/AttendanceMaster";
import EmployeeMaster from "App/Models/EmployeeMaster";
import { DateTime } from "luxon";
import moment from "moment";
import { from } from "./../../contracts/env";

export default class DailyAttendanceService {
  public static async getpresentList(data) {
    var begin = (data.currentPage - 1) * data.perPage;
    var limit;
    var offset;
    var designationCondition;
    var departmentCondition;
    var AttendanceDate;

    if (data.currentPage != undefined && data.csv == undefined) {
      limit = data.perPage;
      offset = begin;
    } else {
      limit = "";
      offset = "";
    }

    var adminStatus = await Helper.getAdminStatus(data.EmployeeId);

    var departmentId = await Helper.getDepartmentIdByEmpID(data.EmployeeId);

    if (data.dataFor == "present") {
      if (data.date != undefined && data.date != " ") {
        var AttDate = data.date;
        AttendanceDate = AttDate.toFormat("yyyy-MM-dd");
      } else {
        var currDate = moment().format("YYYY-MM-DD");
        AttendanceDate = currDate;
      }
      const countRecordsQuery = await Database.from("AttendanceMaster")
        .select("Id")
        .where("AttendanceDate", AttendanceDate)
        .andWhere("OrganizationId", data.OrganizationId)
        .whereIn("AttendanceStatus", [1, 3, 5])
        .whereIn(
          "EmployeeId",
          Database.rawQuery(
            `(SELECT Id from EmployeeMaster where OrganizationId =${data.OrganizationId} AND Is_Delete = 0 )`
          )
        )
        .count("Id as Id");

      var totalCount;
      if (countRecordsQuery.length > 0) {
        totalCount = countRecordsQuery[0].Id;
      }

      var DailyAttPresentReportDataQueryResult;
      var DailyAttPresentReportDataQuery = Database.from(
        "AttendanceMaster as A"
      )
        .select(
          Database.raw("CONCAT(E.FirstName, ' ', E.LastName) as name"),
          Database.raw("SUBSTR(A.TimeIn, 1, 5) as `TimeIn`"),
          Database.raw(
            "(SELECT shifttype FROM ShiftMaster WHERE Id = ShiftId) as shiftType"
          ),
          Database.raw("SUBSTR(A.TimeOut, 1, 5) as `TimeOut`"),
          Database.raw("'Present' as status"),
          Database.raw(
            "SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage"
          ),
          Database.raw(
            "SUBSTRING_INDEX(A.ExitImage, '.com/', -1) as ExitImage"
          ),
          Database.raw("SUBSTR(A.checkInLoc, 1, 40) as checkInLoc"),
          Database.raw("SUBSTR(A.CheckOutLoc, 1, 40) as CheckOutLoc"),
          "A.latit_in",
          "A.longi_in",
          "A.latit_out",
          "A.longi_out",
          "A.Id",
          "A.TotalLoggedHours",
          "A.AttendanceStatus",
          "A.ShiftId",
          "A.multitime_sts"
        )
        .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
        .innerJoin("DesignationMaster as DM", "A.Desg_id", "DM.Id")
        .where("E.OrganizationId", data.OrganizationId)
        .whereIn("A.AttendanceStatus", [1, 3, 4, 5, 8])
        .where("A.AttendanceDate", AttendanceDate)
        .where("E.Is_Delete", 0)
        .orderBy("name", "asc")
        .limit(limit)
        .offset(offset);

      if (adminStatus == 2) {
        var departmentId = await Helper.getDepartmentIdByEmpID(data.EmployeeId);
        departmentCondition = `E.Department = ${departmentId}`;
        DailyAttPresentReportDataQuery.whereRaw(departmentCondition);
      }

      if (data.DesignationId != 0 && data.DesignationId != undefined) {
        designationCondition = ` Desg_id= ${data.DesignationId}`;
        DailyAttPresentReportDataQuery.whereRaw(designationCondition);
      }
      DailyAttPresentReportDataQueryResult =
        await DailyAttPresentReportDataQuery;
      interface DailyAttendancePresent {
        name: string;
        shiftType: number;
        AttendanceStatus: number;
        TimeIn: string;
        TimeOut: string;
        Status: string;
        MultiTimeStatus: number;
        checkInLoc: string;
        CheckOutLoc: string;
        latit_in: string;
        longi_in: string;
        latit_out: string;
        longi_out: string;
        Id: number;
        TotalLoggedHours: string;
        totalCount: number;
        EntryImage: string;
        ExitImage: string;
      }

      var result: DailyAttendancePresent[] = [];

      if (DailyAttPresentReportDataQueryResult) {
        DailyAttPresentReportDataQueryResult.forEach((row) => {
          const data: DailyAttendancePresent = {
            name: row.name,
            shiftType: row.shiftType,
            AttendanceStatus: row.AttendanceStatus,
            TimeIn: row.TimeIn,
            TimeOut: row.TimeOut,
            Status: row.status,
            MultiTimeStatus: row.multitime_sts,
            checkInLoc: row.checkInLoc,
            CheckOutLoc: row.CheckOutLoc,
            latit_in: row.latit_in,
            longi_in: row.longi_in,
            latit_out: row.latit_out,
            longi_out: row.longi_out,
            Id: row.Id,
            TotalLoggedHours: row.TotalLoggedHours,
            totalCount: totalCount,
            EntryImage: row.EntryImage,
            ExitImage: row.ExitImage,
          };
          result.push(data);
        });
      } else {
        result.push();
      }

      data["present"] = result;
      return data["present"];
    } else if (data.dataFor == "absent") {
      if (adminStatus == 2) {
        var departmentId = await Helper.getDepartmentIdByEmpID(data.EmployeeId);
        departmentCondition = `Dept_id = ${departmentId}`;
      }

      if (data.date != undefined) {
        var AttDate = data.date;
        AttendanceDate = AttDate.toFormat("yyyy-MM-dd"); //for other day's absentees

        const absCountQuery = await Database.from("AttendanceMaster")
          .where("AttendanceDate", AttendanceDate)
          .where("OrganizationId", data.OrganizationId)
          .whereIn("AttendanceStatus", [2, 7])
          .whereIn(
            "EmployeeId",
            Database.rawQuery(
              `(SELECT Id from EmployeeMaster where OrganizationId =${data.OrganizationId} AND Is_Delete = 0 )`
            )
          )
          .count("Id as abscount");

        var absCount;
        if (absCountQuery.length > 0) {
          absCount = absCountQuery[0].abscount;
        }

        var orgId = data.OrganizationId;
        var absentCountQuery = Database.from("AttendanceMaster as A")
          .select(
            Database.raw(
              "DATE_FORMAT(A.AttendanceDate,'%Y-%m-%d') as AttendanceDate"
            ),
            "A.Dept_id",
            "A.Desg_id",
            "A.AttendanceStatus",
            Database.raw(
              "(select CONCAT(FirstName,' ',LastName) FROM EmployeeMaster where Id = EmployeeId) as name"
            ),
            Database.raw(` '-' as TimeOut`),
            Database.raw(` '-' as TimeIn`),
            Database.raw(
              `(select ApprovalStatus from AppliedLeave where EmployeeId = A.EmployeeId and ApprovalStatus = 2 and Date = ${AttendanceDate}) as LeaveStatus`
            )
          )
          .innerJoin("EmployeeMaster as E", "E.Id", "A.EmployeeId")
          .where("AttendanceDate", AttendanceDate)
          .whereIn("AttendanceStatus", [2, 7])
          .where("A.OrganizationId", orgId)
          .whereIn(
            "EmployeeId",
            Database.raw(
              `SELECT Id FROM EmployeeMaster WHERE OrganizationId= ${orgId} AND Is_Delete = 0`
            )
          )
          .orderBy("name", "asc");

        if (departmentCondition != undefined) {
          absentCountQuery = absentCountQuery.whereRaw(departmentCondition);
        }

        if (data.DesignationId != 0 && data.DesignationId != undefined) {
          designationCondition = ` Desg_id= ${data.DesignationId}`; // From AttendanceMaster
          absentCountQuery = absentCountQuery.whereRaw(designationCondition);
        }
        var absentCountQueryResult = await absentCountQuery;
        interface absentList {
          name: string;
          TimeIn: string;
          TimeOut: string;
          LeaveStatus: string;
          absCount: number;
        }

        var absentListResult: absentList[] = [];

        if (absentCountQueryResult.length > 0) {
          absentCountQueryResult.forEach((row) => {
            var Name;
            var name = row.name;
            if (name.split(" ").length > 3) {
              var words = name.split(" ", 4);
              var firstthree = words.slice(0, 3);
              Name = firstthree.join(" ") + "...";
            } else {
              Name = name;
            }

            var absentData: absentList = {
              name: Name,
              TimeIn: row.TimeIn,
              TimeOut: row.TimeOut,
              LeaveStatus: row.LeaveStatus,
              absCount: absCount,
            };
            absentListResult.push(absentData);
          });
        } else {
          absentListResult.push();
        }

        data["absent"] = absentListResult;
        return data["absent"];
      }
      //For Today's Absentees
      else {
        AttendanceDate = moment().format("yyyy-MM-DD");

        if (adminStatus == 2) {
          var departmentId = await Helper.getDepartmentIdByEmpID(
            data.EmployeeId
          );
          departmentCondition = `Dept_id = ${departmentId}`;
        }

        var AbsCountQuery = Database.from("AttendanceMaster as A")
          .select(
            Database.raw(`CONCAT (E.FirstName, ' ' ,E.LastName)  as name`),
            Database.raw(` '-' as Timeout `),
            Database.raw(` '-' as TimeOut `)
          )
          .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
          .where("AttendanceDate", AttendanceDate)
          .where("A.OrganizationId", data.OrganizationId)
          .whereIn("AttendanceStatus", [2, 7])
          .orderBy("name", "asc");

        if (data.DesignationId != 0 && data.DesignationId != undefined) {
          designationCondition = ` Desg_id= ${data.DesignationId}`; // From AttendanceMaster
          AbsCountQuery = AbsCountQuery.whereRaw(designationCondition);
        }

        if (departmentCondition != undefined) {
          AbsCountQuery = AbsCountQuery.whereRaw(departmentCondition);
        }

        var AbsCountQueryResult = await AbsCountQuery;

        var AbsentCountQuery = Database.from("EmployeeMaster as E")
          .select(
            Database.raw(
              "DATE_FORMAT(A.AttendanceDate,'%Y-%m-%d') as AttendanceDate"
            ),
            Database.raw(`CONCAT(E.FirstName, ' ', E.LastName) as name`),
            Database.raw(` '-' as TimeIn `),
            Database.raw(` '-' as TimeOut `),
            Database.raw(
              `(select ApprovalStatus FROM AppliedLeave WHERE EmployeeId=E.Id AND ApprovalStatus=2 AND Date=${AttendanceDate}) as LeaveStatus`
            ),
            "A.AttendanceStatus"
          )
          .innerJoin("AttendanceMaster as A", "A.EmployeeId", "E.Id")
          .innerJoin("ShiftMaster as S", "A.ShiftId", "S.Id")
          .where("AttendanceDate", AttendanceDate)
          .whereNotIn(
            "E.Id",
            Database.from("AttendanceMaster as A")
              .select("A.EmployeeId")
              .where("A.AttendanceDate", AttendanceDate)
              .where("A.OrganizationId", data.OrganizationId)
              .whereIn("A.AttendanceStatus", [1, 8, 4, 7])
              .whereNotIn("A.Wo_H_Hd", [11, 12])
          )
          .andWhere("E.OrganizationId", data.OrganizationId)
          .andWhere((builder) => {
            builder
              .where(
                "E.Id",
                Database.raw(
                  `(select empid from ShiftPlanner WHERE ShiftPlanner.orgid=${data.OrganizationId} and ShiftPlanner.empid=E.Id)`
                )
              )
              .orWhere("E.Id", Database.raw(`E.Shift`));
          })
          .groupBy("E.Id")
          .orderBy("name", "asc")
          .limit(25);

        if (data.DesignationId != 0 && data.DesignationId != undefined) {
          designationCondition = `Designation= ${data.DesignationId}`; // From AttendanceMaster
          AbsentCountQuery = AbsentCountQuery.whereRaw(designationCondition);
        }

        if (departmentCondition != undefined) {
          AbsentCountQuery = AbsentCountQuery.whereRaw(departmentCondition);
        }

        var AbsentCountQueryResult = await AbsentCountQuery;
        interface OtherDayAbsentList {
          name: string;
          TimeIn: string;
          TimeOut: string;
          LeaveStatus: string;
        }

        var otherDayAbsentData: OtherDayAbsentList[] = [];
        if (AbsentCountQueryResult.length > 0) {
          AbsentCountQueryResult.forEach((row) => {
            var Name;
            var name = AbsentCountQueryResult[0].name;
            if (name.split(" ").length > 3) {
              var words = name.split(" ", 4);
              var firstthree = words.slice(0, 3);
              Name = firstthree.join(" ") + "...";
            } else {
              Name = name;
            }
            const otherDayAbsentList: OtherDayAbsentList = {
              name: Name,
              TimeIn: row.TimeIn,
              TimeOut: row.TimeOut,
              LeaveStatus: row.LeaveStatus,
            };
            otherDayAbsentData.push(otherDayAbsentList);
          });
        } else {
          otherDayAbsentData.push();
        }

        data["absent"] = AbsCountQueryResult.concat(AbsentCountQueryResult);
        return data["absent"];
      }
    } else if (data.dataFor == "latecomings") {
      var DepartmentCondition;
      if (adminStatus == 2) {
        var DepartmentId = await Helper.getDepartmentIdByEmpID(data.EmployeeId);
        DepartmentCondition = `Dept_id=${DepartmentId}`;
      }

      if (data.date != undefined && data.date != " ") {
        var AttDate = data.date;
        AttendanceDate = AttDate.toFormat("yyyy-MM-dd");
      } else {
        var currDate = moment().format("YYYY-MM-DD");
        AttendanceDate = currDate;
      }

      var LateComingsQuery = Database.from("EmployeeMaster as E")
        .select(
          Database.raw(`CONCAT(FirstName,' ',LastName) as name`),
          Database.raw(`SUBSTR(TimeIn,1,5) as 'TimeIn'`),
          Database.raw(`SUBSTR(TimeOut, 1, 5) as 'TimeOut'`),
          Database.raw(`'Present' as status`),
          Database.raw(
            `SUBSTRING_INDEX(EntryImage, '.com/', -1) as EntryImage`
          ),
          Database.raw(`SUBSTRING_INDEX(ExitImage, '.com/', -1) as ExitImage`),
          Database.raw(`SUBSTR(checkInLoc, 1, 40) as checkInLoc`),
          Database.raw(`SUBSTR(CheckOutLoc, 1, 40) as CheckOutLoc`),
          "latit_in",
          "longi_in",
          "latit_out",
          "longi_out",
          "A.Id",
          "multitime_sts",
          "ShiftId",
          "TotalLoggedHours"
        )
        .where("E.Id", data.EmployeeId)
        .innerJoin("AttendanceMaster as A", "A.EmployeeId", "E.Id")
        .whereRaw(
          `SUBSTRING((TimeIn), 1, 5) > SUBSTRING((SELECT (CASE WHEN (TimeInGrace) != '00:00:00' THEN (TimeInGrace) ELSE (TimeIn) END) FROM ShiftMaster WHERE ShiftMaster.Id = A.ShiftId), 1, 5) AND AttendanceDate="${AttendanceDate}" AND A.OrganizationId=${data.OrganizationId} AND AttendanceStatus IN (1,4,8) AND '3' NOT IN (Select shifttype from ShiftMaster where Id=ShiftId) order by name `
        );

      if (data.DesignationId != 0 && data.DesignationId != undefined) {
        designationCondition = ` Desg_id= ${data.DesignationId}`; // From AttendanceMaster
        LateComingsQuery = LateComingsQuery.whereRaw(designationCondition);
      }
      if (DepartmentCondition != undefined) {
        LateComingsQuery = LateComingsQuery.whereRaw(DepartmentCondition);
      }

      var LateComingsQueryResult = await LateComingsQuery;

      interface LateComingsList {
        name: string;
        TimeIn: string;
        TimeOut: string;
        status: string;
        EntryImage: string;
        ExitImage: string;
        checkInLoc: string;
        checkOutLoc: string;
        latit_in: string;
        latit_out: string;
        Id: number;
        multitime_sts: string;
        shiftType: number;
        getInterimAttAvailableSts: number;
        TotalLoggedHours: string;
      }

      var LateComingsData: LateComingsList[] = [];

      if (LateComingsQueryResult.length > 0) {
        await Promise.all(
          LateComingsQueryResult.map(async (row) => {
            var lateComingsList: LateComingsList = {
              name: row.name,
              TimeIn: row.TimeIn,
              TimeOut: row.TimeOut,
              status: row.status,
              EntryImage: row.EntryImage,
              ExitImage: row.ExitImage,
              checkInLoc: row.checkInLoc,
              checkOutLoc: row.CheckOutLoc,
              latit_in: row.latit_in,
              latit_out: row.latit_out,
              Id: row.Id,
              multitime_sts: row.multitime_sts,
              shiftType: await Helper.getShiftType(row.ShiftId),
              getInterimAttAvailableSts: await Helper.getInterimAttAvailableSt(
                row.Id
              ),

              TotalLoggedHours: row.TotalLoggedHours,
            };

            LateComingsData.push(lateComingsList);
          })
        );
      } else {
        LateComingsData.push();
      }
      data["latecomings"] = LateComingsData;
      return data["latecomings"];
    } else if (data.dataFor == "earlyleavings") {
      if (adminStatus == 2) {
        var DepartmentId = await Helper.getDepartmentIdByEmpID(data.EmployeeId);
        departmentCondition = `Dept_id=${DepartmentId}`;
      }

      if (data.date != undefined && data.date != " ") {
        var AttDate = data.date;
        AttendanceDate = AttDate.toFormat("yyyy-MM-dd");
      } else {
        var currDate = moment().format("YYYY-MM-DD");
        AttendanceDate = currDate;
      }

      var earlyLeavingsQuery = Database.from("AttendanceMaster as A")
        .select(
          Database.raw(`CONCAT(E.FirstName,' ',E.LastName) as name`),
          Database.raw(
            `SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage`
          ),
          Database.raw(
            `SUBSTRING_INDEX(A.ExitImage, '.com/', -1) as ExitImage`
          ),
          Database.raw(`SUBSTR(A.checkInLoc, 1, 40) as checkInLoc`),
          Database.raw(` SUBSTR(A.CheckOutLoc, 1, 40) as CheckOutLoc`),
          "A.TimeIn as TimeIn",
          "A.TimeOut as TimeOut",
          "A.Desg_id",
          "A.ShiftId",
          "A.latit_in",
          "A.longi_in",
          "A.latit_out",
          "A.longi_out",
          "A.Id",
          "A.multitime_sts",
          "A.TotalLoggedHours",
          "S.TimeIn as ShiftTimeIn",
          "S.TimeOut as ShiftTimeOut"
        )
        .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
        .innerJoin("ShiftMaster as S ", "A.ShiftId", "S.Id")
        .where("A.OrganizationId", data.OrganizationId)
        .where("A.Is_Delete", 0)
        .whereRaw(
          `(CASE WHEN (S.shifttype=2 AND A.timeindate= A.timeoutdate)
        THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut)
        WHEN(S.shifttype=2 AND A.timeindate!=A.timeoutdate)
        THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut)
        ELSE CONCAT(A.AttendanceDate,' ',S.TimeOut)END)
         >
         (CASE
         WHEN (A.timeoutdate!='0000-00-00')
         THEN CONCAT(A.timeoutdate,' ',A.TimeOut)  
         WHEN(S.shifttype=2 AND A.timeindate!=A.timeoutdate)
         THEN  CONCAT(A.timeoutdate,' ',A.TimeOut)
         ELSE CONCAT(A.AttendanceDate,' ',A.TimeOut) END) `
        )
        .whereRaw(
          ` A.TimeIn!='00:00:00' And A.TimeOut!='00:00:00' and A.AttendanceStatus NOT IN (2,3,5)`
        )
        .whereRaw(
          ` (CASE WHEN (A.timeoutdate!='0000-00-00')  
         THEN (
         CASE WHEN (S.shifttype=2 AND A.timeindate=A.timeoutdate)
         THEN TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeOut))      
         ELSE TIMEDIFF((  
         CASE WHEN (S.shifttype=2 AND A.timeindate!=A.timeoutdate)
         THEN CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut)
         ELSE  CONCAT(A.AttendanceDate,' ',S.TimeOut) END ) ,
         CONCAT(A.timeoutdate,' ',A.TimeOut)) END)
         ELSE SUBTIME(S.TimeOut, A.TimeIn) END) > '00:00:59'`
        )
        .whereRaw(`A.TimeIn!='00:00:00'`)
        .whereRaw(`A.TimeOut!='00:00:00'`)
        .andWhere("A.AttendanceDate", AttendanceDate)
        .whereRaw("S.shifttype!=3")
        .orderBy("E.FirstName", "asc")
        .limit(limit)
        .offset(offset);

      if (data.DesignationId != 0 && data.DesignationId != undefined) {
        designationCondition = `Desg_id= ${data.DesignationId}`; // From AttendanceMaster
        earlyLeavingsQuery.whereRaw(designationCondition);
      }

      if (departmentCondition != undefined) {
        earlyLeavingsQuery.whereRaw(departmentCondition);
      }
      var earlyLeavingsQueryResult = await earlyLeavingsQuery;

      interface earlyLeavingsInterface {
        shift: string;
        name: string;
        TimeIn: string;
        TimeOut: string;
        EntryImage: string;
        ExitImage: string;
        CheckOutLoc: string;
        checkInLoc: string;
        latit_in: string;
        longi_in: string;
        latit_out: string;
        longi_out: string;
        status: string;
        Id: number;
        multitime_sts: string;
        shiftType: number;
        getInterimAttAvailableSts: string;
        TotalLoggedHours: string;
      }
      var earlyleavings: earlyLeavingsInterface[] = [];

      if (earlyLeavingsQueryResult.length > 0) {
        await Promise.all(
          earlyLeavingsQueryResult.map(async (row) => {
            var shiftTimeIn = row.ShiftTimeIn.slice(0, 5);
            var shiftTimeOut = row.ShiftTimeOut.slice(0, 5);
            var shift = shiftTimeIn + "-" + shiftTimeOut;
            var TimeIn = row.TimeIn.slice(0, 5);
            var TimeOut = row.TimeOut.slice(0, 5);
            var shiftType = await Helper.getShiftType(row.ShiftId);
            var getInterimAttAvailableSts =
              await Helper.getInterimAttAvailableSt(row.Id);
            const earlyleavingsList: earlyLeavingsInterface = {
              shift: shift,
              name: row.name,
              TimeIn: TimeIn,
              TimeOut: TimeOut,
              EntryImage: row.EntryImage,
              ExitImage: row.ExitImage,
              CheckOutLoc: row.CheckOutLoc,
              checkInLoc: row.checkInLoc,
              latit_in: row.latit_in,
              longi_in: row.longi_in,
              latit_out: row.latit_out,
              longi_out: row.longi_out,
              status: row.status,
              Id: row.status,
              multitime_sts: row.multitime_sts,
              shiftType: shiftType,
              getInterimAttAvailableSts: getInterimAttAvailableSts,
              TotalLoggedHours: row.TotalLoggedHours,
            };
            earlyleavings.push(earlyleavingsList);
          })
        );
      }
      data["earlyleavings"] = earlyleavings;
      return data["earlyleavings"];
    }
  }

  public static async saveTimeInOut(allDataOfTimeInOut) {
    let jsonData = JSON.parse(allDataOfTimeInOut.data);
    let interimAttendanceId = 0;
    let statusArray: any[] = [];
    let k = 0;
    let OwnerId: number = 0;
    let areaId: number = 0;
    let HourlyRateId: number = 0;
    let Desg_id: number = 0;
    let Dept_id: number = 0;
    let avtarImg = "https://ubitech.ubihrm.com/public/avatars/male.png";
    let disappstatus = 0;

    ////////////////////////////

    let areaId12;
    let outside_geofence_setting = "";
    let Geofencests;
    let disattreason = "";

    // console.log(jsonData.length)
    // console.log(jsonData[0]['2023-08-26'].interim.length)
    // console.log('jsonlength')

    await Promise.all(jsonData.map(async(row,i)=>{
     // const date = Object.keys(jsonData[i]);
   // }))



    //for (let i = 0; i < jsonData.length; i++) {
      const date = Object.keys(jsonData[i]);

      if (Array.isArray(jsonData[i][date[0]].interim)) {
       // await Promise.all(jsonData[i][date[0]].interim.map(async(rows,j)=>{
         
      //  }))

        for (let j = 0; j < jsonData[i][date[0]].interim.length; j++) {
          let {
            Id = 0,
            UserId = 0,
            ShiftId = "",
            AttendanceMasterId = 0,
            Action = "",
            AttendanceDate = "",
            OrganizationId = 0,
            LatitudeIn = 0,
            LongitudeIn = 0,
            LatitudeOut = 0,
            LongitudeOut = 0,
            TimeInTime = "",
            TimeOutTime = "",
            IsTimeInSynced = 0,
            IsTimeOutSynced = 0,
            FakeTimeInStatus = 0,
            FakeTimeOutStatus = 0,
            FakeLocationInStatus = 0,
            FakeLocationOutStatus = 0,
            GeofenceIn = "",
            GeofenceOut = "",
            TimeInDevice = "",
            TimeOutDevice = "",
            TimeInCity = "",
            TimeOutCity = "",
            TimeInAppVersion = "",
            TimeOutAppVersion = "",
            TimeOutPictureBase64 = "",
            TimeInPictureBase64 = "",
            TimeInApp = "",
            TimeOutApp = "",
            TimeInAddress = "",
            TimeOutAddress = "",
            TimeInDeviceName = "",
            TimeOutDeviceName = "",
            Platform = "",
            SyncTimeIn = "0",
            SyncTimeOut = "0",
            TimeInDeviceId = "",
            TimeOutDeviceId = "",
            TimeInDate = "",
            TimeOutDate = "",
            TimeInStampApp = "",
            TimeOutStampApp = "",
            TimeInRemark = "",
            TimeOutRemark = "",
            orgTopic = "",
            ThumnailTimeOutPictureBase64 = "",
            ThumnailTimeInPictureBase64 = "",
            GeofenceInAreaId = "",
            GeofenceOutAreaId = "",
          } = jsonData[i][date[0]].interim[j];

          console.log(jsonData[i][date[0]].interim[j]);
          console.log("all data of");
          // console.log(j);
          // console.log("all data of");

          const zone = await Helper.getEmpTimeZone(UserId, OrganizationId);
          const defaultZone = DateTime.now().setZone(zone);
          let shiftType = await Helper.getShiftType(ShiftId);
          let attDatePastOneDay = defaultZone
            .minus({ days: 1 })
            .toFormat("yyyy-MM-dd");
          let currentDate = defaultZone.toFormat("yyyy-MM-dd");

          if (shiftType == "1") {
            if (ShiftId == "0" || ShiftId == "" || ShiftId == "") {
              ShiftId = await Helper.getassignedShiftTimes(
                UserId,
                AttendanceDate
              );
            }
          }

          let getSettingOfPunchAttendace = await Database.from(
            "licence_ubiattendance"
          )
            .select("allowOverTime", "Addon_AutoTimeOut")
            .where("OrganizationId", OrganizationId);

          let allowOverTime;
          if (getSettingOfPunchAttendace.length > 0) {
            let allowOverTime = getSettingOfPunchAttendace[0].allowOverTime;
            //let Addon_AutoTimeOut = getSettingOfPunchAttendace[0].Addon_AutoTimeOut;
            if (allowOverTime == 1) {
              allowOverTime = true;
            } else {
              allowOverTime = false;
            }
          }

          if (allowOverTime == true && shiftType != 2) {
            let getlastAttendanceData = await Database.from(
              "licence_ubiattendance"
            )
              .select("*")
              .where("EmployeeId", UserId)
              .andWhere("OrganizationId", OrganizationId)
              .andWhere("TimeOut", "00:00:00")
              .andWhereIn("AttendanceStatus", [1, 3, 5, 8])
              .andWhereBetween("AttendanceDate", [
                attDatePastOneDay,
                currentDate,
              ])
              .orderBy("AttendanceDate", "desc")
              .limit(1);

            if (getSettingOfPunchAttendace.length > 0) {
              AttendanceDate = getlastAttendanceData[0].AttendanceDate;
            }
          }

          let geofencePerm = await Helper.getNotificationPermission(
            OrganizationId,
            "OutsideGeofence"
          );
          let SuspiciousSelfiePerm = await Helper.getNotificationPermission(
            OrganizationId,
            "SuspiciousSelfie"
          );
          let SuspiciousDevicePerm = await Helper.getNotificationPermission(
            OrganizationId,
            "SuspiciousDevice"
          );
          let deviceverificationperm = await Helper.getAddonPermission(
            OrganizationId,
            "Addon_DeviceVerification"
          );

          let addonGeoFenceStst = await Helper.getAddonPermission(
            OrganizationId,
            "Addon_GeoFence"
          );
          let checkRestriction =
            await Helper.getAddon_geoFenceRestrictionByUserId(
              UserId,
              "fencearea",
              OrganizationId
            );

          if (addonGeoFenceStst == 1 && checkRestriction == 1) {
            GeofenceIn = "Within Geofence";
            GeofenceOut = "Within Geofence";
          }

          let time =
            defaultZone.toFormat("HH:mm:ss") == "00:00:00"
              ? "23:59:00"
              : defaultZone.toFormat("HH:mm:ss");
          let stamp = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
          let today = currentDate;
          let name = await Helper.getEmpName(UserId);
          let TimeInStampServer = defaultZone.toFormat("yyyy-MM-dd, HH:mm:ss");
          let TimeOutStampServer = defaultZone.toFormat("yyyy-MM-dd, HH:mm:ss");

          const updateQuery = await Database.query()
            .from("AppliedLeave")
            .where("EmployeeId", UserId)
            .where("HalfDayStatus", "!=", 1)
            .where("OrganizationId", OrganizationId)
            .whereIn("ApprovalStatus", [1, 2])
            .update({
              ApprovalStatus: 4,
              Remarks: "Employee was present",
            });

          const result = await Database.query()
            .from("AppliedLeave")
            .where("EmployeeId", UserId)
            .where("ApprovalStatus", 2)
            .where("HalfDayStatus", 1)
            .where("Date", AttendanceDate)
            .select("*");

          let attendance_sts = result.length > 0 ? 4 : 1;

          const query = await Database.from("AttendanceMaster")
            .where("EmployeeId", UserId)
            .where("AttendanceDate", AttendanceDate)
            .where("disapprove_sts", 1)
            .count("Id as count")
            .first();

          if (query.count > 0) {
            attendance_sts = 2;
          }

          let MultipletimeStatus = await Helper.getShiftMultipleTimeStatus(
            UserId,
            AttendanceDate,
            ShiftId
          );

          const attendanceData = await AttendanceMaster.query()
            .where("EmployeeId", UserId)
            .where("AttendanceDate", AttendanceDate)
            .select("Id", "TimeIn", "TimeOut")
            .first();    

          let attTimeIn = "00:00:00";
          let attTimeOut = "00:00:00";

          console.log('attendanceData==============>');
          console.log(attendanceData);
          console.log('attendanceData==============>');

          if (attendanceData) {
            AttendanceMasterId = attendanceData.Id;
            attTimeIn = attendanceData.TimeIn;
            attTimeOut = attendanceData.TimeOut;
          }
          // console.log("AttendanceMasterId=> "+AttendanceMasterId)

          const EmployeeRecord = await EmployeeMaster.query()
            .where("Id", UserId)
            .select(
              "Shift",
              "Department",
              "Designation",
              "area_assigned",
              "hourly_rate",
              "OwnerId"
            )
            .first();

          if (EmployeeRecord) {
            Dept_id = EmployeeRecord.Department;
            Desg_id = EmployeeRecord.Designation;
            areaId = EmployeeRecord.area_assigned;
            HourlyRateId = EmployeeRecord.hourly_rate;
            OwnerId = EmployeeRecord.OwnerId;
          }
		  
		  
		  console.log(SyncTimeIn == "1" && SyncTimeOut == "1");
		  console.log("start Case");

          if (SyncTimeIn == "1" && SyncTimeOut != "1") {
            let interimAttendanceIdss = 0;

            if (GeofenceIn == "Outside Geofence") {
              // if(geofencePerm==9|| geofencePerm==13||geofencePerm==11|| geofencePerm==15)
              // {
              //     $pageName="Outside Geofence";//to navigate notification Do not change it.
              //     $NotificationId= sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Outside Geofence", "$name has punched Attendance outside Geofence", "$UserId","$OrganizationId","$pageName");

              //     $query=$this->db->query("UPDATE NotificationsList SET PageName = 'Outsidegeofance' WHERE Id = '$NotificationId' ");
              // }

              if (geofencePerm == 13) {
                /////////////Start Mail code Outside Geofence(".$today.")"/////////////
              }
            }

            /////////////////// DeviceVerification code ////////////////////

            if (deviceverificationperm == 1) {
              let employeeDeviceId: any = await Database.from("EmployeeMaster")
                .select("DeviceId")
                .where("Id", `${UserId}`)
                .first();
              if (employeeDeviceId) {
                let verifieddevice = employeeDeviceId.DeviceId;
                let suspiciousdevice = 0;
                if (verifieddevice == TimeInDeviceId) {
                  suspiciousdevice = 0;
                } else {
                  suspiciousdevice = 1;
                  // if(SuspiciousDevicePerm==9|| SuspiciousDevicePerm==13||SuspiciousDevicePerm==11|| SuspiciousDevicePerm==15)
                  // {
                  //   $pageName="Suspicious Device";//to navigate notification Do not change it.
                  //   sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Suspicious Device", "$name's Attendance Device does not match", "$UserId","$OrganizationId","$pageName");
                  // }
                  if (
                    SuspiciousDevicePerm == 5 ||
                    SuspiciousDevicePerm == 13 ||
                    SuspiciousDevicePerm == 7 ||
                    SuspiciousDevicePerm == 15
                  ) {
                    /////////////Enter code of Suspicious Device///////////
                  }
                }
              }
            }

            /////////////////// DeviceVerification code ////////////////////
            console.log("case one for sync Attendance Only Time In");
            let EntryImage =
              ThumnailTimeInPictureBase64 == ""
                ? avtarImg
                : ThumnailTimeInPictureBase64;
            try {
              areaId = GeofenceInAreaId;
              if (AttendanceMasterId == 0) {
                if (
                  OrganizationId == 201958 ||
                  OrganizationId == 126338 ||
                  OrganizationId == 209694 ||
                  OrganizationId == 206065 ||
                  OrganizationId == 10
                ) {
                  areaId12 = await Helper.getAreaIdByUser(UserId);
                  outside_geofence_setting = await Helper.getSettingByOrgId(
                    OrganizationId
                  ); //disapprove_setting on h
                }

                console.log("shakir-----922");
                console.log(OrganizationId);
                console.log(areaId12);
                console.log(addonGeoFenceStst);
                console.log(outside_geofence_setting);
                console.log("shakir-----922");

                Geofencests = addonGeoFenceStst;
                if (
                  areaId12 != 0 &&
                  Geofencests == 1 &&
                  outside_geofence_setting == "1"
                ) {
                  if (GeofenceIn == "") {
                    let areaId1 = areaId12;
                    areaId12 = await Helper.getAreaInfo(areaId1);
                    let lat = areaId12.lat;
                    let long = areaId12.long;
                    let radius = areaId12.radius;
                    let dis = await Helper.calculateDistance(
                      lat,
                      long,
                      LatitudeIn,
                      LongitudeIn,
                      "'K'"
                    );
                    if (dis <= radius) {
                      GeofenceIn = "Within Geofence";
                    } else {
                      GeofenceIn = "Outside Geofence";
                    }
                  }

                  if (GeofenceIn == "Outside Geofence") {
                    attendance_sts = 2;
                    disappstatus = 2; //pending disaaprove
                  }
                }

                const InsertAttendanceTimeiN = await Database.table(
                  "AttendanceMaster"
                )
                  .returning("Id")
                  .insert({
                    TimeInApp: TimeInApp,
                    FakeLocationStatusTimeIn: FakeLocationInStatus,
                    EmployeeId: UserId,
                    AttendanceDate: AttendanceDate,
                    AttendanceStatus: attendance_sts,
                    TimeIn: TimeInTime,
                    ShiftId: ShiftId,
                    Dept_id: Dept_id,
                    Desg_id: Desg_id,
                    areaId: areaId,
                    HourlyRateId: HourlyRateId,
                    OrganizationId: OrganizationId,
                    CreatedDate: today,
                    CreatedById: 0,
                    LastModifiedDate: today,
                    LastModifiedById: 0,
                    OwnerId: OwnerId,
                    Overtime: "00:00:00",
                    EntryImage: EntryImage,
                    checkInLoc: TimeInAddress,
                    device: "mobile",
                    latit_in: LatitudeIn,
                    longi_in: LongitudeIn,
                    timeindate: TimeInDate,
                    Platform: Platform,
                    TimeInDeviceId: TimeInDeviceId,
                    TimeInDeviceName: TimeInDeviceName,
                    timeincity: TimeInCity,
                    TimeInAppVersion: TimeInAppVersion,
                    TimeInGeoFence: GeofenceIn,
                    TimeInDevice: TimeInDevice,
                    multitime_sts: MultipletimeStatus,
                    remark: TimeInRemark,
                    TimeInStampApp: TimeInStampApp,
                    TimeInStampServer: TimeInStampServer,
                    ZoneId: GeofenceInAreaId,
                    disapprove_sts: disappstatus,
                  });

                AttendanceMasterId = InsertAttendanceTimeiN[0];

                if (
                  areaId12 != 0 &&
                  Geofencests == 1 &&
                  outside_geofence_setting == "1" &&
                  AttendanceMasterId != 0 &&
                  GeofenceIn == "Outside Geofence"
                ) {
                  let empcode = ""; //getEmpCode($UserId);
                  let empname = ""; //getEmpName($UserId);
                  let disapprove_datetime = TimeInDate + " " + TimeInTime;
                  disattreason = "Outside Geofence";
                  TimeOutDate = "0000:00:00";
                  let TimeOut = "00:00:00";
                  let remarkfordisapprove = "";
                  let disappstatus = 0;
                  const insertDataOnDisapprove_approve = Database.table(
                    "Disapprove_approve"
                  ).insert({
                    AttendanceId: AttendanceMasterId,
                    EmployeeId: UserId,
                    EmployeeCode: empcode,
                    EmployeeName: empname,
                    ShiftId: ShiftId,
                    deptid: Dept_id,
                    desgid: Desg_id,
                    AttendanceDate: AttendanceDate,
                    OrganizationId: OrganizationId,
                    TimeIn: TimeInTime,
                    TimeOut: TimeOutTime,
                    TimeInDate: TimeInDate,
                    TimeOutDate: TimeOutDate,
                    disapprove_datetime: disapprove_datetime,
                    //disapp_sts: disappstatus,
                    disapprovereason:disattreason,
                    disapp_reason: GeofenceIn,
                    disapp_remark: remarkfordisapprove,
                  }); ////ashish endd////////
                }

                ////////////////////Outside Geofence Restriction end/////////////
                if (
                  OrganizationId == "105999" ||
                  OrganizationId == "10" ||
                  OrganizationId == "168264"
                ) {
                  // $mail = $this->db->query("Select Subject,Body from All_mailers where id=30");
                  //                 $subject='';
                  //                 $mailbody='';
                  //                  $username='';
                  //                  $orgname='';
                  //                  $TimeInTme=date("h:i:s A",strtotime($time));
                  //               if ($email = $mail->result())
                  //                {
                  //                   $subject = $email[0]->Subject;
                  //                   $mailbody = $email[0]->Body;
                  //               }
                  //               $emp=$this->db->query("SELECT E.CurrentEmailId,CONCAT(E.FirstName,' ',E.LastName) as Name ,o.Name as Orgname from EmployeeMaster E,Organization o where E.Id='$UserId' and E.OrganizationId =o.Id and o.Id='$OrganizationId'");
                  //   $emailIn="";
                  //               if($emp1= $emp->result())
                  //               {
                  //                 $username=$emp1[0]->Name;
                  //                  $orgname=$emp1[0]->Orgname;
                  //    $emailIn = decode5t($emp1[0]->CurrentEmailId);
                  //               }
                  //               //$orgname="UbitechSolutions";
                  //              // $username="Ashish";
                  //              // $val= '<p style="width:15%!important;">'.$TimeInAddress.'</p>';
                  //               $Tminval = $TimeInTme;
                  //               $Tmoutval = ' -';
                  //               $TmIN ='Time In';
                  //               $TimeInAddrss = $TimeInAddress;
                  //               $TimeOutAddrss = ' -';
                  //               $latitin = $LatitudeIn.",".$LongitudeIn;
                  //               $mailbody1 = $mailbody;
                  //               $mailbody2 = str_replace('{Akanksha Dubey}', $username, $mailbody1);
                  //               $mailbody3 = str_replace('{Organization Name/School Name}',$orgname,$mailbody2);
                  //               $mailbody4 = str_replace('11:01 AM.',$Tminval,$mailbody3);
                  //               $mailbody5= str_replace('{Name}', $username,$mailbody4);
                  //               $mailbody6= str_replace('{Time-In}',$Tminval,$mailbody5);
                  //               $mailbody7=str_replace('{Time_out}', $Tmoutval,$mailbody6);
                  //               $mailbody8=str_replace('{Time-InLocation}', $TimeInAddrss,$mailbody7);
                  //               //$mailbody9=str_replace('{Time-InLocation}', $TimeInAddrss,$mailbody8);
                  //               $mailbody9 = str_replace('{Time_outLocation}',$TimeOutAddrss,
                  //                $mailbody8);
                  //    $mailbody10 = str_replace('{latit-In}', $latitin,
                  //                $mailbody9);
                  //    $mlbody11= str_replace('{latit-out}','-', $mailbody10);
                  //    $message = $mlbody11;
                  //               $headers = "MIME-Version: 1.0" . "\r\n";
                  //               $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                  //               $headers .= 'From: <noreply@ubiattendance.com>' . "\r\n";
                  /* sendEmail_new1("ashish@ubitechsolutions.com", $subject, $message, $headers);*/
                  //sendEmail_new("shumyla@ubitechsolutions.com", $subject, $message,$headers);
                  //sendEmail_new($emailIn, $subject, $message, $headers);
                }
              }

              if (MultipletimeStatus == 1 || shiftType == "3") {
			  let getInterimAttIds=0;
                if (AttendanceMasterId != 0) {
                  const queryResult = await Database.from("InterimAttendances")
                    .select("Id")
                    .where("AttendanceMasterId", AttendanceMasterId)
                    .andWhere("TimeIn", TimeInTime);

                  if (queryResult.length > 0) {
                    getInterimAttIds = queryResult[0].Id;
                  }

                  if (getInterimAttIds == 0) {
                    // Insert into InterimAttendances
                    const InsertAttendanceInInterimTimeiN =
                      await Database.table("InterimAttendances")
                        .returning("id")
                        .insert({
                          TimeIn: TimeInTime,
                          TimeInImage: EntryImage,
                          TimeInLocation: TimeInAddress,
                          LatitudeIn: LatitudeIn,
                          LongitudeIn: LongitudeIn,
                          TimeOut: TimeInTime, // Note: TimeOut seems to be the same as TimeIn in your query
                          Device: "mobile",
                          FakeLocationStatusTimeIn: FakeLocationInStatus,
                          Platform: Platform,
                          TimeInCity: TimeInCity,
                          TimeInAppVersion: TimeInAppVersion,
                          TimeInGeofence: GeofenceIn,
                          AttendanceMasterId: AttendanceMasterId,
                          TimeInDeviceId: TimeInDeviceId,
                          TimeInDeviceName: TimeInDeviceName,
                          TimeInRemark: TimeInRemark,
                          TimeInDate: TimeInDate,
                          TimeInStampApp: TimeInStampApp,
                          TimeInStampServer: TimeInStampServer,
                          EmployeeId: UserId,
                          OrganizationId: OrganizationId,
                        });

                    interimAttendanceId = InsertAttendanceInInterimTimeiN[0];
                  }
                }
              }
              statusArray[k] = {
                Time: TimeInTime,
                Date: AttendanceDate,
                Action: "TimeIn",
                EmpId: UserId,
                InterimId: Id,
                InterimAttendanceId: interimAttendanceId,
                AttendanceMasterId: AttendanceMasterId,
              };
              k++;
            } catch (error) {
              const errorMsg = "Message: " + error.message;
              const status = 0;
            }
          }
          //******************************start second case****************************//
          else if (SyncTimeIn == "1" && SyncTimeOut == "1") {
		  console.log("inside both case");
            //let interimAttendanceIds=0
            console.log(
              "*************case mark attendance both****************"
            );
            let interimAttendanceIds = 0;
            let EntryImage =
              ThumnailTimeInPictureBase64 == ""
                ? avtarImg
                : ThumnailTimeInPictureBase64;
            let ExitImage =
              ThumnailTimeOutPictureBase64 == ""
                ? avtarImg
                : ThumnailTimeOutPictureBase64;

            try {
              let areaId = GeofenceInAreaId;
              let areaIdOut = GeofenceOutAreaId;
              console.log("shakir+AttendanceMasterId"+ AttendanceMasterId);

              if (AttendanceMasterId == 0) {
                if (GeofenceIn == "Outside Geofence") {
                  if (geofencePerm == 13) {
                    ///////////Out side Geofence code start Here///
                  }
                }

                if (GeofenceOut == "Outside Geofence") {
                  if (geofencePerm == 13) {
                    ///////////Out side Geofence code start Here///
                  }
                }
                console.log("shakir+deviceverificationperm"+ deviceverificationperm);
                // if (deviceverificationperm == 1) {
                //   let employeeDeviceId: any = await Database.from(
                //     "EmployeeMaster"
                //   )
                //     .select("DeviceId")
                //     .where("Id", `${UserId}`)
                //     .first();
                //   if (employeeDeviceId) {
                //     let verifieddevice = employeeDeviceId.DeviceId;
                //     let suspiciousdevice = 0;
                //     if (
                //       verifieddevice == TimeInDeviceId &&
                //       verifieddevice == TimeOutDeviceId
                //     ) {
                //       suspiciousdevice = 0;
                //     } else {
                //       suspiciousdevice = 1;
                //       // if(SuspiciousDevicePerm==9|| SuspiciousDevicePerm==13||SuspiciousDevicePerm==11|| SuspiciousDevicePerm==15)
                //       // {
                //       //   $pageName="Suspicious Device";//to navigate notification Do not change it.
                //       //   sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Suspicious Device", "$name's Attendance Device does not match", "$UserId","$OrganizationId","$pageName");
                //       // }
                //       if (
                //         SuspiciousDevicePerm == 5 ||
                //         SuspiciousDevicePerm == 13 ||
                //         SuspiciousDevicePerm == 7 ||
                //         SuspiciousDevicePerm == 15
                //       ) {
                //         /////////////Enter code of Suspicious Device///////////
                //       }
                //     }
                //   }
                // }
                let Zone_id = 0;

                if (
                  OrganizationId == 201958 ||
                  OrganizationId == 126338 ||
                  OrganizationId == 209694 ||
                  OrganizationId == 206065 ||
                  OrganizationId == 10
                ) {
                  areaId12 = await Helper.getAreaIdByUser(UserId);
                  outside_geofence_setting = await Helper.getSettingByOrgId(
                    OrganizationId
                  ); //disapprove_setting on h
                  console.log("shakir+areaId12"+ areaId12);
                  console.log("shakir+outside_geofence_setting"+ outside_geofence_setting);
                }
                Geofencests = addonGeoFenceStst;
                if (
                  areaId12 != 0 &&
                  Geofencests == 1 &&
                  outside_geofence_setting == "1"
                ) {
                  if (
                    (GeofenceIn == "" && GeofenceOut == "") ||
                    GeofenceIn == "" ||
                    GeofenceOut == ""
                  ) {
                    let areaId1 = areaId12;
                    areaId12 = await Helper.getAreaInfo(areaId1);
                    let lat = areaId12.lat;
                    let long = areaId12.long;
                    let radius = areaId12.radius;
                    let dis = await Helper.calculateDistance(
                      lat,
                      long,
                      LatitudeIn,
                      LongitudeIn,
                      "'K'"
                    );
                    if (dis <= radius) {
                      if (GeofenceIn == "") {
                        GeofenceIn = "Within Geofence";
                      }
                      if (GeofenceOut == "") {
                        GeofenceOut = "Within Geofence";
                      }
                    } else {
                      if (GeofenceIn == "") {
                        GeofenceIn = "Outside Geofence";
                      }
                      if (GeofenceOut == "") {
                        GeofenceOut = "Outside Geofence";
                      }
                    }
                  }

                  if (
                    (GeofenceIn == "Outside Geofence" &&
                      GeofenceOut != "Outside Geofence") ||
                    (GeofenceIn == "Outside Geofence" &&
                      GeofenceOut == "Outside Geofence") ||
                    (GeofenceIn != "Outside Geofence" &&
                      GeofenceOut == "Outside Geofence")
                  ) {
                    attendance_sts = 2;
                    disappstatus = 2; //pending disaaprove
                    disattreason = "Outside Geofence";
                  }
                }
                const InsertAttendanceTimeiN = await Database.table(
                  "AttendanceMaster"
                )
                  .returning("id")
                  .insert({
                    TimeInApp: TimeInApp,
                    TimeOutApp: TimeOutApp,
                    FakeLocationStatusTimeIn: FakeLocationInStatus,
                    FakeLocationStatusTimeOut: FakeLocationOutStatus,
                    EmployeeId: UserId,
                    AttendanceDate: AttendanceDate,
                    AttendanceStatus: attendance_sts,
                    TimeIn: TimeInTime,
                    TimeOut: TimeOutTime,
                    ShiftId: ShiftId,
                    Dept_id: Dept_id,
                    Desg_id: Desg_id,
                    areaId: areaId,
                    HourlyRateId: HourlyRateId,
                    OrganizationId: OrganizationId,
                    CreatedDate: today,
                    CreatedById: UserId,
                    LastModifiedDate: stamp,
                    LastModifiedById: UserId,
                    OwnerId: UserId,
                    EntryImage: EntryImage,
                    ExitImage: ExitImage,
                    checkInLoc: TimeInAddress,
                    checkOutLoc: TimeOutAddress,
                    device: "mobile",
                    latit_in: LatitudeIn,
                    longi_in: LongitudeIn,
                    latit_out: LatitudeOut,
                    longi_out: LongitudeOut,
                    timeindate: TimeInDate,
                    timeoutdate: TimeOutDate,
                    Platform: Platform,
                    TimeInDeviceId: TimeInDeviceId,
                    TimeOutDeviceId: TimeOutDeviceId,
                    TimeInDeviceName: TimeInDeviceName,
                    TimeOutDeviceName: TimeOutDeviceName,
                    timeincity: TimeInCity,
                    timeoutcity: TimeOutCity,
                    TimeInAppVersion: TimeInAppVersion,
                    TimeOutAppVersion: TimeOutAppVersion,
                    TimeInGeoFence: GeofenceIn,
                    TimeOutGeoFence: GeofenceOut,
                    TimeInDevice: TimeInDevice,
                    TimeOutDevice: TimeOutDevice,
                    multitime_sts: MultipletimeStatus,
                    remark: TimeInRemark,
                    remarks: TimeOutRemark,
                    TimeInStampApp: TimeInStampApp,
                    TimeOutStampApp: TimeOutStampApp,
                    TimeInStampServer: TimeInStampServer,
                    TimeOutStampServer: TimeOutStampServer,
                    areaIdTimeOut: areaIdOut,
                    //disapp_sts: disappstatus,
                    disapprovereason:disattreason,
                    ZoneId: Zone_id,
                  });
                AttendanceMasterId = InsertAttendanceTimeiN[0];
              console.log("shakir+AFETR INSERT AttendanceMasterId"+ AttendanceMasterId);

                if((areaId12 != 0)&&(Geofencests == 1)&&(outside_geofence_setting == "1") && ((GeofenceIn=="Outside Geofence" && GeofenceOut!="Outside Geofence") || (GeofenceIn=="Outside Geofence" && GeofenceOut=="Outside Geofence") || (GeofenceIn!="Outside Geofence" && GeofenceOut=="Outside Geofence")))
                  {  
                     
                                 let empId;
                                 let ShiftId1;
                                 let deptid1;
                                 let Desg_id1;
                                 let timein1;
                                 let timeout1;
                                 let TimeInDate1;
                                 let TimeOutDate1;
                                 let attdate;
                                 let remarkfordisapprove;
                               

                               const getAttendanceData=await Database.from("AttendanceMaster").select("EmployeeId","ShiftId","Dept_id","Desg_id","TimeIn","TimeOut","timeindate","timeoutdate","AttendanceDate").where("Id",AttendanceMasterId).first()
                                if(getAttendanceData) {
                                    empId=getAttendanceData.EmployeeId;
                                    ShiftId1=getAttendanceData.ShiftId;
                                    deptid1=getAttendanceData.Dept_id;
                                    Desg_id1=getAttendanceData.Desg_id;
                                    timein1=getAttendanceData.TimeIn;
                                    timeout1=getAttendanceData.TimeOut;
                                    TimeInDate1= getAttendanceData.timeindate;
                                    TimeOutDate1= getAttendanceData.timeoutdate;
                                    attdate=getAttendanceData.AttendanceDate;
                                }

                                let empcode="";
                                let empname="";
                                TimeInDate=attdate;
                                disattreason="Outside Geofence";
                                disappstatus=0;

                                const insertDataOnDisapprovAtt=await Database.table("Disapprove_approve").insert({
                                  AttendanceId:AttendanceMasterId,
                                  EmployeeId:UserId,
                                  EmployeeCode:empcode,
                                  EmployeeName:empname,
                                  ShiftId:ShiftId1,
                                  deptid:deptid1,
                                  desgid:Desg_id1,
                                  AttendanceDate:attdate,
                                  OrganizationId:OrganizationId,
                                  TimeIn:timein1,
                                  TimeOut:timeout1,
                                  TimeInDate:TimeInDate1,
                                  TimeOutDate:TimeOutDate1,
                                  disapprove_datetime:currentDate,
                                  disapp_sts:disappstatus,
                                  disapp_reason:disattreason,
                                  disapp_remark:remarkfordisapprove
                                })
                            }
              }

             console.log("MultipletimeStatus===>"+MultipletimeStatus);
              if (MultipletimeStatus == 1 || shiftType == "3") {
			  let interimAttIds=0;
                if (AttendanceMasterId != 0) {
                  const query = Database.from("InterimAttendances")
                    .where("AttendanceMasterId", AttendanceMasterId)
                    .where("TimeIn", TimeInTime)
                    .select("id");
				
					
                  const haveInterimId: any = await query;
				  
				  console.log("check interim Ids")
				  console.log(haveInterimId);
				  console.log(haveInterimId.length > 0);
				  console.log("check interim Ids")
                  if (haveInterimId.length > 0) {
                    interimAttIds = haveInterimId[0].id;
                  }
                }

                console.log("deepak"+TimeInTime);
                console.log("deepak"+interimAttendanceIds);
                if (interimAttIds == 0) {
                  console.log("new Insert Query for interim");

                  const query = Database.table("InterimAttendances")
                    .returning("id")
                    .insert({
                      TimeIn: TimeInTime,
                      TimeOut: TimeOutTime,
                      TimeInImage: EntryImage,
                      TimeOutImage: ExitImage,
                      TimeInLocation: TimeInAddress,
                      TimeOutLocation: TimeOutAddress,
                      LatitudeIn: LatitudeIn,
                      LatitudeOut: LatitudeOut,
                      LongitudeIn: LongitudeIn,
                      LongitudeOut: LongitudeOut,
                      Device: "mobile",
                      FakeLocationStatusTimeIn: FakeLocationInStatus,
                      FakeLocationStatusTimeOut: FakeLocationOutStatus,
                      Platform: Platform,
                      TimeInCity: TimeInCity,
                      TimeOutCity: TimeOutCity,
                      TimeInAppVersion: TimeInAppVersion,
                      TimeOutAppVersion: TimeOutAppVersion,
                      TimeInGeofence: GeofenceIn,
                      TimeOutGeofence: GeofenceOut,
                      AttendanceMasterId: AttendanceMasterId,
                      TimeInDeviceId: TimeInDeviceId,
                      TimeOutDeviceId: TimeOutDeviceId,
                      TimeInDeviceName: TimeInDeviceName,
                      TimeOutDeviceName: TimeOutDeviceName,
                      LoggedHours: Database.raw("TIMEDIFF(?, ?)", [
                        `${AttendanceDate} ${TimeOutTime}`,
                        `${AttendanceDate} ${TimeInTime}`,
                      ]),
                      TimeInRemark: TimeInRemark,
                      TimeOutRemark: TimeOutRemark,
                      TimeInDate: TimeInDate,
                      TimeOutDate: TimeOutDate,
                      TimeInStampApp: TimeInStampApp,
                      TimeOutStampApp: TimeOutStampApp,
                      TimeInStampServer: TimeInStampServer,
                      TimeOutStampServer: TimeOutStampServer,
                      EmployeeId: UserId,
                      OrganizationId: OrganizationId,
                    });

                  let InsertAttendanceTimeInOut = await query;
                  console.log("////////////////"+InsertAttendanceTimeInOut)
                  interimAttendanceIds = InsertAttendanceTimeInOut[0];
                }
              }

              // //update totalloggedhours and overtime in shifttype 3 AND MultipletimeStatus 1//

              if (MultipletimeStatus == 1 || shiftType == "3") {
                let calculatedOvertime = "00:00:00";
                let totalLoggedHours = "00:00:00";
                let hoursPerDay = "00:00:00";

                const query = await Database.from("InterimAttendances")
                  .select("Id")
                  .select(
                    Database.raw(
                      "SEC_TO_TIME(SUM(TIME_TO_SEC(LoggedHours))) as totalLoggedHours"
                    )
                  )
                  .select(
                    Database.raw(
                      `(select HoursPerDay from ShiftMaster where Id = '${ShiftId}') as hoursPerDay`
                    )
                  )
                  .where("AttendanceMasterId", AttendanceMasterId);

                if (query.length > 0) {
                  hoursPerDay = query[0].hoursPerDay;
                  totalLoggedHours = query[0].totalLoggedHours;
                }

                const { hours, minutes, seconds } = Helper.calculateOvertime(
                  hoursPerDay,
                  totalLoggedHours
                );
                console.log(hours + ":" + minutes + ":" + seconds);
                calculatedOvertime = hours + ":" + minutes + ":" + seconds;
                console.log(
                  "calculatedOvertime Case Three" + calculatedOvertime
                );

                const updateLoggedHours = Database.from("AttendanceMaster")
                  .where("id", AttendanceMasterId)
                  .update({
                    overtime: calculatedOvertime,
                    TotalLoggedHours: totalLoggedHours,
                  });
                await updateLoggedHours;
              }

              // update totalloggedhours and overtime in shifttype 1 & 2 AND MultipletimeStatus 0 //
              if (
                (shiftType == "1" || shiftType == "2") &&
                MultipletimeStatus != 1
              ) {
                let calculatedOvertime = "00:00:00";
                let totalLoggedHours = "00:00:00";

                const getOvertTime = await Database.from(
                  "AttendanceMaster as A"
                )
                  .select(
                    "A.TimeIn as attTimeIn",
                    "A.TimeOut as attTimeOut",
                    "C.TimeIn as shiftTimeIn",
                    "C.TimeOut as shiftTimeOut",
                    Database.raw(
                      "TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn)) as TotalLoggedHours"
                    ),
                    Database.raw(
                      "(CASE WHEN (C.shifttype=2) THEN SUBTIME(TIMEDIFF(CONCAT('2021-08-21', ' ', C.TimeOut), CONCAT('2021-08-20', ' ', C.TimeIn)), TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn))) ELSE SUBTIME(TIMEDIFF(A.TimeOut, A.TimeIn), TIMEDIFF(C.TimeOut, C.TimeIn)) END) as overtime"
                    )
                  )
                  .innerJoin("ShiftMaster as C", "A.ShiftId", "C.Id")
                  .where("A.Id", AttendanceMasterId)
                  .first(); // Use 'first()' to get the first row of the result

                if (getOvertTime) {
                  totalLoggedHours = getOvertTime.TotalLoggedHours;
                  calculatedOvertime = getOvertTime.overtime;
                }
                const query = await Database.from("AttendanceMaster")
                  .where("id", AttendanceMasterId)
                  .update({
                    overtime: calculatedOvertime,
                    TotalLoggedHours: totalLoggedHours,
                  });
              }
              //// update totalloggedhours and overtime in shifttype 1 & 2 AND MultipletimeStatus 0 //

              //////////////////////////// Half Day Status /////////////////////
              const results = await Database.from("AttendanceMaster as A")
                .innerJoin("ShiftMaster as S", "A.ShiftId", "S.Id")
                .select(
                  "S.TimeIn as ShiftTimeIn",
                  "S.TimeOut as ShiftTimeOut",
                  "S.shifttype",
                  "S.HoursPerDay"
                )
                .select(
                  Database.raw(`(CASE
                    WHEN (S.shifttype = 1) THEN SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(S.TimeOut, S.TimeIn)) / 2)
                    WHEN (S.shifttype = 2) THEN SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(CONCAT('2021-08-07', ' ', S.TimeOut), CONCAT('2021-08-06', ' ', S.TimeIn))) / 2)
                    WHEN (S.shifttype = 3) THEN SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(S.HoursPerDay, A.TotalLoggedHours)) / 2)
                    ELSE 0 END) as halfshift`)
                )
                .select("A.TotalLoggedHours as TotalLoggedHours")
                .where("A.Id", AttendanceMasterId);

              const halfshiftTimestamp = new Date(
                `1970-01-01T${results[0].halfshift}Z`
              ).getTime();
              const totalLoggedHoursTimestamp = new Date(
                `1970-01-01T${results[0].TotalLoggedHours}Z`
              ).getTime();

              let halfDayStatus;

              if (halfshiftTimestamp > totalLoggedHoursTimestamp) {
                halfDayStatus = 13;
              } else {
                halfDayStatus = 0;
              }

              const updateHalfdayStatus = await Database.from(
                "AttendanceMaster"
              )
                .where("Id", AttendanceMasterId)
                .update({
                  Wo_H_Hd: halfDayStatus,
                });

              statusArray[k] = {
                Time: TimeInTime,
                Date: AttendanceDate,
                Action: "TimeIn",
                EmpId: UserId,
                InterimId: Id,
                InterimAttendanceId: interimAttendanceIds,
                AttendanceMasterId: AttendanceMasterId,
              };
              k++;

              statusArray[k] = {
                Time: TimeOutTime,
                Date: AttendanceDate,
                Action: "TimeOut",
                EmpId: UserId,
                InterimId: Id,
                InterimAttendanceId: interimAttendanceIds,
                AttendanceMasterId: AttendanceMasterId,
              };
              k++;
              //console.log(statusArray);
            } catch (error) {}
          }
          //******************************End second case****************************//
          //******************************start third case****************************//
          else if (SyncTimeIn != "1" && SyncTimeOut == "1") {
            let ExitImage =
              ThumnailTimeOutPictureBase64 == ""
                ? avtarImg
                : ThumnailTimeOutPictureBase64;
            let areaIdOut = GeofenceOutAreaId;
            let calculatedOvertime = "00:00:00";
            let totalLoggedHours = "00:00:00";
            let hoursPerDay = "00:00:00";


                  if((GeofenceOut=="Outside Geofence"))
                    {
                        if(geofencePerm==9|| geofencePerm==13||geofencePerm==11|| geofencePerm==15)
                        {
                            // $pageName="Outside Geofence";//to navigate notification Do not change it.
                            // $NotificationId= sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Outside Geofence", "$name has punched Attendance outside Geofence", "$UserId","$OrganizationId","$pageName");
                            // $query=$this->db->query("UPDATE NotificationsList SET PageName = 'Outsidegeofance' WHERE Id = '$NotificationId' ");
                        }

                if(geofencePerm == 13){
                              ///////////send outside geofence mail code here////////////
                            }
                       
                    }

                    if (deviceverificationperm == 1) {
                      let employeeDeviceId: any = await Database.from(
                        "EmployeeMaster"
                      )
                        .select("DeviceId")
                        .where("Id", `${UserId}`)
                        .first();
                      if (employeeDeviceId) {
                        let verifieddevice = employeeDeviceId.DeviceId;
                        let suspiciousdevice = 0;
                        if (verifieddevice == TimeOutDeviceId) {
                          suspiciousdevice = 0;
                        } else {
                          suspiciousdevice = 1;
                          // if(SuspiciousDevicePerm==9|| SuspiciousDevicePerm==13||SuspiciousDevicePerm==11|| SuspiciousDevicePerm==15)
                          // {
                          //   $pageName="Suspicious Device";//to navigate notification Do not change it.
                          //   sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Suspicious Device", "$name's Attendance Device does not match", "$UserId","$OrganizationId","$pageName");
                          // }
                          if (
                            SuspiciousDevicePerm == 5 ||
                            SuspiciousDevicePerm == 13 ||
                            SuspiciousDevicePerm == 7 ||
                            SuspiciousDevicePerm == 15
                          ) {
                            /////////////Enter code of Suspicious Device///////////
                          }
                        }
                      }
                    }






            if (MultipletimeStatus == 1 || shiftType == "3") {
              let timeOutAlreadySyncedId = 0;

              if (AttendanceMasterId == 0) {
                const getAttnadaceRecord = await Database.from(
                  "AttendanceMaster"
                )
                  .select("Id")
                  .where("EmployeeId", UserId)
                  .whereBetween("AttendanceDate", [
                    Database.raw(
                      `date_sub('${AttendanceDate}', interval 1 day)`
                    ),
                    AttendanceDate,
                  ])
                  .orderBy("AttendanceDate", "desc")
                  .limit(1);

                if (getAttnadaceRecord.length > 0) {
                  AttendanceMasterId = getAttnadaceRecord[0].Id;
                }
              }

              const maxIdOfInterimAttendance = await Database.from(
                "InterimAttendances"
              )
                .select("Id")
                .where("AttendanceMasterId", AttendanceMasterId)
                .orderBy("Id", "desc")
                .first();

              if (maxIdOfInterimAttendance) {
                interimAttendanceId = maxIdOfInterimAttendance.Id;
              }

              if (interimAttendanceId != 0) {
                const alreadyMarkedTimeOutId = await Database.from(
                  "InterimAttendances"
                )
                  .select("Id")
                  .where("AttendanceMasterId", AttendanceMasterId)
                  .andWhere("TimeOut", TimeOutTime)
                  .orderBy("Id", "desc")
                  .first();

                if (alreadyMarkedTimeOutId) {
                  timeOutAlreadySyncedId = alreadyMarkedTimeOutId.Id;
                }

                const loggedHoursResult = await Database.from(
                  "InterimAttendances"
                )
                  .select(
                    Database.raw(
                      `TIMEDIFF(CONCAT(?, ' ', ?), CONCAT(TimeInDate, ' ', TimeIn)) as loggedHours`,
                      [TimeOutDate, TimeOutTime]
                    )
                  )
                  .where("Id", interimAttendanceId)
                  .first();

                const loggedHours = loggedHoursResult.loggedHours;

                const updateQuery = await Database.from("InterimAttendances")
                  .where("Id", interimAttendanceId)
                  .update({
                    FakeLocationStatusTimeOut: FakeLocationOutStatus,
                    TimeOutImage: ExitImage,
                    TimeOutLocation: TimeOutAddress,
                    LatitudeOut: LatitudeOut,
                    LongitudeOut: LongitudeOut,
                    TimeOut: TimeOutTime,
                    TimeOutDeviceId: TimeOutDeviceId,
                    TimeOutDeviceName: TimeOutDeviceName,
                    TimeOutCity: TimeOutCity,
                    TimeOutAppVersion: TimeOutAppVersion,
                    TimeOutGeofence: GeofenceOut,
                    LoggedHours: loggedHours,
                    TimeOutDate: TimeOutDate,
                    TimeOutRemark: TimeOutRemark,
                    TimeOutStampApp: TimeOutStampApp,
                    TimeOutStampServer: TimeOutStampServer,
                  });
              }

              const calculateLoggedHours = await Database.from(
                "InterimAttendances as I"
              )
                .select(
                  "A.Id",
                  "A.ShiftId",
                  Database.raw(
                    "SEC_TO_TIME(SUM(TIME_TO_SEC(I.LoggedHours))) as totalLoggedHours"
                  ),
                  Database.raw(
                    `(SELECT (CASE WHEN (shifttype=1) THEN TIMEDIFF(TimeOut,TimeIn) WHEN (shifttype=2) THEN TIMEDIFF(CONCAT('2021-10-11', ' ', TimeOut), CONCAT('2021-10-10', ' ', TimeIn)) WHEN (shifttype=3) THEN HoursPerDay END) FROM ShiftMaster WHERE Id=A.ShiftId) as hoursPerDay`
                  )
                )
                .innerJoin(
                  "AttendanceMaster as A",
                  "A.Id",
                  "I.AttendanceMasterId"
                )
                .where("I.AttendanceMasterId", AttendanceMasterId)
                .groupBy("A.Id", "A.ShiftId");

              if (calculateLoggedHours.length > 0) {
                totalLoggedHours = calculateLoggedHours[0].totalLoggedHours;
                let hoursPerDay = calculateLoggedHours[0].hoursPerDay;
                const { hours, minutes, seconds } = Helper.calculateOvertime(
                  hoursPerDay,
                  totalLoggedHours
                );
                console.log(hours + ":" + minutes + ":" + seconds);
                calculatedOvertime = hours + ":" + minutes + ":" + seconds;
                console.log("calculatedOvertime" + calculatedOvertime);
              }
            }
             


            if (
              OrganizationId == 201958 ||
              OrganizationId == 126338 ||
              OrganizationId == 209694 ||
              OrganizationId == 206065 ||
              OrganizationId == 10
            ) {
              areaId12 = await Helper.getAreaIdByUser(UserId);
              outside_geofence_setting = await Helper.getSettingByOrgId(
                OrganizationId
              ); //disapprove_setting on h
            }
            Geofencests = addonGeoFenceStst;
            if (
              areaId12 != 0 &&
              Geofencests == 1 &&
              outside_geofence_setting == "1"
            ) {
              if (
                (GeofenceOut == "")) {
                let areaId1 = areaId12;
                areaId12 = await Helper.getAreaInfo(areaId1);
                let lat = areaId12.lat;
                let long = areaId12.long;
                let radius = areaId12.radius;
                let dis = await Helper.calculateDistance(
                  lat,
                  long,
                  LatitudeIn,
                  LongitudeIn,
                  "'K'"
                );
                if (dis <= radius) {
                  if (GeofenceOut == "") {
                    GeofenceOut = "Within Geofence";
                  }
                } else {
                  if (GeofenceOut == "") {
                    GeofenceOut = "Outside Geofence";
                  }
                }
              }

              if ( GeofenceOut == "Outside Geofence" ) {
                attendance_sts = 2;
                disappstatus = 2; //pending disaaprove
                disattreason = "Outside Geofence";
              }
            }

            const updateResult: any = await AttendanceMaster.query()
              .where("id", AttendanceMasterId)
              .update({
                FakeLocationStatusTimeOut: FakeLocationOutStatus,
                ExitImage: ExitImage,
                CheckOutLoc: TimeOutAddress,
                latit_out: LatitudeOut,
                longi_out: LongitudeOut,
                TimeOut: TimeOutTime,
                TimeOutDeviceId: TimeOutDeviceId,
                TimeOutDeviceName: TimeOutDeviceName,
                timeoutcity: TimeOutCity,
                LastModifiedDate: stamp,
                TimeOutApp: TimeOutApp,
                timeoutdate: TimeOutDate,
                TimeOutAppVersion: TimeOutAppVersion,
                TimeOutGeoFence: GeofenceOut,
                TimeOutDevice: TimeOutDevice,
                AttendanceStatus: attendance_sts,
                remarks: TimeOutRemark,
                TimeOutStampApp: TimeOutStampApp,
                TimeOutStampServer: TimeOutStampServer,
                areaIdTimeOut: areaIdOut,
                disapprove_sts: disappstatus,
                disapprovereason: disattreason,
                overtime: calculatedOvertime,
                TotalLoggedHours: totalLoggedHours,
              });


              if((areaId12 != 0)&&(Geofencests == 1)&&(outside_geofence_setting == "1") && (GeofenceOut=="Outside Geofence"))
                  {  
                     
                                 let empId;
                                 let ShiftId1;
                                 let deptid1;
                                 let Desg_id1;
                                 let timein1;
                                 let timeout1;
                                 let TimeInDate1;
                                 let TimeOutDate1;
                                 let attdate;
                                 let remarkfordisapprove;
                               

                               const getAttendanceData=await Database.from("AttendanceMaster").select("EmployeeId","ShiftId","Dept_id","Desg_id","TimeIn","TimeOut","timeindate","timeoutdate","AttendanceDate").where("Id",AttendanceMasterId).first()
                                if(getAttendanceData) {
                                    empId=getAttendanceData.EmployeeId;
                                    ShiftId1=getAttendanceData.ShiftId;
                                    deptid1=getAttendanceData.Dept_id;
                                    Desg_id1=getAttendanceData.Desg_id;
                                    timein1=getAttendanceData.TimeIn;
                                    timeout1=getAttendanceData.TimeOut;
                                    TimeInDate1= getAttendanceData.timeindate;
                                    TimeOutDate1= getAttendanceData.timeoutdate;
                                    attdate=getAttendanceData.AttendanceDate;
                                }

                                let empcode="";
                                let empname="";
                                TimeInDate=attdate;
                                disattreason="Outside Geofence";
                                disappstatus=0;

                                const insertDataOnDisapprovAtt=await Database.table("Disapprove_approve").insert({
                                  AttendanceId:AttendanceMasterId,
                                  EmployeeId:UserId,
                                  EmployeeCode:empcode,
                                  EmployeeName:empname,
                                  ShiftId:ShiftId1,
                                  deptid:deptid1,
                                  desgid:Desg_id1,
                                  AttendanceDate:attdate,
                                  OrganizationId:OrganizationId,
                                  TimeIn:timein1,
                                  TimeOut:timeout1,
                                  TimeInDate:TimeInDate1,
                                  TimeOutDate:TimeOutDate1,
                                  disapprove_datetime:currentDate,
                                  disapp_sts:disappstatus,
                                  disapp_reason:disattreason,
                                  disapp_remark:remarkfordisapprove
                                })
                            }

            if (
              (shiftType == "1" || shiftType == "2") &&
              MultipletimeStatus != 1
            ) {
              calculatedOvertime = "00:00:00";
              totalLoggedHours = "00:00:00";

              const result = await Database.from("AttendanceMaster as A")
                .select(
                  "A.TimeIn as attTimeIn",
                  "A.TimeOut as attTimeOut",
                  "C.TimeIn as shiftTimeIn",
                  "C.TimeOut as shiftTimeOut",
                  Database.raw(
                    "TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn)) as TotalLoggedHours"
                  ),
                  Database.raw(
                    "CASE WHEN (C.shifttype = 2) THEN SUBTIME(TIMEDIFF(CONCAT('2021-08-21', ' ', C.TimeOut), CONCAT('2021-08-20', ' ', C.TimeIn)), TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn))) ELSE SUBTIME(TIMEDIFF(A.TimeOut, A.TimeIn), TIMEDIFF(C.TimeOut, C.TimeIn)) END as overtime"
                  )
                )
                .innerJoin("ShiftMaster as C", "C.Id", "=", "A.ShiftId")
                .where("A.Id", AttendanceMasterId)
                .first();

              if (result.length > 0) {
                totalLoggedHours = result.TotalLoggedHours;
                calculatedOvertime = result.overtime;
              }

              const updateLoggedHour = Database.from("AttendanceMaster")
                .where("Id", AttendanceMasterId)
                .update({
                  TotalLoggedHours: totalLoggedHours,
                  overtime: calculatedOvertime,
                });
            }

            statusArray[k] = {
              Time: TimeOutTime,
              Date: AttendanceDate,
              Action: "TimeOut",
              EmpId: UserId,
              InterimId: Id,
              InterimAttendanceId: interimAttendanceId,
              AttendanceMasterId: AttendanceMasterId,
            };

            k++;      
          }
          //******************************End third case****************************//
        }
     // }));
      }
    //}
  }));

    return statusArray;
  }
}