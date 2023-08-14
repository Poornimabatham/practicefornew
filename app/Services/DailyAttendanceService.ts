import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
// import { DateTime } from "luxon";
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
        }
        else {
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
            designationCondition = ` Desg_id= ${data.Designation}`;    // From AttendanceMaster
        }

        if (data.dataFor == 'present') {

            if (adminStatus == 2) {
                var departmentId = data.DepartmentId;
                condition = `E.Department = ${departmentId}`
            }

            const countRecordsQuery: any = await Database.from('AttendanceMaster').select('Id').where('AttendanceDate', '2023-02-03').andWhere('OrganizationId', data.OrganizationId).whereIn('AttendanceStatus', [1, 3, 5]).whereIn('EmployeeId', Database.rawQuery(`(SELECT Id from EmployeeMaster where OrganizationId =${data.OrganizationId} AND Is_Delete = 0 )`)).count('Id as Id')

            var totalCount;
            if (countRecordsQuery.length > 0) {
                totalCount = countRecordsQuery[0].Id;
            }

            var DailyAttPresentReportDataQuery = Database.from('AttendanceMaster as A').select(
                Database.raw("CONCAT(E.FirstName, ' ', E.LastName) as name"),
                Database.raw("SUBSTR(A.TimeIn, 1, 5) as `TimeIn`"),
                Database.raw("(SELECT shifttype FROM ShiftMaster WHERE Id = ShiftId) as shiftType"),
                Database.raw("SUBSTR(A.TimeOut, 1, 5) as `TimeOut`"),
                Database.raw("'Present' as status"),
                Database.raw("SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage"),
                Database.raw("SUBSTRING_INDEX(A.ExitImage, '.com/', -1) as ExitImage"),
                Database.raw("SUBSTR(A.checkInLoc, 1, 40) as checkInLoc"),
                Database.raw("SUBSTR(A.CheckOutLoc, 1, 40) as CheckOutLoc"),
                'A.latit_in',
                'A.longi_in',
                'A.latit_out',
                'A.longi_out',
                'A.Id',
                'A.TotalLoggedHours',
                'A.AttendanceStatus',
                'A.ShiftId',
                'A.multitime_sts',
            )
                .innerJoin('EmployeeMaster as E', 'A.EmployeeId', 'E.Id')
                .innerJoin('DesignationMaster as DM', 'A.Desg_id', 'DM.Id')
                .where('E.OrganizationId', data.OrganizationId)
                .whereIn('A.AttendanceStatus', [1, 3, 4, 5, 8])
                .where('A.AttendanceDate', '2023-02-03')
                .whereRaw(designationCondition)
                .where('E.Is_Delete', 0)
                .orderBy('name', 'asc')
                .limit(limit)
                .offset(offset);

            if (condition != undefined) {
                DailyAttPresentReportDataQuery.whereRaw(condition)
            }
            var DailyAttPresentReportDataQueryResult = await DailyAttPresentReportDataQuery;

            interface DailyAttendancePresent {
                name: string,
                shiftType: number,
                AttendanceStatus: number,
                TimeIn: string,
                TimeOut: string,
                Status: string,
                MultiTimeStatus: number,
                checkInLoc: string,
                CheckOutLoc: string,
                latit_in: string,
                longi_in: string,
                latit_out: string,
                longi_out: string,
                Id: number,
                TotalLoggedHours: string,
                totalCount: number,
                EntryImage: string,
                ExitImage: string,
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
                    }
                    result.push(data);

                })
            }

            else {
                result.push()
            }

            data['present'] = result;
            // return data['present']
        }
        else if (data.dataFor == "absent") {

            if (adminStatus == 2) {
                var departmentId = data.departmentId;
                condition = `Dept_id = ${departmentId}`;
            }

            if (data.date != new Date().toISOString().split('T')[0]) {
                const absCountQuery = await Database.from('AttendanceMaster').select('Id').where('AttendanceDate', data.date).where('OrganizatonId', data.OrganizationId).whereIn('AttendanceStatus', [2, 7]).whereIn('EmployeeId', Database.rawQuery(`(SELECT Id from EmployeeMaster where OrganizationId =${data.OrganizationId} AND Is_Delete = 0 )`)).count('Id as absCount')

                
                if (absCountQuery.length > 0) {
                    
                 //   var absCount = absCountQuery[0].Id;
                }

                await Database.from('AttendanceMaster as A').select(
                    Database.raw("CONCAT(E.FirstName, ' ', E.LastName) as name"),
                    Database.raw('TimeIn as -'),
                    Database.raw('TimeOut as -'),
                    Database.raw('SELECT ApprovalStatus FROM AppliedLeave ')

                )

            }
        }
    }

    public static async saveTimeInOut(allDataOfTimeInOut) {
        console.log('allDataOfTimeInOut');
        let jsonData= JSON.parse(allDataOfTimeInOut.data);
        console.log(jsonData[0]['2023-05-19']['interim'][0].StaffId);
        console.log(jsonData.length);
        // (allDataOfTimeInOut.data).forEach(item => {
        //     for (const dateKey in item) {
        //       if (item.hasOwnProperty(dateKey)) {
        //         const dateData = item[dateKey];
        //         if (Array.isArray(dateData.interim)) {
        //           dateData.interim.forEach(interimItem => {

        //             console.log(interimItem);
        //             // Process the interim item as needed
        //             // For example, push the "Id" property to the results array
        //            // results.push(interimItem.Id);
        //           });
        //         }
        //       }
        //     }
        //   });

    }

}