import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { BaseModel } from "@ioc:Adonis/Lucid/Orm";

export default class CheckUserEmailValidator extends BaseModel {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static CheckUserEmailSchema = {
    schema: schema.create({
      email: schema.string(),
    }),
  };

  static CheckUserPhoneSchema = {
    schema: schema.create({
      phone: schema.string(),
    }),
  };
  static verifyEmailOtpRequestSchema = {
    schema: schema.create({
      emailId: schema.string([rules.email()]),
      otp: schema.number(),
      orgId: schema.number(),
    }),
  };

  static updateEmailOTPRequestSchema = {
    schema: schema.create({
      emailId: schema.string([rules.email()]),
      oldEmail: schema.string([rules.email()]),

      empId: schema.number(),
      orgId: schema.number(),
    }),
  };
}
