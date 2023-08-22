import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetDataToRegService from 'App/Services/GetDataToApplyRegService'
import GetDataToRegValidator from 'App/Validators/GetDataToApplyValidator'

export default class GetDataToApplyRegController {

    public async FetchDataToApplyReg({ request,response }: HttpContextContract) {
       
        const ValidationInputDetails = await request.validate(GetDataToRegValidator.GetDataTOapplyRegschema)
        const Output = await GetDataToRegService.FetchingdatatoReg(ValidationInputDetails)
        return response.json(Output);

    }
}
