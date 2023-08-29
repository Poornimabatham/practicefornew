import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import CheckUserEmailService from "App/Services/CheckuserEmailService";
import CheckUserEmailValidator from "App/Validators/CheckuserEmailValidator";

export default class CheckUserEmailController{
<<<<<<< HEAD
  public async CheckUserEmail({ request, response }: HttpContextContract) {
=======
  public async CheckUserEmaildata({ request, response }: HttpContextContract) {
>>>>>>> 871124dd6f71680c74cc9989f4b9e5702abfc21e
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
}
