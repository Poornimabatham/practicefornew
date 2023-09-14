import { schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class DesignationValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static AddDesignationschema = {
    schema: schema.create({
      uid: schema.number(),
      orgid: schema.number(),
      name: schema.string(),
      sts: schema.number(),
      desc: schema.string.optional(),
    }),
  };
  static Designationschema = {
    schema: schema.create({
      orgid: schema.number(),
      status: schema.number.optional(),
      pagename: schema.string(),
      currentPage: schema.number(),
      perPage: schema.number.optional(),
    }),
  };

  static updateDesignationschema = {
    schema: schema.create({
      uid: schema.number(),
      UpdateName: schema.string.optional(),
      sts: schema.string(),
      id:schema.number(),
      desg:schema.string()
    }),
  };

  static assignDesignation = {
    schema: schema.create({
      Orgid: schema.number(),
      desigid: schema.number(),
      designame: schema.string(),
      empid: schema.number(),
      empname: schema.string(),
      adminid: schema.number.optional(),
      adminname: schema.string(),
    }),
  };

  static DesignationStatusSchema = {
    schema: schema.create({
      orgid: schema.number(),
      Id: schema.number(),
    }),
  };

  static deleteInActiveDesignationVal = {
    schema: schema.create({
      orgId: schema.number.optional(),
      empId: schema.number.optional(),
      Id: schema.number.optional(),
    }),
  };
}
