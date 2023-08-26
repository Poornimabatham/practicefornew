import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChangePasswordOtpValidator from 'App/Validators/ChangePasswordOtpValidator'
import changePasswordOTPService from 'App/Services/changePasswordOTPService'

export default class ChangePasswordOtpsController {

    public async changePasswordOTP({ request, response }: HttpContextContract) {

        const validatedata = await request.validate(ChangePasswordOtpValidator.changePasswordOTP);

        const service = await changePasswordOTPService.changePasswordOTP(validatedata);

        return response.json(service);
    }

    public async newchangepass({ request, response }: HttpContextContract) {

        const validatedata = await request.validate(ChangePasswordOtpValidator.newchangepass);

        const service = await changePasswordOTPService.newchangepass(validatedata);

         response.json(service);
    }
}
