import { schema} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class TokenValidator extends BaseValidator  {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({})
  static token ={
    schema:schema.create({
    userName: schema.string(),
    empid: schema.number(),
    orgid: schema.number(),
    }), message: BaseValidator.messages
  }

 
}
