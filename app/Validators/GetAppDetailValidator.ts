import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator';

export default class GetAppDetailValidator {
  constructor(protected ctx: HttpContextContract) {}

  public static getAppDetail = {
    schema: schema.create({
      currentInstallVersion: schema.string.optional(),
      appName: schema.string(),
    }),
    message: BaseValidator.messages,
  };
}
