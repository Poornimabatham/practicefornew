import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import loginValidator from 'App/Validators/loginValidator'
import loginService from 'App/Services/loginService'
import Helper from 'App/Helper/Helper';
import Hash from '@ioc:Adonis/Core/Hash'
import UserMaster from 'App/Models/UserMaster';


export default class LoginController {

  public async checkLogin({ request, response ,auth}: HttpContextContract) {
    
    const data = await request.validate(loginValidator.loginV);
    const {userName = "", password=""} = request.all();
    const Email1:any = await Helper.encode5t(userName);
    const Password1:any=  await Helper.encode5t(password);
    
    const user:any = await UserMaster
      .query()
      .orWhereRaw("(Username = ? or username_mobile = ?)", [Email1, Email1])
      .where('password', Password1);
    // Verify password  

      
    if (user.length <= 0) {
      // User not found
      return response.status(401).send('Invalid credentials deepak');
    }

    // Compare the provided plaintext password with the stored plaintext password
    if (Password1 === user[0].password) {
      const token = await auth.use('api').generate(user[0])
     // console.log(token.token);
      
        //var testing=  await auth.use('api').authenticate()
        //console.log('testing');
        //console.log(testing);
        
      const result = await loginService.checkLogin(data,token)
     
      return result
      //return response.status(200).json({ message: 'Authentication successful' });
    } else {
      // Passwords don't match, authentication failed
      return response.status(401).send('Invalid credentials shakir');
    }
    
   
  }

   public async newregister_orgTemp({request,response}:HttpContextContract)
   {

     const validata = await request.validate(loginValidator.singupvalidator)
     const res      = await loginService.newregister_orgTemp(validata)
     response.json(res)
  }
  
  private data = []
  public async Loginverifymail({ request, response }: HttpContextContract) {
    const valdata = await request.validate(loginValidator.Loginverifymail)
    this.data["email"] = valdata.email ? valdata.email : "0";
    this.data["org_id"] = valdata.org_id ? valdata.org_id : "0";
    const servicerep = await loginService.Loginverifymail(this.data);
    return response.json(servicerep)  
   }

   public async insert({response,auth}){
    ///const { auth } = require('@adonisjs/auth');
     let email='dee@gmail.com';
     let pwd = 'abcd1234';
    // var test = await auth.attempt('deeapk@gmail.com','abcd1234')
    // console.log('test');
    // console.log(test);
    // console.log('test');

    /////////////////////////////////////////////////////////////////

      // Lookup user manually
      const user = await UserMaster
      .query()
      .where('email', email)
      .where('password', pwd)
      .firstOrFail()
  
    // Verify password
    if (!user) {
      // User not found
      return response.status(401).send('Invalid credentials');
    }
    
    // Compare the provided plaintext password with the stored plaintext password
    if (pwd === user.Password) {
      const token = await auth.use('api').generate(user)
      console.log('Authentication token:', token)
      return response.status(200).json({ message: 'Authentication successful' });
    } else {
      // Passwords don't match, authentication failed
      return response.status(401).send('Invalid credentials');
    }
  
    // Generate token

    

    // let query = await Usertest.create({
    //   email: "shakir@gmail.com",
    //   password: "abcd1234"
    // })
   }



}

 