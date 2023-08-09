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

        if (data.DesignationId != 0 && data.DesignationId != "") {
            designationCondition = ` Desg_id= ${data.DesignationId}`;    // From AttendanceMaster
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
            var departmentCondition;
            var AttendanceDate;
            if (adminStatus == 2) {
                var departmentId = data.DepartmentId;
                departmentCondition = `Dept_id = ${departmentId}`;
            }

            if (data.DesignationId != 0 && data.DesignationId != "") {
                designationCondition = ` Desg_id= ${data.DesignationId}`;    // From AttendanceMaster
            }


            if (data.date == undefined) {
                AttendanceDate = new Date().toISOString().split('T')[0];
            }
            else {
                AttendanceDate = data.date.toFormat('yyyy-MM-dd')
            }
            if (data.date != new Date().toISOString().split('T')[0]) {
                const absCountQuery = await Database.from('AttendanceMaster').select('Id').where('AttendanceDate', AttendanceDate).where('OrganizationId', data.OrganizationId).whereIn('AttendanceStatus', [2, 7]).whereIn('EmployeeId', Database.rawQuery(`(SELECT Id from EmployeeMaster where OrganizationId =${data.OrganizationId} AND Is_Delete = 0 )`)).count('Id as abscount')

                var absCount;
                if (absCountQuery.length > 0) {
                    absCount = absCountQuery[0].Id;
                }

                var orgId = data.OrganizationId;
                var absentCountQuery = Database.from('AttendanceMaster as A').select(
                    Database.raw("(select CONCAT(FirstName,' ',LastName) FROM EmployeeMaster where Id = EmployeeId) as name"),
                    Database.raw(` '-' as TimeOut`),
                    Database.raw(` '-' as TimeIn`),
                    Database.raw('(select ApprovalStatus from AppliedLeave where EmployeeId = A.EmployeeId and ApprovalStatus = 2 and Date = 2023-03-02) as LeaveStatus'))
                    .innerJoin('EmployeeMaster as E', 'E.Id', 'A.EmployeeId')
                    .where('AttendanceDate', '2023-02-01')
                    .whereIn('AttendanceStatus', [2, 7])
                    .where('A.OrganizationId', data.OrganizationId)
                    .whereIn('EmployeeId', Database.raw(`SELECT Id FROM EmployeeMaster WHERE OrganizationId= ${orgId} AND Is_Delete = 0`))
                    .whereRaw(designationCondition)
                    .orderBy('name', 'asc')


                if (departmentCondition != undefined) {
                    absentCountQuery = absentCountQuery.whereRaw(departmentCondition);
                }
                var absentCountQueryResult = await absentCountQuery;

                // return absentCountQueryResult

                if (absentCountQueryResult.length > 0) {
                    var name = absentCountQueryResult[0].name;

                    absentCountQueryResult.forEach((row) => {
                        if (name.split(' ').length > 1) {
                            var words = name.split(' ', 4);
                            var firstthree = words.slice(0, 3);
                            const output = firstthree.join(' ') + '...';
                           

                        }
                        



                    })
                }
                // return absentCountQueryResult
            }
        }
    }

}