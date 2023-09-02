import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'
export default class UserSettingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({});
  static usersetting = {
    schema: schema.create({
      empid: schema.number(),
      uid: schema.number(),
      cpassword: schema.string(),
      npassword: schema.string(),
      rtpassword: schema.string(),
    }),
  };

  static updateprofile = {
    schema: schema.create({
      orgid: schema.string(),
      empid: schema.string(),
    }),
  };

  static PunchVisit = {
    schema: schema.create({
      Orgid: schema.number(),
      Empid: schema.number(),
      Date: schema.date.optional({ format: "yyyy-MM-dd" }),
      loginEmp: schema.string(),
      currentPage: schema.number(),
      perpage: schema.number(),
    }),
  };

  static EmployeeList = {
    schema: schema.create({
      Orgid: schema.number(),
      Empid: schema.number(),
    }),
  };

  static Notification = {
    schema: schema.create({
      Orgid: schema.number(),
    }),
  };

  static Notification2 = {
    schema: schema.create({
      ColumnName: schema.string(),
      Value: schema.number(),
      OrgId: schema.number(),
    }),
  };

  static updateNotification = {
    schema: schema.create({
      empid: schema.number(),
      status: schema.string(),
      orgid: schema.number(),
    }),
  };

  static QrValidation = {
    schema: schema.create({
      empId: schema.number(),
      orgId: schema.number(),
      qRKioskPin: schema.number(),
    }),
  };

  static ChangeQR = {
    schema: schema.create({
      userId: schema.number(),
      orgId: schema.number(),
      oldPin: schema.number(),
      newPin: schema.number(),
    }),
  };

  static RegDetail = {
    schema: schema.create({
      datafor: schema.string(),
      uid: schema.number(),
      orgid: schema.number(),
      hrsts: schema.number(),
      divhrsts: schema.number(),
    }),
  };

  static recoverPinLoginCredential = {
    schema: schema.create({
      Orgid: schema.number(),
      Empid: schema.number(),
      userName: schema.string(),
      password: schema.string(),
    }),
  };

  static UpdateQR = {
    schema: schema.create({
      userId: schema.number(),
      orgId: schema.number(),
      status: schema.number(),
    }),
  };

  static demoSchedule = {
    schema: schema.create({
      orgId: schema.number(),
      empId: schema.number(),
      newDate: schema.date.optional({ format: "yyyy-MM-dd" }),
      selectTime: schema.string(),
      cardTitle: schema.string(),
    }),
  };

  static Teampunchinfo = {
    schema: schema.create({
      uid: schema.number(),
      orgid: schema.number(),
      date: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };

  static GetQrKioskStatus = {
    schema: schema.create({
      OrgId: schema.number([]),
      EmpId: schema.number([]),
    }),
    message: BaseValidator.messages,
  };

  static DeleteAccount = {
    schema: schema.create({
      reason: schema.string.optional(),
      refid: schema.number.optional(),
      uid: schema.number.optional(),
      date: schema.date.optional({ format: "yyyy-MM-dd" }),
    }),
  };
}
