import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ResetPasswordLinkService from "App/Services/ResetpasswordLinkService";
import ResetPasswordLinkValidator from "App/Validators/ResetPassWordLinkValidator";

export default class ResetPasswordLinkController {
  public async ResetPassword({ request }: HttpContextContract) {
    const Validationinput = await request.validate(
     ResetPasswordLinkValidator.ResetPasswordLinkchema
    );
    const Output = await ResetPasswordLinkService.ResetPassword(Validationinput);
    return Output;
  }
  public async   getAllowAttToUser ({ request }: HttpContextContract) {
    const Validationinput = await request.validate(
     ResetPasswordLinkValidator.getAllowAttToUserschema
    );
    const Output = await ResetPasswordLinkService.getAllowAttToUserData(Validationinput);
    return Output;
  }
}
