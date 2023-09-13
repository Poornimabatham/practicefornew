import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class AddonValidator {
  constructor(protected ctx: HttpContextContract) {

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
  public static tryfreeaddon = {
    schema: schema.create({
      uid: schema.number(),
      refno: schema.number(),
      name: schema.string()
    }),
    message: BaseValidator.messages,
  }

  public static registeredFaceIDList = {
    schema: schema.create({
      refno: schema.number(),
      dataFor: schema.string(),
      empid: schema.number(),
      currentPage: schema.number.optional(),
      perPage: schema.string.optional(),
      pageName: schema.string.optional()
    }),
    message: BaseValidator.messages,
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
