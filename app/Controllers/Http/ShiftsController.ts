// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ShiftsService from 'App/Services/ShiftService';
import ShiftValidator from 'App/Validators/ShiftValidator';

export default class ShiftsController {
  public async index({ }: HttpContextContract) {
   // return "mayank";
  }

  public async create({request,response}: HttpContextContract) {
    const validatedparams = await request.validate(ShiftValidator.addshift);
    const result = await ShiftsService.createdata(validatedparams);
    console.log(result);
    response.json(result);
  }

  public async store({}: HttpContextContract) {}

  public async show({request,response }: HttpContextContract)
  {
    const validatedparams = await request.validate(ShiftValidator.shifts);
    const result = await ShiftsService.getShiftData(validatedparams);
    response.json(result);
  }

  public async edit({request , response }: HttpContextContract) {
    const validatedparams = await request.validate(ShiftValidator.assign);
    const result = await ShiftsService.assignShift(validatedparams);
    console.log(result);
    return response.json(result);
   
  }

  public async update({ request, response }: HttpContextContract) {
     const validatedparams = await request.validate(ShiftValidator.updateshift);
    const result = await ShiftsService.updateShift(validatedparams);
    
    console.log(result);
    response.json(result);
  }

  public async destroy({ request, response }: HttpContextContract) {
    const validatedparams = await request.validate(ShiftValidator.Inactiveshift);
    const result = await ShiftsService.deleteInActivateShift(validatedparams);
    console.log(result);
    response.json(result);
  }
}
