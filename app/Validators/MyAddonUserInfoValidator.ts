import { schema} from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class MyAddonUserInfoValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static Myaddonuserinfoschema = {
    schema: schema.create({
      orgid:schema.number(),
      empid:schema.number()
    }),
  };
}
