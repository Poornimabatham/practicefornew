import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserSettingService from 'App/Services/UserSettingService';
import UsersettingValidator from 'App/Validators/UserSettingValidator';


export default class UsersettingsController {
  public async UpdatePass({request,response}: HttpContextContract) {
     await request.validate(UsersettingValidator.usersetting)
     const api= await UserSettingService.changepassword(request.all())
    response.json(api);

  }

    public async updateProfilePhoto({}){
      
    }

  // public async updateProfilePhoto({request,response}:HttpContextContract){
  //    await request.validate(UsersettingValidator.updateprofile)
  //    const result = await UserSettingService.updateProfilePhoto(request.all())
  // }
}