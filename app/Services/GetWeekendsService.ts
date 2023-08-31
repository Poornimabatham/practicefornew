import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
import { unix } from "moment";

export default class GetWeekendsService {
    public static async getWeekends(getWeekendsData) {

        const OrgId = getWeekendsData.OrgId;
        const EmpId = getWeekendsData.EmpId;
        const currentDate = DateTime.local();
        const startDate = currentDate.toFormat('yyyy-MM-dd');
        const endDate = currentDate.plus({ months: 6 }).toFormat('yyyy-MM-dd');
        const startDateISO = DateTime.fromISO(startDate);
        const endDateISO = DateTime.fromISO(endDate);
        const dateDiffInSeconds = Math.abs(endDateISO.diff(startDateISO).as('seconds'));
        const dateDiffInDays = Math.floor(dateDiffInSeconds / (60 * 60 * 24));
        var result: {} = {};
        var data: {} = {};
        for (let i = 0; i < dateDiffInDays + 1; i++) {
            var newDate = startDateISO.plus({ days: i }).toFormat('yyyy-MM-dd');
            var ShiftEId = await Helper.getShiftIdByEmpID(EmpId);
            const ShiftPlannerId = await Helper.getShiftplannershiftIdByEmpID(EmpId, newDate);

            if (ShiftPlannerId != '') {
                var ShiftId = ShiftPlannerId;
            }
            else {
                ShiftId = ShiftEId;
            }

            data['date'] = startDateISO.plus({ days: i }).toFormat('yyyy-MM-dd');
            data['shiftid'] = ShiftId;
            data['weekoff'] = await Helper.getweeklyoffnew(newDate, ShiftId, EmpId, OrgId);
            return data['weekoff']

            if (data['weekoff'] == 'Week Off') {
                result['id'] = data['shiftid'];
                result['title'] = data['weekoff'];
                result['start'] = data['date'];
            }
        }
        return result
    }
}