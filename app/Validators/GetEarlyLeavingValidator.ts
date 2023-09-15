import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetEarlyLeavingValidator {
  constructor(protected ctx: HttpContextContract) {}

  static EarlyLeavingScehma = {
    schema: schema.create({
      uid: schema.number.optional(),
      orgid: schema.number.optional(),
      csv: schema.string.optional(),
      currentPage: schema.number.optional(),
      perPage: schema.number.optional(),
      cdate: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };

  static EarlyLeavingCsvScehma = {
    schema: schema.create({
      uid: schema.number.optional(),
      orgid: schema.number.optional(),
      csv: schema.string.optional(),
      cdate: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };
}
