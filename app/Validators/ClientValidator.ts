import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class ClientValidator extends BaseValidator {

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
  public schema = schema.create({})
  static ClientSchema =
    {
      schema: schema.create({
        orgid: schema.number(),
        empid: schema.number()

      }), message: BaseValidator.messages
    }

  static addClientSchema =
    {
      schema: schema.create({
        orgId: schema.number(),
        empId: schema.number(),
        compName: schema.string(),
        name: schema.string(),
        compAddress: schema.string(),
        phone: schema.number(),
        email: schema.string.optional(),
        description: schema.string.optional(),
        city: schema.string.optional(),
        country: schema.string.optional(),
        status: schema.number.optional(),
        platform: schema.string.optional(),
        radius: schema.number.optional(),
        LatLong: schema.string.optional()
      }), message: BaseValidator.messages
    }
  static updateClientSchema =
    {
      schema: schema.create({
        orgId: schema.number(),
        empId: schema.number(),
        compName: schema.string(),
        name: schema.string(),
        clientId:schema.number.optional(),
        compAddress: schema.string(),
        phone: schema.number(),
        email: schema.string.optional(),
        description: schema.string.optional(),
        status: schema.number.optional(),
        platform: schema.string.optional(),
        radius: schema.number.optional(),
        LatLong: schema.string.optional()
      }), message: BaseValidator.messages
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
