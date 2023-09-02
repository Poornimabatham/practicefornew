import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class GetDataToRegValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static GetDataTOapplyRegschema = {
    schema: schema.create({
      uid: schema.number(),
      orgid: schema.number(),
      month: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };

  static GetDataTOCountRegschema = {
    schema: schema.create({
      uid: schema.number(),
      orgid: schema.number(),
      month: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };

  static OnSendRegularizeRequestschema = {
    schema: schema.create({
      id: schema.number.optional(),
      timein: schema.string(),
      timeout: schema.string(),
      remark: schema.string(),
      platform: schema.string(),
      RegularizationAppliedFrom: schema.string(),
      uid: schema.number(),
      orgid: schema.number(),
      attdate: schema.date.optional({ format: "dd-MMM-yyyy" }),
    }),
  };
}
