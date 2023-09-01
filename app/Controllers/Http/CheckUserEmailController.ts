import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import CheckUserEmailService from "App/Services/CheckuserEmailService";
import CheckUserEmailValidator from "App/Validators/CheckuserEmailValidator";

export default class CheckUserEmailController{
  public async CheckUserEmaildata({ request, response }: HttpContextContract) {
    const inputValidation = await request.validate(
      CheckUserEmailValidator.CheckUserEmailSchema
    );
    const result = await CheckUserEmailService.CheckUserEmail(inputValidation);

    return response.json(result);
  }

  public async CheckUserPhonedata({ request, response }: HttpContextContract) {
    const inputValidation = await request.validate(
      CheckUserEmailValidator.CheckUserPhoneSchema
    );
    const result = await CheckUserEmailService.CheckUserPhone(inputValidation);

    return response.json(result);
  }

  public async verifyEmailOtpRequestdata({ request, response }: HttpContextContract) {
    const inputValidation = await request.validate(
      CheckUserEmailValidator.verifyEmailOtpRequestSchema
    );
    const result = await CheckUserEmailService.VerifyEmailOtpRequest(inputValidation);

    return response.json(result);
  }
  public async updateEmailOTPRequestdata({request,response}:HttpContextContract){
    const inputValidation = await request.validate(
      CheckUserEmailValidator.updateEmailOTPRequestSchema
    );
    const result = await CheckUserEmailService.UpdateEmailOTPRequest(inputValidation);

    return response.json(result);
  }
}
