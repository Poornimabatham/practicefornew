import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class UsershiftplannerValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static fetchUsershiftplannerschema = {
    schema: schema.create({
      empid: schema.number(),
      orgid: schema.number(),
    }),
  };

  static InsertdeviceInfochema = {
    schema: schema.create({
      empid: schema.number(),
      devicename: schema.string(),
      deviceid: schema.string([rules.alphaNum()]),
    }),
  };
  static getShiftDetailsShiftPlanner = {
    schema: schema.create({
      empid: schema.number(),
      orgid: schema.number(),
      attDate: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };
}
