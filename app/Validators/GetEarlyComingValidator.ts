import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class GetEarlyComingValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static EarlyCommersScehma = {
    schema: schema.create({
      empid: schema.number.optional(),
      deptId: schema.number.optional(),
      orgid: schema.number.optional(),
      csv: schema.string.optional(),
      currentPage: schema.number.optional(),
      perPage: schema.number.optional(),
      date: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };

  static EarlyCommersCsvScehma = {
    schema: schema.create({
      empid: schema.number.optional(),
      deptId: schema.number.optional(),
      orgid: schema.number.optional(),
      csv: schema.string.optional(),
      date: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };
}
