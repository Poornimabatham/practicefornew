import { schema,rules } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Basevalidator from  './Basevalidator'

export default class Validator extends Basevalidator  {
  constructor(public ctx: HttpContextContract) {
    super();
  }

    
  
    static n = {schema:schema.create({

    empid: schema.number(),
  fname: schema.string(),
  lname: schema.string(),

  password: schema.string([
    rules.confirmed(),
    rules.minLength(4)
  ]) , email: schema.string([
    rules.email()
  ]),  phone:schema.number(),
  }),


  
  messages: {
    required: 'The {{ field }} is required to create a new account',
    'fname.unique': 'Username not available',
    'lname.unique':'lastname is available'
  }
  

  // message:Basevalidator.messages
 

  // const load = await request.validate({schema:this.n})

  
}
  




}


