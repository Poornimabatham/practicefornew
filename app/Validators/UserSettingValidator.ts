import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserSettingValidator  {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({})
  static usersetting = {
    schema:schema.create({
       empid : schema.number(),
       uid:schema.number(),
       cpassword:schema.string(),
       npassword:schema.string(),
       rtpassword:schema.string()
    })
  }

  static updateprofile = {
    schema:schema.create({
       orgid : schema.string(),
       empid: schema.string(),
    }),
  }

   static PunchVisit = {
      schema:schema.create({
        Orgid:schema.number(),
        Empid:schema.number(),
        Date:schema.date.optional({format:'yyyy-MM-dd'}),
        loginEmp:schema.string(),
        currentPage:schema.number(),
        perpage:schema.number()

      })
   }

   static EmployeeList = {
    schema:schema.create({
      Orgid:schema.number(),
      Empid:schema.number(),
    })
   }

   static Notification = {
      schema:schema.create({
        Orgid:schema.number(),
      })
   }

   static Notification2 = {
      schema:schema.create({
        ColumnName:schema.string(),
        Value:schema.number(),
        OrgId:schema.number()

      })
   }

   static updateNotification = {
      schema:schema.create({
        empid:schema.number(),
        status:schema.string(),
        orgid:schema.number()
      })
   }

   static Profileimage = {
      schema:schema.create({
        empId:schema.number(),
        orgId:schema.number()

      })
   }

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  // messages: CustomMessages = {}
}
