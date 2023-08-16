 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DailyAttendanceService from 'App/Services/DailyAttendanceService';

export default class AttendancesController {

    public async saveTimeInOut({ request,response }: HttpContextContract) {
        console.log("Function Working");
       
        let allDataOfTimeInOut= await request.all();
        const serviceResult = await DailyAttendanceService.saveTimeInOut(allDataOfTimeInOut);
        return response.json(serviceResult);
    }
}
