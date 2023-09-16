import { schema,rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class ChangePasswordOtpValidator {
  constructor(protected ctx: HttpContextContract) {}

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
  static changePasswordOTP = {
    schema: schema.create({
      emailotp: schema.string.optional(),
      phoneotp: schema.string(),
    }),
    message: BaseValidator.messages,
  };

  static newchangepass = {
    schema: schema.create({
      changepassphone: schema.string(),
      newpass: schema.string.optional(),
    }),
    message: BaseValidator.messages,
  };

  static Changepass = {
    schema: schema.create({
      empid: schema.number(),
      orgid: schema.number(),
      pwd: schema.string(),
      npwd: schema.string(),
      email:schema.string([rules.email()])
    }),
    message: BaseValidator.messages,
  };
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
