import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from '../BaseValidator'

export default class Plannervalidator  extends BaseValidator{
  constructor(protected ctx: HttpContextContract) {
    super()
  }
    static FetchPlannerchema ={
  
   schema:schema.create({
  userid:schema.number(),
  refno:schema.number(),
  attDen:schema.number()

    })
  }
 }
  

