import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";

export default class getunderovertimeService {

    public static async getunderovertime(getdata) {

        const OrgId = getdata.OrgId;
        const EmpId = getdata.EmpId;
        const logMonth = getdata.logMonth;
        const dateTime = DateTime.fromFormat(logMonth, 'MMM dd yyyy');
        const unixTimestamp = Math.floor(dateTime.toMillis() / 1000);
        const dateTime1 = DateTime.fromMillis(unixTimestamp * 1000);
        const startDate = dateTime1.set({ day: 1 }).toFormat('yyyy-MM-dd');
        const endDate = dateTime1.endOf('month').toFormat('yyyy-MM-dd');
        const shiftId = await Helper.getShiftIdByEmpID(EmpId);
        const shiftType = await Helper.getShiftType(shiftId);
        var multiShiftSts = await Helper.getShiftmultists(shiftId);
        let shift12holydaysandweekoffs_msts
        let totalLoggedHours = 0;
        let s3HolydayAndWeekOff;
        let stsoverunderwithmultists = 0;
        let HolidayandWeekOff = 0;
        let shiftHolidaysandWeekoffs_msts = 0;
        let shifttype3overunder;
        let s3HalfDay;
        let st12overunderwithmultists;
        let totalTimeOff;
        let multiTimeHalfDay;
        let st12underoverwithoutmulti_sts;
        let s12HolydayAndWeekOff;
        let s12HalfDay;
        if (shiftType == 3) {  //shifttype ==3
            var selectQuery = await Database.from('AttendanceMaster as A')
                .select(Database.raw('SUM(TIME_TO_SEC(CASE WHEN (SELECT shifttype FROM ShiftMaster WHERE Id=A.ShiftId) IN (3) THEN TIMEDIFF(IFNULL((SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(LoggedHours))) FROM InterimAttendances WHERE AttendanceMasterId=A.Id), "00:00:00"), S.HoursPerDay) END)) as shifttype3overunder'))
                .innerJoin('ShiftMaster as S', 'A.ShiftId', 'S.Id')
                .where('A.EmployeeId', EmpId)
                .where('A.OrganizationId', OrgId)
                .whereBetween('A.AttendanceDate', [startDate, endDate])
                .whereNotIn('A.AttendanceStatus', [3, 4, 5])
                .whereRaw('A.TimeIn!="00:00:00"')

            if (selectQuery.length > 0) {
                shifttype3overunder = selectQuery[0].shifttype3overunder;

                if (shifttype3overunder == "" || shifttype3overunder == null ||
                    shifttype3overunder == undefined) {
                    shifttype3overunder = 0;
                }
            }
            else {
                shifttype3overunder = 0;
            }

            // calculate total logged hours of weekoffs and holydays for shifttype 3

            var selectTotalLoggedHoursQuery = await Database.from('AttendanceMaster').select(
                Database.raw(` (SUM(TIME_TO_SEC(IFNULL((CASE WHEN ((SELECT shiftType FROM ShiftMaster WHERE Id=AttendanceMaster.ShiftId) IN (3)) THEN (SELECT Sec_to_time(SUM(Time_to_sec(LoggedHours))) from InterimAttendances where AttendanceMasterId=AttendanceMaster.Id) ELSE '0' END),'00:00:00')))) as shift3HolydayAndWeekOff`)
            )
                .where('EmployeeId', EmpId)
                .where('OrganizationId', OrgId)
                .whereBetween('AttendanceDate', [startDate, endDate])
                .whereIn('AttendanceStatus', [3, 5])
                .whereRaw('TimeIn!="00:00:00"')

            // return selectTotalLoggedHoursQuery
            if (selectTotalLoggedHoursQuery.length > 0) {
                s3HolydayAndWeekOff = selectTotalLoggedHoursQuery[0].shift3HolydayAndWeekOff;

                if (s3HolydayAndWeekOff == "" || s3HolydayAndWeekOff == null ||
                    s3HolydayAndWeekOff == undefined) {
                    s3HolydayAndWeekOff = 0;
                }
            }
            else {
                s3HolydayAndWeekOff = 0;
            }

            // query9 calculate total (overtime or undertime) for shifttype 3 halfday case

            var selectoverunderhalfdayQuery = await Database.from('AttendanceMaster as A').select(
                Database.raw(` SUM(TIME_TO_SEC((CASE WHEN ((SELECT shiftType FROM ShiftMaster WHERE Id=A.ShiftId) IN (3)) THEN TIMEDIFF(IFNULL((SELECT Sec_to_time(SUM(Time_to_sec(LoggedHours))) from InterimAttendances where AttendanceMasterId=A.Id),'00:00:00'),(SEC_TO_TIME(TIME_TO_SEC(S.HoursPerDay)/2))) END))) as shift3HalfDay `)
            )
                .innerJoin('ShiftMaster as S', 'A.ShiftId', 'S.Id')
                .where('A.EmployeeId', EmpId)
                .where('A.OrganizationId', OrgId)
                .whereBetween('A.AttendanceDate', [startDate, endDate])
                .where('A.AttendanceStatus', 4)
                .whereRaw('A.TimeIn!="00:00:00"')


            // return selectoverunderhalfdayQuery

            if (selectoverunderhalfdayQuery.length > 0) {
                s3HalfDay = selectoverunderhalfdayQuery[0].shift3HalfDay;

                if (s3HalfDay == '' || s3HalfDay == undefined || s3HalfDay == null) {
                    s3HalfDay = 0;
                }
                else {
                    s3HalfDay = 0;
                }
            }
        }
        //  calculate total(overtime or undertime) for shifttype 1 AND 2 with multiple time status
        else if ((shiftType == 7 || shiftType == 8) && multiShiftSts == 1) {
            var selectoverundermultistsQuery = await Database.from('AttendanceMaster as A').select(
                Database.raw(` SUM(TIME_TO_SEC((CASE WHEN ((S.shifttype=1 OR S.shifttype=2) AND A.multitime_sts=1) THEN TIMEDIFF(IFNULL((SELECT Sec_to_time(SUM(Time_to_sec(LoggedHours))) from InterimAttendances where AttendanceMasterId=A.Id),'00:00:00'),((CASE WHEN (S.shifttype=2 AND A.timeoutdate=A.timeindate) THEN TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',S.TimeIn)) ELSE TIMEDIFF(CONCAT(A.timeoutdate,' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',S.TimeIn)) END))) END))) as shift12overunderwith_multitimests`)
            )
                .innerJoin('ShiftMaster as S', 'A.ShiftId', 'S.Id')
                .where('A.EmployeeId', EmpId)
                .where('A.OrganizationId', OrgId)
                .whereBetween('A.AttendanceDate', [startDate, endDate])
                .whereNotIn('A.AttendanceStatus', [3, 4, 5])
                .whereRaw('S.shifttype!=3')
                .whereRaw('A.TimeIn!="00:00:00"')
                .whereRaw('A.TimeOut!="00:00:00"')

            // return selectoverundermultistsQuery

            if (selectoverundermultistsQuery.length > 0) {
                st12overunderwithmultists = selectoverundermultistsQuery[0].shift12overunderwith_multitimests;

                if (st12overunderwithmultists == '' || st12overunderwithmultists == undefined || st12overunderwithmultists == null) {
                    st12overunderwithmultists = 0;
                }

            }
            else {
                st12overunderwithmultists = 0;
            }

            //  calculate total time off

            var selecttotaltimeoffQuery = await Database.from('Timeoff').select(
                Database.raw(`(SUM(TIME_TO_SEC(IFNULL((TIMEDIFF(TimeTo,TimeFrom)),'00:00:00')))) as totalTimeOff `)
            )
                .where('EmployeeId', EmpId)
                .where('OrganizationId', OrgId)
                .whereBetween('Timeofdate', [startDate, endDate]);

            // return selecttotaltimeoffQuery

            if (selecttotaltimeoffQuery.length > 0) {
                totalTimeOff = selecttotaltimeoffQuery[0].totalTimeOff;

                if (totalTimeOff == '' || totalTimeOff == undefined || totalTimeOff == null) {
                    totalTimeOff = 0;
                }

            }
            else {
                totalTimeOff = 0;
            }

            //  calculate total logged hours of weekoffs and holidays for shift 1 and 2 with multiple time status

            var selectTotalLoggedhourss12msts = await Database.from('AttendanceMaster as A').select(
                Database.raw(`(SUM(TIME_TO_SEC(IFNULL((CASE WHEN ((S.shifttype=1 OR S.shifttype=2) AND A.multitime_sts=1) THEN (SELECT Sec_to_time(SUM(Time_to_sec(LoggedHours))) from InterimAttendances where AttendanceMasterId=A.Id) END),'00:00:00')))) as shift12holydaysandweekoffsmsts`)
            )
                .innerJoin('ShiftMaster as S', 'A.ShiftId', 'S.Id')
                .where('A.EmployeeId', EmpId)
                .where('A.OrganizationId', OrgId)
                .whereBetween('A.AttendanceDate', [startDate, endDate])
                .whereBetween('A.AttendanceStatus', [3, 5])
                .whereRaw('S.shifttype!=3')
                .whereRaw('A.TimeIn!="00:00:00"')
            // return selectTotalLoggedhourss12msts

            if (selectTotalLoggedhourss12msts.length > 0) {
                shift12holydaysandweekoffs_msts = selectTotalLoggedhourss12msts[0].shift12holydaysandweekoffsmsts;

                if (shift12holydaysandweekoffs_msts == '' || shift12holydaysandweekoffs_msts == undefined || shift12holydaysandweekoffs_msts == null) {
                    shift12holydaysandweekoffs_msts = 0;
                }
            }
            else {
                shift12holydaysandweekoffs_msts = 0;
            }

            //  calculate total (overtime or undertime) for shifttype 1 & 2 halfday case with multiple time in/out case

            var selectmultitimeHalfDayQuery = await Database.from('AttendanceMaster as A').select(
                Database.raw(`SUM(TIME_TO_SEC(IFNULL(TIMEDIFF((CASE WHEN ((S.shifttype=1 OR S.shifttype=2) AND A.multitime_sts=1) THEN (SELECT Sec_to_time(SUM(Time_to_sec(LoggedHours))) from InterimAttendances where AttendanceMasterId=A.Id) END),(SEC_TO_TIME(Time_to_sec(CASE WHEN(S.shifttype=2 AND A.timeoutdate=A.timeindate) THEN TIMEDIFF(CONCAT('A.AttendanceDate+1',' ',S.TimeOut),CONCAT('A.AttendanceDate',' ',S.TimeIn)) WHEN (S.shifttype=1) THEN TIMEDIFF(CONCAT('A.AttendanceDate',' ',S.TimeOut),CONCAT('A.AttendanceDate',' ',S.TimeIn)) ELSE '0' END)/2))),'00:00:00'))) as multiTimeHalfDay`)
            )
                .innerJoin('ShiftMaster as S', 'A.ShiftId', 'S.Id')
                .where('A.EmployeeId', EmpId)
                .where('A.OrganizationId', OrgId)
                .whereBetween('A.AttendanceDate', [startDate, endDate])
                .where('A.AttendanceStatus', 4)
            //    return selectmultitimeHalfDayQuery
            if (selectmultitimeHalfDayQuery.length > 0) {
                multiTimeHalfDay = selectmultitimeHalfDayQuery[0].multiTimeHalfDay;

                if (multiTimeHalfDay == '' || multiTimeHalfDay == undefined || multiTimeHalfDay == null) {
                    multiTimeHalfDay = 0;
                }

            }
            else {
                multiTimeHalfDay = 0;
            }
            // return  multiTimeHalfDay
        }

        //  calculate total (overtime or undertime) for only shifttype 1 and 2 without multipletime_sts
        else if ((shiftType == 1 || shiftType == 2) && multiShiftSts == 1) {
            var selects12totalloggedQuery = await Database.from('AttendanceMaster as A').select(
                Database.raw(`SUM(TIME_TO_SEC(CASE WHEN (S.shifttype=2 AND A.timeoutdate=A.timeindate) THEN SUBTIME(TIMEDIFF(CONCAT(A.timeoutdate,' ',A.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeIn)),TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',S.TimeIn))) ELSE SUBTIME(TIMEDIFF(CONCAT(A.timeoutdate,' ',A.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeIn)),TIMEDIFF(CONCAT(A.timeoutdate,' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',S.TimeIn))) END)) as st12underoverwithoutmulti_sts`)
            )
                .innerJoin('ShiftMaster as S', 'A.ShiftId', 'S.Id')
                .where('A.EmployeeId', EmpId)
                .where('A.OrganizationId', OrgId)
                .whereBetween('A.AttendanceDate', [startDate, endDate])
                .whereNotIn('A.AttendanceStatus', [3, 4, 5])
                .whereRaw('A.TimeIn!="00:00:00"')
                .whereRaw('A.TimeOut!="00:00:00"')
                .whereRaw('S.shifttype!=3')
                .whereRaw('A.multitime_sts!=1')
            // return selects12totalloggedQuery

            if (selects12totalloggedQuery.length > 0) {
                st12underoverwithoutmulti_sts = selects12totalloggedQuery[0].st12underoverwithoutmulti_sts;

                if (st12underoverwithoutmulti_sts == '' || st12underoverwithoutmulti_sts == undefined || st12underoverwithoutmulti_sts == null) {
                    st12underoverwithoutmulti_sts = 0;
                }
            }
            else {
                st12underoverwithoutmulti_sts = 0;
            }
            // return st12underoverwithoutmulti_sts

            //  calculate total time off

            var selectTotalTimeOff = await Database.from('Timeoff').select(
                Database.raw(`(SUM(TIME_TO_SEC(IFNULL((TIMEDIFF(TimeTo,TimeFrom)),'00:00:00')))) as totalTimeOff`)
            )
                .where('EmployeeId', EmpId)
                .where('OrganizationId', OrgId)
                .whereBetween('TimeofDate', [startDate, endDate])
            // return selectTotalTimeOff

            if (selectTotalTimeOff.length > 0) {
                totalTimeOff = selectTotalTimeOff[0].totalTimeOff;

                if (totalTimeOff == '' || totalTimeOff == undefined || totalTimeOff == null) {
                    totalTimeOff = 0;
                }
            }
            else {
                totalTimeOff = 0;
            }

            // calculate total logged hours of weekoffs and holidays for shift 1 and 2 with out mutitime sts

            var selecttotalweekoffsandholidayss12Query = await Database.from('AttendanceMaster as A').select(
                Database.raw(`(SUM(TIME_TO_SEC(IFNULL((CASE WHEN (S.shifttype=2 AND A.timeoutdate=A.timeindate) THEN TIMEDIFF(CONCAT(A.timeoutdate,' ',A.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeIn)) ELSE TIMEDIFF(CONCAT(A.timeoutdate,' ',A.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeIn)) END),'00:00:00')))) as shift12HolydayAndWeekOff `)
            )
                .innerJoin('ShiftMaster as S', 'A.ShiftId', 'S.Id')
                .where('A.EmployeeId', EmpId)
                .where('A.OrganizationId', OrgId)
                .whereBetween('A.AttendanceDate', [startDate, endDate])
                .whereIn('A.AttendanceStatus', [3, 5])
                .whereRaw('A.TimeIn!="00:00:00"')
                .whereRaw('S.shifttype!=3')
                .whereRaw('A.multitime_sts!=1')
            // return selecttotalweekoffsandholidayss12Query
            if (selecttotalweekoffsandholidayss12Query.length > 0) {
                s12HolydayAndWeekOff = selecttotalweekoffsandholidayss12Query[0].shift12HolydayAndWeekOff;

                if (s12HolydayAndWeekOff == '' || s12HolydayAndWeekOff == undefined || s12HolydayAndWeekOff == null) {
                    s12HolydayAndWeekOff = 0;
                }
            }
            else {
                s12HolydayAndWeekOff = 0;
            }
            // return s12HolydayAndWeekOff

            // calculate total (overtime or undertime) for shifttype 1 & 2 halfday case without multiple time in/out case

            var selecttotaloverunders12 = await Database.from('AttendanceMaster as A').select(
                Database.raw(`SUM(TIME_TO_SEC(IFNULL((CASE WHEN (S.shifttype=2 AND A.timeoutdate=A.timeindate) THEN SUBTIME(TIMEDIFF(CONCAT(A.timeoutdate,' ',A.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeIn)),SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(CONCAT(DATE_ADD(A.AttendanceDate, INTERVAL 1 DAY),' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',S.TimeIn)))/2)) ELSE SUBTIME(TIMEDIFF(CONCAT(A.timeoutdate,' ',A.TimeOut),CONCAT(A.AttendanceDate,' ',A.TimeIn)),SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(CONCAT(A.timeoutdate,' ',S.TimeOut),CONCAT(A.AttendanceDate,' ',S.TimeIn)))/2)) END),'0'))) as shift12HalfDay `)
            )
                .innerJoin('ShiftMaster as S', 'A.ShiftId', 'S.Id')
                .where('A.EmployeeId', EmpId)
                .where('A.OrganizationId', OrgId)
                .whereBetween('A.AttendanceDate', [startDate, endDate])
                .where('A.AttendanceStatus', 4)
                .whereRaw('A.TimeIn!="00:00:00"')
                .whereRaw('A.TimeOut!="00:00:00"')
                .whereRaw('S.shifttype!=3')
                .whereRaw('A.multitime_sts!=1')
            // return selecttotaloverunders12

            if (selecttotaloverunders12.length > 0) {
                s12HalfDay = selecttotaloverunders12[0].shift12HalfDay;

                if (s12HalfDay == '' || s12HalfDay == undefined || s12HalfDay == null) {
                    s12HalfDay = 0;
                }
            }
            else {
                s12HalfDay = 0;
            }
            // return s12HalfDay
        }
    }
}
