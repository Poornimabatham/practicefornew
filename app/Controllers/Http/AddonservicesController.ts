import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Addonservice from 'App/Services/Addonservice';
import AddonValidator from 'App/Validators/AddonValidator'

export default class AddonservicesController {

    public async sendTryFreeAddonService({ request, response }: HttpContextContract) {
        const req = await request.validate(AddonValidator.tryfreeaddon);
        const res = await Addonservice.free_addon_three_days(req);
        return response.json(res);
    }

    public async registeredFaceIDList({ request, response }: HttpContextContract) {

        const validateReq = await request.validate(AddonValidator.registeredFaceIDList);

        const res = await Addonservice.registeredFaceIDList(validateReq);

        return response.json(res);
    }

    public async disapprovefaceid({ request, response }: HttpContextContract) {

        const validateReq = await request.validate(AddonValidator.disapprovefaceid);

        const res = await Addonservice.disapprovefaceid(validateReq);

        return response.json(res);
    }

}
