import Route from '@ioc:Adonis/Core/Route'

Route.get('/FetchHolidays','HolidayController.FetchHoliday').middleware('throttle:global');
Route.post('/addHoliday','HolidayController.InsertHoliday').middleware('throttle:global');
