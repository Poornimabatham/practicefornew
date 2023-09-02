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
        const multiShiftSts = await Helper.getShiftmultists(shiftId);
        let totalLoggedHours = 0;
        let stsoverunderwithmultists = 0;
        let HolidayandWeekOff = 0;
        let shiftHolidaysandWeekoffs_msts = 0;

        if (shiftType == 3) {
            var selectQuery = await Database.from('AttendanceMaster as A').select(
                Database.raw(`SUM(TIME_TO_SEC((CASE WHEN ((SELECT shiftType FROM ShiftMaster WHERE Id=A.ShiftId) IN (3))
			
                THEN TIMEDIFF(IF NULL((SELECT Sec_to_time(SUM(Time_to_sec(LoggedHours))) from InterimAttendances where AttendanceMasterId=A.Id),'00:00:00'),

                (C.HoursPerDay)) END))) as shifttype3overunder`)
            )
        }
    }
}