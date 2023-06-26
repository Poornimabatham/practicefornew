import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Validator from  'App/Validators/User1Validator'
import User2 from 'App/Models/User2';
import Database from '@ioc:Adonis/Lucid/Database'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import User2 from 'App/Models/User2';

export default class UsersController  {
  public async index({}: HttpContextContract) {
    
  }

  public async create({}: HttpContextContract) {
    return "hello";
    
    
    
  }

  public async store({request,response}: HttpContextContract) {








    const postSchema = schema.create({
     
    // empid: schema.number(),
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
   

const users = await Database
  .from('employee') // 👈 gives an instance of select query builder
  .select('*')
return users
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
