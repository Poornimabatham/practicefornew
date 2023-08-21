import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import AttendanceMaster from "App/Models/AttendanceMaster";
import EmployeeMaster from "App/Models/EmployeeMaster";
import { DateTime } from "luxon";
// import moment from "moment-timezone";

export default class DailyAttendanceService {
  public static async getpresentList(data) {
    var begin = (data.currentPage - 1) * data.perPage;
    var limit;
    var offset;
    // var inpDate = data.date;
    var designationCondition;

    if (data.currentPage != 0 && data.csv == "") {
      limit = data.perPage;
      offset = begin;
    } else {
      limit = "";
      offset = "";
    }
    // var utcOffset
    // var cdate;
    // if (inpDate) {
    //     // var now = inpDate.setZone('Asia/Kabul')
    //     // cdate = now.toFormat('yyyy-MM-dd HH:mm:ss')
    //     cdate = moment().tz('Europe/Tirane').toDate()
    //     // cdate = moment.tz.zonesForCountry('Asia/Kolkata', true);

    //     return cdate
    //     // cdate = DateTime.fromJSDate(inpDate).setZone({ offset: 'utcOffset', name: 'Asia/Kolkata' });

    // }
    // return utcOffset
    // else {
    //     cdate = new Date()
    // }
    // // var formattedDate = cdate.toISOString()
    // // return formattedDate;
    // return cdate

    // let date;
    // var formattedDateTime

    // if (inpDate) {
    //     var cdate=inpDate.setZone('Asia/Kolkata')
    //     // date = DateTime.fromJSDate(inpDate, { zone: 'Asia/Kabul' })
    //     formattedDateTime = cdate.toFormat('yyyy-MM-dd ')
    // } else {
    //     date = DateTime.now().setZone('Asia/Kabul');
    //     formattedDateTime = date.toFormat('yyyy-MM-dd ')
    // }

    // return formattedDateTime;

    // const formattedDateTime= formatDateTime(inpDate,'Asia/Kabul')

    //         var zone = await Helper.getTimeZone(data.OrganizationId)
    //         var timeZone = zone[0]?.name;
    //         const now = inpDate ? inpDate.setZone('Asia/Kabul') : DateTime.local().setZone('Asia/Kabul')
    //         const FormattedDate = now.toFormat('yyyy-MM-dd HH:mm:ss');
    //         return FormattedDate

    // var formattedDate = inpDate
    //     ? DateTime.fromISO(inpDate, { zone: 'utc' }).setZone('Asia/Kabul')
    //     : DateTime.now().setZone('Asia/Kabul');
    // var FormattedDate = formattedDate.toFormat('yyyy-MM-dd HH:mm:ss')

    var adminStatus = await Helper.getAdminStatus(data.EmployeeId);

    var condition;

    if (data.Designation != 0 && data.Designation != "") {
      designationCondition = ` Desg_id= ${data.Designation}`; // From AttendanceMaster
    }

    if (data.dataFor == "present") {
      if (adminStatus == 2) {
        var departmentId = data.DepartmentId;
        condition = `E.Department = ${departmentId}`;
      }

      const countRecordsQuery: any = await Database.from("AttendanceMaster")
        .select("Id")
        .where("AttendanceDate", "2023-02-03")
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
        .where("A.AttendanceDate", "2023-02-03")
        .whereRaw(designationCondition)
        .where("E.Is_Delete", 0)
        .orderBy("name", "asc")
        .limit(limit)
        .offset(offset);

      if (condition != undefined) {
        DailyAttPresentReportDataQuery.whereRaw(condition);
      }
      var DailyAttPresentReportDataQueryResult =
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
      // return data['present']
    } else if (data.dataFor == "absent") {
      if (adminStatus == 2) {
        var departmentId = data.departmentId;
        condition = `Dept_id = ${departmentId}`;
      }

      if (data.date != new Date().toISOString().split("T")[0]) {
        const absCountQuery = await Database.from("AttendanceMaster")
          .select("Id")
          .where("AttendanceDate", data.date)
          .where("OrganizatonId", data.OrganizationId)
          .whereIn("AttendanceStatus", [2, 7])
          .whereIn(
            "EmployeeId",
            Database.rawQuery(
              `(SELECT Id from EmployeeMaster where OrganizationId =${data.OrganizationId} AND Is_Delete = 0 )`
            )
          )
          .count("Id as absCount");

        if (absCountQuery.length > 0) {
          //   var absCount = absCountQuery[0].Id;
        }

        await Database.from("AttendanceMaster as A").select(
          Database.raw("CONCAT(E.FirstName, ' ', E.LastName) as name"),
          Database.raw("TimeIn as -"),
          Database.raw("TimeOut as -"),
          Database.raw("SELECT ApprovalStatus FROM AppliedLeave ")
        );
      }
    }
  }

