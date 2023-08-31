import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import GetappVersionValidator from "App/Validators/GetappVersionValidator";
import GetappVersionService from "App/Services/GetappVersionService";
export default class GetappVersionController {
  public async getappversiondata({ request, response }: HttpContextContract) {
    const InputValidation = await request.validate(
      GetappVersionValidator.GetappVersionschema
    );
    const ServiceData = await GetappVersionService.GetappVersion(
      InputValidation
    );
    return response.json(ServiceData);
  }
}
