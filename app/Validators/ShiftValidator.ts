import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'
export default class ShiftValidator {
  constructor(protected ctx: HttpContextContract) {
    // super()
  }
  static shifts = {
    schema: schema.create({
      OrganizationId: schema.number(),
      archive: schema.number.optional(),
      shifttype: schema.number.optional(),
      currentpage: schema.number(),
      perpage: schema.number(),
    }),
    message: BaseValidator.messages,
  };
  static addshift = {
    schema: schema.create({
      name: schema.string(),
      org_id: schema.number(),
      ti: schema.string(),
      to: schema.string(),
      tib: schema.string.optional(),
      tob: schema.string.optional(),
      sts: schema.number(),
      shifttype: schema.number(),
      minimumworkinghours: schema.number.optional(),
      multiplepunches: schema.number(),
      empid: schema.number(),
      shiftcalendardata: schema.string(),
    }),
  };
  static updateshift = {
    schema: schema.create({
      uid: schema.number(),
      shift: schema.string(),
      sts: schema.number(),
      multiple_timests: schema.number(),
      id: schema.number(),
    }),
  };
  static assign = {
    schema: schema.create({
      Orgid: schema.number(),
      shiftid: schema.number(),
      shiftname: schema.string(),
      empid: schema.number(),
      empname: schema.string(),
      adminid: schema.number(),
      adminname: schema.string(),
    }),
  };
  static Inactiveshift={ 
    schema: schema.create({
      orgId: schema.number(),
      id: schema.number(),
      empId: schema.number(),
    }),
  };

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
  public schema = schema.create({});

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
  public messages: CustomMessages = {};
}
