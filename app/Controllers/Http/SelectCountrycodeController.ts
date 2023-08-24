import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SelectCountryCodeService from "App/Services/SelectCountryCodeService";
import SelectCountryCodeValidator from "App/Validators/SelectCountryCodeValidator";


export default class SelectCountryCodeController {
  public async FetchCountryCode({
    request,
    response,
  }: HttpContextContract) {
    const inputvalidation = await request.validate(
     SelectCountryCodeValidator.fetchCountryCodeschema)
    const result = await SelectCountryCodeService.CountryCode(inputvalidation);
    return response.json(result);
  }

}