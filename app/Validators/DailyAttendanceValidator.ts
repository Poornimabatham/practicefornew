import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class DailyAttendanceValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
   }

  static getpresentSchema = {
    schema: schema.create({
    OrganizationId:schema.number(),
    EmployeeId:schema.number(),
    DepartmentId:schema.number.optional(),
    date:schema.date.optional(),
    csv:schema.string.optional(),
    dataFor:schema.string(),
    currentPage:schema.number.optional(),
    perPage:schema.number.optional()
    }),message:BaseValidator.messages
  }

 
}
