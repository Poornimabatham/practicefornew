import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import BaseValidator from "./BaseValidator";
export default class GetappVersionValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static GetappVersionschema = {
    schema: schema.create({
      platform: schema.string(),
    }),
  };
}
