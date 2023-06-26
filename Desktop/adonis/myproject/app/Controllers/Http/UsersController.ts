import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validator from  'App/Validators/Validator'
// import User2 from 'App/Models/User2';

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User2 from 'App/Models/User2';

export default class UsersController {
  public async index({}: HttpContextContract) {
    console.log(Validator.n);
    console.log(Validator.messages)
   
  }

  public async create({}: HttpContextContract) {
    
    
    
  }

  public async store({request,response}: HttpContextContract) {








    const postSchema = schema.create({
     
    empid: schema.number(),
    fname: schema.string([
      rules.alpha()
    ]

      
    ),
    lname: schema.string([
      rules.alpha()
    ]),
  
    password: schema.string([
      rules.minLength(4),rules.minLength(2)
    ]) , email: schema.string([
      rules.email()
    ]),  phone:schema.number(),
    })

    
   const messages = {
    required: 'The {{ field }} is required to create a new account',
    'fname.unique': 'Username not available',
    'lname.unique':'lastname is available'
  }
  
  const payload: any = await request.validate({ schema: postSchema,messages })
  const post: User2 = await User2.create(payload)

  return response.ok(post)

    await post.save()















    
    // console.log(Validator.messages)

    // console.log(request.all())
    // return  false;



    
    // const User = new  User2()
    // User.fname ="rahul"
    // User.lname ="jain"
    // User.password = 7987
    // User.email= "somya21@gmail.com"
    // User.phone=87979898
    // await User.save()
  }

  public async show({}: HttpContextContract) {
    // return "ah fo ia"
    // console.log(validator.n);

  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
