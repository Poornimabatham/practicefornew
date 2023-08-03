import Route from '@ioc:Adonis/Core/Route'

Route.get('/FetchHolidays','AddHolidayController.FetchHoliday');

Route.get('/InsertHolidays','AddHolidayController.InsertHoliday');