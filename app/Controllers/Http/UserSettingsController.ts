import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserSettingService from 'App/Services/UserSettingService';
import UserSettingValidator from 'App/Validators/UserSettingValidator';
import UsersettingValidator from 'App/Validators/UserSettingValidator';


export default class UsersettingsController {
    public async UpdatePass({request,response}: HttpContextContract)
    {
      await request.validate(UsersettingValidator.usersetting)
      const changepassword = await UserSettingService.changepassword(request.all())
      response.json(changepassword);
    }

    // public async UpdateProfile({request, response}: HttpContextContract)
    // {
    //   const validata = await request.validate(UsersettingValidator.updateprofile)
    //   const UpdateProfile = await UserSettingService.UpdateProfilePhoto(validata)
      
    // }

    public async getPunchInfoCsv({request,response}:HttpContextContract){
      const validdata = await request.validate(UsersettingValidator.PunchVisit)
      const res       = await UserSettingService.getPunchInfoCsv(validdata)
      response.json(res);
    }

    public async getPunchInfo({request,response}:HttpContextContract){
      const validdata = await request.validate(UsersettingValidator.PunchVisit)
      const res       = await UserSettingService.getPunchInfo(validdata);
      response.json(res);
    }

    public async getEmployeesList({request ,response} : HttpContextContract){
      const getvaliddata = await request.validate(UsersettingValidator.EmployeeList)
      const res          = await UserSettingService.getEmployeesList(getvaliddata );
      response.json(res);
    }

    public async OrgCheck({request,response}:HttpContextContract){
      const ValidData  = await request.validate(UsersettingValidator.Notification)
      const res        = await UserSettingService.getOrgCheck(ValidData);
      response.json(res)

    }

    public async Notification({request , response}:HttpContextContract){
      const Validdata = await request.validate(UsersettingValidator.Notification2)
      const res       = await UserSettingService.NotificationTest(Validdata);
      response.json(res)
    }

    public async UpdateNotification({request,response}:HttpContextContract){
       const Validdata = await request.validate(UsersettingValidator.updateNotification)
       const res       = await UserSettingService.UpdateNotificationStatus(Validdata);
       response.json(res);
    }

    public async setQrKioskPin({request,response}:HttpContextContract){
       const Validdata = await request.validate(UserSettingValidator.QrValidation)
       const res       = await UserSettingService.setQrKioskPin(Validdata);
       response.json(res)
    }

    public async ChangeQrKioskPin({request , response}:HttpContextContract){
       const Validdata = await request.validate(UserSettingValidator.ChangeQR)
       const res       = await UserSettingService.ChangeQrKioskPin(Validdata)
       response.json(res)
    }


}