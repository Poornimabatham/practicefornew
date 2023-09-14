import { schema} from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class LatecomingValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }
  static fetchlatecomingsschema = {
    schema: schema.create({
      refno: schema.number(),
      cdate: schema.string(),
      uid: schema.number(),
      csv: schema.number.optional(),
      currentPage: schema.number(),
      perPage: schema.number(),
    }),
  };

  static getlateComingsCsvSchema  = {
    schema: schema.create({
      Orgid: schema.number(),
      Date: schema.date.optional({ format: "yyyy-MM-dd" }),
      Empid: schema.number(),
      Csv: schema.number.optional(),
    }),
  };
}
