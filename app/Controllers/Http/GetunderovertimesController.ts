import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import getunderovertimeService from 'App/Services/GetunderovertimeService'
import GetunderovertimeValidator from 'App/Validators/GetunderovertimeValidator'

export default class GetunderovertimesController {

    public async getunderovertime({ request, response }: HttpContextContract) {
        const reqData = await request.validate(GetunderovertimeValidator.getUnderOvertime);

        const resService = await getunderovertimeService.getunderovertime(reqData);

        return response.json(resService);
    }
}
