import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class SendNotificationDiffOrgEmployeeValidator {
  constructor(protected ctx: HttpContextContract) { }

  static SendNotificationDiffOrgEmployee = {
    schema: schema.create({
      orgid: schema.number(),
      contact: schema.string(),
      adminEmail: schema.string.optional(),
      adminId: schema.number.optional()
    }), message: BaseValidator.messages
  }

  public messages: CustomMessages = {}
}
