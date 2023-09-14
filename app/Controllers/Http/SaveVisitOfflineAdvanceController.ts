import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import saveVisitOfflineAdvanceService from "App/Services/saveVisitOfflineAdvanceService";
import saveVisitOfflineAdvanceValidator from "App/Validators/saveVisitOfflineAdvanceValidator";
export default class SaveVisitOfflineAdvanceController {
  public async SaveVisitOfflineAdvance({
    request,
    response,
  }: HttpContextContract) {
    const InputValidataion = await request.validate(
      saveVisitOfflineAdvanceValidator.saveVisitOfflineAdvanceschema
    );
    const result = await saveVisitOfflineAdvanceService.saveVisitOfflineAdvance(
      InputValidataion
    );
    return response.json(result);
  }
  public async checkLoginWithSyncAttQr({request,response}:HttpContextContract){
  const input = await request.validate(saveVisitOfflineAdvanceValidator.checkLoginWithSyncAttQr)
    const result = await saveVisitOfflineAdvanceService.checkLoginWithSyncAttQr(input);
    return response.json(result);
  }
}
