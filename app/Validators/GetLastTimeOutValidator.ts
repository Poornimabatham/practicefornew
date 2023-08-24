import { schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class GetLastTimeOutValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static GetLastTimeOutschema = {
    schema: schema.create({
      orgid: schema.number(),
      empid: schema.number(),
      empTimeZoneDate: schema.date.optional({ format: "yyyy-MM-dd" })
    }),
  };
}
