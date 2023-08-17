import { schema} from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class  GetApprovalRegularizationValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static GetApprovalRegularizationschema = {
    schema: schema.create({
      attendance_id:schema.number(),
      orgid:schema.number(),
      uid:schema.number(),
      approverresult:schema.number(),
      comment :schema.number(),
      platform :schema.number(),
      RegularizationAppliedFrom:schema.number()
    }),
  };
}