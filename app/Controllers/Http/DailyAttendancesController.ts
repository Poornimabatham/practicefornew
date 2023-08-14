import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DailyAttendanceValidator from 'App/Validators/DailyAttendanceValidator';
import DailyAttendanceService from 'App/Services/DailyAttendanceService';


export default class DailyAttendancesController {

    public async getPresentList({ request, response }: HttpContextContract) {

        const requestValidate = await request.validate(DailyAttendanceValidator.getpresentSchema);

        const serviceResult = await DailyAttendanceService.getpresentList(requestValidate);

        return response.json(serviceResult);
    }
}
