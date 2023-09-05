import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules } from '@ioc:Adonis/Core/Validator'
import BaseValidator from './BaseValidator'

export default class HolidayValidate extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }
  static HolidayFetch = {
    schema: schema.create({
      OrgId: schema.number(),
    }),
  };
  static HolidayInsert = {
    schema: schema.create({
      empid: schema.string(),
      name: schema.string(),
      description: schema.string(),
      org_id: schema.string(),
      from: schema.string(),
      to: schema.string(),
    }),
  };
}


