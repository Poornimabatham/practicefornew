import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetWeekendValidator from 'App/Validators/GetWeekendValidator'
import GetWeekendsService from 'App/Services/GetWeekendsService'

export default class GetWeekendsController {
    public async GetWeekends({ request, response }: HttpContextContract) {

        const reqData = await request.validate(GetWeekendValidator.GetWeekends);

        const serviceRes = await GetWeekendsService.getWeekends(reqData);

        return response.json(serviceRes);
    }
}
