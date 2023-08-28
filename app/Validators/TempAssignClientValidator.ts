import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
import Schema from "@ioc:Adonis/Lucid/Schema";

export default class TempAssignClientValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static TempAssignClientschema = {
    schema: schema.create({
      cid: schema.number(),
      uid: schema.number(),
      orgid: schema.number(),
    }),
  };
 
  
}
