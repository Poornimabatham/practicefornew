import { Request } from "@adonisjs/core/build/standalone";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import GetplannerWiseSummary from "App/Services/ReportServices/GetplannerWiseService";
import Plannervalidator from "App/Validators/ReportValidator/PlannerValidator";

export default class GetplannerController {
  public async data({ request, response }: HttpContextContract) {
    const a = await request.validate(Plannervalidator.FetchPlannerchema);
    const b = await GetplannerWiseSummary.Getlannerwisesummary(a);
    return response.json(b);
  }
}
