import { schema} from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class  GetApprovalRegularizationValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static GetApprovalRegularizationschema = {
    schema: schema.create({
      Attendanceid:schema.number(),
      Orgid:schema.number(),
      Uid:schema.number(),
      Approvalresult:schema.number(),
      Comment:schema.number(),
      Platform:schema.number(),
      RegularizationAppliedFrom:schema.number()
    }),
  };
}