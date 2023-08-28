// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetUsersMobileValidator from 'App/Validators/GetUsersMobileValidator';
import getUsersMobileService from 'App/Services/getUsersMobileService';
export default class GetUsersMobilesController {
    public async index({request ,response}: HttpContextContract) {
        const validatedparams = await request.validate(GetUsersMobileValidator.UserMobile);
        const result = await getUsersMobileService.getUsersMobile(validatedparams);
       // console.log(result);
        response.json(result);
    }
}