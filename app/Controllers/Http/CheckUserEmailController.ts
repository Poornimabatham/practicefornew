import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import CheckUserEmailService from "App/Services/CheckuserEmailService";
import CheckUserEmailValidator from "App/Validators/CheckuserEmailValidator";

export default class CheckUserEmailController{
  public async CheckUserEmail({ request, response }: HttpContextContract) {
    const inputValidation = await request.validate(
      CheckUserEmailValidator.CheckUserEmailSchema
    );
    const result = await CheckUserEmailService.CheckUserEmail(inputValidation);

    return response.json(result);
  }

  public async CheckUserPhone({ request, response }: HttpContextContract) {
    const inputValidation = await request.validate(
      CheckUserEmailValidator.CheckUserPhoneSchema
    );
    const result = await CheckUserEmailService.CheckUserPhone(inputValidation);

    return response.json(result);
  }
}
