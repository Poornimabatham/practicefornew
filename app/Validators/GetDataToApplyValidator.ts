import { schema} from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class GetDataToRegValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static GetDataTOapplyRegschema = {
    schema: schema.create({
    uid:schema.number(),
    orgid:schema.number(),
    month:schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };
}
