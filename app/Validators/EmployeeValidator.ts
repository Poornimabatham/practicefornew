import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class EmployeeValidator extends BaseValidator {
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
