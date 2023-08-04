import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import moment from 'moment-timezone';
import { DateTime } from "luxon";


export default class DailyAttendanceService {

    public static async getpresentList(data) {
        var begin = (data.currentPage - 1) * data.perPage;
        var limit;
        var offset;

        if (data.currentPage != 0 && data.csv == "") {
            limit = data.perPage;
            offset = begin;
        }
        else {
            limit = "";
            offset = "";

        }
        var zone = await Helper.getTimeZone(data.OrganizationId)
        var timeZone = zone[0]?.name;
        var defaulttimeZone = moment().tz(timeZone).toDate();
        const dateTime = DateTime.fromJSDate(defaulttimeZone);    //converts the JavaScript Date object to a Luxon DateTime
        const formattedDate = dateTime.toFormat('yy-MM-dd');
        var time = dateTime.toFormat('HH:mm:ss')
        var currentDate = DateTime.now().toFormat('yy-MM-dd');

        var designationCondition;
        var designationCondition1;

        var adminStatus = await Helper.getAdminStatus(data.EmployeeId);

        var conditon;

        if (data.Designation != -0 && data.Designation != "") {
            designationCondition = `and Desg_id ${data.Designation}`;
            designationCondition1 = `and Designation ${data.Designation}`;
        }

        if (data.dataFor == 'present') {

            if (adminStatus == 2) {
                var departmentId = data.DepartmentId;
                conditon = `and E.Department = ${departmentId}`
            }

            const subQuery = await Database.from('EmployeeMaster').select('Id').where('OrganizationId', data.OrganizationId).andWhere('Is_Delete', 0)

            const countQuery: any = await Database.from('AttendanceMaster').select('Id').count('Id as total').where('AttendanceDate', formattedDate).andWhere('OrganizationId', data.OrganizationId).whereIn('AttendanceStatus', [1, 3, 5]).whereIn('EmployeeId', subQuery)

            var countDate;
            if (countQuery) {
                countDate = countQuery.Id;
            }

            const DailyAttPresentReportDataQuery = await Database.from('AttendanceMaster as A').select(
                Database.raw("CONCAT(E.FirstName, ' ', E.LastName) as name"),
                // Database.raw("SUBSTR(A.TimeIn, 1, 5) as `TimeIn`"),
                // Database.raw("(SELECT shifttype FROM ShiftMaster WHERE Id = ShiftId) as shiftType"),
                // Database.raw("SUBSTR(A.TimeOut, 1, 5) as `TimeOut`"),
                // Database.raw("'Present' as status"),
                // Database.raw("SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage"),
                // Database.raw("SUBSTRING_INDEX(A.ExitImage, '.com/', -1) as ExitImage"),
                // Database.raw("SUBSTR(A.checkInLoc, 1, 40) as checkInLoc"),
                // Database.raw("SUBSTR(A.CheckOutLoc, 1, 40) as CheckOutLoc"),
                'A.latit_in',
                'A.longi_in',
                'A.latit_out',
                'A.longi_out',
                'A.Id',
                'A.TotalLoggedHours',
                'A.AttendanceStatus',
                'A.ShiftId',
                'A.multitime_sts'
            )
                .innerJoin('EmployeeMaster as E', 'A.EmployeeId', 'E.Id')
                // .innerJoin('DesignationMaster as DM', 'A.desg_id', 'DM.Id')
                // .where('E.OrganizationId', data.OrganizationId)
                // .whereIn('A.AttendanceStatus', [1, 3, 4, 5, 8])
                // .where('A.AttendanceDate', data.date)
                // // .whereRaw(designationCondition)
                // // .whereRaw(conditon)
                // .where('E.Is_Delete', 0)
                // .orderBy('name', 'asc')
                // .limit(limit)
                // .offset(begin);


            return DailyAttPresentReportDataQuery;
        }

    }
}