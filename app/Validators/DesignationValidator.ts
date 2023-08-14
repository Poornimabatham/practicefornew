import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class DesignationValidator  extends BaseValidator{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

    static AddDesignationschema ={
   schema:schema.create({
      uid: schema.number(),
      orgid: schema.number(),
      name: schema.string(),
      sts: schema.number.optional(),
      desc: schema.string.optional(),
    })
  }
  
  // Fetch Designation schema
     static Designationschema ={
      schema:schema.create({
        orgid:schema.number(),
        status:schema.number.optional(),
        pagename:schema.number.optional(),
        currentpage:schema.number.optional(),
        perpage:schema.number.optional()
  
      })
     }
  
    static updateDesignationschema={
      schema:schema.create({
        Updateid:schema.number(),
        UpdateName:schema.string(),
        sts:schema.number.optional(),
        Updateorgid:schema.number()
        
      })
     }

  }
  

