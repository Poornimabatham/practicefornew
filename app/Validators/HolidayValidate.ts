import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules } from '@ioc:Adonis/Core/Validator'
import BaseValidator from './BaseValidator'

export default class HolidayValidate extends BaseValidator{
 constructor(protected ctx: HttpContextContract) {
  super()
 }
  static HolidayFetch = {schema:schema.create({
   OrgId:schema.number()
  
   })
  }
  static HolidayInsert = {schema:schema.create({
    EmpId:schema.number(),
    Name: schema.string(),
    Description: schema.string([rules.alpha(),rules.maxLength(20),rules.minLength(2)]),
    OrganizationId: schema.number(),
    DateFrom: schema.date.optional({format: 'yyyy-MM-dd'}),
    DateTo: schema.date.optional({format: 'yyyy-MM-dd'})

   })
  }
}


