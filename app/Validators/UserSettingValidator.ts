import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserSettingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({})
  static usersetting = {
    schema:schema.create({
       empid : schema.number(),
       uid:schema.number(),
       cpassword:schema.string(),
       npassword:schema.string(),
       rtpassword:schema.string()
    })
  }

}
