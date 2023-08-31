import Route from '@ioc:Adonis/Core/Route'

Route.get('/getDailyAttendancePresent', 'DailyAttendancesController.getPresentList').middleware('throttle:global')