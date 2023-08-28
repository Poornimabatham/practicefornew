import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ShiftsService from 'App/Services/ShiftService';
import ShiftValidator from 'App/Validators/ShiftValidator';

export default class ShiftsController {
  private data = []
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    const validatedparams = await request.validate(ShiftValidator.addshift);
    const result = await ShiftsService.createdata(validatedparams);
    response.json(result);
  }

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const validatedparams = await request.validate(ShiftValidator.shifts);
    const result = await ShiftsService.getShiftData(validatedparams);
    response.json(result);
  }

  public async update({ request, response }: HttpContextContract) {
    const validatedparams = await request.validate(ShiftValidator.updateshift);
    const result = await ShiftsService.updateShift(validatedparams);
    response.json(result);
  }

  public async destroy({ request, response }: HttpContextContract) {
    const validatedparams = await request.validate(
      ShiftValidator.Inactiveshift
    );
    const result = await ShiftsService.deleteInActivateShift(validatedparams);
    response.json(result);
  }

  public async assignShift({ request, response }: HttpContextContract) {
    const getvalidData = await request.validate(ShiftValidator.assignShift);

    this.data["Orgid"] = getvalidData.Orgid ? getvalidData.Orgid : 0;
    this.data["shiftid"] = getvalidData.shiftid ? getvalidData.shiftid : 0;
    this.data["shiftname"] = getvalidData.shiftname ? getvalidData.shiftname :0;
    this.data["empid"] = getvalidData.empid ? getvalidData.empid : " ";
    this.data["adminid"] = getvalidData.adminid ? getvalidData.adminid : 0;
    this.data["empname"] = getvalidData.empname ? getvalidData.empname : 0;
    this.data["adminname"] = getvalidData.adminname? getvalidData.adminname: 0;

    const getResponsefromService = await ShiftsService.assignShift(this.data);

    return response.json(getResponsefromService);
  }

  /////////////ashish//////////////////////
  public async AssignShiftsByDepartment({ request, response }: HttpContextContract) {

    try{
    const getvalidData = await request.validate(ShiftValidator.AssignShiftByDepart);

    this.data["Orgid"] =getvalidData.orgid;
    this.data["shiftid"] = getvalidData.shiftid;
    this.data["status"] = getvalidData.status;
    this.data['departid']=getvalidData.departid;
    this.data['date']=getvalidData.date;
    this.data['WeekoffStatus']=getvalidData.WeekoffStatus;
    this.data["shiftname"] = getvalidData.shiftname;
    this.data["departname"] = getvalidData.departname;
    this.data["adminid"] = getvalidData.adminid;
    this.data["adminname"] = getvalidData.adminname;

    const result=await ShiftsService.AssignShiftByDepart(this.data);
      if(result['status']=='false'){
        response.status(400).send({Message:"Invalid Response"});  
      }else{
        response.status(200).send({Message:"Success",Response:result['status']});  
      }
    }catch(Error){
      response.status(400).send({Message:"Invalid Request",Name:Error})
    }

    //return response.json(getResponsefromService);
  }



}