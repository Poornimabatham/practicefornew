// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ShiftsService from 'App/Services/ShiftService';
import ShiftValidator from 'App/Validators/ShiftValidator';

export default class ShiftsController {
   public async index({}: HttpContextContract) {
  }

  public async create({request}: HttpContextContract) {
    const validparameters = await request.validate(ShiftValidator.addshift);
    await ShiftsService.createdata(validparameters);
  
  }

  public async store({}: HttpContextContract) {}

  public async show({request,response }: HttpContextContract)
  {
    const a = await request.validate(ShiftValidator.shifts);
    const b = await ShiftsService.getShiftData(a)
    response.json(b);
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
