import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class ResetPasswordLinkValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static ResetPasswordLinkchema = {
    schema: schema.create({
      una: schema.string([rules.email()]),
    }),
  };

  static getAllowAttToUserschema = {
    schema: schema.create({
      allowToPunchAtt: schema.string([rules.alpha()]),
      Id: schema.number(),
      orgid: schema.number(),
      empid: schema.number(),
    }),
  };
}
