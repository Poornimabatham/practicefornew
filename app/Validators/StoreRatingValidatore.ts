import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreRatingValidator {
  constructor(protected ctx: HttpContextContract) {}


  static StoreRatingsScehma = {schema:schema.create({
    empid:schema.number(),
    orgid:schema.number(),
     remark:schema.number(),
     rating:schema.number(),
     
   })
 }
}
