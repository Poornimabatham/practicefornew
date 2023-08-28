import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TempAssignClientService from "App/Services/TempAssignClientService";
import TempAssignClientValidator from "App/Validators/TempAssignClientValidator";

export default class  TempAssignClientController {
  public async TempAssignClientdata({
    request,
    response,
  }: HttpContextContract) {
    const InputValidation = await request.validate(
      TempAssignClientValidator.TempAssignClientschema
    );
    const Output= await TempAssignClientService.TempAssignClient( InputValidation);
    return response.json(Output);
  }
  
}
