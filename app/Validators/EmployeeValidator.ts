import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class EmployeeValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public static empvalid = {
    schema: schema.create({
      refno: schema.number(),
      empid: schema.number(),
      status: schema.number.optional(),
      currentPage: schema.number.optional(),
      perpage: schema.number.optional(),
      searchval: schema.string.optional()
    })
    , message: BaseValidator.messages
  }
  public static deleteemp = {
    schema: schema.create({
      EmpId: schema.number(),
      Orgid: schema.number(),
      permission: schema.number(),
      adminname: schema.string(),
      EmpName: schema.string(),
      status: schema.number(),
      adminid: schema.number()
    })
    , message: BaseValidator.messages
  }

  public messages: CustomMessages = {}
}
