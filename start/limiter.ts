/*
|--------------------------------------------------------------------------
| Define HTTP rate limiters
|--------------------------------------------------------------------------
|
| The "Limiter.define" method callback receives an instance of the HTTP
| context you can use to customize the allowed requests and duration
| based upon the user of the request.
|
*/

import { Limiter } from '@adonisjs/limiter/build/services'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';

export const { httpLimiters } = Limiter.define('global', async ({request}) => {
  // console.log(request.hostname());
  // const a = request.url();
  // console.log(request);
  
  // const throttleKey = request.ip();
  // const b =throttleKey+a;
  // console.log(b);
  // let query =  await Database.table('apilimiters').insert({key:b,points:'2',expire:'2343545'})
  // console.log(query);
  
  

  
  return Limiter.allowRequests(10).every('1 min')
})

// export default class AuthController {
//   public async store({ auth, request, response }: HttpContextContract) {
//     const email = request.input('email')
//     const password = request.input('password')
  
//     // return

    

//     // Step 1
//     const throttleKey = `login_${email}_${request.ip()}`

//     // Step 2
//     const limiter = Limiter.use({
//       requests: 10,
//       duration: '15 mins',
//       blockDuration: '30 mins',
//     })

//     // Step 3
//     if (await limiter.isBlocked(throttleKey)) {
//       return response.tooManyRequests('Login attempts exhausted. Please try after some time')
//     }


//     try {
//       await auth.attempt(email, password)
//     } catch (error) {
//       // Step 4
//       await limiter.increment(throttleKey)
//       throw error
//     }

//     // Step 5
//     await limiter.delete(throttleKey)
//   }
// }
