import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Validator from  'App/Validators/User1Validator'
// import User2 from 'App/Models/User2';
import User1Validator from 'App/Validators/User1Validator';
// import Database from '@ioc:Adonis/Lucid/Database'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User2 from 'App/Models/User2';

export default class UsersController  {
  public async index({}: HttpContextContract) {
    
  }

  public async create({}: HttpContextContract) {
    return "hello";
    
    
    
  }

  public async store({request,response}: HttpContextContract) {




  const payload: any = await request.validate(User1Validator. postSchema, )
  console.log(payload)
  return payload
  await payload.save()
  const post: User2 = await User2.create(payload)

  return response.ok(post)

    await post.save()



    // const postSchema = schema.create({
     
    // // empid: schema.number(),
    // fname: schema.string.optional([
    //   rules.alpha()
    // ]

      
    // ),
    // lname: schema.string([
    //   rules.alpha()
    // ]),
  
    
    // password: schema.string([
    //   rules.minLength(4),rules.minLength(2)
    // ]) , email: schema.string([
    //   rules.email(),rules.unique({table:'employee',column:'email'})


    // ]),  phone:schema.string([rules.mobile(),rules.maxLength(10),rules.minLength(10)]),
    // })
    

    

    
  //   const messages = {
  // '*':(field, rule) => {
  //    return `${rule} validation error on ${field}`
  //   },
      
  //     required:'{{field}} is required',
  //     unique:'{{field}} must be unique',
  //     maxLength:'The length is too long',
  //     minLength:'The length is too short',
  //     email:'email should be  in @ format',
  //     mobile:'mobile containes only 10 numbers',
    
  //     //unique:'{{field}} must be unique',
  // //     minLength: '{{field}} must be atleast {{options.minLength}} characters long',
  // //     maxLength:'{{field}} cannot be longer than {{options.maxLength}} characters long',

  //  }
  
  // const payload: any = await request.validate({ schema: postSchema,messages })
  // const post: User2 = await User2.create(payload)

  // return response.ok(post)

  //   await post.save()















    
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
   

// const users = await Database
//   .from('employee') // 👈 gives an instance of select query builder
//   .select('*')
// return users
//const user = await User2.all()
// const user2 = await User2.findBy('fname', 'poornimabatham')
// return user2

  }

  public async edit({}: HttpContextContract) {
   
  }
  

  public async update({}: HttpContextContract) {}

//   public async destroy({}: HttpContextContract) {
//     const d = await User2.find(1)
// await d.delete()
//   }
}
