import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import getlateComingsCsvService from "App/Services/getlateComingsCsvService"
import LatecomingValidator from "App/Validators/LatecomingValidator";
export default class LatecomingsController {
  public async getlateComingsCsv({ request, response }: HttpContextContract) {
    const a = await request.validate(
      LatecomingValidator.getlateComingsCsvSchema
    );
    const b = await getlateComingsCsvService.getLateComingCsv(a);
    return response.json(b);
  }
}
