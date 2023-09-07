import { schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";

export default class DepartmentValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static getDepartment = {
    schema: schema.create({
      orgid: schema.number(),
      empid: schema.number(),
      status:schema.number()
    }),
    message: BaseValidator.messages,
  };

  static addDepartment = {
    schema: schema.create({
      Id: schema.number(),
      OrganizationId: schema.number(),
      Name: schema.string(),
      archive: schema.number.optional(),
    }),
    message: BaseValidator.messages,
  };

  static updateDepartment = {
    schema: schema.create({
      OrganizationId: schema.number(),
      DId: schema.number(),
      adminId: schema.number(),
      archive: schema.number(),
      Name: schema.string.optional(),
      LastModifiedById: schema.number.optional(),
    }),
    message: BaseValidator.messages,
  };

  static assignDepartment = {
    schema: schema.create({
      Orgid: schema.number(),
      deptid: schema.number(),
      deptname: schema.string(),
      empid: schema.number(),
      empname: schema.string(),
      adminid: schema.number.optional(),
      adminname: schema.string(),
    }),
  };

  static DepartmentStatusSchema = {
    schema: schema.create({
      orgid: schema.number(),
      Id: schema.number(),
    }),
  };

  static DeptEmp = {
    schema: schema.create({
      orgid: schema.number(),
      deptid: schema.number.optional(),
      empid: schema.number(),
      datafor: schema.string()
    })
  }
  static getEmpdataDepartmentWiseCount = {
    schema: schema.create({
      orgId: schema.number(),
      empId: schema.number.optional(),
      date: schema.date(),
    }),  
  };

  static deleteInActiveDepartment = {
    schema: schema.create({
      orgId: schema.number.optional(),
      empId: schema.number.optional(),
      Id: schema.number.optional(),
      date: schema.date()
    }),
  };
}
