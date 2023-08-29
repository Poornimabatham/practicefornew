import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
   Route.get('/getEmpHistoryOf30_getx','GetAttendanceEmployeewisesController.getPresentList')
   
  }).namespace('App/Controllers/Http/ReportController')