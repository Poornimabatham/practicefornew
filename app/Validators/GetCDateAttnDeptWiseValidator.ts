import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class GetCDateAttnDeptWiseValidator extends BaseModel {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  static GetCDateAttnDeptWise_getx = {schema:schema.create({

    dept:schema.number.optional(),
    att:schema.number.optional(),
    orgid:schema.number.optional(),
    csv: schema.string.optional(),
    currentPage: schema.number.optional(),
    perPage: schema.number.optional(),
    datafor:schema.string.optional(),
    date: schema.date.optional({format:'yyyy-MM-dd'}),

   })
 }
}
