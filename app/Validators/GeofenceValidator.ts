import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class GeofenceValidator {
  constructor(protected ctx: HttpContextContract) { }

  static getgeofence = {
    schema: schema.create({
      OrganizationId: schema.number(),
      currentpage: schema.number.optional(),
      perpage: schema.number.optional(),
      pagename: schema.string.optional(),
    }),
    message: BaseValidator.messages,
  };

  static addgeofence = {
    schema: schema.create({
      Name: schema.string(),
      Lat_Long: schema.string(),
      Location: schema.string(),
      Radius: schema.string(),
      OrganizationId: schema.number(),
      LastModifiedById: schema.number(),
    }),
    message: BaseValidator.messages,
  };
  static addpolygon = {
    schema: schema.create({
      Name: schema.string(),
      Lat_Long: schema.string(),
      OrganizationId: schema.number(),
      Location: schema.string(),
      LastModifiedById: schema.number(),
      Status: schema.number(),
    }),
  };
  static assignGeofence = {
    schema: schema.create({
      area_assigned: schema.number(),
      OrganizationId: schema.number(),
      Id: schema.number(),
      adminid: schema.number(),
    }),
  };
  public messages: CustomMessages = {};

  static deleteGeoFence = {
    schema: schema.create({
      area_assigned: schema.string.optional(),
      OrganizationId: schema.string.optional(),
    }),
  };
}
