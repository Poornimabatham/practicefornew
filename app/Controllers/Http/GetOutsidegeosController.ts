import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import GetOutsidegeoValidator from "App/Validators/GetOutsideGeoValidator";
import GetoutsidegeoService from "App/Services/ReportServices/GetoutsidegeoService";

export default class GetOutsidegeosController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    console.log("test");
    const validatedparams = await request.validate(
      GetOutsidegeoValidator.getoutsidegeo
    );
    const result = await GetoutsidegeoService.getOutsidegeoService(
      validatedparams
    );
    console.log(result)
    response.json(result)
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {} 
}
