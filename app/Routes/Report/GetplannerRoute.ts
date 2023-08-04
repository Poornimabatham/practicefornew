import Route from '@ioc:Adonis/Core/Route'
import GetplannerController from 'App/Controllers/Http/ReportController/GetPlannerController'


Route.group(() => {
    Route.get('/fetchdata','GetplannerController.data')
    Route.post('/fetch','GetplannerController.data2')

  }).namespace('App/Controllers/Http/ReportController').namespace('App/Controllers/Http/ReportController')
  