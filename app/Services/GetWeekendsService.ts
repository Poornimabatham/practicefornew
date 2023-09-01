import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
export default class GetWeekendsService {
    public static async getWeekends(getWeekendsData) {

        const OrgId = getWeekendsData.OrgId;
        const EmpId = getWeekendsData.EmpId;
        const currentDate = DateTime.local();
        const startDate = currentDate.toFormat('yyyy-MM-dd');
        var endDate = currentDate.plus({ months: 6 }).toFormat('yyyy-MM-dd');
        var startDateISO = DateTime.fromISO(startDate);  //converting to datetime object
        var endDateISO = DateTime.fromISO(endDate);      //converting to datetime object
        var dateDiffInSeconds = Math.abs(endDateISO.diff(startDateISO).as('seconds'));
        var dateDiffInDays = Math.floor(dateDiffInSeconds / (60 * 60 * 24));
        var result: {} = {};
        var data: {} = {};
        var ShiftId: number;
        for (let i = 0; i < dateDiffInDays + 1; i++) {
            var newDate = startDateISO.plus({ days: i }).toFormat('yyyy-MM-dd');
            var ShiftEId = await Helper.getShiftIdByEmpID(EmpId);
            const ShiftPlannerId = await Helper.getShiftplannershiftIdByEmpID(EmpId, newDate);
            if (ShiftPlannerId != '' || ShiftPlannerId != 0) {
                ShiftId = ShiftPlannerId;
            }
            else {
                ShiftId = ShiftEId;
            }
            data['date'] = startDateISO.plus({ days: i }).toFormat('yyyy-MM-dd');
            data['shiftid'] = ShiftId;
            data['weekoff'] = await Helper.getweeklyoffnew(newDate, ShiftId, EmpId, OrgId);

            if (data['weekoff'] == 'WeekOff') {
                result['id'] = data['shiftid'];
                result['title'] = data['weekoff'];
                result['start'] = data['date'];
            }
        }
        return result;
    }
}