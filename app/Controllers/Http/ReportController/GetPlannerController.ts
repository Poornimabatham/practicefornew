import { Request } from "@adonisjs/core/build/standalone";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import PlannerService from "App/Services/ReportServices/PlannerService";
import Planneralidator from "App/Validators/ReportValidator/PlannerValidator";

import Plannervalidator from "App/Validators/ReportValidator/PlannerValidator";
export default class GetplannerController {
  public async data({ request, response }: HttpContextContract) {
    const a = await request.validate(Plannervalidator.FetchPlannerchema);

    const b = await PlannerService.getplannerwisesummary(a);

    return response.json(b);
  }
}
