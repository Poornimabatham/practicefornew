import { schema,rules } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './Basevalidator'

// import Basevalidator from  './Basevalidator'

export default class User1Validator extends BaseValidator {
  constructor(public ctx: HttpContextContract) {
    super();             
  }

    
  
    static postSchema= {schema:schema.create({

   
  
    
     
    // empid: schema.number(),
    fname: schema.string.optional([
      rules.alpha()
    ]

      
    ),
    lname: schema.string([
      rules.alpha()
    ]),
  
    
    password: schema.string([
      rules.minLength(4),rules.minLength(2)
    ]) , email: schema.string([
      rules.email(),rules.unique({table:'employee',column:'email'})


    ]),  phone:schema.string([rules.mobile(),rules.maxLength(10),rules.minLength(10)]),
    }),
    

    
 message:BaseValidator.messages


  
  // messages: {
  //   required: 'The {{ field }} is required to create a new account',
  //   'fname.unique': 'Username not available',
  //   'lname.unique':'lastname is available'
  // }
  

 
 

  // const load = await request.validate({schema:this.n})

  
}
  





}


