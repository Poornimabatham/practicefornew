import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AddHolidayService from 'App/Services/AddHolidayService';
import AddHolidayValidate from 'App/Validators/AddHolidayValidate';
import Database from '@ioc:Adonis/Lucid/Database';

export default class AddHolidayController {

  public async FetchHoliday({ request, response }: HttpContextContract) {

    const valid: any = await request.validate(AddHolidayValidate.HolidayFetch)
    const result = await AddHolidayService.Holidayfetch(valid)

    return response.json(result)
  }

  public async InsertHoliday({ request, response }: HttpContextContract) {

    const validData = await request.validate(AddHolidayValidate.HolidayInsert)
    const result = await AddHolidayService.InsertHoliday(validData)
    
    return response.json(result);
  }


  public async create({ }: HttpContextContract) {

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

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const userid = request.input('empId', '')
    const orgid = request.input('orgId', '')

    const result: any = {}

    const query1 = await Database
      .from('UserMaster')
      .select('kioskPin')
      .where('EmployeeId', userid)
      .andWhere('OrganizationId', orgid)

    query1.forEach((row: any) => {
      result.kioskPin = row.kioskPin
      result.cuperButton = result.kioskPin === '' ? 0 : 1
    })

    const data = [result]

    return response.json(data)
  }

  public async edit({ }: HttpContextContract) {}

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}

