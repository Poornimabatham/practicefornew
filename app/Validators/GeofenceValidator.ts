import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class GeofenceValidator {
  constructor(protected ctx: HttpContextContract) {}

  static getgeofence = {
    schema: schema.create({
      OrganizationId: schema.number(),
      currentpage:schema.number(),
      perpage:schema.number(),
      pagename:schema.string()
    }), message: BaseValidator.messages
  }

  static addgeofence = {
    schema: schema.create({
      Name: schema.string(),
      Lat_Long:schema.string(),
      Location:schema.string(),
      Radius:schema.string(),
      OrganizationId:schema.number(),
      LastModifiedById:schema.number()
    }), message: BaseValidator.messages
  }

  public messages: CustomMessages = {}
}
