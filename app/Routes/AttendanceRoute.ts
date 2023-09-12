import Route from '@ioc:Adonis/Core/Route'

Route.post('/saveImageAdvance', 'AttendancesController.saveTimeInOut')
Route.post('/AttendanceAct', 'AttendancesController.AttendanceAct')
