import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import getAppDetailService from "App/Services/getAppDetailService";
import GetAppDetailValidator from "App/Validators/GetAppDetailValidator";

export default class GetAppDetailsController {
  private data = []  
  public async getAppDetail({ request, response }: HttpContextContract) {
    const getValidData = await request.validate(
      GetAppDetailValidator.getAppDetail
    );
    this.data["appName"] = getValidData.appName ? getValidData.appName : "appName";
    this.data["currentInstallVersion"] = getValidData.currentInstallVersion ? getValidData.currentInstallVersion : "0.0.0";

    const getreponseFromService = await getAppDetailService.getAppDetail(
      this.data
    );

    return response.json(getreponseFromService);
  }
}