  public static async saveTimeInOut(allDataOfTimeInOut) {
    let jsonData = JSON.parse(allDataOfTimeInOut.data);
    let interimAttendanceId=0;
    let statusArray: any[] = [];
    let k =0;
    let OwnerId:number=0;
    let areaId:number=0;
    let HourlyRateId:number=0;
    let Desg_id:number=0;
    let Dept_id:number=0;
    
    
    //console.log(jsonData[0]['2023-05-19']['interim'][0].StaffId);
    //console.log(jsonData.length);
    for (let i = 0; i < jsonData.length; i++) {
      const date = Object.keys(jsonData[i]);
      if (Array.isArray(jsonData[i][date[0]].interim)) {
        for (let j = 0; j < jsonData[i][date[0]].interim.length; j++) {
          let {
            Id = 0,
            UserId = 0,
            ShiftId = "",
            attendanceMasterId = 0,
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
            SyncTimeIn = "1",
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

        

          const zone = await Helper.getEmpTimeZone(UserId, OrganizationId);
          const defaultZone = DateTime.now().setZone(zone);

          let shiftType = await Helper.getShiftType(ShiftId);
          let attDatePastOneDay = defaultZone.minus({ days: 1 }).toFormat("yyyy-MM-dd");
          let currentDate = defaultZone.toFormat("yyyy-MM-dd");

          // console.log(defaultZone.minus({ days: 1 }).toFormat('yyyy-MM-dd, HH:mm:ss'));
          // console.log(defaultZone.toFormat('yyyy-MM-dd, HH:mm:ss'));
          console.log(shiftType);
          console.log("shifttype");

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
            .select("allowOverTime","Addon_AutoTimeOut")
            .where("OrganizationId", OrganizationId);

          let allowOverTime;
          if (getSettingOfPunchAttendace.length > 0) {
            let allowOverTime = getSettingOfPunchAttendace[0].allowOverTime;
            let Addon_AutoTimeOut;
              getSettingOfPunchAttendace[0].Addon_AutoTimeOut;
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

          let geofencePerm=await Helper.getNotificationPermission(OrganizationId,'OutsideGeofence');
          let SuspiciousSelfiePerm=await Helper.getNotificationPermission(OrganizationId,'SuspiciousSelfie');
          let SuspiciousDevicePerm=await Helper.getNotificationPermission(OrganizationId,'SuspiciousDevice'); 
               
                let time = defaultZone.toFormat('HH:mm:ss') == "00:00:00" ? "23:59:00" : defaultZone.toFormat('HH:mm:ss');
                let stamp = defaultZone.toFormat('yyyy-MM-dd, HH:mm:ss');
                let today = currentDate;
                let currDate=currentDate;
                let name=await Helper.getEmpName(UserId);
                console.log(name);
                let TimeInStampServer = defaultZone.toFormat('yyyy-MM-dd, HH:mm:ss');
                let TimeOutStampServer = defaultZone.toFormat('yyyy-MM-dd, HH:mm:ss');

                  
                const updateQuery = await Database.query()
                    .from("AppliedLeave")
                    .where('EmployeeId', UserId)
                    .where('HalfDayStatus', '!=', 1)
                    .where('OrganizationId', OrganizationId)
                    .whereIn('ApprovalStatus', [1, 2])
                    .update({
                      ApprovalStatus: 4,
                      Remarks: 'Employee was present'
                    });


                const result = await Database.query().from('AppliedLeave')
                    .where('EmployeeId', UserId)
                    .where('ApprovalStatus', 2)
                    .where('HalfDayStatus', 1)
                    .where('Date', AttendanceDate)
                    .select('*');

                let attendance_sts = result.length > 0 ? 4 : 1;
                  console.log(attendance_sts);

                  const query = await Database.from('AttendanceMaster')
                        .where('EmployeeId', UserId)
                        .where('AttendanceDate', AttendanceDate)
                        .where('disapprove_sts', 1)
                        .count('Id as count')
                        .first();

                      if (query.count > 0) {
                        attendance_sts= 2;
                      }

                      let MultipletimeStatus=await Helper.getShiftMultipleTimeStatus(UserId,AttendanceDate,ShiftId);
                      console.log(UserId+"=>"+AttendanceDate+"=>"+ShiftId);
                      console.log(MultipletimeStatus);
                      console.log('MultipletimeStatus');

                      const attendanceData = await AttendanceMaster.query()
                        .where('EmployeeId', UserId)
                        .where('AttendanceDate', AttendanceDate)
                        .select('Id', 'TimeIn', 'TimeOut')
                        .first();
                        let attTimeIn='00:00:00'
                        let attTimeOut='00:00:00'
                      if (attendanceData) {
                            //attendanceMasterId = attendanceData.Id;
                            attendanceMasterId = 0;
                            attTimeIn = attendanceData.TimeIn;
                            attTimeOut = attendanceData.TimeOut;

                        console.log(attendanceMasterId+"=>"+attTimeIn+"=>"+attTimeOut);
                      }


                     const EmployeeRecord=await EmployeeMaster.query()
                      .where('Id', UserId)
                      .select('Shift','Department','Designation','area_assigned','hourly_rate','OwnerId')
                      .first();

                      if(EmployeeRecord){
                        
                          Dept_id=EmployeeRecord.Department;
                          Desg_id=EmployeeRecord.Designation;
                          areaId=EmployeeRecord.area_assigned;
                          HourlyRateId=EmployeeRecord.hourly_rate;
                          OwnerId=EmployeeRecord.OwnerId;  
                      }

                      console.log("shakir"+attendanceMasterId);

                      if(SyncTimeIn=='1' && SyncTimeOut!='1'){
                        console.log("case one for sync Attendance Only Time In");
                        let EntryImage= ThumnailTimeInPictureBase64;
                        if(TimeInPictureBase64==""){
                            EntryImage="https://ubitech.ubihrm.com/public/avatars/male.png";
                        }

                        try {
                             areaId = GeofenceInAreaId;
                          
                          // Outside Geofence code
                          if (GeofenceIn === "Outside Geofence") {
                            if ([9, 13, 11, 15].includes(geofencePerm)) {
                              const pageName = "Outside Geofence";
                              
                            }
                        
                            if (geofencePerm === 13) {
                              const message = `<html>
                                <head>   
                                <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
                                <meta name=Generator content="Microsoft Word 12 (filtered)">
                                <style>
                                </style>   
                                </head>   
                                <body lang=EN-US link=blue vlink=purple>    
                                <hr>
                                <br>${name} has punched TimeIn outside Geofence</br>
                                </hr>   
                                </body>  
                                </html>`;
                              const headers = {};
                              const subject = `Outside Geofence(${today})`;
                        
                              const query = await Database.raw(
                                "SELECT email FROM admin_login WHERE OrganizationId = ? AND status = 1",
                                [OrganizationId]
                              );
                              //const emails = query.rows.map((row) => row.email);
                        
                              // Send emails
                              // for (const email of emails) {
                              //   await sendEmail_new(email, subject, message, headers);
                              // }
                            }
                          }
                        
                          // DeviceVerification code
                          const deviceverificationpermQuery = await Database.raw(
                            "SELECT Addon_DeviceVerification FROM licence_ubiattendance WHERE OrganizationId = ?",
                            [OrganizationId]
                          );
                          //const deviceverificationperm = deviceverificationpermQuery.rows[0].Addon_DeviceVerification;
                        
                          // if (deviceverificationperm === 1) {
                          //   const deviceQuery = await Database.raw(
                          //     "SELECT DeviceId FROM EmployeeMaster WHERE Id = ?",
                          //     [UserId]
                          //   );
                            //const verifieddevice = deviceQuery.rows[0].DeviceId;
                        
                            // if (verifieddevice !== TimeInDeviceId) {
                            //   const suspiciousdevice = 1;
                            //   if ([9, 13, 11, 15].includes(SuspiciousDevicePerm)) {
                            //     const pageName = "Suspicious Device";
                            //     sendManualPushNotification(
                            //       `('${orgTopic}' in topics) && ('admin' in topics)`,
                            //       "Suspicious Device",
                            //       `${name}'s Attendance Device does not match`,
                            //       UserId,
                            //       OrganizationId,
                            //       pageName
                            //     );
                            //   }
                        
                            //   if ([5, 13, 7, 15].includes(SuspiciousDevicePerm)) {
                            //     const query = await Database.raw(
                            //       "SELECT email FROM admin_login WHERE OrganizationId = ? AND status = 1",
                            //       [OrganizationId]
                            //     );
                            //     const emails = query.rows.map((row) => row.email);
                            //     const message = `<html>
                            //       <head>
                            //       <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
                            //       <meta name=Generator content="Microsoft Word 12 (filtered)">
                            //       <style>
                            //       </style>
                            //       </head>
                            //       <body lang=EN-US link=blue vlink=purple>       
                            //       <hr>
                            //       <br>${name}'s Attendance Device is different from their registered Device ID</br>
                            //       </hr>
                            //       </body>
                            //       </html>`;
                            //     const headers = {};
                            //     const subject = `Suspicious Device(${today})`;
                        
                            //     // Send emails
                            //     for (const email of emails) {
                            //       await sendEmail_new(email, subject, message, headers);
                            //     }
                            //   }
                            // }
                          //}
                        
                          console.log("attendanceMasterId=>"+attendanceMasterId);
                          if (attendanceMasterId == 0) {

                            const InsertAttendanceTimeiN = await Database
                            .table('AttendanceMaster')
                            .returning('id')
                            .insert({
                              TimeInApp : TimeInApp,
                              FakeLocationStatusTimeIn : FakeLocationInStatus,
                              EmployeeId : UserId,
                              AttendanceDate : AttendanceDate,
                              AttendanceStatus : attendance_sts,
                              TimeIn:TimeInTime,
                              ShiftId : ShiftId,
                              Dept_id : Dept_id,
                              Desg_id : Desg_id,
                              areaId : areaId,
                              HourlyRateId : HourlyRateId,
                              OrganizationId : OrganizationId,
                              CreatedDate : today,
                              CreatedById : 0,
                              LastModifiedDate : today,
                              LastModifiedById : 0,
                              OwnerId : OwnerId,
                              Overtime : "00:00:00",
                              EntryImage : EntryImage,
                              checkInLoc : TimeInAddress,
                              device : "mobile",
                              latit_in : LatitudeIn,
                              longi_in : LongitudeIn,
                              timeindate : TimeInDate,
                              Platform : Platform,
                              TimeInDeviceId : TimeInDeviceId,
                              TimeInDeviceName : TimeInDeviceName,
                              timeincity : TimeInCity,
                              TimeInAppVersion : TimeInAppVersion,
                              TimeInGeoFence : GeofenceIn,
                              TimeInDevice : TimeInDevice,
                              multitime_sts : MultipletimeStatus,
                              remark : TimeInRemark,
                              TimeInStampApp : TimeInStampApp,
                              TimeInStampServer : TimeInStampServer,
                              ZoneId : GeofenceInAreaId
                            });
                            console.log("AttendanceMasterId=>"+InsertAttendanceTimeiN[0]);
                            attendanceMasterId = InsertAttendanceTimeiN[0];
                        
                            if (OrganizationId === '105999' || OrganizationId === '10' || OrganizationId === '168264') {
                              // Send mail logic for specific organizations
                              // const mailQuery = await Database.raw("SELECT Subject, Body FROM All_mailers WHERE id = 30");
                              // const subject = mailQuery.rows[0].Subject;
                              // const mailbody = mailQuery.rows[0].Body;
                        
                              // const empQuery = await Database.raw(
                              //   "SELECT E.CurrentEmailId, CONCAT(E.FirstName, ' ', E.LastName) as Name, o.Name as Orgname FROM EmployeeMaster E, Organization o WHERE E.Id = ? AND E.OrganizationId = o.Id AND o.Id = ?",
                              //   [UserId, OrganizationId]
                              // );
                              // const username = empQuery.rows[0].Name;
                              // const orgname = empQuery.rows[0].Orgname;
                              // const emailIn = decode5t(empQuery.rows[0].CurrentEmailId);
                        
                              // const TimeInTme = moment(TimeInTime, 'HH:mm:ss').format('h:mm:ss A');
                              // // Remaining mail logic...
                        
                              // const headers = {};
                              // const message = mailbody; // Construct your message here
                        
                              // // Send email
                              // await sendEmail_new(emailIn, subject, message, headers);
                            }
                          } else if (attendanceMasterId != 0 && attTimeIn == '00:00:00') {
                           
                            // Update existing record in AttendanceMaster
                            // await Database.raw(
                            //   "UPDATE AttendanceMaster SET TimeInApp = ?, FakeLocationStatusTimeIn = ?, EmployeeId = ?, ... WHERE Id = ?",
                            //   [TimeInApp, FakeLocationInStatus, UserId, ..., attendanceMasterId]
                            // );
                          }

                        
                          if (MultipletimeStatus == 1 || shiftType === '3') {
                            if (attendanceMasterId != 0) {

                                const queryResult=  await Database.from('InterimAttendances').select('Id').where('AttendanceMasterId',attendanceMasterId).andWhere('TimeIn',TimeInTime);

                                if (queryResult.length > 0) {
                                   interimAttendanceId = queryResult[0].Id;
                                  console.log("Interim Attendance ID:", interimAttendanceId);
                                }
                                console.log("Interim Attendance IDs:", interimAttendanceId);
                        
                              if (interimAttendanceId == 0) {
                                // Insert into InterimAttendances
                              
                                  const InsertAttendanceInInterimTimeiN = await Database
                                  .table('InterimAttendances')
                                  .returning('id')
                                  .insert({
                                    TimeIn: TimeInTime,
                                    TimeInImage: EntryImage,
                                    TimeInLocation: TimeInAddress,
                                    LatitudeIn: LatitudeIn,
                                    LongitudeIn: LongitudeIn,
                                    TimeOut: TimeInTime, // Note: TimeOut seems to be the same as TimeIn in your query
                                    Device: 'mobile',
                                    FakeLocationStatusTimeIn: FakeLocationInStatus,
                                    Platform: Platform,
                                    TimeInCity: TimeInCity,
                                    TimeInAppVersion: TimeInAppVersion,
                                    TimeInGeofence: GeofenceIn,
                                    AttendanceMasterId: attendanceMasterId,
                                    TimeInDeviceId: TimeInDeviceId,
                                    TimeInDeviceName: TimeInDeviceName,
                                    TimeInRemark: TimeInRemark,
                                    TimeInDate: TimeInDate,
                                    TimeInStampApp: TimeInStampApp,
                                    TimeInStampServer: TimeInStampServer,
                                    EmployeeId: UserId,
                                    OrganizationId: OrganizationId,
                                  
                                  });
                                
                              }
                            }
                          }
                        
                          // Send data on alfanar server
                          if (['90303', '225436'].includes(OrganizationId)) {
                           
                          }
                        
                          // Send data on sanjeevani server
                          if (OrganizationId === '148156') {
                           
                          }

                          statusArray[k] = {
                            Time: TimeInTime,
                            Date: AttendanceDate,
                            Action: 'TimeIn',
                            EmpId: UserId,
                            InterimId: Id,
                            InterimAttendanceId: interimAttendanceId,
                            AttendanceMasterId: attendanceMasterId,
                          };
                          k++;
                        
                          // const statusEntry = {
                          //   Time: TimeInTime,
                          //   Date: AttendanceDate,
                          //   Action: 'TimeIn',
                          //   EmpId: UserId,
                          //   InterimId: Id,
                          //   InterimAttendanceId: interimAttendanceId,
                          //   AttendanceMasterId: attendanceMasterId,
                          // };
                          // statusArray.push(statusEntry);
                         
                        } catch (error) {
                          
                          const errorMsg = 'Message: ' + error.message;
                          const status = 0;
                        }

                      }else if(SyncTimeIn=='1' && SyncTimeOut=='1'){
                        
                      }else if(SyncTimeIn!='1' && SyncTimeOut=='1'){
                        console.log("case three for sync Attendance Only Time out");
                        let ExitImage=ThumnailTimeOutPictureBase64;
					              let areaIdOut = GeofenceOutAreaId;

                        if(TimeOutPictureBase64==""){
                          ExitImage="https://ubitech.ubihrm.com/public/avatars/male.png";
                        }
                        
                        let calculatedOvertime='00:00:00';
                        let totalLoggedHours='00:00:00';
                        let hoursPerDay='00:00:00';
                        if(MultipletimeStatus==1 || shiftType=='3'){
                          let timeOutAlreadySyncedId=0;
                          console.log(attendanceMasterId);
                          console.log('attendanceMasterId->timeout');
                          if (attendanceMasterId == 0)
                          {

                            const getAttnadaceRecord =  await Database.from('AttendanceMaster').select('Id').where('EmployeeId', UserId).whereBetween('AttendanceDate', [Database.raw(`date_sub('${AttendanceDate}', interval 1 day)`),AttendanceDate]).orderBy('AttendanceDate', 'desc').limit(1);
                            console.log('getAttnadaceRecord');
                            if (getAttnadaceRecord.length > 0) {
                              attendanceMasterId = getAttnadaceRecord[0].Id;
                              console.log("attendanceMasterId Attendance ID:", attendanceMasterId);
                            }   
                          }

                        const maxIdOfInterimAttendance = await Database.from('InterimAttendances')
                                                .select('Id')
                                                .where('AttendanceMasterId', attendanceMasterId).orderBy('Id', 'desc').first();
                                                console.log(maxIdOfInterimAttendance);
                            if (maxIdOfInterimAttendance)
                            {
                                interimAttendanceId=maxIdOfInterimAttendance.Id;
                                console.log("MAx Id Attendance ID:", interimAttendanceId);
                            }
                            if(interimAttendanceId!=0){

                              const alreadyMarkedTimeOutId = await Database.from('InterimAttendances')
                                                .select('Id')
                                                .where('AttendanceMasterId', attendanceMasterId).andWhere("TimeOut",TimeOutTime).orderBy('Id', 'desc').first();

                            if (alreadyMarkedTimeOutId)
                            {
                                timeOutAlreadySyncedId=alreadyMarkedTimeOutId.Id;
                            }

                            console.log(TimeOutDate+' '+TimeOutTime);

                            console.log('TimeOutDate+');

                          
                           
                            const updateQuery = await Database
                                          .from('InterimAttendances')
                                          .where('Id', interimAttendanceId)
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
                                            LoggedHours: `TIMEDIFF(CONCAT('${TimeOutDate}', ' ', '${TimeOutTime}'), CONCAT(TimeInDate, ' ', TimeIn))`,
                                            TimeOutDate: TimeOutDate,
                                            TimeOutRemark: TimeOutRemark,
                                            TimeOutStampApp: TimeOutStampApp,
                                            TimeOutStampServer: TimeOutStampServer
                                          });

                            }


                            const calculateLoggedHours = await Database.from('InterimAttendances as I')
                                                .select(
                                                  'A.Id',
                                                  'A.ShiftId',
                                                  Database.raw('SEC_TO_TIME(SUM(TIME_TO_SEC(I.LoggedHours))) as totalLoggedHours'),
                                                  Database.raw(`
                                                    (SELECT (CASE 
                                                      WHEN (shifttype=1) THEN TIMEDIFF(TimeOut,TimeIn) 
                                                      WHEN (shifttype=2) THEN TIMEDIFF(CONCAT('2021-10-11', ' ', TimeOut), CONCAT('2021-10-10', ' ', TimeIn)) 
                                                      WHEN (shifttype=3) THEN HoursPerDay 
                                                    END) FROM ShiftMaster WHERE Id=A.ShiftId) as hoursPerDay
                                                  `)
                                                )
                                                .innerJoin('AttendanceMaster as A', 'A.Id', 'I.AttendanceMasterId')
                                                .where('I.AttendanceMasterId', attendanceMasterId)
                                                .groupBy('A.Id', 'A.ShiftId');

                          if (calculateLoggedHours)
                        {
                            let totalLoggedHours=calculateLoggedHours[0].totalLoggedHours;
                            let hoursPerDay=calculateLoggedHours[0].hoursPerDay;

                            console.log(totalLoggedHours);
                            console.log(hoursPerDay);

                            const { hours, minutes,seconds }  = Helper.calculateOvertime(hoursPerDay,totalLoggedHours);
                            console.log(hours+":"+minutes+":"+seconds);
                            let calculatedOvertime= hours+":"+minutes+":"+seconds;
                            console.log('calculatedOvertime'+calculatedOvertime);
                            
    
                        }

                        }


                        statusArray[k] = {
                          Time: TimeOutTime,
                          Date: AttendanceDate,
                          Action: 'TimeOut',
                          EmpId: UserId,
                          InterimId: Id,
                          InterimAttendanceId: interimAttendanceId,
                          AttendanceMasterId: attendanceMasterId,
                        };
                        
                        k++;

                        // if(($GeofenceOut=="Outside Geofence")){
                        //   let attendance_sts=2;//absent
                           let disappstatus= 2;//pending disaaprove 
                           let disattreason="Outside Geofence";
                      
console.log(calculatedOvertime);
console.log(totalLoggedHours);

const cond1 = `overtime='${calculatedOvertime}', TotalLoggedHours='09:09:09'`;

const updateResult = await AttendanceMaster.query()
  .where('id', attendanceMasterId)
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
    overtime:calculatedOvertime,
    TotalLoggedHours:'09:09:09'
  });
                        //console.log(updateResult);

                        if((shiftType=='1' || shiftType=='2') && (MultipletimeStatus!=1))
                        {
    
                            calculatedOvertime='00:00:00';
                            totalLoggedHours='00:00:00';
    
                            const result = await Database
                                              .from('AttendanceMaster as A')
                                              .select(
                                                'A.TimeIn as attTimeIn',
                                                'A.TimeOut as attTimeOut',
                                                'C.TimeIn as shiftTimeIn',
                                                'C.TimeOut as shiftTimeOut',
                                                Database.raw(
                                                  "TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn)) as TotalLoggedHours"
                                                ),
                                                Database.raw(
                                                  "CASE WHEN (C.shifttype = 2) THEN SUBTIME(TIMEDIFF(CONCAT('2021-08-21', ' ', C.TimeOut), CONCAT('2021-08-20', ' ', C.TimeIn)), TIMEDIFF(CONCAT(A.timeoutdate, ' ', A.TimeOut), CONCAT(A.timeindate, ' ', A.TimeIn))) ELSE SUBTIME(TIMEDIFF(A.TimeOut, A.TimeIn), TIMEDIFF(C.TimeOut, C.TimeIn)) END as overtime"
                                                )
                                              )
                                              .innerJoin('ShiftMaster as C', 'C.Id', '=', 'A.ShiftId')
                                              .where('A.Id', attendanceMasterId)
                                              .first();
                            
                           
    console.log("result->");
    console.log(result);
    console.log(result[0].TotalLoggedHours);
    
                            if (result.length > 0) 
                            {
                                totalLoggedHours=result[0].TotalLoggedHours;
                                calculatedOvertime=result[0].overtime;                             
                            }
    
                    
                        //$this->db->query("UPDATE AttendanceMaster SET TotalLoggedHours='$totalLoggedHours',overtime='$calculatedOvertime' WHERE Id='$attendanceMasterId'");
    
                        }

                      }
                      

        }
      } else {
        console.log("array not working");
      }
    }
  }
}
