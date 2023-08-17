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
    DepartmentId:schema.number(),
    date:schema.date.optional(),
    Designation:schema.string(),
    csv:schema.string.optional(),
    dataFor:schema.string(),
    currentPage:schema.number(),
    perPage:schema.number()
    }),message:BaseValidator.messages
  }

 
}
