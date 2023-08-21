import Route from '@ioc:Adonis/Core/Route'

Route.get('/FetchHolidays','HolidayController.FetchHoliday').middleware('throttle:global');
Route.post('/InsertHolidays','HolidayController.InsertHoliday').middleware('throttle:global');
