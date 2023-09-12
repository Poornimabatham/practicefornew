import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import loginValidator from 'App/Validators/loginValidator'
import loginService from 'App/Services/loginService'
import Helper from 'App/Helper/Helper';
import Usertest from 'App/Models/Usertest';

export default class LoginController {
  public async checkLogin({ request, response }: HttpContextContract) {
    
    const data = await request.validate(loginValidator.loginV);
    const result = await loginService.login(data)
      if(result == 0){
        return response.status(400).send({Message:"User is Not found"});
      }else{
        let key:any = process.env.secretKey;
        let username1=Helper.encode5t(result[0]);
        let empid= Helper.encode5t(result[3].toString());
        let token:any = Helper.generateToken(key,{username:username1,empid:empid});
        if(token == 0)
        { 
          return response.status(400).send({Message:"Key is not Generated",Key:token});
        }else{
          const result2 = await loginService.storetoken({token:token,id:result[3],orgid:result[4]})
          if(result2 > 0){
            return response.status(200).send({Message:"Key Generated",Key:token});
          }else{
            return response.status(400).send({Message:"Key Not stored",Key:"000000"});
          } 
        }
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

   public async insert({auth}){

    var test = await auth.attempt('deepak@gmail.com','abcd1234')
    console.log('test');
    console.log(test);
    console.log('test');
    

    // let query = await Usertest.create({
    //   email: "shakir@gmail.com",
    //   password: "abcd1234"
    // })
   }



}

 