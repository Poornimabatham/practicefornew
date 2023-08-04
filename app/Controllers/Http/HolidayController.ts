import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import HolidayService from 'App/Services/HolidayService';
import HolidayValidate from 'App/Validators/HolidayValidate';
import Database from '@ioc:Adonis/Lucid/Database';

export default class HolidayController {

  public async FetchHoliday({ request, response }: HttpContextContract) {

    const ReqData: any = await request.validate(HolidayValidate.HolidayFetch)
    const result = await HolidayService.Holidayfetch(ReqData)

    return response.json(result)
  }

  public async InsertHoliday({ request, response }: HttpContextContract) {

    const ReqData = await request.validate(HolidayValidate.HolidayInsert)
    const result = await HolidayService.InsertHoliday(ReqData)
    
    return response.json(result);
  }


  public async create({ }: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({ }: HttpContextContract) {}

  public async update({ }: HttpContextContract) {
    
    const data = await Database.table('holidays').multiInsert([      // Multi-insert in holiday refers to Models/holidays.ts
      { holiday_name: 'Gandhi Jayanti', HM_Id: '53' },
      { holiday_name: 'Republic day', HM_Id: '77' },
      { holiday_name: 'Shivratri', HM_Id: '79' },
      { holiday_name: 'Strike', HM_Id: '92' },
      { holiday_name: 'Eid', HM_Id: '99' },
      { holiday_name: 'Independence Day', HM_Id: '150' },
      { holiday_name: "Mahatma Gandhi Jayanthi", HM_Id: '177' },
      { holiday_name: "Dussehra", HM_Id: '183' },
      { holiday_name: "Diwali 2018", HM_Id: '175' },
      { holiday_name: "Election", HM_Id: '208' },
    ])
    return data
  
  }

  public async destroy({ }: HttpContextContract) { }
}

