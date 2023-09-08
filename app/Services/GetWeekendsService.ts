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
        var response: any[] = []
        var ShiftId: number;

        for (let i = 0; i < (dateDiffInDays + 1); i++) {
            var result: {} = {};
            var newDate = startDateISO.plus({ days: i }).toFormat('yyyy-MM-dd');
            var ShiftEId = await Helper.getShiftIdByEmpID(EmpId);
            const ShiftPlannerId = await Helper.getShiftplannershiftIdByEmpID(EmpId, newDate);
            if (ShiftPlannerId != '' || ShiftPlannerId != 0) {
                ShiftId = ShiftPlannerId;
            }
            else {
                ShiftId = ShiftEId;
            }
            let date = startDateISO.plus({ days: i }).toFormat('yyyy-MM-dd');
            let shiftid = ShiftId;
            let weekoff = await Helper.getweeklyoffnew(newDate, ShiftId, EmpId, OrgId);

            if (weekoff == 'WeekOff') {
                result['id'] = shiftid;
                result['title'] = weekoff;
                result['start'] = date;
                response.push(result);
            }
        }
        return response;
    }
}