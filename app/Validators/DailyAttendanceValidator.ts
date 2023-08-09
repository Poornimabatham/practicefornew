import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class DailyAttendanceValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
   }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  static getpresentSchema = {
    schema: schema.create({
    OrganizationId:schema.number(),
    EmployeeId:schema.number(),
    DepartmentId:schema.number.optional(),
    date:schema.date.optional(),
    DesignationId:schema.number.optional(),
    csv:schema.string.optional(),
    dataFor:schema.string(),
    currentPage:schema.number.optional(),
    perPage:schema.number.optional()
    }),message:BaseValidator.messages
  }

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
