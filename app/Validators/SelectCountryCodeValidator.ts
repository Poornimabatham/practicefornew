import { schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class SelectCountryCodeValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static fetchCountryCodeschema = {
    schema: schema.create({
        countrycode:schema.string(),
        countryname:schema.string(),
    }),
  };

  
}