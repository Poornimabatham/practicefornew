import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import getProfileImageValidator from 'App/Validators/getProfileImageValidator'
import getProfileImageService from 'App/Services/getProfileImageService'
export default class getProfileImageController {
    public async getProfileImage({request,response}: HttpContextContract) {
        const InputValidation = await request.validate(getProfileImageValidator.getProfileImageServicesschema)
        const output = await getProfileImageService.getProfileImage(InputValidation)
        return response.json(output)
    }

    public async sendBrodCastNotificationFromService({request,response}: HttpContextContract) {
        const InputValidation = await request.validate(getProfileImageValidator.sendBrodCastNotificationFromService)
        const output = await getProfileImageService.sendBrodCastNotificationFromService(InputValidation)
        return response.json(output)
    }
    public async generateNumericOTP({request,response}: HttpContextContract) {
        const InputValidation = await request.validate(getProfileImageValidator.generateNumericOTPschema)
        const output = await getProfileImageService.generateNumericOTP(InputValidation)
        return response.json(output)
    }
}