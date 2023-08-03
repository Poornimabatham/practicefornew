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
    //let currDate = moment().format("YYYY-MM-DD");
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

  public async store({ response }: HttpContextContract) {   //  fetching common data from holidaymaster & holidays

    // const show = await Database
    // .from('holidaymaster')
    // .innerJoin('holidays',' holidaymaster.Id','holidays.HM_Id')
    // .select("*")
    // return "Heloo"
    // return response.json(show)

    // const show2 = await HolidayM.all()  // fetched all data from HolidayM -model
    // return show2
  }

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

  public async edit({ }: HttpContextContract) {

    // import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
    // import HolidayMaster from 'App/Models/HolidayMaster'
    // import ActivityHistoryMaster from 'App/Models/ActivityHistoryMaster'
    // import { DateTime } from 'luxon'

    //     public async addHoliday({ request, response }: HttpContextContract) {
    //       const orgid = request.input('org_id', 0)
    //       const empid = request.input('empid', 0)
    //       const name = request.input('name', '')
    //       const from = request.input('from', 0)
    //       const to = request.input('to', 0)
    //       const description = request.input('description', '')

    //       const result = { status: '' }

    //       const date = DateTime.local().toFormat('yyyy-MM-dd')
    //       const fromDate = DateTime.fromISO(from).toFormat('yyyy-MM-dd')
    //       const toDate = DateTime.fromISO(to).toFormat('yyyy-MM-dd')

    //       const existingHoliday = await HolidayMaster.query()
    //         .where((query) =>
    //           query
    //             .whereBetween('DateFrom', [fromDate, toDate])
    //             .orWhereBetween('DateTo', [fromDate, toDate])
    //         )
    //         .andWhere('OrganizationId', orgid)
    //         .first()

    //       if (existingHoliday) {
    //         result.status = '2' // Holiday already exists
    //         return response.json(result)
    //       }

    //       const newHoliday = new HolidayMaster()
    //       newHoliday.Name = name
    //       newHoliday.Description = description
    //       newHoliday.DateFrom = fromDate
    //       newHoliday.DateTo = toDate
    //       newHoliday.DivisionId = '0'
    //       newHoliday.OrganizationId = orgid
    //       newHoliday.CreatedDate = date
    //       newHoliday.CreatedById = empid
    //       newHoliday.LastModifiedDate = date
    //       newHoliday.LastModifiedById = empid
    //       newHoliday.FiscalId = 1
    //       await newHoliday.save()

    //       // Log the activity
    //       const zone = getTimeZone(orgid) // You need to implement this function
    //       DateTime.local().setZone(zone)
    //       const activityDate = DateTime.local().toFormat('yy-MM-dd HH:mm:ss')
    //       const activityBy = 1
    //       const actionPerformed = `<b>${name}</b> holiday has been created by <b>${getEmpName(empid)}</b> from Attendance App`
    //       const appModule = 'Holiday'

    //       const activityHistory = new ActivityHistoryMaster()
    //       activityHistory.LastModifiedDate = activityDate
    //       activityHistory.LastModifiedById = empid
    //       activityHistory.Module = 'Attendance app'
    //       activityHistory.ActionPerformed = actionPerformed
    //       activityHistory.OrganizationId = orgid
    //       activityHistory.ActivityBy = activityBy
    //       activityHistory.adminid = empid
    //       activityHistory.AppModule = appModule
    //       await activityHistory.save()

    //       result.status = '1' // Holiday added successfully
    //       return response.json(result)
    //     }
    //   }


  }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}

