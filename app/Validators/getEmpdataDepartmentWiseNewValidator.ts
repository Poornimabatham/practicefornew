import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class getEmpdataDepartmentWiseNewValidator {
  constructor(protected ctx: HttpContextContract) {}


  static getEmpdataDepartmentWiseNewScehma = {schema:schema.create({
    orgid:schema.number(),
    date: schema.date.optional({format: 'yyyy-MM-dd'})

   })
 }
}
