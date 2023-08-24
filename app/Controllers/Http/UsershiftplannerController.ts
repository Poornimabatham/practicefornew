import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UsershiftplannerService from "App/Services/UsershiftplannerService.";
import UsershiftplannerValidator from "App/Validators/UsershiftplannerValidator";

export default class UsershiftPlannerController {
  public async FetchUsershiftPlanner({
    request,
    response,
  }: HttpContextContract) {
    const a = await request.validate(
      UsershiftplannerValidator.fetchUsershiftplannerschema
    );
    const b = await UsershiftplannerService.usershiftplanner(a);
    return response.json(b);
  }



  
  public async storedeviceinfo({request,response }: HttpContextContract) {
    const a = await  request.validate(UsershiftplannerValidator.InsertdeviceInfochema)
    const b = await  UsershiftplannerService.Storedeviceinformation(a)
    return  response.json(b)      
}
}
