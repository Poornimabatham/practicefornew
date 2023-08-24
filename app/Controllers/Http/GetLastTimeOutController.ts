import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import GetLastTimeOutValidator from "App/Validators/GetLastTimeOutValidator";
import GetLastTimeService from "App/Services/GetLastTimeOutService";

export default class GetLastTimeOutController {
  public async FetchLastTimeOut({request,response }: HttpContextContract) {
    const InputFeildsValidation = await  request.validate(GetLastTimeOutValidator.GetLastTimeOutschema)
    const result = await  GetLastTimeService.GetLastTime(InputFeildsValidation)
    return  response.json(result)
  }
}