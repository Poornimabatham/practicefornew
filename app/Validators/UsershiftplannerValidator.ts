import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class UsershiftplannerValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static fetchUsershiftplannerschema = {
    schema: schema.create({
      uid: schema.number(),
      orgid: schema.number(),
    }),
  };

  static InsertdeviceInfochema = {
    schema: schema.create({
      empid: schema.number(),
      devicename: schema.string([rules.alphaNum()]),
      deviceid: schema.string([rules.alphaNum()]),
    }),
  };
}
