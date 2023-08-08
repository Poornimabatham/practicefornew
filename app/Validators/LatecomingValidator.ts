import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class LatecomingValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  // Insert Designation schema
  static fetchlatecomingsschema = {
    schema: schema.create({
      Orgid: schema.number(),
      Date: schema.date.optional({ format: "yyyy-MM-dd" }),
      Empid: schema.number(),
      Csv: schema.number.optional(),
      Currentpage: schema.number(),
      Perpage: schema.number(),
    }),
  };
}
