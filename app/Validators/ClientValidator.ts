import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class ClientValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({});
  static ClientSchema = {
    schema: schema.create({
      orgId: schema.number(),
      empId: schema.number(),
    }),
    message: BaseValidator.messages,
  };

  static addClientSchema = {
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
      countryCode: schema.string(),
      status: schema.number.optional(),
      platform: schema.string.optional(),
      radius: schema.number.optional(),
      LatLong: schema.string.optional(),
    }),
    message: BaseValidator.messages,
  };

  static updateClientSchema = {
    schema: schema.create({
      orgId: schema.number(),
      empId: schema.number(),
      compName: schema.string(),
      name: schema.string(),
      clientId: schema.number(),
      compAddress: schema.string(),
      phone: schema.number(),
      countryCode: schema.string.optional(),
      email: schema.string.optional(),
      description: schema.string.optional(),
      status: schema.number.optional(),
      platform: schema.string.optional(),
      radius: schema.number.optional(),
      LatLong: schema.string.optional(),
    }),
    message: BaseValidator.messages,
  };

  static getClientListSchema = {
    schema: schema.create({
      orgId: schema.number(),
      empId: schema.number(),
      startwith: schema.string.optional(),
    }),
    message: BaseValidator.messages,
  };

  static assignMultipleClient = {
    schema: schema.create({
      Orgid: schema.number.optional(),
      clientid: schema.number.optional(),
      clientname: schema.string.optional(),
      empid: schema.number.optional(),
      empname: schema.string.optional(),
      adminid: schema.number.optional(),
      adminname: schema.string.optional(),
    }),
  };
}
