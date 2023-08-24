import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MyAddonUserInfoService from "App/Services/MyAddonUserInfoService";
import MyAddonUserInfoValidator from "App/Validators/MyAddonUserInfoValidator";

export default class MyAddonUserInfoController {
  public  async Fetchdata({ request, response }: HttpContextContract) {
    const a = await request.validate(
      MyAddonUserInfoValidator.Myaddonuserinfoschema
    );
    const b = await MyAddonUserInfoService.getdetailsMyaddonuser(a);

    return response.json(b);
  }


  
}
