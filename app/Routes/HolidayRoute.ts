import Route from '@ioc:Adonis/Core/Route'

Route.get('/FetchHolidays','HolidayController.FetchHoliday').middleware('throttle:global');

Route.get('/InsertHolidays','HolidayController.InsertHoliday').middleware('throttle:global');