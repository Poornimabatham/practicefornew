import { schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class GetInterimAttendancesValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static getInterimAttendancesschema = {
    schema: schema.create({
      attendanceMasterId: schema.number(),
    }),
  };
}
