import { schema,rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class getProfileImageValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static getProfileImageServicesschema = {
    schema: schema.create({
      orgId: schema.number(),

      empId: schema.number(),
    }),
  };

  static sendBrodCastNotificationFromService = {
    schema: schema.create({
      refno: schema.number(),
      title: schema.string(),
      uid: schema.number(),
      body: schema.string(),
      topic: schema.string.optional(),
      PageName: schema.string(),
    }),
  };
  static generateNumericOTPschema = {
    schema: schema.create({
      emailId: schema.string([rules.email()]),
      empId: schema.number(),
      orgId: schema.number(),
    }),
  };
}
