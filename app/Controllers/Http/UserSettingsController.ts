import { Request } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserSettingService from 'App/Services/UserSettingService';
import UserSettingValidator from 'App/Validators/UserSettingValidator';
import UsersettingValidator from 'App/Validators/UserSettingValidator';


export default class UserSettingsController {
  public async UpdatePass({ request, response }: HttpContextContract) {
    await request.validate(UsersettingValidator.usersetting);
    const changepassword = await UserSettingService.changepassword(
      request.all()
    );
    response.json(changepassword);
  }

  // public async UpdateProfile({request, response}: HttpContextContract)
  // {
  //   const validata = await request.validate(UsersettingValidator.updateprofile)
  //   const UpdateProfile = await UserSettingService.UpdateProfilePhoto(validata)

  // }

  public async getPunchInfoCsv({ request, response }: HttpContextContract) {
    const validdata = await request.validate(UsersettingValidator.PunchVisit);
    const res = await UserSettingService.getPunchInfoCsv(validdata);
    response.json(res);
  }

  public async getPunchInfo({ request, response }: HttpContextContract) {
    const validdata = await request.validate(UsersettingValidator.PunchVisit);
    const res = await UserSettingService.getPunchInfo(validdata);
    response.json(res);
  }

  public async getEmployeesList({ request, response }: HttpContextContract) {
    const getvaliddata = await request.validate(
      UsersettingValidator.EmployeeList
    );
    const res = await UserSettingService.getEmployeesList(getvaliddata);
    response.json(res);
  }

  public async OrgCheck({ request, response }: HttpContextContract) {
    const ValidData = await request.validate(UsersettingValidator.Notification);
    const res = await UserSettingService.getOrgCheck(ValidData);
    response.json(res);
  }

  public async Notification({ request, response }: HttpContextContract) {
    const Validdata = await request.validate(
      UsersettingValidator.Notification2
    );
    const res = await UserSettingService.NotificationTest(Validdata);
    response.json(res);
  }

  public async UpdateNotification({ request, response }: HttpContextContract) {
    const Validdata = await request.validate(
      UsersettingValidator.updateNotification
    );
    const res = await UserSettingService.UpdateNotificationStatus(Validdata);
    response.json(res);
  }

  public async setQrKioskPin({ request, response }: HttpContextContract) {
    const Validdata = await request.validate(UserSettingValidator.QrValidation);
    const res = await UserSettingService.setQrKioskPin(Validdata);
    response.json(res);
  }

  public async ChangeQrKioskPin({ request, response }: HttpContextContract) {
    const Validdata = await request.validate(UserSettingValidator.ChangeQR);
    const res = await UserSettingService.ChangeQrKioskPin(Validdata);
    response.json(res);
  }

  public async getRegDetailForApproval({
    request,
    response,
  }: HttpContextContract) {
    const Validdata = await request.validate(UserSettingValidator.RegDetail);
    const res = await UserSettingService.getRegDetailForApproval(Validdata);
    response.json(res);
  }

  public async recoverPinLoginCredential({ request, response }) {
    const validate = await request.validate(
      UserSettingValidator.recoverPinLoginCredential
    );

    const service = await UserSettingService.recoverPinLoginCredential(
      validate
    );

    return response.json(service);
  }

  public async UpdateQrKioskPageReopen({
    request,
    response,
  }: HttpContextContract) {
    const validata = await request.validate(UserSettingValidator.UpdateQR);
    const res = await UserSettingService.UpdateQrKioskPageReopen(validata);
    response.json(res);
  }

  public async demoScheduleRequest({ request, response }: HttpContextContract) {
    const validata = await request.validate(UserSettingValidator.demoSchedule);
    const res = await UserSettingService.demoScheduleRequest(validata);
    response.json(res);
  }

  public async getTeamPunchInfo({ request, response }: HttpContextContract) {
    const validata = await request.validate(UserSettingValidator.Teampunchinfo);
    const res = await UserSettingService.getTeamPunchInfo(validata);
    response.json(res);
  }

  public async getQrKioskStatus({ request, response }: HttpContextContract) {
    const reqdata = await request.validate(
      UserSettingValidator.GetQrKioskStatus
    );

    const serviceRes = await UserSettingService.GetQrKioskStatus(reqdata);

    return response.json(serviceRes);
  }

  public async getReferDiscountRequest({ response }: HttpContextContract) {
    const serviceRes = await UserSettingService.getReferDiscountRequestService();
    return response.json(serviceRes);
  }
  private data = [];
  public async DeleteAccount({ request,response }: HttpContextContract) {
    const reqData = await request.validate(UserSettingValidator.DeleteAccount)
    this.data["reason"] = reqData.reason ? reqData.reason : 0;
    this.data["refid"] = reqData.refid ? reqData.refid : 0;
    this.data["uid"] = reqData.uid ? reqData.uid : 0;
    this.data["date"] = reqData.date ? reqData.date : 0;
    const serviceRes = await UserSettingService.DeleteAccount(this.data);
    return response.json(serviceRes);  
  }

  public async getSetKioskPin({request,response}:HttpContextContract){
     const validata = await request.validate(UserSettingValidator.getsetkiospin);
     const res = await UserSettingService.getSetKioskPin(validata);
     response.json(res)
     
  }

  public async checkuseremailforgoogle({ request, response }: HttpContextContract) {
     const reqData = await request.validate(UserSettingValidator.checkuseremailforgoogle)
     const serviceRes = await UserSettingService.checkuseremailforgoogle(reqData);
     return response.json(serviceRes); 
  }

  public async updateProfilePhoto({ request, response }: HttpContextContract) {
    const reqData = await request.validate(UserSettingValidator.updateProfilePhoto);
    const serviceRes = await UserSettingService.updateProfilePhoto(reqData);
    return response.json(serviceRes);
  }
}