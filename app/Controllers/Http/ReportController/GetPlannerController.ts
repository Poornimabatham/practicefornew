import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import GetplannerWiseSummary from "App/Services/ReportServices/GetplannerWiseService";
import Plannervalidator from "App/Validators/ReportValidator/PlannerValidator";
export default class  GetPlannerController {
  public async getplannerwisesummary({ request, response }: HttpContextContract) {
    const a = await request.validate(Plannervalidator.FetchPlannerchema);
    const b = await GetplannerWiseSummary.Getlannerwisesummary(a);
    return response.json(b);
  }
  public async getRegSummary({request,response}:HttpContextContract){
    const a = await request.validate(Plannervalidator.getRegSummarychema);
    const b = await GetplannerWiseSummary.getRegSummary(a);
    return response.json(b);
  }
}