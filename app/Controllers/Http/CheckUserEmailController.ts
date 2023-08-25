import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import CheckUserEmailService from "App/Services/CheckuserEmailService";
import CheckUserEmailValidator from "App/Validators/CheckuserEmailValidator";

export default class checkuseremailController {
  public async CheckUserEmail({ request, response }: HttpContextContract) {
    const inputValidation = await request.validate(
      CheckUserEmailValidator.CheckUserEmailSchema
    );
    const result = await CheckUserEmailService.CheckUserEmail(inputValidation);

    return response.json(result);
  }
}
