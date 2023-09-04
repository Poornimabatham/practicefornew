import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class loginValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }
  static loginV = {
    schema: schema.create({
      userName: schema.string(),
      password: schema.string(),
    }),
    message: BaseValidator.messages,
  };
  static logout = {
    schema: schema.create({
      empid: schema.number(),
      orgid: schema.number(),
    }),
    message: BaseValidator.messages,
  };

  static singupvalidator = {
    schema: schema.create({
      username: schema.string(),
      companyName: schema.string(),
      useremail: schema.string(),
      userpassword: schema.string(),
      countrycode: schema.number(),
      countrycodeid: schema.number(),
      phoneno: schema.number(),
      appleAuthId: schema.number.optional(),
      platform: schema.string(),
      app: schema.string(),
      skipOTP: schema.string(),
      emailVerification: schema.string.optional(),
    }),
  };

  static Loginverifymail = {
    schema: schema.create({
      email: schema.number.optional(),
      org_id: schema.number.optional(),
    }),
  };
}